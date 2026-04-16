import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'backend'))

from motor.motor_asyncio import AsyncIOMotorClient
from passlib.context import CryptContext
from datetime import datetime, timezone
import asyncio
from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent.parent / 'backend'
load_dotenv(ROOT_DIR / '.env')

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

async def seed_users():
    mongo_url = os.environ['MONGO_URL']
    client = AsyncIOMotorClient(mongo_url)
    db = client[os.environ['DB_NAME']]
    
    # Check if users already exist
    admin_exists = await db.users.find_one({"email": "admin@test.com"})
    student_exists = await db.users.find_one({"email": "student@test.com"})
    
    if not admin_exists:
        admin_user = {
            "email": "admin@test.com",
            "name": "Admin User",
            "role": "admin",
            "password_hash": pwd_context.hash("Admin123"),
            "created_at": datetime.now(timezone.utc).isoformat()
        }
        await db.users.insert_one(admin_user)
        print("✓ Admin user created: admin@test.com / Admin123")
    else:
        print("✓ Admin user already exists")
    
    if not student_exists:
        student_user = {
            "email": "student@test.com",
            "name": "Student User",
            "role": "student",
            "password_hash": pwd_context.hash("Student123"),
            "created_at": datetime.now(timezone.utc).isoformat()
        }
        await db.users.insert_one(student_user)
        print("✓ Student user created: student@test.com / Student123")
    else:
        print("✓ Student user already exists")
    
    client.close()
    print("\nSeeding complete!")

if __name__ == "__main__":
    asyncio.run(seed_users())
