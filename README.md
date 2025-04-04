# Rexxailabs Challenge API

Backend API for managing clients and projects with secure authentication.

## Tech Stack

- **Language**: TypeScript
- **Framework**: Node.js with Express.js
- **Database**: PostgreSQL (Supabase)
- **ORM**: Prisma
- **Authentication**: JWT
- **Validation**: Zod

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
    "status": "PENDING", // PENDING, IN_PROGRESS, COMPLETED
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