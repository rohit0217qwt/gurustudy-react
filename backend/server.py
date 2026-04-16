from fastapi import FastAPI, APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, EmailStr, Field, ConfigDict
from typing import List, Optional
from datetime import datetime, timezone, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext
import os
import logging
from pathlib import Path
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Security
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
SECRET_KEY = os.environ.get('JWT_SECRET_KEY', 'your-secret-key-change-in-production')
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 1440
security = HTTPBearer()

app = FastAPI()
api_router = APIRouter(prefix="/api")

# Models
class User(BaseModel):
    model_config = ConfigDict(extra="ignore")
    email: EmailStr
    name: str
    role: str = "student"  # admin or student
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class UserCreate(BaseModel):
    email: EmailStr
    name: str
    password: str
    role: str = "student"

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str
    user: User

class Question(BaseModel):
    question: str
    options: List[str]
    correct_answer: int

class Assessment(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    title: str
    description: str
    version: str
    questions: List[Question]
    duration_minutes: int
    available_from: datetime
    available_until: datetime
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class AssessmentCreate(BaseModel):
    title: str
    description: str
    version: str
    questions: List[Question]
    duration_minutes: int
    available_from: datetime
    available_until: datetime

class Registration(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    user_email: EmailStr
    user_name: str
    assessment_id: str
    assessment_title: str
    exam_version: str
    exam_date: datetime
    status: str = "registered"  # registered, completed, missed
    score: Optional[int] = None
    registered_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class BulkRegistration(BaseModel):
    candidates: List[dict]  # [{"email": "", "name": "", "assessment_id": "", "exam_date": ""}]

class AssessmentSubmission(BaseModel):
    assessment_id: str
    answers: List[int]  # indices of selected options

class Course(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    title: str
    code: str
    description: str
    image_url: Optional[str] = None
    total_quiz: int = 0
    status: str = "active"  # active or disabled
    added_by: str = ""
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class CourseCreate(BaseModel):
    title: str
    code: str
    description: str
    image_url: Optional[str] = None
    status: str = "active"

class ContactForm(BaseModel):
    name: str
    email: EmailStr
    message: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

# Auth helpers
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=401, detail="Invalid token")
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    user = await db.users.find_one({"email": email}, {"_id": 0, "password_hash": 0})
    if user is None:
        raise HTTPException(status_code=401, detail="User not found")
    return User(**user)

async def get_admin_user(current_user: User = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    return current_user

# Email helper
def send_email(to_email: str, subject: str, content: str):
    try:
        sendgrid_api_key = os.environ.get('SENDGRID_API_KEY')
        sender_email = os.environ.get('SENDER_EMAIL', 'noreply@example.com')
        
        if not sendgrid_api_key or sendgrid_api_key == 'test-key':
            logging.info(f"Email would be sent to {to_email}: {subject}")
            return True
        
        message = Mail(
            from_email=sender_email,
            to_emails=to_email,
            subject=subject,
            html_content=content
        )
        sg = SendGridAPIClient(sendgrid_api_key)
        response = sg.send(message)
        return response.status_code == 202
    except Exception as e:
        logging.error(f"Email send error: {str(e)}")
        return False

# Auth endpoints
@api_router.post("/auth/register", response_model=Token)
async def register(user_data: UserCreate):
    existing_user = await db.users.find_one({"email": user_data.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    password_hash = get_password_hash(user_data.password)
    user_doc = {
        "email": user_data.email,
        "name": user_data.name,
        "role": user_data.role,
        "password_hash": password_hash,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    
    await db.users.insert_one(user_doc)
    
    access_token = create_access_token(data={"sub": user_data.email})
    user = User(email=user_data.email, name=user_data.name, role=user_data.role)
    
    return Token(access_token=access_token, token_type="bearer", user=user)

@api_router.post("/auth/login", response_model=Token)
async def login(user_data: UserLogin):
    user = await db.users.find_one({"email": user_data.email})
    if not user or not verify_password(user_data.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    access_token = create_access_token(data={"sub": user_data.email})
    user_obj = User(email=user["email"], name=user["name"], role=user["role"])
    
    return Token(access_token=access_token, token_type="bearer", user=user_obj)

@api_router.get("/auth/me", response_model=User)
async def get_me(current_user: User = Depends(get_current_user)):
    return current_user

# Admin endpoints
@api_router.post("/admin/assessments", response_model=Assessment)
async def create_assessment(assessment: AssessmentCreate, admin: User = Depends(get_admin_user)):
    import uuid
    assessment_id = str(uuid.uuid4())
    
    assessment_doc = assessment.model_dump()
    assessment_doc['id'] = assessment_id
    assessment_doc['available_from'] = assessment_doc['available_from'].isoformat()
    assessment_doc['available_until'] = assessment_doc['available_until'].isoformat()
    assessment_doc['created_at'] = datetime.now(timezone.utc).isoformat()
    
    await db.assessments.insert_one(assessment_doc)
    
    return Assessment(**assessment_doc)

@api_router.get("/admin/assessments", response_model=List[Assessment])
async def get_all_assessments(admin: User = Depends(get_admin_user)):
    assessments = await db.assessments.find({}, {"_id": 0}).to_list(1000)
    for assessment in assessments:
        assessment['available_from'] = datetime.fromisoformat(assessment['available_from'])
        assessment['available_until'] = datetime.fromisoformat(assessment['available_until'])
        assessment['created_at'] = datetime.fromisoformat(assessment['created_at'])
    return assessments

@api_router.post("/admin/bulk-register")
async def bulk_register(data: BulkRegistration, admin: User = Depends(get_admin_user)):
    import uuid
    registrations = []
    
    for candidate in data.candidates:
        # Check if user exists, create if not
        user = await db.users.find_one({"email": candidate["email"]})
        if not user:
            default_password = get_password_hash("Password123")
            user_doc = {
                "email": candidate["email"],
                "name": candidate["name"],
                "role": "student",
                "password_hash": default_password,
                "created_at": datetime.now(timezone.utc).isoformat()
            }
            await db.users.insert_one(user_doc)
        
        # Get assessment details
        assessment = await db.assessments.find_one({"id": candidate["assessment_id"]}, {"_id": 0})
        if not assessment:
            continue
        
        # Create registration
        reg_id = str(uuid.uuid4())
        reg_doc = {
            "id": reg_id,
            "user_email": candidate["email"],
            "user_name": candidate["name"],
            "assessment_id": candidate["assessment_id"],
            "assessment_title": assessment["title"],
            "exam_version": assessment["version"],
            "exam_date": candidate["exam_date"],
            "status": "registered",
            "score": None,
            "registered_at": datetime.now(timezone.utc).isoformat()
        }
        
        await db.registrations.insert_one(reg_doc)
        registrations.append(reg_doc)
        
        # Send email notification
        email_content = f"""
        <h2>Assessment Registration</h2>
        <p>Hello {candidate['name']},</p>
        <p>You have been registered for the assessment: <strong>{assessment['title']}</strong></p>
        <p>Exam Date: {candidate['exam_date']}</p>
        <p>Version: {assessment['version']}</p>
        <p>Please log in to your portal to access the assessment.</p>
        <p>Default password: Password123 (please change after first login)</p>
        """
        send_email(candidate["email"], "Assessment Registration", email_content)
    
    return {"message": f"Successfully registered {len(registrations)} candidates", "count": len(registrations)}

@api_router.get("/admin/registrations", response_model=List[Registration])
async def get_all_registrations(admin: User = Depends(get_admin_user)):
    registrations = await db.registrations.find({}, {"_id": 0}).to_list(1000)
    for reg in registrations:
        reg['registered_at'] = datetime.fromisoformat(reg['registered_at'])
        if isinstance(reg['exam_date'], str):
            reg['exam_date'] = datetime.fromisoformat(reg['exam_date'])
    return registrations

# Course endpoints (Admin)
@api_router.post("/admin/courses", response_model=Course)
async def create_course(course: CourseCreate, admin: User = Depends(get_admin_user)):
    import uuid
    course_id = str(uuid.uuid4())
    
    course_doc = course.model_dump()
    course_doc['id'] = course_id
    course_doc['total_quiz'] = 0
    course_doc['added_by'] = admin.name
    course_doc['created_at'] = datetime.now(timezone.utc).isoformat()
    
    await db.courses.insert_one(course_doc)
    
    return Course(**course_doc)

@api_router.get("/admin/courses", response_model=List[Course])
async def get_all_courses(admin: User = Depends(get_admin_user)):
    courses = await db.courses.find({}, {"_id": 0}).to_list(1000)
    for course in courses:
        course['created_at'] = datetime.fromisoformat(course['created_at'])
    return courses

@api_router.put("/admin/courses/{course_id}/status")
async def toggle_course_status(course_id: str, admin: User = Depends(get_admin_user)):
    course = await db.courses.find_one({"id": course_id}, {"_id": 0})
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    
    new_status = "disabled" if course["status"] == "active" else "active"
    await db.courses.update_one({"id": course_id}, {"$set": {"status": new_status}})
    
    return {"message": f"Course status updated to {new_status}", "status": new_status}

@api_router.delete("/admin/courses/{course_id}")
async def delete_course(course_id: str, admin: User = Depends(get_admin_user)):
    result = await db.courses.delete_one({"id": course_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Course not found")
    return {"message": "Course deleted successfully"}

# User endpoints
@api_router.get("/user/assessments", response_model=List[Assessment])
async def get_user_assessments(current_user: User = Depends(get_current_user)):
    # Get assessments user is registered for
    registrations = await db.registrations.find({"user_email": current_user.email}, {"_id": 0}).to_list(1000)
    assessment_ids = [reg["assessment_id"] for reg in registrations]
    
    assessments = await db.assessments.find({"id": {"$in": assessment_ids}}, {"_id": 0}).to_list(1000)
    
    for assessment in assessments:
        assessment['available_from'] = datetime.fromisoformat(assessment['available_from'])
        assessment['available_until'] = datetime.fromisoformat(assessment['available_until'])
        assessment['created_at'] = datetime.fromisoformat(assessment['created_at'])
    
    return assessments

@api_router.get("/user/registrations", response_model=List[Registration])
async def get_user_registrations(current_user: User = Depends(get_current_user)):
    registrations = await db.registrations.find({"user_email": current_user.email}, {"_id": 0}).to_list(1000)
    for reg in registrations:
        reg['registered_at'] = datetime.fromisoformat(reg['registered_at'])
        if isinstance(reg['exam_date'], str):
            reg['exam_date'] = datetime.fromisoformat(reg['exam_date'])
    return registrations

@api_router.get("/user/assessment/{assessment_id}", response_model=Assessment)
async def get_assessment_detail(assessment_id: str, current_user: User = Depends(get_current_user)):
    # Check if user is registered
    registration = await db.registrations.find_one({"user_email": current_user.email, "assessment_id": assessment_id})
    if not registration:
        raise HTTPException(status_code=403, detail="Not registered for this assessment")
    
    assessment = await db.assessments.find_one({"id": assessment_id}, {"_id": 0})
    if not assessment:
        raise HTTPException(status_code=404, detail="Assessment not found")
    
    assessment['available_from'] = datetime.fromisoformat(assessment['available_from'])
    assessment['available_until'] = datetime.fromisoformat(assessment['available_until'])
    assessment['created_at'] = datetime.fromisoformat(assessment['created_at'])
    
    return Assessment(**assessment)

@api_router.post("/user/submit-assessment")
async def submit_assessment(submission: AssessmentSubmission, current_user: User = Depends(get_current_user)):
    # Get assessment
    assessment = await db.assessments.find_one({"id": submission.assessment_id}, {"_id": 0})
    if not assessment:
        raise HTTPException(status_code=404, detail="Assessment not found")
    
    # Calculate score
    correct_count = 0
    for i, answer in enumerate(submission.answers):
        if i < len(assessment["questions"]) and answer == assessment["questions"][i]["correct_answer"]:
            correct_count += 1
    
    score = int((correct_count / len(assessment["questions"])) * 100)
    
    # Update registration
    await db.registrations.update_one(
        {"user_email": current_user.email, "assessment_id": submission.assessment_id},
        {"$set": {"status": "completed", "score": score}}
    )
    
    return {"message": "Assessment submitted successfully", "score": score, "correct": correct_count, "total": len(assessment["questions"])}

# Contact endpoint
@api_router.post("/contact")
async def submit_contact(contact: ContactForm):
    contact_doc = contact.model_dump()
    contact_doc['created_at'] = contact_doc['created_at'].isoformat()
    
    await db.contacts.insert_one(contact_doc)
    
    # Send email to admin
    email_content = f"""
    <h2>New Contact Form Submission</h2>
    <p><strong>Name:</strong> {contact.name}</p>
    <p><strong>Email:</strong> {contact.email}</p>
    <p><strong>Message:</strong> {contact.message}</p>
    """
    send_email(os.environ.get('ADMIN_EMAIL', 'admin@example.com'), "New Contact Form", email_content)
    
    return {"message": "Contact form submitted successfully"}

app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
