# AUTHCORE

Secure Login Authentication System

**OASIS INFOBYTE SIP — Web Development & Designing — Level 2 Task 4**

---

## Objective

Build a full-stack, secure authentication system with registration, login, session management, and a protected dashboard using Node.js, Express, SQLite, and bcrypt.

---

## Tech Stack

| Layer    | Technology                        |
| -------- | --------------------------------- |
| Frontend | HTML5, CSS3, Vanilla JavaScript   |
| Backend  | Node.js, Express.js               |
| Database | SQLite (better-sqlite3)           |
| Auth     | bcrypt, express-session           |

---

## Authentication Architecture

```
Client → Express Server → Session Middleware → Route Handler → SQLite DB
                                ↓
                          Session Cookie (httpOnly)
```

- Passwords are hashed with **bcrypt** (10 salt rounds) before storage.
- Sessions are managed via `express-session` with an httpOnly cookie.
- The `/api/auth/me` endpoint is protected by an auth middleware that checks for a valid session.

---

## Database Schema

```sql
CREATE TABLE users (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  username      TEXT NOT NULL UNIQUE,
  email         TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at    DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

---

## Security Measures

- Passwords hashed with bcrypt — never stored in plaintext
- Parameterized SQL queries (no string concatenation)
- Server-side validation on all endpoints
- Client-side validation with real-time feedback
- Generic error messages on login failure (no credential enumeration)
- httpOnly session cookies
- No password hashes ever returned to the client
- Environment variables for secrets

---

## API Endpoints

| Method | Endpoint              | Description             | Auth Required |
| ------ | --------------------- | ----------------------- | ------------- |
| POST   | `/api/auth/register`  | Register a new account  | No            |
| POST   | `/api/auth/login`     | Sign in                 | No            |
| POST   | `/api/auth/logout`    | Destroy session         | No            |
| GET    | `/api/auth/me`        | Get current user info   | Yes           |

### Request/Response Examples

**Register**
```json
POST /api/auth/register
{
  "username": "john",
  "email": "john@example.com",
  "password": "Akash1234"
}

Response: 201
{
  "message": "Account created successfully",
  "user": { "id": 1, "username": "john", "email": "john@example.com" }
}
```

**Login**
```json
POST /api/auth/login
{
  "email": "john@example.com",
  "password": "Akash1234"
}

Response: 200
{
  "message": "Login successful",
  "user": { "id": 1, "username": "john", "email": "john@example.com" }
}
```

---

## Installation

1. Clone the repository
2. Install dependencies:
```bash
cd authcore
npm install
```

3. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

4. Update `SESSION_SECRET` in `.env` with a strong random string.

---

## Environment Variables

| Variable        | Description                          | Default                |
| --------------- | ------------------------------------ | ---------------------- |
| `PORT`          | Server port                          | `3000`                 |
| `SESSION_SECRET`| Secret for session signing           | (required)             |

---

## Running

```bash
npm start
```

The server starts at `http://localhost:3000`.

---

## Testing

1. Open `http://localhost:3000` in your browser
2. Click **Create one** to register
3. Fill in username, email, and password (min 8 chars, must include a number)
4. After registration you are redirected to the dashboard
5. Click **Logout** to sign out
6. Sign in with your credentials
7. Try accessing `/dashboard` while logged out — you should be redirected to login

---

## Validation Rules

**Password:**
- Minimum 8 characters
- Must contain at least one number
- Example valid: `Akash1234`
- Example invalid: `password`

**Registration:**
- All fields required
- Username must be at least 2 characters
- Email must be valid format
- Duplicate username/email rejected with clear error

---

## Author

OASIS INFOBYTE SIP Participant
