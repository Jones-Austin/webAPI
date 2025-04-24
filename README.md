# Car Brands API Backend

## 1. Project Overview

This project provides a backend REST API for managing a list of car brands. It is built using Node.js and Express.js, and it interacts with a PostgreSQL database to store and retrieve brand information.

### Technology Stack

- **Runtime:** Node.js  
- **Framework:** Express.js  
- **Database:** PostgreSQL  
- **Node PostgreSQL Client:** `pg`  
- **Middleware:** `cors` (for Cross-Origin Resource Sharing)

### Purpose & Goals

- To provide CRUD (Create, Read, Update) operations for car brands.  
- To offer a simple and clear API interface.  
- To demonstrate basic backend development principles with Node.js and PostgreSQL.

---

## 2. Installation & Setup

### Prerequisites

- Node.js (v14 or later recommended)  
- npm (usually comes with Node.js) or yarn  
- Access to a PostgreSQL database instance.

### Steps

1. **Clone the repository:**
    ```bash
    git clone <your-repository-url> # Replace <your-repository-url> with the actual URL
    cd <repository-directory-name>
    ```

2. **Install dependencies:**
    ```bash
    npm install
    # or if using yarn:
    # yarn install
    ```

3. **Configure Database Connection:**
    - The database connection string is currently hardcoded in `db.js`.
    - **Recommendation:** Modify `db.js` to read from environment variables (e.g., `process.env.DATABASE_URL`).
    - Ensure the PostgreSQL database server is running and accessible.
    - The current configuration points to a Render PostgreSQL instance and requires SSL.

4. **Start the API server:**
    ```bash
    npm start
    # or if you have a dev script:
    # npm run dev
    ```
    - Server runs on `http://localhost:8004` (as set in `server.js`).

---

## 3. API Documentation

### Base URL

```
/api/v1/cars
```

### Endpoints

---

#### `GET /api/v1/cars`

- **Description:** Retrieves a list of all car brands.  
- **Method:** `GET`  
- **Query Parameters:**
  - `id` (optional): Filter by a specific brand ID (integer).  
    *Note: Use `GET /api/v1/cars/:id` to get a single brand.*

- **Success Response (200 OK):**
    ```json
    [
        { "id": 1, "carbrand": "Toyota" },
        { "id": 2, "carbrand": "Ford" },
        { "id": 3, "carbrand": "Honda" }
    ]
    ```

- **Error Responses:**
  - `400 Bad Request`: Invalid `id` query parameter.
  - `500 Internal Server Error`: Query or server error.

---

#### `GET /api/v1/cars/:id`

- **Description:** Retrieves a car brand by ID.  
- **Method:** `GET`  
- **URL Parameters:**  
  - `id` (required): Brand ID (integer)

- **Success Response (200 OK):**
    ```json
    { "id": 1, "carbrand": "Toyota" }
    ```

- **Error Responses:**
  - `400 Bad Request`: Invalid ID.
  - `404 Not Found`: No matching brand.
  - `500 Internal Server Error`: Query or server error.

---

#### `POST /api/v1/cars`

- **Description:** Adds a new car brand.  
- **Method:** `POST`  
- **Request Body:**
    ```json
    { "name": "Tesla" }
    ```
    - `name` (required): Brand name (string, non-empty)

- **Success Response (201 Created):**
    ```json
    { "id": 4, "carbrand": "Tesla" }
    ```

- **Error Responses:**
  - `400 Bad Request`: Missing/invalid `name`.
  - `409 Conflict`: Duplicate brand name.
  - `500 Internal Server Error`: Query or server error.

---

#### `PUT /api/v1/cars/:id`

- **Description:** Updates a car brand.  
- **Method:** `PUT`  
- **URL Parameters:**
  - `id` (required): Brand ID (integer)

- **Request Body:**
    ```json
    { "name": "Ford Motors" }
    ```
    - `name` (required): Updated brand name (string, non-empty)

- **Success Response (200 OK):**
    ```json
    { "id": 2, "carbrand": "Ford Motors" }
    ```

- **Error Responses:**
  - `400 Bad Request`: Invalid ID or name.
  - `404 Not Found`: Brand not found.
  - `409 Conflict`: Duplicate name.
  - `500 Internal Server Error`: Query or server error.

---

## 4. Database Setup

This application requires a PostgreSQL database.

### Schema

```sql
CREATE TABLE carbrands (
    id SERIAL PRIMARY KEY,
    carbrand VARCHAR(255) NOT NULL UNIQUE
);

-- Optional: Add index
-- CREATE INDEX idx_carbrand_name ON carbrands(carbrand);
```

### Connection Details

- Configure via environment variables (`DATABASE_URL`) or in `db.js`.  
- SSL config used:
  ```js
  ssl: { rejectUnauthorized: false }
  ```
  - Needed for Render/Heroku, adjust per your provider.

---

## 5. Authentication & Security

- **Authentication:** Not implemented. All endpoints are public.  
  ➤ For production, add JWT, OAuth2, or API keys.

- **CORS:** Enabled for all origins (`'*'`).  
  ➤ Limit origins in production.

- **Input Validation:** Basic checks in controller functions.  
  ➤ For complex validation, use `joi` or `express-validator`.

- **Rate Limiting:** Not implemented.  
  ➤ Add rate limiting for abuse prevention.

- **HTTPS:** Use HTTPS in production environments.

---

## 6. Deployment Guide

Can be deployed to: Heroku, Render, AWS, GCP, DigitalOcean, etc.

### General Steps

1. **Version Control:** Use Git.  
2. **Hosting Platform:** Pick one (e.g., Render).  
3. **Environment Variables:**
   - `DATABASE_URL`
   - `NODE_ENV=production`
   - `PORT` (use `process.env.PORT || 8004`)
4. **Build Command:**
    ```bash
    npm install
    ```
5. **Start Command:**
    ```bash
    npm start
    # or node server.js
    ```
6. **Deploy:**
    ```bash
    git add .
    git commit -m "Prepare for deployment"
    git push origin main
    ```

### Deployment Example (Heroku/Render)

Ensure `Procfile` or Render command:
```
web: npm start
```

---

## 7. License & Contribution Guidelines

### License

MIT License.

### Contribution Guidelines

Contributions are welcome!  
- Submit issues or pull requests.  
- For major changes, open an issue for discussion.  
- Follow existing code style and include tests where applicable.