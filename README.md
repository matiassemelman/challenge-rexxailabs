# Rexxailabs Challenge API

Backend API for managing clients and projects with secure authentication.

## Tech Stack

- **Language**: TypeScript
- **Framework**: Node.js with Express.js
- **Database**: PostgreSQL (Supabase)
- **ORM**: Prisma
- **Authentication**: JWT
- **Validation**: Zod
- **Security**: Rate limiting, CORS protection

## Setup Instructions

### 1. Clone the repository

```bash
git clone <repository-url>
cd challenge-rexxailabs
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file based on the provided `.env.example`:

```bash
cp .env.example .env
```

Edit the `.env` file and set the following variables:

- `DATABASE_URL`: Your Supabase PostgreSQL connection string
- `JWT_SECRET`: A strong secret key for JWT token generation (use a randomly generated string)
- `FRONTEND_URL`: URL of your frontend application (for CORS configuration)

### 4. Database setup

Run Prisma migrations to set up your database schema:

```bash
npx prisma db push
```

### 5. Start the development server

```bash
npm run dev
```

The API will be available at: http://localhost:3000

## Security Features

### CORS Protection

The API implements a secure CORS policy that:
- Only allows requests from whitelisted origins (localhost development servers by default)
- Can be configured via the FRONTEND_URL environment variable
- Allows credentials to be included in cross-origin requests

### Rate Limiting

The API implements rate limiting to prevent abuse:
- Global limit: 100 requests per 15-minute window per IP address
- Stricter limits on authentication endpoints: 20 requests per 30-minute window

## Deploying to Render

### 1. Create a Render account

Sign up for a free account at [Render](https://render.com) if you don't already have one.

### 2. Create a new Web Service

1. From your Render dashboard, click "New" and select "Web Service"
2. Connect your GitHub repository
3. Configure the service with the following details:
   - **Name**: rexxailabs-api (or whatever you prefer)
   - **Environment**: Node
   - **Build Command**: `./build.sh`
   - **Start Command**: `npm start`

### 3. Configure environment variables

In the "Environment" tab of your Render service, add the following variables:
- `DATABASE_URL`: Your Supabase PostgreSQL connection string
- `JWT_SECRET`: Your JWT secret key
- `FRONTEND_URL`: The URL of your frontend application
- `NODE_ENV`: Set to `production`

### 4. Deploy

Click "Create Web Service" to deploy your application. Render will automatically build and deploy your API.

### 5. Verify the deployment

Once deployment is complete, click on the generated URL to verify that your API is running. You should see the message: "Rexxailabs Challenge API is running!"

## API Endpoints

### Authentication

- **Register**: `POST /api/v1/auth/register`
  ```json
  {
    "email": "user@example.com",
    "password": "securepassword"
  }
  ```

- **Login**: `POST /api/v1/auth/login`
  ```json
  {
    "email": "user@example.com",
    "password": "securepassword"
  }
  ```

### Clients

All client endpoints require authentication. Include the token in the Authorization header:
`Authorization: Bearer YOUR_TOKEN_HERE`

- **Create client**: `POST /api/v1/clients`
  ```json
  {
    "name": "Client Name",
    "email": "client@example.com",
    "phone": "+1234567890"
  }
  ```

- **Get all clients**: `GET /api/v1/clients`
- **Get client by ID**: `GET /api/v1/clients/:id`
- **Update client**: `PUT /api/v1/clients/:id`
- **Delete client**: `DELETE /api/v1/clients/:id`

### Projects

All project endpoints require authentication. Include the token in the Authorization header:
`Authorization: Bearer YOUR_TOKEN_HERE`

- **Create project**: `POST /api/v1/projects`
  ```json
  {
    "name": "Project Name",
    "description": "Project description",
    "clientId": "client-uuid",
    "status": "PENDING", // PENDING, IN_PROGRESS, COMPLETED, CANCELLED
    "startDate": "2023-04-15T12:00:00Z", // Optional
    "deliveryDate": "2023-05-15T12:00:00Z" // Optional
  }
  ```

- **Get all projects**: `GET /api/v1/projects`
  - Filter by status: `GET /api/v1/projects?status=IN_PROGRESS`
  - Filter by client: `GET /api/v1/projects?clientId=client-uuid`

- **Get project by ID**: `GET /api/v1/projects/:id`
- **Update project**: `PUT /api/v1/projects/:id`
- **Delete project**: `DELETE /api/v1/projects/:id`