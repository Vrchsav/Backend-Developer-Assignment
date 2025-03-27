# User Management API

## Features

- User registration with profile picture upload
- Secure authentication using JWT
- Profile management (view, update)
- Password management
- Image upload with Cloudinary integration
- Input validation and error handling


## Installation

1. **Clone the repository**
```bash
git clone https://github.com/Vrchsav/Backend-Developer-Assignment.git
cd Backend-Developer-Assignment
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment Setup**

Create a `.env` file in the root directory with the following variables:
```env
PORT=8000
MONGODB_URI=mongodb://localhost:27017/your_database
JWT_SECRET=your_jwt_secret_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

4. **Start the server**
```bash
npm start
```

## API Endpoints

### User Registration
![Registration](/Images/register.png)

- **URL**: `POST /api/users/`
- **Content-Type**: `multipart/form-data`
- **Body**:
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "StrongPass123!",
    "address": "123 Street",
    "bio": "About me",
    "image": [file upload]
  }
  ```
- **Response**:
  ```json
  {
    "user": {
      "name": "John Doe",
      "email": "john@example.com",
      "address": "123 Street",
      "bio": "About me",
      "profilePicture": "cloudinary_url"
    },
    "token": "jwt_token"
  }
  ```

### User Login
![Login](/Images/login.png)

- **URL**: `POST /api/users/login`
- **Content-Type**: `application/json`
- **Body**:
  ```json
  {
    "email": "john@example.com",
    "password": "StrongPass123!"
  }
  ```
- **Response**:
  ```json
  {
    "user": {
      "name": "John Doe",
      "email": "john@example.com",
      "address": "123 Street",
      "bio": "About me",
      "profilePicture": "cloudinary_url"
    },
    "token": "jwt_token"
  }
  ```

### Get Profile
![Profile](/Images/Profile.png)

- **URL**: `GET /api/users/profile`
- **Headers**: 
  ```
  Authorization: Bearer <jwt_token>
  ```
- **Response**:
  ```json
  {
    "user": {
      "name": "John Doe",
      "email": "john@example.com",
      "address": "123 Street",
      "bio": "About me",
      "profilePicture": "cloudinary_url"
    }
  }
  ```

### Update Profile
![Update](/Images/update.png)

- **URL**: `PUT /api/users/profile`
- **Headers**: 
  ```
  Authorization: Bearer <jwt_token>
  ```
- **Content-Type**: `multipart/form-data`
- **Body**:
  ```json
  {
    "name": "Updated Name",
    "address": "New Address",
    "bio": "Updated bio",
    "image": [file upload]
  }
  ```
- **Response**:
  ```json
  {
    "message": "Profile updated successfully",
    "user": {
      "name": "Updated Name",
      "email": "john@example.com",
      "address": "New Address",
      "bio": "Updated bio",
      "profilePicture": "new_cloudinary_url"
    }
  }
  ```

### Update Password
- **URL**: `PUT /api/users/password`
- **Headers**: 
  ```
  Authorization: Bearer <jwt_token>
  ```
- **Content-Type**: `application/json`
- **Body**:
  ```json
  {
    "currentPassword": "OldPass123!",
    "newPassword": "NewPass123!"
  }
  ```
- **Response**:
  ```json
  {
    "message": "Password updated successfully"
  }
  ```


4. **Test Flow**
   1. Register a new user (save the token)
   2. Login (save the token)
   3. Get profile (using token)
   4. Update profile (using token)
   5. Update password (using token)

## Error Handling

The API returns appropriate HTTP status codes and error messages:
- `400`: Bad Request (validation errors)
- `401`: Unauthorized (invalid/missing token)
- `404`: Not Found
- `500`: Internal Server Error

## Security Features

- Password hashing using bcrypt
- JWT-based authentication
- Input validation
- Strong password requirements
- Protected routes
- Secure file upload

