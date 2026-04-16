#!/usr/bin/env python3

import requests
import sys
import json
from datetime import datetime, timedelta
from typing import Dict, Any

class AssessmentPlatformTester:
    def __init__(self, base_url="https://web-refresh-v2-2.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_url = f"{base_url}/api"
        self.admin_token = None
        self.student_token = None
        self.tests_run = 0
        self.tests_passed = 0
        self.test_results = []

    def log_test(self, name: str, success: bool, details: str = ""):
        """Log test result"""
        self.tests_run += 1
        if success:
            self.tests_passed += 1
            print(f"✅ {name}")
        else:
            print(f"❌ {name} - {details}")
        
        self.test_results.append({
            "test": name,
            "success": success,
            "details": details
        })

    def make_request(self, method: str, endpoint: str, data: Dict = None, token: str = None) -> tuple:
        """Make HTTP request and return (success, response_data, status_code)"""
        url = f"{self.api_url}/{endpoint}"
        headers = {'Content-Type': 'application/json'}
        
        if token:
            headers['Authorization'] = f'Bearer {token}'

        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=10)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=headers, timeout=10)
            elif method == 'DELETE':
                response = requests.delete(url, headers=headers, timeout=10)
            
            try:
                response_data = response.json()
            except:
                response_data = {"message": response.text}
            
            return response.status_code < 400, response_data, response.status_code
            
        except Exception as e:
            return False, {"error": str(e)}, 0

    def test_admin_login(self):
        """Test admin login"""
        success, data, status = self.make_request(
            'POST', 
            'auth/login',
            {"email": "admin@test.com", "password": "Admin123"}
        )
        
        if success and 'access_token' in data:
            self.admin_token = data['access_token']
            self.log_test("Admin Login", True)
            return True
        else:
            self.log_test("Admin Login", False, f"Status: {status}, Data: {data}")
            return False

    def test_student_login(self):
        """Test student login"""
        success, data, status = self.make_request(
            'POST', 
            'auth/login',
            {"email": "student@test.com", "password": "Student123"}
        )
        
        if success and 'access_token' in data:
            self.student_token = data['access_token']
            self.log_test("Student Login", True)
            return True
        else:
            self.log_test("Student Login", False, f"Status: {status}, Data: {data}")
            return False

    def test_invalid_login(self):
        """Test invalid login credentials"""
        success, data, status = self.make_request(
            'POST', 
            'auth/login',
            {"email": "invalid@test.com", "password": "wrongpass"}
        )
        
        # Should fail with 401
        if not success and status == 401:
            self.log_test("Invalid Login (Expected Failure)", True)
            return True
        else:
            self.log_test("Invalid Login (Expected Failure)", False, f"Expected 401, got {status}")
            return False

    def test_auth_me_admin(self):
        """Test /auth/me endpoint for admin"""
        if not self.admin_token:
            self.log_test("Auth Me (Admin)", False, "No admin token")
            return False
            
        success, data, status = self.make_request('GET', 'auth/me', token=self.admin_token)
        
        if success and data.get('role') == 'admin':
            self.log_test("Auth Me (Admin)", True)
            return True
        else:
            self.log_test("Auth Me (Admin)", False, f"Status: {status}, Data: {data}")
            return False

    def test_auth_me_student(self):
        """Test /auth/me endpoint for student"""
        if not self.student_token:
            self.log_test("Auth Me (Student)", False, "No student token")
            return False
            
        success, data, status = self.make_request('GET', 'auth/me', token=self.student_token)
        
        if success and data.get('role') == 'student':
            self.log_test("Auth Me (Student)", True)
            return True
        else:
            self.log_test("Auth Me (Student)", False, f"Status: {status}, Data: {data}")
            return False

    def test_create_assessment(self):
        """Test creating an assessment"""
        if not self.admin_token:
            self.log_test("Create Assessment", False, "No admin token")
            return False, None

        # Create assessment data
        assessment_data = {
            "title": "Test Cyber Security Assessment",
            "description": "A test assessment for cyber security knowledge",
            "version": "v1.0",
            "duration_minutes": 30,
            "available_from": (datetime.now() + timedelta(minutes=1)).isoformat(),
            "available_until": (datetime.now() + timedelta(days=30)).isoformat(),
            "questions": [
                {
                    "question": "What does CIA stand for in cybersecurity?",
                    "options": [
                        "Confidentiality, Integrity, Availability",
                        "Central Intelligence Agency",
                        "Computer Information Access",
                        "Cyber Intelligence Analysis"
                    ],
                    "correct_answer": 0
                },
                {
                    "question": "Which of the following is a common type of malware?",
                    "options": [
                        "Firewall",
                        "Antivirus",
                        "Trojan",
                        "Router"
                    ],
                    "correct_answer": 2
                }
            ]
        }

        success, data, status = self.make_request(
            'POST', 
            'admin/assessments', 
            assessment_data, 
            token=self.admin_token
        )
        
        if success and 'id' in data:
            self.log_test("Create Assessment", True)
            return True, data['id']
        else:
            self.log_test("Create Assessment", False, f"Status: {status}, Data: {data}")
            return False, None

    def test_get_assessments_admin(self):
        """Test getting all assessments as admin"""
        if not self.admin_token:
            self.log_test("Get Assessments (Admin)", False, "No admin token")
            return False

        success, data, status = self.make_request('GET', 'admin/assessments', token=self.admin_token)
        
        if success and isinstance(data, list):
            self.log_test("Get Assessments (Admin)", True)
            return True
        else:
            self.log_test("Get Assessments (Admin)", False, f"Status: {status}, Data: {data}")
            return False

    def test_bulk_register(self, assessment_id: str):
        """Test bulk registration"""
        if not self.admin_token or not assessment_id:
            self.log_test("Bulk Register", False, "No admin token or assessment ID")
            return False

        bulk_data = {
            "candidates": [
                {
                    "name": "Test Candidate 1",
                    "email": "testcandidate1@example.com",
                    "assessment_id": assessment_id,
                    "exam_date": (datetime.now() + timedelta(days=1)).isoformat()
                },
                {
                    "name": "Test Candidate 2", 
                    "email": "testcandidate2@example.com",
                    "assessment_id": assessment_id,
                    "exam_date": (datetime.now() + timedelta(days=2)).isoformat()
                }
            ]
        }

        success, data, status = self.make_request(
            'POST', 
            'admin/bulk-register', 
            bulk_data, 
            token=self.admin_token
        )
        
        if success and data.get('count', 0) > 0:
            self.log_test("Bulk Register", True)
            return True
        else:
            self.log_test("Bulk Register", False, f"Status: {status}, Data: {data}")
            return False

    def test_get_registrations_admin(self):
        """Test getting all registrations as admin"""
        if not self.admin_token:
            self.log_test("Get Registrations (Admin)", False, "No admin token")
            return False

        success, data, status = self.make_request('GET', 'admin/registrations', token=self.admin_token)
        
        if success and isinstance(data, list):
            self.log_test("Get Registrations (Admin)", True)
            return True
        else:
            self.log_test("Get Registrations (Admin)", False, f"Status: {status}, Data: {data}")
            return False

    def test_get_user_assessments(self):
        """Test getting user assessments"""
        if not self.student_token:
            self.log_test("Get User Assessments", False, "No student token")
            return False

        success, data, status = self.make_request('GET', 'user/assessments', token=self.student_token)
        
        if success and isinstance(data, list):
            self.log_test("Get User Assessments", True)
            return True
        else:
            self.log_test("Get User Assessments", False, f"Status: {status}, Data: {data}")
            return False

    def test_get_user_registrations(self):
        """Test getting user registrations"""
        if not self.student_token:
            self.log_test("Get User Registrations", False, "No student token")
            return False

        success, data, status = self.make_request('GET', 'user/registrations', token=self.student_token)
        
        if success and isinstance(data, list):
            self.log_test("Get User Registrations", True)
            return True
        else:
            self.log_test("Get User Registrations", False, f"Status: {status}, Data: {data}")
            return False

    def test_contact_form(self):
        """Test contact form submission"""
        contact_data = {
            "name": "Test User",
            "email": "testuser@example.com",
            "message": "This is a test contact form submission."
        }

        success, data, status = self.make_request('POST', 'contact', contact_data)
        
        if success and 'message' in data:
            self.log_test("Contact Form", True)
            return True
        else:
            self.log_test("Contact Form", False, f"Status: {status}, Data: {data}")
            return False

    def test_unauthorized_access(self):
        """Test unauthorized access to admin endpoints"""
        success, data, status = self.make_request('GET', 'admin/assessments')
        
        # Should fail with 401 or 403
        if not success and status in [401, 403]:
            self.log_test("Unauthorized Access (Expected Failure)", True)
            return True
        else:
            self.log_test("Unauthorized Access (Expected Failure)", False, f"Expected 401/403, got {status}")
            return False

    def run_all_tests(self):
        """Run all tests"""
        print(f"🚀 Starting API tests for {self.base_url}")
        print("=" * 60)

        # Authentication tests
        print("\n📋 Authentication Tests:")
        admin_login_success = self.test_admin_login()
        student_login_success = self.test_student_login()
        self.test_invalid_login()
        
        if admin_login_success:
            self.test_auth_me_admin()
        if student_login_success:
            self.test_auth_me_student()

        # Admin functionality tests
        print("\n📋 Admin Functionality Tests:")
        assessment_id = None
        if admin_login_success:
            success, assessment_id = self.test_create_assessment()
            self.test_get_assessments_admin()
            if assessment_id:
                self.test_bulk_register(assessment_id)
            self.test_get_registrations_admin()

        # Student functionality tests
        print("\n📋 Student Functionality Tests:")
        if student_login_success:
            self.test_get_user_assessments()
            self.test_get_user_registrations()

        # Public endpoint tests
        print("\n📋 Public Endpoint Tests:")
        self.test_contact_form()
        self.test_unauthorized_access()

        # Summary
        print("\n" + "=" * 60)
        print(f"📊 Test Results: {self.tests_passed}/{self.tests_run} passed")
        
        if self.tests_passed == self.tests_run:
            print("🎉 All tests passed!")
            return 0
        else:
            print("❌ Some tests failed!")
            return 1

def main():
    tester = AssessmentPlatformTester()
    return tester.run_all_tests()

if __name__ == "__main__":
    sys.exit(main())