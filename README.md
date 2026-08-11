# RentNest Backend

## Overview

RentNest Backend is a production-ready, full-featured rental property management RESTful API platform built with Node.js, Express.js, TypeScript, PostgreSQL, and Prisma ORM.

The platform provides granular, role-based functionality tailored to three core user roles:
- **Tenants**: Browse available properties with search/filters, submit rental requests, manage favorites, receive real-time notifications, and submit property reviews.
- **Landlords**: List and manage properties, review rental applications, and accept/reject tenant requests with transactional status updates.
- **Admins**: Platform oversight with user management, category management, system-wide properties control, and analytical dashboard metrics.

---

## Technology Stack

- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma ORM (`@prisma/client`, `@prisma/adapter-pg`)
- **Authentication**: JSON Web Tokens (JWT) & Google OAuth 2.0
- **Password Security**: `bcrypt` (12 salt rounds)
- **Environment**: `dotenv`
- **Security & CORS**: `cors`, `helmet`, `express-rate-limit`

---

## Features

- **Authentication & OAuth**: Local email/password registration, secure JWT authentication, and Google OAuth 2.0 login integration.
- **Role-Based Authorization**: Strict route protection for `TENANT`, `LANDLORD`, and `ADMIN` roles.
- **Property Management**: Complete CRUD operations for property listings with search, filter (location, rent range, property type), and pagination support.
- **Rental Request System**: Tenants submit applications; Landlords approve/reject requests with transactional property status updates.
- **Favorites & Wishlist**: Save favorite properties and manage personal wishlists.
- **Reviews & Ratings**: Star rating system (1–5) and review comments for verified properties.
- **Notification System**: Notifications triggered on rental request updates and account events.
- **Analytics & Dashboard**: Role-customized analytical dashboards for Admin, Landlord, and Tenant.

---

## JWT Authentication Header

All protected API endpoints require a valid JSON Web Token (JWT) sent in the HTTP request headers using the standard `Bearer` authentication scheme:

```http
Authorization: Bearer <jwt_token>
```

- Tokens are generated upon successful login (`POST /api/auth/login` or `POST /api/auth/google`) and contain user identity (`id`, `email`, `role`).
- Unauthenticated requests to protected endpoints return `401 Unauthorized`.
- Requests lacking required role permissions return `403 Forbidden`.

---

## Database Models Overview

The database is built on PostgreSQL using Prisma ORM with soft delete support (`isDeleted = true`):

| Model | Table | Description & Relations | Key Enums |
| :--- | :--- | :--- | :--- |
| **`User`** | `users` | User accounts (Tenants, Landlords, Admins). Has many properties, requests, reviews, favorites, and notifications. | `UserRole` (`TENANT`, `LANDLORD`, `ADMIN`), `UserStatus` (`ACTIVE`, `BLOCKED`, `INACTIVE`) |
| **`Category`** | `categories` | Property categories (e.g. Apartments, Rooms). Has many properties. | `CategoryStatus` (`ACTIVE`, `INACTIVE`) |
| **`Property`** | `properties` | Rental listings with rent, area, amenities, landlord ID, and category ID. | `PropertyType` (`FLAT`, `ROOM`, `SEAT`, `SUBLET`, `HOSTEL`), `PropertyStatus` (`AVAILABLE`, `RESERVED`, `RENTED`, `INACTIVE`) |
| **`RentalRequest`** | `rental_requests` | Rental applications connecting Tenants and Properties. | `RequestStatus` (`PENDING`, `ACCEPTED`, `REJECTED`, `CANCELLED`) |
| **`Review`** | `reviews` | Ratings (1–5) and review comments per property by tenants. | `ReviewStatus` (`PUBLISHED`, `HIDDEN`) |
| **`Favorite`** | `favorites` | Saved property wishlist per user. | `FavoriteStatus` (`ACTIVE`, `REMOVED`) |
| **`Notification`** | `notifications` | In-app alerts and request status updates for users. | `type`: `INFO`, `RENTAL_REQUEST` |

---

## Project Structure

```text
rentnest-server/
├── prisma/
│   ├── schema.prisma        # Prisma database schema & enum definitions
│   └── seed.ts              # Initial seed data for development
├── src/
│   ├── services/
│   │   ├── auth/            # Auth routes, controller & service (register, login, google)
│   │   ├── user/            # User management (admin endpoints)
│   │   ├── category/        # Category management
│   │   ├── property/        # Property listings, search & filters
│   │   ├── rentalRequest/   # Rental application lifecycle
│   │   ├── favorite/        # Tenant wishlist & saved properties
│   │   ├── review/          # Ratings and property feedback
│   │   ├── notification/    # System notifications
│   │   └── dashboard/       # Admin, Landlord, and Tenant analytics
│   ├── routes/              # Central express router configuration
│   ├── middleware/          # auth, authorize, rateLimiter, globalErrorHandler, notFound
│   ├── utils/               # AppError, sendResponse & JwtUtils
│   ├── lib/                 # Prisma client instance
│   ├── app.ts               # Express app instance with security middlewares
│   └── server.ts            # HTTP server entry point
├── API_DOCUMENTATION.md     # Complete REST API reference documentation
├── README.md                # Project documentation & setup guide
└── package.json
```

---

## Environment Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Tasmih/rentnest-server.git
   cd rentnest-server
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the root directory (refer to `.env.example`):
   ```env
   PORT=5000
   DATABASE_URL="postgresql://username:password@localhost:5432/rentnest_db?schema=public"
   JWT_SECRET="your_jwt_secret_key"
   JWT_EXPIRES_IN="7d"
   CLIENT_URL="http://localhost:3000"
   GOOGLE_CLIENT_ID="your_google_client_id"
   GOOGLE_CLIENT_SECRET="your_google_client_secret"
   ```

4. **Prisma Commands**:
   ```bash
   # Generate Prisma Client
   npx prisma generate

   # Run Database Migrations
   npx prisma migrate dev

   # Seed Database (Optional)
   npx prisma db seed
   ```

---

## Running Project

### Development Mode
Start server with automatic reload:
```bash
npm run dev
```
Server runs at: `http://localhost:5000` (API base: `http://localhost:5000/api`)

### Production Mode
Compile TypeScript & run:
```bash
# Build
npm run build

# Start Production Server
npm start
```

---

## API Documentation

Complete details for all 30 REST endpoints, request bodies, query parameters, headers, and status codes are documented in:
👉 **[API_DOCUMENTATION.md](./API_DOCUMENTATION.md)** (View online on [GitHub](https://github.com/Tasmih/rentnest-server/blob/main/API_DOCUMENTATION.md))

---

## Deployment & Repository Information

- **Live Backend API Base URL**: [https://rentnest-server-fz6q.onrender.com/api](https://rentnest-server-fz6q.onrender.com/api)
- **Deployment Platform**: Render
- **Database Hosting**: PostgreSQL
- **Backend Repository**: [https://github.com/Tasmih/rentnest-server](https://github.com/Tasmih/rentnest-server)
- **Frontend Repository**: [https://github.com/Tasmih/rentnest-client](https://github.com/Tasmih/rentnest-client)
- **Live Frontend Web App**: [https://rentnest.vercel.app](https://rentnest.vercel.app)
