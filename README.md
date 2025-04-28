# Driver Behavior Monitoring System - Setup Guide!

This document provides step-by-step instructions for setting up and running the Driver Behavior Monitoring System project on Kali Linux or any Debian-based system. This guide covers database setup, backend configuration and frontend setup.

## Prerequisites

- Kali Linux or any Debian-based system
- Node.js (v14+ recommended)
- npm (v6+ recommended)
- PostgreSQL (v12+ recommended)

## 1. Database Setup

### 1.1. Install PostgreSQL (if not already installed)

```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
```

### 1.2. Start PostgreSQL Service

```bash
sudo service postgresql start
```

### 1.3. Access PostgreSQL and Create Database

```bash
sudo -u postgres psql
```

### 1.4. Create Database and User

```sql
CREATE DATABASE driver_monitoring;
CREATE USER dbms_user WITH ENCRYPTED PASSWORD '1234';
GRANT ALL PRIVILEGES ON DATABASE driver_monitoring TO dbms_user;
\c driver_monitoring
```

### 1.5. Create Required Tables

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE driver_data (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    speed FLOAT,
    location TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Exit PostgreSQL
\q
```

## 2. Backend Setup

### 2.1. Clone the Repository (if applicable)

If you're cloning from a repository:

```bash
git clone [repository-url]
cd [project-directory]
```

### 2.2. Navigate to Project Directory

```bash
cd ~/Desktop/BSSE/FYP/DBMS
```

### 2.3. Install Server Dependencies

```bash
cd server
npm install
npm install express pg dotenv bcryptjs jsonwebtoken cors
```

### 2.4. Configure Environment Variables

Create a `.env` file in the server directory:

```bash
touch .env
```

Add the following configuration to the `.env` file:

```
DB_HOST=localhost
DB_USER=dbms_user
DB_NAME=driver_monitoring
DB_PASSWORD=1234
PORT=5000
JWT_SECRET=driver_monitoring_secure_secret_key
```

### 2.5. Verify Server File Structure

Ensure your server directory has the following structure:

```
server/
├── config/
│   └── dbConfig.js
├── middleware/
│   └── auth.js
├── routes/
│   └── auth.js
├── .env
├── package.json
└── server.js
```

### 2.6. Start the Backend Server

```bash
npm start
```

If `npm start` is not configured in package.json, use:

```bash
node server.js
```

## 3. Frontend Setup

### 3.1. Navigate to Client Directory

```bash
cd ~/Desktop/BSSE/FYP/DBMS/client
```

### 3.2. Install Client Dependencies

```bash
npm install
npm install axios react-router-dom
```

### 3.3. Configure API URL

Ensure that your React application is configured to connect to the correct backend API URL.

Create or update `src/config.js`:

```javascript
export const API_URL = "http://localhost:5000/api";
```

### 3.4. Start the Frontend Application

```bash
npm start
```

## 4. Testing the Application

### 4.1. Test Backend API

Using curl or a tool like Postman, test your API endpoints:

```bash
# Test the base route
curl http://localhost:5000/

# Test signup
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'

# Test login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Test protected route (requires token from login)
curl http://localhost:5000/api/dashboard \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 4.2. Access the Web Interface

Open your browser and navigate to:

```
http://localhost:3000
```

## 5. Troubleshooting

### 5.1. Database Connection Issues

- Check if PostgreSQL is running:

  ```bash
  sudo service postgresql status
  ```

- Verify credentials in your .env file

- Test direct connection:
  ```bash
  psql -U dbms_user -d driver_monitoring -h localhost -W
  ```

### 5.2. Port Conflicts

- If port 5000 is in use, change it in your .env file
- Check which process is using a port:
  ```bash
  sudo netstat -tlnp | grep 5000
  ```

### 5.3. CORS Issues

If you encounter CORS errors:

1. Ensure the frontend is sending requests to the correct URL
2. Check that the backend CORS configuration is properly set up
3. Verify that your authentication headers are properly formatted

### 5.4. Node.js or npm Issues

- Update Node.js and npm:

  ```bash
  sudo apt update
  sudo apt install nodejs npm
  ```

- Check versions:
  ```bash
  node -v
  npm -v
  ```

## 6. API Documentation

### 6.1. Authentication Endpoints

#### Register a New User

- **URL**: `/api/auth/signup`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "name": "User Name",
    "email": "user@example.com",
    "password": "securepassword"
  }
  ```
- **Response**: User object with JWT token

#### Login User

- **URL**: `/api/auth/login`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "securepassword"
  }
  ```
- **Response**: User object with JWT token

### 6.2. Protected Endpoints

#### Dashboard

- **URL**: `/api/dashboard`
- **Method**: `GET`
- **Headers**:
  ```
  Authorization: Bearer YOUR_JWT_TOKEN
  ```
- **Response**: Dashboard data

## 7. Security Considerations

- The JWT secret key should be complex and kept secure
- PostgreSQL passwords should be strong
- Consider implementing rate limiting for API endpoints
- Set up HTTPS for production deployment
- Implement proper input validation on both frontend and backend

## 8. Next Steps

- Implement driver data collection endpoints
- Create analytics dashboard
- Set up monitoring for the application
- Implement automated testing
- Configure CI/CD pipeline

---

For any additional questions or issues, please contact the development team.
