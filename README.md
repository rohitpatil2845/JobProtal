# 🚀 Job Portal - Full Stack Application

A modern, full-featured job portal application built with React, Node.js, Express, MySQL, and AI-powered recommendations. Similar to LinkedIn Jobs with advanced features for both job seekers and employers.

## ✨ Features

### 🔐 Authentication & Authorization
- JWT-based secure authentication
- Role-based access control (User & Admin)
- Password hashing with bcrypt
- Protected routes on frontend and backend

### 💼 For Job Seekers (Users)
- **Browse Jobs** with advanced filters
  - Filter by city, job type, experience, salary, category
  - Full-text search across jobs
  - Pagination support
- **Apply for Jobs** with resume upload (PDF/DOC/DOCX)
- **Track Applications** with real-time status updates
- **Save/Bookmark Jobs** for later viewing
- **AI-Powered Job Recommendations** based on skills and profile
- **AI Resume Analyzer** - Extract skills and calculate job match scores
- **View Match Scores** for each job

### 👨‍💼 For Employers (Admins)
- **Admin Dashboard** with analytics
  - Total jobs posted
  - Active jobs count
  - Total applications received
  - Conversion rate (hired/total applications)
  - Applications by status breakdown
  - Top performing jobs
- **Job Management (CRUD)**
  - Create new job postings
  - Edit existing jobs
  - Delete jobs
  - Draft/Active/Closed status
- **AI Job Description Generator** - Generate professional descriptions
- **View All Applications** for posted jobs
- **Update Application Status** (Pending → Reviewed → Shortlisted → Hired/Rejected)

### 🤖 AI Features
1. **Job Recommendations** - TF-IDF based similarity matching
2. **Resume Analyzer** - Extract skills from PDF/DOC resumes
3. **Match Score Calculator** - Calculate compatibility between user and job
4. **Job Description Generator** - AI-assisted description writing

## 🛠️ Tech Stack

### Frontend
- **React 18** with Hooks
- **Vite** for fast development
- **TailwindCSS** for modern UI
- **React Router** for navigation
- **Axios** for API calls
- **React Icons** for beautiful icons
- **React Toastify** for notifications

### Backend
- **Node.js & Express.js**
- **MySQL** with Sequelize ORM
- **JWT** for authentication
- **Bcrypt** for password hashing
- **Multer** for file uploads
- **Natural** library for NLP (TF-IDF)
- **PDF-Parse** for resume parsing

### Database
- **MySQL 8.0+**
- Models: Users, Jobs, Applications, SavedJobs
- Proper relationships and indexes

## 📁 Project Structure

```
Linkdin/
├── backend/
│   ├── config/
│   │   └── database.js          # MySQL/Sequelize config
│   ├── middleware/
│   │   ├── auth.js              # JWT authentication
│   │   ├── errorHandler.js      # Error handling
│   │   └── upload.js            # File upload config
│   ├── models/
│   │   ├── User.js              # User model
│   │   ├── Job.js               # Job model
│   │   ├── Application.js       # Application model
│   │   ├── SavedJob.js          # Saved jobs model
│   │   └── index.js             # Model associations
│   ├── routes/
│   │   ├── auth.js              # Auth routes
│   │   ├── jobs.js              # Job CRUD routes
│   │   ├── applications.js      # Application routes
│   │   ├── savedJobs.js         # Saved jobs routes
│   │   ├── admin.js             # Admin analytics
│   │   └── ai.js                # AI features
│   ├── utils/
│   │   └── aiHelpers.js         # AI/ML utilities
│   ├── .env.example             # Environment template
│   ├── server.js                # Express app
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx       # Navigation bar
    │   │   ├── Footer.jsx       # Footer
    │   │   ├── JobCard.jsx      # Job card component
    │   │   ├── FilterBar.jsx    # Advanced filters
    │   │   ├── SkeletonLoader.jsx
    │   │   └── ProtectedRoute.jsx
    │   ├── context/
    │   │   └── AuthContext.jsx  # Global auth state
    │   ├── pages/
    │   │   ├── Home.jsx         # Landing page
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   ├── Jobs.jsx         # Job listings
    │   │   ├── JobDetail.jsx    # Single job page
    │   │   ├── MyApplications.jsx
    │   │   ├── SavedJobs.jsx
    │   │   ├── Recommendations.jsx
    │   │   └── admin/
    │   │       ├── AdminDashboard.jsx
    │   │       └── CreateJob.jsx
    │   ├── utils/
    │   │   └── api.js           # Axios config
    │   ├── App.jsx              # Main app
    │   ├── main.jsx             # Entry point
    │   └── index.css            # Global styles
    ├── .env.example
    ├── vite.config.js
    ├── tailwind.config.js
    └── package.json
```

## 🚀 Getting Started

### Prerequisites
- Node.js 16+
- MySQL 8.0+
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

4. Update `.env` with your configuration:
```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=job_portal
JWT_SECRET=your_secret_key
CLIENT_URL=http://localhost:5173
```

5. Create MySQL database:
```sql
CREATE DATABASE job_portal;
```

6. Start the server:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Update `.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

5. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Jobs
- `GET /api/jobs` - Get all jobs (with filters)
- `GET /api/jobs/:id` - Get single job
- `POST /api/jobs` - Create job (Admin only)
- `PUT /api/jobs/:id` - Update job (Admin only)
- `DELETE /api/jobs/:id` - Delete job (Admin only)

### Applications
- `POST /api/applications/apply` - Apply for job
- `GET /api/applications/my-applications` - Get user applications
- `GET /api/applications/job/:jobId` - Get job applications (Admin)
- `PUT /api/applications/:id/status` - Update status (Admin)

### Saved Jobs
- `POST /api/saved-jobs` - Save a job
- `GET /api/saved-jobs` - Get saved jobs
- `DELETE /api/saved-jobs/:jobId` - Remove saved job

### Admin
- `GET /api/admin/dashboard` - Get dashboard analytics
- `GET /api/admin/analytics` - Get detailed analytics

### AI Features
- `GET /api/ai/recommendations` - Get job recommendations
- `POST /api/ai/analyze-resume` - Analyze resume
- `POST /api/ai/generate-description` - Generate job description
- `POST /api/ai/match-score` - Calculate match score

## 🌐 Deployment

### Backend Deployment (Render)

1. Create account on [Render](https://render.com)
2. Create new Web Service
3. Connect GitHub repository
4. Set build command: `npm install`
5. Set start command: `node server.js`
6. Add environment variables from `.env.example`
7. Deploy!

### Database Deployment (PlanetScale)

1. Create account on [PlanetScale](https://planetscale.com)
2. Create new database
3. Get connection details
4. Update Render environment variables with PlanetScale credentials
5. Database will auto-sync models

### Frontend Deployment (Vercel)

1. Create account on [Vercel](https://vercel.com)
2. Import frontend repository
3. Set framework preset to "Vite"
4. Add environment variable: `VITE_API_URL=<your-render-backend-url>/api`
5. Deploy!

## 🔒 Environment Variables

### Backend (.env)
```env
PORT=5000
NODE_ENV=production
DB_HOST=<planetscale-host>
DB_USER=<planetscale-user>
DB_PASSWORD=<planetscale-password>
DB_NAME=<database-name>
DB_PORT=3306
JWT_SECRET=<secure-random-string>
CLIENT_URL=<vercel-frontend-url>
OPENAI_API_KEY=<optional>
```

### Frontend (.env)
```env
VITE_API_URL=<render-backend-url>/api
```

## 👥 User Roles

### User (Job Seeker)
- Browse and search jobs
- Apply for jobs with resume
- Track application status
- Save favorite jobs
- Get AI recommendations
- Analyze resume match scores

### Admin (Employer/Recruiter)
- Post and manage jobs
- View dashboard analytics
- Review applications
- Update application status
- Generate job descriptions with AI
- Track conversion rates

## 🎨 UI/UX Features

- **Responsive Design** - Works on all devices
- **Modern UI** - Built with TailwindCSS
- **Skeleton Loaders** - Smooth loading experience
- **Toast Notifications** - Real-time feedback
- **Smooth Animations** - Polished interactions
- **Dark Mode Ready** - Easy to add dark theme

## 🔧 Development

### Run Backend Tests
```bash
cd backend
npm test
```

### Run Frontend Tests
```bash
cd frontend
npm test
```

### Build for Production

Backend:
```bash
cd backend
# No build needed, Node.js runs directly
```

Frontend:
```bash
cd frontend
npm run build
```

## 📝 Database Schema

### Users Table
```sql
- id (PK)
- name
- email (unique)
- password (hashed)
- role (user/admin)
- skills (JSON)
- resumeUrl
- createdAt
- updatedAt
```

### Jobs Table
```sql
- job_id (PK)
- title
- company
- description
- requirements
- city
- country
- jobType
- experience
- salaryMin
- salaryMax
- category
- skills (JSON)
- postedBy (FK -> Users)
- status
- applicationCount
- createdAt
- updatedAt
```

### Applications Table
```sql
- id (PK)
- job_id (FK -> Jobs)
- user_id (FK -> Users)
- resumeUrl
- coverLetter
- status
- matchScore
- appliedAt
- updatedAt
```

### SavedJobs Table
```sql
- id (PK)
- user_id (FK -> Users)
- job_id (FK -> Jobs)
- savedAt
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- React team for the amazing framework
- TailwindCSS for beautiful styling
- Natural library for NLP features
- All open-source contributors

## 📞 Support

For support, email support@jobportal.com or create an issue in the repository.

---

**Built with ❤️ using React, Node.js, and MySQL**
