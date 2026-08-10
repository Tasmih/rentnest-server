# RentNest Backend

## Project Overview

RentNest Backend is a full-featured rental property management RESTful API platform built with Node.js, Express.js, TypeScript, PostgreSQL, and Prisma ORM.

The platform provides role-based functionality tailored to three types of users:
- **Tenants**: Browse available properties, apply search and filter criteria, submit rental requests, manage favorite properties, and post property reviews.
- **Landlords**: List and manage properties, view rental applications submitted for their properties, and accept or reject tenant requests with automated status updates.
- **Admins**: Manage users, categories, properties, and monitor system-wide platform analytics via dedicated dashboard metrics.

---

## Technology Stack

- **Runtime & Core**: Node.js, Express.js, TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma ORM (`@prisma/client`, `@prisma/adapter-pg`)
- **Authentication & Security**: JSON Web Tokens (JWT), bcrypt
- **Development Tools**: `ts-node-dev`, `tsx`, `typescript`

---

## Features

### Authentication
- User Registration (`POST /api/auth/register`)
- User Login (`POST /api/auth/login`)
- JWT-based authentication and stateless session management
- Role-based authorization (`ADMIN`, `LANDLORD`, `TENANT`)

### User Management
- User profile retrieval and management
- Role enforcement (`ADMIN`, `LANDLORD`, `TENANT`)
- Soft delete support for users

### Category Management
- Create, retrieve, update, and soft-delete categories
- Protection against deleting categories associated with active property listings
- Admin-only write access

### Property Management
- Create, update, soft-delete, and fetch property listings
- Advanced search, filtering (by area, min/max rent, property type, category), and pagination
- Detailed property view with landlord and category information

### Rental Request Management
- Tenants can submit rental requests with move-in date and custom message
- Landlords can retrieve all requests submitted for their properties
- Landlord request acceptance: updates request status to `ACCEPTED`, sets property status to `RENTED`, and automatically rejects competing pending requests in a Prisma transaction
- Landlord request rejection: updates pending request status to `REJECTED`

### Favorite Management
- Add properties to user favorites
- Soft-delete/remove from favorites
- Retrieve tenant's active favorite properties list

### Review Management
- Create property reviews with rating (1–5) and comment
- Update and soft-delete (hide) existing reviews
- Retrieve public reviews per property with user details

### Dashboard Module
- **Admin Dashboard**: System-wide statistics (total users, landlords, tenants, total/available/rented properties, total rental requests)
- **Landlord Dashboard**: Landlord-specific stats (properties owned, available/rented properties, pending/accepted requests)
- **Tenant Dashboard**: Tenant-specific stats (total, pending, and accepted requests, plus favorite count)

---

## Project Structure

```text
src/
 ├── services/
 │    ├── auth/          # Authentication routes, controller & service
 │    ├── category/      # Category management
 │    ├── dashboard/     # Role-based dashboard analytics
 │    ├── favorite/      # User property favorites
 │    ├── property/      # Property listings, search & filters
 │    ├── rentalRequest/ # Rental request lifecycle management
 │    ├── review/        # Property reviews & ratings
 │    └── user/          # User management
 ├── routes/             # Central router configuration
 ├── middleware/         # Auth, authorization, error & 404 handlers
 ├── utils/              # AppError, sendResponse & JWT utilities
 └── lib/                # Prisma client & database adapter instance
```

---

## Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Tasmih/rentnest-server.git
   cd rentnest-server
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

---

## Environment Setup

Create a `.env` file in the root directory:

```env
PORT=5000
DATABASE_URL="postgresql://username:password@localhost:5432/rentnest_db?schema=public"
JWT_SECRET="your_jwt_secret_key"
```

> **Note**: A `.env` file is required for the application to connect to the database and sign JWT tokens properly.

---

## Database Setup

1. **Generate Prisma Client**:
   ```bash
   npx prisma generate
   ```

2. **Run Migrations**:
   ```bash
   npx prisma migrate dev
   ```

3. **Seed Database (Optional)**:
   ```bash
   npx prisma db seed
   ```

---

## Development

To start the server in development mode with auto-reloading:

```bash
npm run dev
```

The server will start at `http://localhost:5000` by default.

---

## Production Build

1. **Compile TypeScript & Generate Client**:
   ```bash
   npm run build
   ```

2. **Start Production Server**:
   ```bash
   npm start
   ```

---

## API Base URL

All API routes are prefixed with `/api`:

```text
http://localhost:5000/api
```

---

## Deployment

### Deploying to Render

To deploy the backend on **Render**:

- **Build Command**:
  ```bash
  npm install && npm run build
  ```
- **Start Command**:
  ```bash
  npm start
  ```

Ensure you configure the `DATABASE_URL`, `JWT_SECRET`, and `NODE_ENV=production` environment variables in your Render service dashboard.

---

## API Modules

The API includes the following core endpoints under `/api`:

| Module Endpoint | Description |
| :--- | :--- |
| `/api/auth` | User registration and authentication |
| `/api/users` | User management |
| `/api/categories` | Property category management |
| `/api/properties` | Property listings, filtering, search, and pagination |
| `/api/rental-requests` | Tenant rental requests and landlord approval workflow |
| `/api/favorites` | Tenant favorite property list |
| `/api/reviews` | Property reviews and ratings |
| `/api/dashboard` | Role-based dashboard analytics for Admin, Landlord, and Tenant |

---

## Security

- **Authentication**: Secure stateless JWT token authentication via HTTP headers (`Bearer <token>`).
- **Password Security**: Password hashing using `bcrypt` before storage.
- **Authorization**: Granular role-based authorization checking (`ADMIN`, `LANDLORD`, `TENANT`).
- **Data Integrity**: Soft-delete pattern (`isDeleted = true`) implemented across models to preserve transaction history.

---

## Future Improvements

- Payment gateway integration (Stripe / SSLCommerz) for online rent payments
- Real-time notifications for rental request status changes
- In-app messaging and chat system between tenants and landlords
- Cloud image storage integration (Cloudinary / AWS S3) for property image uploads
