# News Aggregator API (Develop Branch)

This README documents the current API behavior in the develop branch implementation located in `api/`. It covers authentication, request/response formats, and available endpoints based on the Express routes and controllers. It also includes best practices for maintaining API documentation.

## Base URL

By default, the API starts on `http://localhost:3800` (uses `process.env.Port || 3800`). The server enables CORS for the configured frontend URL and serves static uploads at `/uploads`.

## Authentication & Sessions

The API uses **HTTP-only cookies** for authentication:

- `access_token` (15 minutes)
- `refreshtoken` (24 hours)

Most authenticated routes require the `access_token` cookie. Refresh tokens are exchanged through `POST /auth/refresh_token` to renew sessions. Google OAuth also returns tokens via cookies and redirects to the frontend callback.

**Roles**:
- `0` = user
- `1` = admin

**Client note**: For browser clients, send credentials by setting `credentials: "include"` in `fetch`/Axios.

## Error Format

Errors are returned as JSON with a `message` field and the appropriate HTTP status code.

```json
{ "message": "Human-readable error" }
```

## Endpoints

### Public Articles

| Method | Path | Description | Auth |
| --- | --- | --- | --- |
| GET | `/news` | List articles (optionally filtered by `category`) | Optional |
| GET | `/news/:id` | Get a single article by ID (increments views) | Optional |

**Query parameters**
- `category` (string): filter by article category.

### Authentication

| Method | Path | Description | Auth |
| --- | --- | --- | --- |
| POST | `/auth/register` | Register a user | No |
| POST | `/auth/login` | Login user and set cookies | No |
| POST | `/auth/refresh_token` | Rotate refresh + access tokens | No (cookie required) |
| GET | `/auth/login/google` | Start Google OAuth | No |
| GET | `/auth/google/callback` | OAuth callback, sets cookies, redirects | No |

**POST /auth/register**

Request body:
```json
{
  "email": "user@example.com",
  "password": "StrongPassword@1",
  "username": "reader"
}
```

Response (201):
```json
{ "message": "User created successfully" }
```

**POST /auth/login**

Request body:
```json
{
  "email": "user@example.com",
  "password": "StrongPassword@1"
}
```

Response (200):
```json
{
  "user_data": {
    "id": "...",
    "email": "user@example.com",
    "username": "reader",
    "role": 0
  }
}
```

### Password Reset

| Method | Path | Description | Auth |
| --- | --- | --- | --- |
| GET | `/reset/check_token?token=...` | Validate a reset token | No |
| POST | `/reset/request_password` | Send reset email | No |
| POST | `/reset/reset_password?token=...` | Reset password with token | No |

**POST /reset/request_password**

Request body:
```json
{ "email": "user@example.com" }
```

Response (201):
```json
{ "message": "Email sent for resetting password" }
```

### User (Authenticated)

| Method | Path | Description | Roles |
| --- | --- | --- | --- |
| GET | `/user/me` | Get current user profile | 0, 1 |
| POST | `/user/update_user` | Update user metadata and/or avatar | 0, 1 |
| POST | `/user/logout` | Logout and clear cookies | 0, 1 |

**POST /user/update_user** (multipart/form-data)

Fields:
- `username` (string, optional)
- `email` (string, optional)
- `image` (file, optional)

Response (200):
```json
{ "message": "updated succesfully" }
```

### Admin (Authenticated)

| Method | Path | Description | Roles |
| --- | --- | --- | --- |
| GET | `/user/users` | List all users | 1 |
| GET | `/user/user/:id` | Get a user by ID | 1 |
| POST | `/create_post` | Create a new article | 1 |
| DELETE | `/delete_post/:id` | Delete an article | 1 |

**POST /create_post** (multipart/form-data)

Fields:
- `title` (string, required)
- `summary` (string, required)
- `content` (string, required)
- `url` (string, optional)
- `source` (string, optional)
- `tags` (string or array, optional)
- `publishedAt` (ISO datetime, optional)
- `scrapedAt` (ISO datetime, optional)
- `views` (number, optional)
- `articleImage` (file, optional)

Response (201):
```json
{
  "message": "Article created successfully",
  "article": {
    "_id": "...",
    "title": "...",
    "summary": "..."
  }
}
```

### Saved Articles & Preferences (Authenticated)

| Method | Path | Description | Roles |
| --- | --- | --- | --- |
| GET | `/bookmarks` | Get saved articles | 0 |
| POST | `/bookmarks` | Save/unsave an article | 0 |
| POST | `/preference` | Save user preferences | 0 |
| GET | `/personalized` | Get personalized articles | 0 |

**POST /bookmarks**

Request body:
```json
{ "articleId": "..." }
```

Response (201):
```json
{
  "message": "Article saved successfully",
  "article_is_saved": true
}
```

**POST /preference**

Request body:
```json
{ "preference": ["technology", "science"] }
```

Response (200):
```json
{ "message": "Preferences saved successfully" }
```



## Quick Reference (Routes)

- Public articles: `GET /news`, `GET /news/:id`
- Auth: `POST /auth/register`, `POST /auth/login`, `POST /auth/refresh_token`
- Password reset: `GET /reset/check_token`, `POST /reset/request_password`, `POST /reset/reset_password`
- User: `GET /user/me`, `POST /user/update_user`, `POST /user/logout`
- Admin: `GET /user/users`, `GET /user/user/:id`, `POST /create_post`, `DELETE /delete_post/:id`
- Preferences: `GET /bookmarks`, `POST /bookmarks`, `POST /preference`, `GET /personalized`