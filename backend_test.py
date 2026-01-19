#!/usr/bin/env python3
"""
Backend API Testing Script for Dargah Portal
Tests all core backend endpoints as specified in test_result.md
"""

import requests
import json
import sys
from typing import Dict, Any, Optional

# Base URL from environment
BASE_URL = "http://localhost:3000/api"

class BackendTester:
    def __init__(self):
        self.session = requests.Session()
        self.auth_token = None
        self.test_results = {}
        
    def log_result(self, test_name: str, success: bool, message: str, response_data: Any = None):
        """Log test results"""
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} {test_name}: {message}")
        
        self.test_results[test_name] = {
            "success": success,
            "message": message,
            "response_data": response_data
        }
        
    def make_request(self, method: str, endpoint: str, data: Dict = None, params: Dict = None) -> tuple:
        """Make HTTP request and return (success, response_data, status_code)"""
        try:
            url = f"{BASE_URL}{endpoint}"
            headers = {"Content-Type": "application/json"}
            
            if self.auth_token:
                headers["Authorization"] = f"Bearer {self.auth_token}"
            
            if method == "GET":
                response = requests.get(url, headers=headers, params=params, timeout=60)
            elif method == "POST":
                response = requests.post(url, headers=headers, json=data, timeout=60)
            elif method == "PUT":
                response = requests.put(url, headers=headers, json=data, timeout=60)
            elif method == "DELETE":
                response = requests.delete(url, headers=headers, params=params, timeout=60)
            else:
                return False, {"error": f"Unsupported method: {method}"}, 400
                
            try:
                response_data = response.json()
            except:
                response_data = {"raw_response": response.text}
                
            return response.status_code < 400, response_data, response.status_code
            
        except requests.exceptions.RequestException as e:
            return False, {"error": str(e)}, 0
    
    def test_auth_login(self):
        """Test POST /api/auth/login"""
        print("\n=== Testing Authentication ===")
        
        # Test valid login
        success, response_data, status_code = self.make_request(
            "POST", 
            "/auth/login", 
            {"username": "admin", "password": "admin123"}
        )
        
        if success and "token" in response_data:
            self.auth_token = response_data["token"]
            self.log_result(
                "POST /api/auth/login (valid credentials)", 
                True, 
                f"Login successful, token received: {response_data['token'][:20]}...",
                response_data
            )
        else:
            self.log_result(
                "POST /api/auth/login (valid credentials)", 
                False, 
                f"Login failed: {response_data}",
                response_data
            )
            
        # Test invalid login
        success, response_data, status_code = self.make_request(
            "POST", 
            "/auth/login", 
            {"username": "admin", "password": "wrongpassword"}
        )
        
        if not success and status_code == 401:
            self.log_result(
                "POST /api/auth/login (invalid credentials)", 
                True, 
                "Correctly rejected invalid credentials",
                response_data
            )
        else:
            self.log_result(
                "POST /api/auth/login (invalid credentials)", 
                False, 
                f"Should have rejected invalid credentials but got: {response_data}",
                response_data
            )
    
    def test_saints_crud(self):
        """Test Saints CRUD operations"""
        print("\n=== Testing Saints CRUD ===")
        
        # Test GET saints (empty initially)
        success, response_data, status_code = self.make_request(
            "GET", 
            "/saints", 
            params={"language": "en"}
        )
        
        if success and "saints" in response_data:
            initial_count = len(response_data["saints"])
            self.log_result(
                "GET /api/saints?language=en", 
                True, 
                f"Retrieved saints list with {initial_count} items",
                response_data
            )
        else:
            self.log_result(
                "GET /api/saints?language=en", 
                False, 
                f"Failed to get saints: {response_data}",
                response_data
            )
            return
        
        # Test POST saint (create)
        test_saint = {
            "name": "Test Saint Hazrat Ali",
            "title": "The Noble Companion", 
            "content": "A test saint entry for API testing purposes",
            "language": "en",
            "order": 1
        }
        
        success, response_data, status_code = self.make_request(
            "POST", 
            "/saints", 
            test_saint
        )
        
        created_saint_id = None
        if success and "saint" in response_data:
            created_saint_id = response_data["saint"]["id"]
            self.log_result(
                "POST /api/saints", 
                True, 
                f"Created saint with ID: {created_saint_id}",
                response_data
            )
        else:
            self.log_result(
                "POST /api/saints", 
                False, 
                f"Failed to create saint: {response_data}",
                response_data
            )
            return
        
        # Test GET saints again (should have 1 more)
        success, response_data, status_code = self.make_request(
            "GET", 
            "/saints", 
            params={"language": "en"}
        )
        
        if success and "saints" in response_data:
            new_count = len(response_data["saints"])
            if new_count == initial_count + 1:
                self.log_result(
                    "GET /api/saints (after create)", 
                    True, 
                    f"Saints count increased from {initial_count} to {new_count}",
                    {"count": new_count}
                )
            else:
                self.log_result(
                    "GET /api/saints (after create)", 
                    False, 
                    f"Expected {initial_count + 1} saints, got {new_count}",
                    response_data
                )
        
        # Test PUT saint (update)
        if created_saint_id:
            update_data = {
                "id": created_saint_id,
                "name": "Updated Test Saint",
                "title": "Updated Title",
                "content": "Updated content for testing",
                "language": "en",
                "order": 2
            }
            
            success, response_data, status_code = self.make_request(
                "PUT", 
                "/saints", 
                update_data
            )
            
            if success and response_data.get("success"):
                self.log_result(
                    "PUT /api/saints", 
                    True, 
                    f"Updated saint {created_saint_id}",
                    response_data
                )
            else:
                self.log_result(
                    "PUT /api/saints", 
                    False, 
                    f"Failed to update saint: {response_data}",
                    response_data
                )
        
        # Test DELETE saint
        if created_saint_id:
            success, response_data, status_code = self.make_request(
                "DELETE", 
                "/saints", 
                params={"id": created_saint_id}
            )
            
            if success and response_data.get("success"):
                self.log_result(
                    "DELETE /api/saints", 
                    True, 
                    f"Deleted saint {created_saint_id}",
                    response_data
                )
            else:
                self.log_result(
                    "DELETE /api/saints", 
                    False, 
                    f"Failed to delete saint: {response_data}",
                    response_data
                )
    
    def test_stats_endpoint(self):
        """Test GET /api/stats"""
        print("\n=== Testing Stats Endpoint ===")
        
        success, response_data, status_code = self.make_request("GET", "/stats")
        
        if success and "stats" in response_data:
            stats = response_data["stats"]
            expected_keys = ["saints", "books", "audio", "videos", "events", "gallery", "news", "slider", "poetry"]
            
            missing_keys = [key for key in expected_keys if key not in stats]
            
            if not missing_keys:
                self.log_result(
                    "GET /api/stats", 
                    True, 
                    f"Stats endpoint working, returned all expected counters: {stats}",
                    response_data
                )
            else:
                self.log_result(
                    "GET /api/stats", 
                    False, 
                    f"Stats missing keys: {missing_keys}. Got: {stats}",
                    response_data
                )
        else:
            self.log_result(
                "GET /api/stats", 
                False, 
                f"Stats endpoint failed: {response_data}",
                response_data
            )
    
    def test_books_crud_smoke(self):
        """Quick smoke test for books CRUD"""
        print("\n=== Testing Books CRUD (Smoke Test) ===")
        
        # Test GET books
        success, response_data, status_code = self.make_request(
            "GET", 
            "/books", 
            params={"language": "en"}
        )
        
        if success and "books" in response_data:
            initial_count = len(response_data["books"])
            self.log_result(
                "GET /api/books?language=en", 
                True, 
                f"Retrieved books list with {initial_count} items",
                {"count": initial_count}
            )
        else:
            self.log_result(
                "GET /api/books?language=en", 
                False, 
                f"Failed to get books: {response_data}",
                response_data
            )
            return
        
        # Test POST book (create)
        test_book = {
            "title": "Test Spiritual Book",
            "author": "Test Author",
            "description": "A test book for API testing",
            "language": "en",
            "pdfUrl": "https://example.com/test.pdf"
        }
        
        success, response_data, status_code = self.make_request(
            "POST", 
            "/books", 
            test_book
        )
        
        created_book_id = None
        if success and "book" in response_data:
            created_book_id = response_data["book"]["id"]
            self.log_result(
                "POST /api/books", 
                True, 
                f"Created book with ID: {created_book_id}",
                response_data
            )
        else:
            self.log_result(
                "POST /api/books", 
                False, 
                f"Failed to create book: {response_data}",
                response_data
            )
            return
        
        # Test DELETE book
        if created_book_id:
            success, response_data, status_code = self.make_request(
                "DELETE", 
                "/books", 
                params={"id": created_book_id}
            )
            
            if success and response_data.get("success"):
                self.log_result(
                    "DELETE /api/books", 
                    True, 
                    f"Deleted book {created_book_id}",
                    response_data
                )
            else:
                self.log_result(
                    "DELETE /api/books", 
                    False, 
                    f"Failed to delete book: {response_data}",
                    response_data
                )
    
    def test_other_endpoints_smoke(self):
        """Quick smoke test for other endpoints"""
        print("\n=== Testing Other Endpoints (Smoke Test) ===")
        
        endpoints = [
            ("GET /api/audio", "/audio", {"language": "en"}),
            ("GET /api/videos", "/videos", {}),
            ("GET /api/events", "/events", {"language": "en"}),
            ("GET /api/news", "/news", {"language": "en"}),
            ("GET /api/gallery", "/gallery", {}),
            ("GET /api/poetry", "/poetry", {"language": "en"}),
        ]
        
        for test_name, endpoint, params in endpoints:
            success, response_data, status_code = self.make_request("GET", endpoint, params=params)
            
            # Map endpoint to expected response key
            endpoint_key_map = {
                "/audio": "audioFiles",
                "/videos": "videos", 
                "/events": "events",
                "/news": "news",
                "/gallery": "gallery",
                "/poetry": "poetry"
            }
            
            expected_key = endpoint_key_map.get(endpoint, endpoint.strip('/').split('/')[-1])
            
            if success and expected_key in response_data:
                count = len(response_data[expected_key])
                self.log_result(
                    test_name, 
                    True, 
                    f"Retrieved {expected_key} list with {count} items",
                    {"count": count}
                )
            else:
                self.log_result(
                    test_name, 
                    False, 
                    f"Failed to get {expected_key}: {response_data}",
                    response_data
                )
    
    def run_all_tests(self):
        """Run all backend tests"""
        print("🚀 Starting Backend API Tests for Dargah Portal")
        print(f"Base URL: {BASE_URL}")
        print("=" * 60)
        
        try:
            # Core authentication test
            self.test_auth_login()
            
            # Core Saints CRUD tests
            self.test_saints_crud()
            
            # Stats endpoint test
            self.test_stats_endpoint()
            
            # Books CRUD smoke test
            self.test_books_crud_smoke()
            
            # Other endpoints smoke test
            self.test_other_endpoints_smoke()
            
        except Exception as e:
            print(f"❌ CRITICAL ERROR during testing: {str(e)}")
            self.log_result("CRITICAL_ERROR", False, str(e))
        
        # Summary
        print("\n" + "=" * 60)
        print("📊 TEST SUMMARY")
        print("=" * 60)
        
        total_tests = len(self.test_results)
        passed_tests = sum(1 for result in self.test_results.values() if result["success"])
        failed_tests = total_tests - passed_tests
        
        print(f"Total Tests: {total_tests}")
        print(f"Passed: {passed_tests} ✅")
        print(f"Failed: {failed_tests} ❌")
        
        if failed_tests > 0:
            print("\n❌ FAILED TESTS:")
            for test_name, result in self.test_results.items():
                if not result["success"]:
                    print(f"  - {test_name}: {result['message']}")
        
        return failed_tests == 0

if __name__ == "__main__":
    tester = BackendTester()
    success = tester.run_all_tests()
    sys.exit(0 if success else 1)