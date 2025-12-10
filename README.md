# MediFind - AI Doctor Finder Application

A comprehensive full-stack healthcare platform for finding doctors, booking appointments, and managing healthcare needs.

## 🌟 Features

### Frontend (8 Pages)
- **Home Page** - Beautiful hero section, search functionality, specializations carousel with Swiper.js
- **Find Doctors** - Search and filter doctors by name, specialization, location
- **Doctor Profile** - Detailed doctor information with appointment booking
- **User Dashboard** - View and manage appointments
- **Profile Settings** - Update personal information
- **About Us** - Company information and team
- **Contact Us** - Contact form and FAQ
- **Authentication** - Login and Registration pages

### Admin Panel
- **Dashboard** - Overview statistics and quick actions
- **Manage Doctors** - Full CRUD operations for doctors
- **Manage Users** - User management with activation controls
- **Manage Appointments** - Confirm, complete, or cancel appointments
- **Manage Specializations** - CRUD for medical specializations

### Backend
- RESTful API with NestJS
- PostgreSQL database with TypeORM
- JWT Authentication
- Role-based access control (Admin/User)
- Auto-seeding with demo data

## 🛠️ Tech Stack

### Frontend
- **Next.js 16** - React framework with App Router
- **Tailwind CSS v4** - Utility-first CSS
- **ShadCN UI** - Modern component library
- **Framer Motion** - Smooth animations
- **Swiper.js** - Interactive carousels
- **Lucide React** - Beautiful icons

### Backend
- **NestJS** - Scalable Node.js framework
- **TypeORM** - Database ORM
- **PostgreSQL** - Relational database
- **JWT** - Authentication tokens
- **Passport** - Authentication middleware
- **Swagger** - API documentation

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- npm or yarn

### Database Setup

1. Create a PostgreSQL database:
```sql
CREATE DATABASE doctor_finder;
```

2. Create a `.env` file in the backend directory:
```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_DATABASE=doctor_finder

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRATION=7d

# App Configuration
PORT=3001
NODE_ENV=development
```

### Backend Setup

```bash
cd backend/backend

# Install dependencies
npm install

# Run the application (will auto-create tables and seed data)
npm run start:dev
```

The backend will be available at `http://localhost:3001`
API Documentation: `http://localhost:3001/api/docs`

### Frontend Setup

```bash
cd frontend/doctor-finder-app

# Install dependencies
npm install

# Run the development server
npm run dev
```

The frontend will be available at `http://localhost:3000`

## 👤 Demo Credentials

### Admin Account
- Email: `admin@doctorfinder.com`
- Password: `admin123`

### User Account
- Email: `user@test.com`
- Password: `user123`

## 📁 Project Structure

```
AI DOCTOR FINDER/
├── backend/
│   └── backend/
│       ├── src/
│       │   ├── auth/           # Authentication module
│       │   ├── users/          # Users module
│       │   ├── doctors/        # Doctors module
│       │   ├── appointments/   # Appointments module
│       │   ├── specializations/# Specializations module
│       │   ├── seed/           # Database seeder
│       │   ├── entities/       # TypeORM entities
│       │   └── config/         # Configuration
│       └── package.json
│
└── frontend/
    └── doctor-finder-app/
        ├── app/
        │   ├── page.js         # Home page
        │   ├── doctors/        # Doctors pages
        │   ├── dashboard/      # User dashboard
        │   ├── admin/          # Admin panel
        │   ├── about/          # About page
        │   ├── contact/        # Contact page
        │   ├── login/          # Login page
        │   └── register/       # Register page
        ├── components/
        │   ├── layout/         # Navbar, Footer
        │   └── ui/             # ShadCN components
        ├── lib/
        │   ├── api.js          # API service
        │   ├── auth-context.js # Auth context
        │   └── utils.js        # Utilities
        └── package.json
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get current user profile

### Doctors
- `GET /api/doctors` - List all doctors (with filters)
- `GET /api/doctors/:id` - Get doctor by ID
- `GET /api/doctors/featured` - Get featured doctors
- `POST /api/doctors` - Create doctor (Admin)
- `PATCH /api/doctors/:id` - Update doctor (Admin)
- `DELETE /api/doctors/:id` - Delete doctor (Admin)

### Specializations
- `GET /api/specializations` - List all specializations
- `GET /api/specializations/:id` - Get specialization by ID
- `POST /api/specializations` - Create specialization (Admin)
- `PATCH /api/specializations/:id` - Update specialization (Admin)
- `DELETE /api/specializations/:id` - Delete specialization (Admin)

### Appointments
- `GET /api/appointments` - List user appointments
- `POST /api/appointments` - Create appointment
- `PATCH /api/appointments/:id/cancel` - Cancel appointment
- `PATCH /api/appointments/:id/confirm` - Confirm appointment (Admin)
- `PATCH /api/appointments/:id/complete` - Complete appointment (Admin)

### Users (Admin)
- `GET /api/users` - List all users
- `GET /api/users/:id` - Get user by ID
- `PATCH /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

## 🎨 Design Features

- **Modern Teal/Emerald Color Scheme**
- **Responsive Design** - Mobile-first approach
- **Smooth Animations** - Framer Motion transitions
- **Interactive Elements** - Hover effects, loading states
- **Glass Morphism** - Modern UI patterns
- **Dark Mode Ready** - CSS variables for theming

## 📝 License

This project is for educational purposes.

---

Built with ❤️ using Next.js, NestJS, and PostgreSQL











