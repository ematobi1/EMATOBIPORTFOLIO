#!/usr/bin/env python3
"""
Comprehensive Backend Testing for Emmanuel Tobi's Portfolio
Tests all backend functionality including authentication, APIs, and database operations
"""

import asyncio
import aiohttp
import json
import os
import sys
from datetime import datetime
from typing import Dict, Any, Optional

# Test configuration
BACKEND_URL = "https://cf037a61-f85b-4a6f-8de8-f981a7e0b5b0.preview.emergentagent.com/api"
ADMIN_EMAIL = "admin@emmanueltobi.dev"
ADMIN_PASSWORD = "admin123"

class BackendTester:
    def __init__(self):
        self.session = None
        self.admin_token = None
        self.test_results = {}
        
    async def setup(self):
        """Setup test session"""
        self.session = aiohttp.ClientSession()
        
    async def cleanup(self):
        """Cleanup test session"""
        if self.session:
            await self.session.close()
    
    async def make_request(self, method: str, endpoint: str, data: Dict = None, 
                          headers: Dict = None, params: Dict = None) -> Dict[str, Any]:
        """Make HTTP request to backend"""
        url = f"{BACKEND_URL}{endpoint}"
        
        try:
            async with self.session.request(
                method, url, json=data, headers=headers, params=params
            ) as response:
                response_data = await response.json() if response.content_type == 'application/json' else await response.text()
                return {
                    "status": response.status,
                    "data": response_data,
                    "success": 200 <= response.status < 300
                }
        except Exception as e:
            return {
                "status": 0,
                "data": {"error": str(e)},
                "success": False
            }
    
    def log_test_result(self, test_name: str, success: bool, message: str, details: Dict = None):
        """Log test result"""
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} {test_name}: {message}")
        
        self.test_results[test_name] = {
            "success": success,
            "message": message,
            "details": details or {},
            "timestamp": datetime.now().isoformat()
        }
        
        if details and not success:
            print(f"   Details: {details}")
    
    async def test_health_check(self):
        """Test basic health check endpoint"""
        print("\n🔍 Testing Health Check...")
        
        result = await self.make_request("GET", "/health")
        
        if result["success"] and result["data"].get("status") == "healthy":
            self.log_test_result(
                "Health Check", 
                True, 
                "Backend is healthy and responding"
            )
        else:
            self.log_test_result(
                "Health Check", 
                False, 
                "Backend health check failed",
                result
            )
    
    async def test_database_initialization(self):
        """Test database initialization by checking if collections exist"""
        print("\n🔍 Testing Database Initialization...")
        
        # Test if we can access personal info (should exist after init)
        result = await self.make_request("GET", "/personal-info")
        
        if result["success"] and result["data"].get("name") == "Emmanuel Tobi":
            self.log_test_result(
                "Database Initialization", 
                True, 
                "Database initialized with default personal info"
            )
        else:
            self.log_test_result(
                "Database Initialization", 
                False, 
                "Database initialization failed or default data missing",
                result
            )
    
    async def test_admin_authentication(self):
        """Test admin user authentication"""
        print("\n🔍 Testing Admin Authentication...")
        
        # Test admin login
        login_data = {
            "email": ADMIN_EMAIL,
            "password": ADMIN_PASSWORD
        }
        
        result = await self.make_request("POST", "/auth/login", login_data)
        
        if result["success"] and "access_token" in result["data"]:
            self.admin_token = result["data"]["access_token"]
            self.log_test_result(
                "Admin Login", 
                True, 
                "Admin user authenticated successfully"
            )
            
            # Test token validation
            headers = {"Authorization": f"Bearer {self.admin_token}"}
            me_result = await self.make_request("GET", "/auth/me", headers=headers)
            
            if me_result["success"] and me_result["data"].get("email") == ADMIN_EMAIL:
                self.log_test_result(
                    "JWT Token Validation", 
                    True, 
                    "JWT token validation working correctly"
                )
            else:
                self.log_test_result(
                    "JWT Token Validation", 
                    False, 
                    "JWT token validation failed",
                    me_result
                )
        else:
            self.log_test_result(
                "Admin Login", 
                False, 
                "Admin authentication failed",
                result
            )
    
    async def test_contact_form_api(self):
        """Test contact form submission and management"""
        print("\n🔍 Testing Contact Form API...")
        
        # Test contact form submission
        contact_data = {
            "name": "John Doe",
            "email": "john.doe@example.com",
            "subject": "Portfolio Inquiry",
            "message": "I'm interested in your web development services.",
            "phone": "+1-555-0123",
            "company": "Tech Solutions Inc",
            "project_type": "Web Application",
            "budget": "$5,000 - $10,000"
        }
        
        result = await self.make_request("POST", "/contact", contact_data)
        
        if result["success"] and result["data"].get("name") == "John Doe":
            contact_id = result["data"]["id"]
            self.log_test_result(
                "Contact Form Submission", 
                True, 
                "Contact form submitted successfully"
            )
            
            # Test admin access to contacts
            if self.admin_token:
                headers = {"Authorization": f"Bearer {self.admin_token}"}
                contacts_result = await self.make_request("GET", "/contacts", headers=headers)
                
                if contacts_result["success"] and isinstance(contacts_result["data"], list):
                    self.log_test_result(
                        "Contact Management API", 
                        True, 
                        f"Retrieved {len(contacts_result['data'])} contact submissions"
                    )
                    
                    # Test contact update
                    update_data = {"is_read": True}
                    update_result = await self.make_request(
                        "PUT", f"/contacts/{contact_id}", update_data, headers=headers
                    )
                    
                    if update_result["success"]:
                        self.log_test_result(
                            "Contact Update API", 
                            True, 
                            "Contact marked as read successfully"
                        )
                    else:
                        self.log_test_result(
                            "Contact Update API", 
                            False, 
                            "Failed to update contact",
                            update_result
                        )
                else:
                    self.log_test_result(
                        "Contact Management API", 
                        False, 
                        "Failed to retrieve contacts",
                        contacts_result
                    )
        else:
            self.log_test_result(
                "Contact Form Submission", 
                False, 
                "Contact form submission failed",
                result
            )
    
    async def test_portfolio_content_apis(self):
        """Test portfolio content management APIs"""
        print("\n🔍 Testing Portfolio Content APIs...")
        
        if not self.admin_token:
            self.log_test_result(
                "Portfolio Content APIs", 
                False, 
                "Admin token required for testing"
            )
            return
        
        headers = {"Authorization": f"Bearer {self.admin_token}"}
        
        # Test Skills API
        skill_data = {
            "name": "Python",
            "level": 95,
            "category": "backend",
            "icon": "python-icon",
            "description": "Advanced Python programming",
            "order": 1
        }
        
        skill_result = await self.make_request("POST", "/skills", skill_data, headers=headers)
        
        if skill_result["success"]:
            skill_id = skill_result["data"]["id"]
            self.log_test_result(
                "Skills CRUD API", 
                True, 
                "Skill created successfully"
            )
            
            # Test skill retrieval
            skills_result = await self.make_request("GET", "/skills")
            if skills_result["success"] and isinstance(skills_result["data"], list):
                self.log_test_result(
                    "Skills Retrieval API", 
                    True, 
                    f"Retrieved {len(skills_result['data'])} skills"
                )
            
            # Clean up - delete test skill
            await self.make_request("DELETE", f"/skills/{skill_id}", headers=headers)
        else:
            self.log_test_result(
                "Skills CRUD API", 
                False, 
                "Failed to create skill",
                skill_result
            )
        
        # Test Projects API
        project_data = {
            "title": "Test Portfolio Website",
            "description": "A modern portfolio website built with React and FastAPI",
            "tech": ["React", "FastAPI", "MongoDB"],
            "image": "https://example.com/project-image.jpg",
            "github": "https://github.com/test/portfolio",
            "demo": "https://portfolio-demo.com",
            "featured": True,
            "status": "completed",
            "order": 1
        }
        
        project_result = await self.make_request("POST", "/projects", project_data, headers=headers)
        
        if project_result["success"]:
            project_id = project_result["data"]["id"]
            self.log_test_result(
                "Projects CRUD API", 
                True, 
                "Project created successfully"
            )
            
            # Test project retrieval
            projects_result = await self.make_request("GET", "/projects")
            if projects_result["success"] and isinstance(projects_result["data"], list):
                self.log_test_result(
                    "Projects Retrieval API", 
                    True, 
                    f"Retrieved {len(projects_result['data'])} projects"
                )
            
            # Clean up - delete test project
            await self.make_request("DELETE", f"/projects/{project_id}", headers=headers)
        else:
            self.log_test_result(
                "Projects CRUD API", 
                False, 
                "Failed to create project",
                project_result
            )
        
        # Test Experience API
        experience_data = {
            "company": "Tech Corp",
            "position": "Senior Developer",
            "duration": "2020 - Present",
            "description": "Led development of web applications",
            "achievements": ["Improved performance by 40%", "Led team of 5 developers"],
            "tech": ["React", "Node.js", "MongoDB"],
            "location": "San Francisco, CA",
            "order": 1
        }
        
        exp_result = await self.make_request("POST", "/experience", experience_data, headers=headers)
        
        if exp_result["success"]:
            exp_id = exp_result["data"]["id"]
            self.log_test_result(
                "Experience CRUD API", 
                True, 
                "Experience created successfully"
            )
            
            # Test experience retrieval
            exp_list_result = await self.make_request("GET", "/experience")
            if exp_list_result["success"] and isinstance(exp_list_result["data"], list):
                self.log_test_result(
                    "Experience Retrieval API", 
                    True, 
                    f"Retrieved {len(exp_list_result['data'])} experience entries"
                )
            
            # Clean up - delete test experience
            await self.make_request("DELETE", f"/experience/{exp_id}", headers=headers)
        else:
            self.log_test_result(
                "Experience CRUD API", 
                False, 
                "Failed to create experience",
                exp_result
            )
    
    async def test_analytics_tracking(self):
        """Test analytics tracking endpoints"""
        print("\n🔍 Testing Analytics Tracking...")
        
        # Test visitor analytics
        visitor_data = {
            "visitor_id": "test-visitor-123",
            "page": "/",
            "referrer": "https://google.com",
            "session_id": "session-123",
            "time_spent": 30
        }
        
        analytics_result = await self.make_request("POST", "/analytics/visit", visitor_data)
        
        if analytics_result["success"]:
            self.log_test_result(
                "Visitor Analytics Tracking", 
                True, 
                "Visitor analytics tracked successfully"
            )
        else:
            self.log_test_result(
                "Visitor Analytics Tracking", 
                False, 
                "Failed to track visitor analytics",
                analytics_result
            )
        
        # Test project view tracking
        project_view_data = {
            "project_id": "test-project-123",
            "visitor_id": "test-visitor-123",
            "action": "view"
        }
        
        project_view_result = await self.make_request("POST", "/analytics/project-view", project_view_data)
        
        if project_view_result["success"]:
            self.log_test_result(
                "Project View Tracking", 
                True, 
                "Project view tracked successfully"
            )
        else:
            self.log_test_result(
                "Project View Tracking", 
                False, 
                "Failed to track project view",
                project_view_result
            )
        
        # Test dashboard analytics (admin only)
        if self.admin_token:
            headers = {"Authorization": f"Bearer {self.admin_token}"}
            dashboard_result = await self.make_request("GET", "/analytics/dashboard", headers=headers)
            
            if dashboard_result["success"] and "total_visitors" in dashboard_result["data"]:
                self.log_test_result(
                    "Dashboard Analytics API", 
                    True, 
                    "Dashboard analytics retrieved successfully"
                )
            else:
                self.log_test_result(
                    "Dashboard Analytics API", 
                    False, 
                    "Failed to retrieve dashboard analytics",
                    dashboard_result
                )
    
    async def test_newsletter_system(self):
        """Test newsletter subscription system"""
        print("\n🔍 Testing Newsletter System...")
        
        # Test newsletter subscription
        newsletter_data = {
            "email": "newsletter.test@example.com",
            "name": "Newsletter Tester"
        }
        
        newsletter_result = await self.make_request("POST", "/newsletter/subscribe", newsletter_data)
        
        if newsletter_result["success"]:
            self.log_test_result(
                "Newsletter Subscription", 
                True, 
                "Newsletter subscription successful"
            )
        else:
            self.log_test_result(
                "Newsletter Subscription", 
                False, 
                "Newsletter subscription failed",
                newsletter_result
            )
    
    async def test_settings_management(self):
        """Test settings management system"""
        print("\n🔍 Testing Settings Management...")
        
        if not self.admin_token:
            self.log_test_result(
                "Settings Management", 
                False, 
                "Admin token required for testing"
            )
            return
        
        headers = {"Authorization": f"Bearer {self.admin_token}"}
        
        # Test get settings
        settings_result = await self.make_request("GET", "/settings", headers=headers)
        
        if settings_result["success"] and isinstance(settings_result["data"], list):
            self.log_test_result(
                "Settings Retrieval", 
                True, 
                f"Retrieved {len(settings_result['data'])} settings"
            )
            
            # Test update setting
            update_result = await self.make_request(
                "PUT", "/settings/email_notifications", 
                None, headers=headers, params={"value": "true"}
            )
            
            if update_result["success"]:
                self.log_test_result(
                    "Settings Update", 
                    True, 
                    "Setting updated successfully"
                )
            else:
                self.log_test_result(
                    "Settings Update", 
                    False, 
                    "Failed to update setting",
                    update_result
                )
        else:
            self.log_test_result(
                "Settings Retrieval", 
                False, 
                "Failed to retrieve settings",
                settings_result
            )
    
    async def test_email_service_graceful_handling(self):
        """Test email service handles missing SMTP configuration gracefully"""
        print("\n🔍 Testing Email Service Graceful Handling...")
        
        # Submit a contact form which should trigger email sending
        contact_data = {
            "name": "Email Test User",
            "email": "emailtest@example.com",
            "subject": "Email Service Test",
            "message": "Testing email service graceful handling"
        }
        
        result = await self.make_request("POST", "/contact", contact_data)
        
        # The contact should still be submitted successfully even if email fails
        if result["success"]:
            self.log_test_result(
                "Email Service Graceful Handling", 
                True, 
                "Contact form works even when SMTP is not configured"
            )
        else:
            self.log_test_result(
                "Email Service Graceful Handling", 
                False, 
                "Contact form failed when SMTP not configured",
                result
            )
    
    async def test_unauthorized_access(self):
        """Test that admin-only endpoints require authentication"""
        print("\n🔍 Testing Unauthorized Access Protection...")
        
        # Test accessing admin endpoint without token
        result = await self.make_request("GET", "/contacts")
        
        if result["status"] == 401 or result["status"] == 403:
            self.log_test_result(
                "Unauthorized Access Protection", 
                True, 
                "Admin endpoints properly protected"
            )
        else:
            self.log_test_result(
                "Unauthorized Access Protection", 
                False, 
                "Admin endpoints not properly protected",
                result
            )
    
    async def run_all_tests(self):
        """Run all backend tests"""
        print("🚀 Starting Comprehensive Backend Testing for Emmanuel Tobi's Portfolio")
        print(f"🔗 Backend URL: {BACKEND_URL}")
        print("=" * 80)
        
        await self.setup()
        
        try:
            # Core functionality tests
            await self.test_health_check()
            await self.test_database_initialization()
            await self.test_admin_authentication()
            
            # API functionality tests
            await self.test_contact_form_api()
            await self.test_portfolio_content_apis()
            await self.test_analytics_tracking()
            await self.test_newsletter_system()
            await self.test_settings_management()
            
            # Security and error handling tests
            await self.test_email_service_graceful_handling()
            await self.test_unauthorized_access()
            
        finally:
            await self.cleanup()
        
        # Print summary
        self.print_test_summary()
    
    def print_test_summary(self):
        """Print test results summary"""
        print("\n" + "=" * 80)
        print("📊 TEST RESULTS SUMMARY")
        print("=" * 80)
        
        total_tests = len(self.test_results)
        passed_tests = sum(1 for result in self.test_results.values() if result["success"])
        failed_tests = total_tests - passed_tests
        
        print(f"Total Tests: {total_tests}")
        print(f"✅ Passed: {passed_tests}")
        print(f"❌ Failed: {failed_tests}")
        print(f"Success Rate: {(passed_tests/total_tests)*100:.1f}%")
        
        if failed_tests > 0:
            print("\n❌ FAILED TESTS:")
            for test_name, result in self.test_results.items():
                if not result["success"]:
                    print(f"  - {test_name}: {result['message']}")
        
        print("\n" + "=" * 80)

async def main():
    """Main test runner"""
    tester = BackendTester()
    await tester.run_all_tests()

if __name__ == "__main__":
    asyncio.run(main())