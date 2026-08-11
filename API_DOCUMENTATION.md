# RentNest API Documentation

## Base URL

- **Development**: `http://localhost:5000/api`
- **Production**: `https://rentnest-server.onrender.com/api`

---

# Standard API Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {}
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description message",
  "data": null
}
```

### HTTP Status Codes Used
| Status Code | Description |
| :--- | :--- |
| **200 OK** | Request succeeded |
| **201 Created** | Resource created successfully |
| **400 Bad Request** | Missing required parameters or invalid input |
| **401 Unauthorized** | Missing, invalid, or expired JWT Bearer token |
| **403 Forbidden** | Insufficient role permissions or account blocked |
| **404 Not Found** | Target resource does not exist |
| **409 Conflict** | Resource already exists (e.g. email or duplicate review) |
| **500 Internal Server Error** | Unexpected server-side failure |

---

# Authentication Flow

1. **Registration**: User submits name, email, password, and role (`TENANT` or `LANDLORD`). Password is hashed using `bcrypt` (12 salt rounds).
2. **Login**: User submits credentials. Server validates status (`ACTIVE`) and password, generating a signed JWT token containing `{ id, email, role }`.
3. **Google OAuth**: Users can log in with Google ID token. If the user doesn't exist, a `requiresRoleSelection` response is returned to let the user select `TENANT` or `LANDLORD` before `POST /api/auth/google/complete`.
4. **Client Storage & Usage**: Client stores the JWT in LocalStorage (`rentnest_auth_token`).
5. **Bearer Authorization**: For all protected routes, the client sends the header:
   ```http
   Authorization: Bearer <jwt_token>
   ```

---

# 1. Auth Module

### 1.1 Register User
- **Method**: `POST`
- **Route**: `/auth/register`
- **Purpose**: Create a new Tenant or Landlord user account
- **Authentication**: Public
- **Role Requirement**: None (Public)
- **Request Body**:
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "SecretPassword123",
    "phone": "+8801700000000",
    "role": "TENANT"
  }
  ```
- **Success Response (201 Created)**:
  ```json
  {
    "success": true,
    "message": "User registered successfully",
    "data": {
      "id": "u-123-456",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+8801700000000",
      "role": "TENANT",
      "status": "ACTIVE",
      "createdAt": "2026-08-11T20:00:00.000Z"
    }
  }
  ```
- **Error Response (409 Conflict / 403 Forbidden)**:
  ```json
  {
    "success": false,
    "message": "User already exists with this email",
    "data": null
  }
  ```

---

### 1.2 Login User
- **Method**: `POST`
- **Route**: `/auth/login`
- **Purpose**: Authenticate user and obtain JWT token
- **Authentication**: Public (Rate-limited: 20 req / 15 min)
- **Role Requirement**: None
- **Request Body**:
  ```json
  {
    "email": "john@example.com",
    "password": "SecretPassword123"
  }
  ```
- **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "User logged in successfully",
    "data": {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "user": {
        "id": "u-123-456",
        "name": "John Doe",
        "email": "john@example.com",
        "phone": "+8801700000000",
        "role": "TENANT",
        "status": "ACTIVE",
        "avatarUrl": null
      }
    }
  }
  ```
- **Error Response (401 Unauthorized)**:
  ```json
  {
    "success": false,
    "message": "Invalid email or password",
    "data": null
  }
  ```

---

### 1.3 Google OAuth Login
- **Method**: `POST`
- **Route**: `/auth/google`
- **Purpose**: Authenticate via Google OAuth credential / ID token
- **Authentication**: Public
- **Request Body**:
  ```json
  {
    "credential": "eyJhbGciOiJSUzI1NiIs..."
  }
  ```
- **Success Response (200 OK - Existing User)**:
  ```json
  {
    "success": true,
    "message": "Google login successful",
    "data": {
      "requiresRoleSelection": false,
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "user": {
        "id": "u-789-abc",
        "name": "Jane Doe",
        "email": "jane@gmail.com",
        "role": "TENANT",
        "avatarUrl": "https://lh3.googleusercontent.com/a/..."
      }
    }
  }
  ```
- **Success Response (200 OK - New User Requires Role)**:
  ```json
  {
    "success": true,
    "message": "Google login successful",
    "data": {
      "requiresRoleSelection": true,
      "googleData": {
        "name": "Jane Doe",
        "email": "jane@gmail.com",
        "googleId": "109876543210987654321",
        "avatarUrl": "https://lh3.googleusercontent.com/a/..."
      }
    }
  }
  ```

---

### 1.4 Complete Google Registration
- **Method**: `POST`
- **Route**: `/auth/google/complete`
- **Purpose**: Finalize Google registration by assigning selected user role (`TENANT` or `LANDLORD`)
- **Authentication**: Public
- **Request Body**:
  ```json
  {
    "name": "Jane Doe",
    "email": "jane@gmail.com",
    "googleId": "109876543210987654321",
    "avatarUrl": "https://lh3.googleusercontent.com/a/...",
    "role": "TENANT"
  }
  ```
- **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Google signup completed successfully",
    "data": {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "user": {
        "id": "u-789-abc",
        "name": "Jane Doe",
        "email": "jane@gmail.com",
        "role": "TENANT",
        "status": "ACTIVE",
        "avatarUrl": "https://lh3.googleusercontent.com/a/..."
      }
    }
  }
  ```

---

# 2. User Module

### 2.1 Get All Users (Admin)
- **Method**: `GET`
- **Route**: `/users`
- **Purpose**: Retrieve list of all non-deleted users
- **Authentication**: JWT Required
- **Role Requirement**: `ADMIN`
- **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Users retrieved successfully",
    "data": [
      {
        "id": "u-123-456",
        "name": "John Doe",
        "email": "john@example.com",
        "phone": "+8801700000000",
        "role": "TENANT",
        "status": "ACTIVE",
        "createdAt": "2026-08-11T20:00:00.000Z"
      }
    ]
  }
  ```

---

### 2.2 Get User By ID
- **Method**: `GET`
- **Route**: `/users/:id`
- **Purpose**: Fetch details of a specific user
- **Authentication**: JWT Required
- **Role Requirement**: `ADMIN`
- **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "User retrieved successfully",
    "data": {
      "id": "u-123-456",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "TENANT",
      "status": "ACTIVE"
    }
  }
  ```

---

### 2.3 Update User
- **Method**: `PATCH`
- **Route**: `/users/:id`
- **Purpose**: Update user profile or account status (`ACTIVE` / `BLOCKED` / `INACTIVE`)
- **Authentication**: JWT Required
- **Role Requirement**: `ADMIN`
- **Request Body**:
  ```json
  {
    "name": "Updated Name",
    "phone": "+8801800000000",
    "status": "BLOCKED"
  }
  ```
- **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "User updated successfully",
    "data": {
      "id": "u-123-456",
      "name": "Updated Name",
      "status": "BLOCKED"
    }
  }
  ```

---

### 2.4 Delete User
- **Method**: `DELETE`
- **Route**: `/users/:id`
- **Purpose**: Soft delete a user account (`isDeleted: true`, `status: INACTIVE`)
- **Authentication**: JWT Required
- **Role Requirement**: `ADMIN`
- **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "User deleted successfully",
    "data": {
      "id": "u-123-456",
      "isDeleted": true,
      "status": "INACTIVE"
    }
  }
  ```

---

# 3. Category Module

### 3.1 Create Category
- **Method**: `POST`
- **Route**: `/categories`
- **Purpose**: Add a new property category
- **Authentication**: JWT Required
- **Role Requirement**: `ADMIN`
- **Request Body**:
  ```json
  {
    "name": "Luxury Apartment",
    "description": "High-end apartments with modern amenities"
  }
  ```
- **Success Response (201 Created)**:
  ```json
  {
    "success": true,
    "message": "Category created successfully",
    "data": {
      "id": "cat-123",
      "name": "Luxury Apartment",
      "description": "High-end apartments with modern amenities",
      "status": "ACTIVE"
    }
  }
  ```

---

### 3.2 Get All Categories
- **Method**: `GET`
- **Route**: `/categories`
- **Purpose**: List all active categories
- **Authentication**: Public
- **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Categories retrieved successfully",
    "data": [
      {
        "id": "cat-123",
        "name": "Luxury Apartment",
        "description": "High-end apartments with modern amenities"
      }
    ]
  }
  ```

---

### 3.3 Get Category By ID
- **Method**: `GET`
- **Route**: `/categories/:id`
- **Purpose**: Fetch details of a single category
- **Authentication**: Public

---

### 3.4 Update Category
- **Method**: `PATCH`
- **Route**: `/categories/:id`
- **Purpose**: Modify category title or description
- **Authentication**: JWT Required
- **Role Requirement**: `ADMIN`

---

### 3.5 Delete Category
- **Method**: `DELETE`
- **Route**: `/categories/:id`
- **Purpose**: Soft delete category (`isDeleted: true`)
- **Authentication**: JWT Required
- **Role Requirement**: `ADMIN`

---

# 4. Property Module

### 4.1 Create Property Listing
- **Method**: `POST`
- **Route**: `/properties`
- **Purpose**: Create a new rental property listing
- **Authentication**: JWT Required
- **Role Requirement**: `LANDLORD`, `ADMIN`
- **Request Body**:
  ```json
  {
    "title": "Modern 3BR Flat in Mirpur",
    "description": "Spacious 3 bedroom flat with balcony and lift facility",
    "rent": 25000,
    "serviceCharge": 3000,
    "utilityCharge": 2000,
    "area": "Mirpur 10",
    "address": "House 12, Road 4, Block C",
    "propertyType": "FLAT",
    "categoryId": "cat-123",
    "bedrooms": 3,
    "bathrooms": 2,
    "coverImage": "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2",
    "furnished": true,
    "parking": true,
    "lift": true,
    "bachelorAllowed": false,
    "familyAllowed": true
  }
  ```
- **Success Response (201 Created)**

---

### 4.2 Get All Properties (Search & Filter)
- **Method**: `GET`
- **Route**: `/properties`
- **Purpose**: List properties with search, filtering, and offset pagination
- **Authentication**: Public
- **Query Parameters Supported**:
  - `area` / `city` / `searchTerm` / `query`: Case-insensitive location/title search
  - `propertyType`: Filter by `FLAT`, `ROOM`, `SEAT`, `SUBLET`, `HOSTEL`
  - `categoryId`: Filter by category ID
  - `minRent` / `minPrice`: Minimum monthly rent
  - `maxRent` / `maxPrice`: Maximum monthly rent
  - `page`: Page number (default: 1)
  - `limit`: Items per page (default: 10)
- **Example Request**: `/api/properties?area=Mirpur&propertyType=FLAT&minRent=10000&maxRent=30000&page=1&limit=10`
- **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Properties retrieved successfully",
    "data": {
      "meta": {
        "page": 1,
        "limit": 10,
        "total": 45,
        "totalPages": 5
      },
      "data": [
        {
          "id": "prop-001",
          "title": "Modern 3BR Flat in Mirpur",
          "rent": 25000,
          "area": "Mirpur 10",
          "propertyType": "FLAT",
          "coverImage": "https://...",
          "bedrooms": 3,
          "bathrooms": 2,
          "status": "AVAILABLE"
        }
      ]
    }
  }
  ```

---

### 4.3 Get Property By ID
- **Method**: `GET`
- **Route**: `/properties/:id`
- **Purpose**: Get complete details of a single property including landlord and category
- **Authentication**: Public

---

### 4.4 Update Property
- **Method**: `PATCH`
- **Route**: `/properties/:id`
- **Purpose**: Update property listing details
- **Authentication**: JWT Required
- **Role Requirement**: `LANDLORD` (Owner only), `ADMIN`

---

### 4.5 Delete Property
- **Method**: `DELETE`
- **Route**: `/properties/:id`
- **Purpose**: Soft delete property (`isDeleted: true`, `status: INACTIVE`)
- **Authentication**: JWT Required
- **Role Requirement**: `LANDLORD` (Owner only), `ADMIN`

---

# 5. Rental Request Module

### 5.1 Create Rental Request
- **Method**: `POST`
- **Route**: `/rental-requests`
- **Purpose**: Submit a rental application for a property
- **Authentication**: JWT Required
- **Role Requirement**: Logged in user (`TENANT`)
- **Request Body**:
  ```json
  {
    "propertyId": "prop-001",
    "moveInDate": "2026-09-01",
    "message": "Hi, I am interested in renting this flat starting next month."
  }
  ```
- **Success Response (201 Created)**

---

### 5.2 Get Tenant's Own Requests
- **Method**: `GET`
- **Route**: `/rental-requests/my`
- **Purpose**: Retrieve rental requests submitted by the logged-in tenant
- **Authentication**: JWT Required

---

### 5.3 Get Landlord Rental Requests
- **Method**: `GET`
- **Route**: `/rental-requests/landlord`
- **Purpose**: Retrieve rental applications submitted for landlord's properties
- **Authentication**: JWT Required
- **Role Requirement**: `LANDLORD`, `ADMIN`

---

### 5.4 Accept Rental Request
- **Method**: `PATCH`
- **Route**: `/rental-requests/:id/accept`
- **Purpose**: Accept a pending rental request (automatically sets property status to `RENTED` and rejects other pending requests for this property)
- **Authentication**: JWT Required
- **Role Requirement**: `LANDLORD` (Owner), `ADMIN`

---

### 5.5 Reject Rental Request
- **Method**: `PATCH`
- **Route**: `/rental-requests/:id/reject`
- **Purpose**: Reject a pending rental request
- **Authentication**: JWT Required
- **Role Requirement**: `LANDLORD` (Owner), `ADMIN`

---

# 6. Favorite Module

### 6.1 Add Favorite
- **Method**: `POST`
- **Route**: `/favorites/:propertyId`
- **Purpose**: Add property to user's saved wishlist
- **Authentication**: JWT Required

---

### 6.2 Get User's Favorites
- **Method**: `GET`
- **Route**: `/favorites/my`
- **Purpose**: Retrieve all active saved properties for current user
- **Authentication**: JWT Required

---

### 6.3 Remove Favorite
- **Method**: `DELETE`
- **Route**: `/favorites/:propertyId`
- **Purpose**: Remove property from wishlist (`status: REMOVED`, `isDeleted: true`)
- **Authentication**: JWT Required

---

# 7. Review Module

### 7.1 Create Property Review
- **Method**: `POST`
- **Route**: `/reviews`
- **Purpose**: Submit a rating (1-5 stars) and comment for a property
- **Authentication**: JWT Required
- **Request Body**:
  ```json
  {
    "propertyId": "prop-001",
    "rating": 5,
    "comment": "Great landlord, very responsive and clean apartment!"
  }
  ```

---

### 7.2 Get Property Reviews
- **Method**: `GET`
- **Route**: `/reviews/property/:propertyId`
- **Purpose**: Fetch published, non-deleted reviews for a property
- **Authentication**: Public

---

### 7.3 Update Review
- **Method**: `PATCH`
- **Route**: `/reviews/:id`
- **Purpose**: Update rating or comment on own review
- **Authentication**: JWT Required (Review Author only)

---

### 7.4 Delete Review
- **Method**: `DELETE`
- **Route**: `/reviews/:id`
- **Purpose**: Soft delete review (`isDeleted: true`, `status: HIDDEN`)
- **Authentication**: JWT Required (Review Author only)

---

# 8. Notification Module

### 8.1 Get User Notifications
- **Method**: `GET`
- **Route**: `/notifications`
- **Purpose**: Fetch notifications for the authenticated user
- **Authentication**: JWT Required

---

### 8.2 Mark All Notifications As Read
- **Method**: `PATCH`
- **Route**: `/notifications/read-all`
- **Purpose**: Mark all unread notifications as read for current user
- **Authentication**: JWT Required

---

### 8.3 Mark Single Notification As Read
- **Method**: `PATCH`
- **Route**: `/notifications/:id/read`
- **Purpose**: Mark a single notification as read
- **Authentication**: JWT Required

---

### 8.4 Delete Notification
- **Method**: `DELETE`
- **Route**: `/notifications/:id`
- **Purpose**: Soft delete notification (`isDeleted: true`)
- **Authentication**: JWT Required

---

# 9. Dashboard Module

### 9.1 Admin Analytics Dashboard
- **Method**: `GET`
- **Route**: `/dashboard/admin`
- **Purpose**: System-wide statistics (users count by role, active properties, property type distribution, request status breakdown)
- **Authentication**: JWT Required
- **Role Requirement**: `ADMIN`

---

### 9.2 Landlord Dashboard
- **Method**: `GET`
- **Route**: `/dashboard/landlord`
- **Purpose**: Landlord-specific stats (total listings, active listings, pending requests)
- **Authentication**: JWT Required
- **Role Requirement**: `LANDLORD`, `ADMIN`

---

### 9.3 Tenant Dashboard
- **Method**: `GET`
- **Route**: `/dashboard/tenant`
- **Purpose**: Tenant stats (total requests submitted, accepted applications, saved favorites)
- **Authentication**: JWT Required
- **Role Requirement**: `TENANT`, `ADMIN`

---

# Database Models Overview (Prisma)

### 1. `User` (`users`)
- **Fields**: `id`, `name`, `email`, `password`, `phone`, `googleId`, `avatarUrl`, `provider`, `role`, `status`, `isDeleted`, `createdAt`, `updatedAt`
- **Enums**: `UserRole` (`TENANT`, `LANDLORD`, `ADMIN`), `UserStatus` (`ACTIVE`, `BLOCKED`, `INACTIVE`)
- **Relations**: Has many `Property`, `RentalRequest`, `Review`, `Favorite`, `Notification`

### 2. `Category` (`categories`)
- **Fields**: `id`, `name`, `description`, `status`, `isDeleted`, `createdAt`, `updatedAt`
- **Enums**: `CategoryStatus` (`ACTIVE`, `INACTIVE`)

### 3. `Property` (`properties`)
- **Fields**: `id`, `title`, `description`, `rent`, `serviceCharge`, `utilityCharge`, `area`, `address`, `propertyType`, `floor`, `totalFloors`, `availableFrom`, `bedrooms`, `bathrooms`, `coverImage`, `furnished`, `parking`, `lift`, `bachelorAllowed`, `familyAllowed`, `landlordId`, `categoryId`, `status`, `isDeleted`, `createdAt`, `updatedAt`
- **Enums**: `PropertyType` (`FLAT`, `ROOM`, `SEAT`, `SUBLET`, `HOSTEL`), `PropertyStatus` (`AVAILABLE`, `RESERVED`, `RENTED`, `INACTIVE`)

### 4. `RentalRequest` (`rental_requests`)
- **Fields**: `id`, `moveInDate`, `message`, `tenantId`, `propertyId`, `status`, `isDeleted`, `createdAt`, `updatedAt`
- **Enums**: `RequestStatus` (`PENDING`, `ACCEPTED`, `REJECTED`, `CANCELLED`)

### 5. `Review` (`reviews`)
- **Fields**: `id`, `rating`, `comment`, `userId`, `propertyId`, `status`, `isDeleted`, `createdAt`, `updatedAt`
- **Enums**: `ReviewStatus` (`PUBLISHED`, `HIDDEN`)

### 6. `Favorite` (`favorites`)
- **Fields**: `id`, `userId`, `propertyId`, `status`, `isDeleted`, `createdAt`, `updatedAt`
- **Enums**: `FavoriteStatus` (`ACTIVE`, `REMOVED`)
- **Constraints**: Unique `[userId, propertyId]`

### 7. `Notification` (`notifications`)
- **Fields**: `id`, `title`, `message`, `type`, `isRead`, `userId`, `isDeleted`, `createdAt`, `updatedAt`
