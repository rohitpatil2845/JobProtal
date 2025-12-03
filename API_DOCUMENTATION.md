# Job Portal - API Documentation

## Base URL
- Development: `http://localhost:5000/api`
- Production: `https://your-app.render.com/api`

## Authentication
Most endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

---

## Authentication Endpoints

### Register User
**POST** `/auth/register`

Create a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "user",  // "user" or "admin"
  "phone": "1234567890"  // optional
}
```

**Response:** `201 Created`
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

### Login
**POST** `/auth/login`

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:** `200 OK`
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "skills": ["React", "Node.js"]
  }
}
```

### Get Current User
**GET** `/auth/me`

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "role": "user",
  "skills": ["React", "Node.js"],
  "resumeUrl": "/uploads/resumes/resume-123.pdf"
}
```

---

## Job Endpoints

### Get All Jobs (with filters)
**GET** `/jobs?city=Bangalore&jobType=Full-time&experience=2-5&salaryMin=500000&search=React&page=1&limit=10`

**Query Parameters:**
- `city` (string): Filter by city
- `jobType` (string): Full-time, Part-time, Contract, Remote, Night Shift
- `experience` (string): e.g., "0-2", "2-5"
- `salaryMin` (number): Minimum salary
- `salaryMax` (number): Maximum salary
- `category` (string): Job category
- `search` (string): Search in title, company, description
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 10)

**Response:** `200 OK`
```json
{
  "jobs": [
    {
      "job_id": 1,
      "title": "Senior React Developer",
      "company": "Tech Corp",
      "description": "We are looking for...",
      "city": "Bangalore",
      "country": "India",
      "jobType": "Full-time",
      "experience": "2-5 years",
      "salaryMin": 500000,
      "salaryMax": 800000,
      "salaryCurrency": "INR",
      "category": "IT",
      "skills": ["React", "Node.js", "AWS"],
      "status": "active",
      "applicationCount": 15,
      "createdAt": "2025-01-01T00:00:00.000Z",
      "poster": {
        "id": 2,
        "name": "Admin User",
        "email": "admin@example.com"
      }
    }
  ],
  "totalJobs": 50,
  "totalPages": 5,
  "currentPage": 1
}
```

### Get Single Job
**GET** `/jobs/:id`

**Response:** `200 OK`
```json
{
  "job_id": 1,
  "title": "Senior React Developer",
  "company": "Tech Corp",
  "description": "Detailed description...",
  "requirements": "Detailed requirements...",
  "city": "Bangalore",
  "jobType": "Full-time",
  "experience": "2-5 years",
  "salaryMin": 500000,
  "salaryMax": 800000,
  "skills": ["React", "Node.js"],
  "poster": {
    "id": 2,
    "name": "Admin User"
  }
}
```

### Create Job (Admin Only)
**POST** `/jobs`

**Headers:** `Authorization: Bearer <admin_token>`

**Request Body:**
```json
{
  "title": "Senior React Developer",
  "company": "Tech Corp",
  "description": "Job description...",
  "requirements": "Requirements...",
  "city": "Bangalore",
  "country": "India",
  "jobType": "Full-time",
  "experience": "2-5 years",
  "salaryMin": 500000,
  "salaryMax": 800000,
  "category": "IT",
  "skills": ["React", "Node.js", "AWS"],
  "status": "active"
}
```

**Response:** `201 Created`

### Update Job (Admin Only)
**PUT** `/jobs/:id`

**Headers:** `Authorization: Bearer <admin_token>`

**Request Body:** (Same as Create Job)

**Response:** `200 OK`

### Delete Job (Admin Only)
**DELETE** `/jobs/:id`

**Headers:** `Authorization: Bearer <admin_token>`

**Response:** `200 OK`
```json
{
  "message": "Job deleted successfully"
}
```

---

## Application Endpoints

### Apply for Job
**POST** `/applications/apply`

**Headers:** 
- `Authorization: Bearer <token>`
- `Content-Type: multipart/form-data`

**Form Data:**
- `job_id` (number): Job ID
- `coverLetter` (text): Cover letter
- `resume` (file): Resume file (PDF/DOC/DOCX, max 5MB)

**Response:** `201 Created`
```json
{
  "message": "Application submitted successfully",
  "application": {
    "id": 1,
    "job_id": 1,
    "user_id": 1,
    "resumeUrl": "/uploads/resumes/resume-123.pdf",
    "status": "pending"
  }
}
```

### Get My Applications
**GET** `/applications/my-applications`

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`
```json
[
  {
    "id": 1,
    "job_id": 1,
    "resumeUrl": "/uploads/resumes/resume-123.pdf",
    "coverLetter": "I am excited...",
    "status": "pending",
    "matchScore": 85.5,
    "appliedAt": "2025-01-01T00:00:00.000Z",
    "job": {
      "job_id": 1,
      "title": "Senior React Developer",
      "company": "Tech Corp"
    }
  }
]
```

### Get Applications for Job (Admin)
**GET** `/applications/job/:jobId`

**Headers:** `Authorization: Bearer <admin_token>`

**Response:** `200 OK`
```json
[
  {
    "id": 1,
    "status": "pending",
    "appliedAt": "2025-01-01T00:00:00.000Z",
    "applicant": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "skills": ["React", "Node.js"]
    }
  }
]
```

### Update Application Status (Admin)
**PUT** `/applications/:id/status`

**Headers:** `Authorization: Bearer <admin_token>`

**Request Body:**
```json
{
  "status": "shortlisted"  // pending, reviewed, shortlisted, rejected, hired
}
```

**Response:** `200 OK`

---

## Saved Jobs Endpoints

### Save Job
**POST** `/saved-jobs`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "job_id": 1
}
```

**Response:** `201 Created`

### Get Saved Jobs
**GET** `/saved-jobs`

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`
```json
[
  {
    "id": 1,
    "job_id": 1,
    "savedAt": "2025-01-01T00:00:00.000Z",
    "job": {
      "job_id": 1,
      "title": "Senior React Developer",
      "company": "Tech Corp"
    }
  }
]
```

### Remove Saved Job
**DELETE** `/saved-jobs/:jobId`

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`

---

## Admin Endpoints

### Get Dashboard Analytics
**GET** `/admin/dashboard`

**Headers:** `Authorization: Bearer <admin_token>`

**Response:** `200 OK`
```json
{
  "stats": {
    "totalJobs": 10,
    "activeJobs": 8,
    "totalApplications": 50,
    "hiredCount": 5,
    "conversionRate": 10.0
  },
  "applicationsByStatus": [
    { "status": "pending", "count": 20 },
    { "status": "reviewed", "count": 15 },
    { "status": "shortlisted", "count": 10 },
    { "status": "hired", "count": 5 }
  ],
  "recentApplications": [...],
  "topJobs": [...]
}
```

---

## AI Endpoints

### Get Job Recommendations
**GET** `/ai/recommendations`

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`
```json
{
  "recommendations": [
    {
      "job_id": 1,
      "title": "Senior React Developer",
      "recommendationScore": 85,
      "matchingSkills": ["React", "Node.js"]
    }
  ],
  "message": "Recommendations generated based on your profile"
}
```

### Analyze Resume
**POST** `/ai/analyze-resume`

**Headers:** 
- `Authorization: Bearer <token>`
- `Content-Type: multipart/form-data`

**Form Data:**
- `resume` (file): Resume PDF
- `job_id` (number, optional): Calculate match score for specific job

**Response:** `200 OK`
```json
{
  "message": "Resume analyzed successfully",
  "extractedSkills": ["React", "Node.js", "MongoDB"],
  "totalSkills": 3,
  "matchScore": 85,
  "resumeUrl": "/uploads/resumes/resume-123.pdf"
}
```

### Generate Job Description
**POST** `/ai/generate-description`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "title": "Senior React Developer",
  "skills": ["React", "Node.js", "AWS"],
  "experience": "2-5 years",
  "jobType": "Full-time"
}
```

**Response:** `200 OK`
```json
{
  "message": "Job description generated successfully",
  "description": "We are seeking a talented Senior React Developer...",
  "generatedAt": "2025-01-01T00:00:00.000Z"
}
```

### Calculate Match Score
**POST** `/ai/match-score`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "job_id": 1
}
```

**Response:** `200 OK`
```json
{
  "matchScore": 85,
  "userSkills": ["React", "Node.js"],
  "jobSkills": ["React", "Node.js", "AWS"],
  "message": "Great match!"
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "message": "Validation Error",
  "errors": [
    {
      "field": "email",
      "message": "Valid email is required"
    }
  ]
}
```

### 401 Unauthorized
```json
{
  "message": "Token is not valid"
}
```

### 403 Forbidden
```json
{
  "message": "Access denied. Admin only."
}
```

### 404 Not Found
```json
{
  "message": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "message": "Internal Server Error"
}
```

---

## Rate Limiting

Currently no rate limiting implemented. Consider adding rate limiting for production:
- 100 requests per 15 minutes per IP
- 1000 requests per day per authenticated user

## Pagination

All list endpoints support pagination:
- Default: `page=1&limit=10`
- Max limit: 100

## File Upload Limits

- Resume files: Max 5MB
- Allowed formats: PDF, DOC, DOCX

## CORS

CORS is enabled for the frontend URL specified in `CLIENT_URL` environment variable.
