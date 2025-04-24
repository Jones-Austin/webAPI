# Car Brands API Backend

## 1. Project Overview

This project provides a backend REST API for managing a list of car brands. It is built using Node.js and Express.js, and it interacts with a PostgreSQL database to store and retrieve brand information.

**Technology Stack:**

*   **Runtime:** Node.js
*   **Framework:** Express.js
*   **Database:** PostgreSQL
*   **Node PostgreSQL Client:** `pg`
*   **Middleware:** `cors` (for Cross-Origin Resource Sharing)

**Purpose & Goals:**

*   To provide CRUD (Create, Read, Update) operations for car brands.
*   To offer a simple and clear API interface.
*   To demonstrate basic backend development principles with Node.js and PostgreSQL.

## 2. Installation & Setup

**Prerequisites:**

*   Node.js (v14 or later recommended)
*   npm (usually comes with Node.js) or yarn
*   Access to a PostgreSQL database instance.

**Steps:**

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url> # Replace <your-repository-url> with the actual URL
    cd <repository-directory-name>
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or if using yarn:
    # yarn install
    ```

3.  **Configure Database Connection:**
    *   The database connection string is currently hardcoded in `db.js`.
    *   **Recommendation:** For better security and flexibility, modify `db.js` to read the connection string from environment variables (e.g., `process.env.DATABASE_URL`).
    *   Ensure the PostgreSQL database server is running and accessible. The current configuration points to a Render PostgreSQL instance and requires SSL.

4.  **Start the API server:**
    ```bash
    npm start
    # or if you have a dev script:
    # npm run dev
    ```
    The server will typically start on `http://localhost:8004` (as configured in `server.js`).

## 3. API Documentation

**Base URL:** `/api/v1/cars`

**Endpoints:**

---

### `GET /api/v1/cars`

*   **Description:** Retrieves a list of all car brands.
*   **Method:** `GET`
*   **Query Parameters:**
    *   `id` (optional): Filters by a specific brand ID (integer). *Note: Using `GET /api/v1/cars/:id` is the preferred way to get a single brand.*
*   **Success Response (200 OK):**
    ```json
    [
        {
            "id": 1,
            "carbrand": "Toyota"
        },
        {
            "id": 2,
            "carbrand": "Ford"
        },
        {
            "id": 3,
            "carbrand": "Honda"
        }
    ]
    ```
*   **Error Responses:**
    *   `400 Bad Request`: If the optional `id` query parameter is provided but is not a valid integer.
    *   `500 Internal Server Error`: Database query failed or other server error.

---

### `GET /api/v1/cars/:id`

*   **Description:** Retrieves a single car brand by its unique ID.
*   **Method:** `GET`
*   **URL Parameters:**
    *   `id` (required): The unique identifier of the car brand (integer).
*   **Success Response (200 OK):**
    ```json
    {
        "id": 1,
        "carbrand": "Toyota"
    }
    ```
*   **Error Responses:**
    *   `400 Bad Request`: If the `id` parameter in the URL is not a valid integer.
    *   `404 Not Found`: If no brand exists with the specified `id`.
    *   `500 Internal Server Error`: Database query failed or other server error.

---

### `POST /api/v1/cars`

*   **Description:** Adds a new car brand to the database.
*   **Method:** `POST`
*   **Request Body:** JSON object containing the brand name.
    ```json
    {
        "name": "Tesla"
    }
    ```
    *   `name` (required): The name of the car brand (string, non-empty).
*   **Success Response (201 Created):** Returns the newly created brand object, including its assigned ID.
    ```json
    {
        "id": 4,
        "carbrand": "Tesla"
    }
    ```
*   **Error Responses:**
    *   `400 Bad Request`: If the `name` field is missing, empty, or not a string.
    *   `409 Conflict`: If a brand with the same name already exists (assuming a unique constraint on the `carbrand` column).
    *   `500 Internal Server Error`: Database query failed or other server error.

---

### `PUT /api/v1/cars/:id`

*   **Description:** Updates an existing car brand identified by its ID.
*   **Method:** `PUT`
*   **URL Parameters:**
    *   `id` (required): The unique identifier of the car brand to update (integer).
*   **Request Body:** JSON object containing the new brand name.
    ```json
    {
        "name": "Ford Motors"
    }
    ```
    *   `name` (required): The updated name for the car brand (string, non-empty).
*   **Success Response (200 OK):** Returns the updated brand object.
    ```json
    {
        "id": 2,
        "carbrand": "Ford Motors"
    }
    ```
*   **Error Responses:**
    *   `400 Bad Request`: If the `id` parameter is invalid, or the `name` field is missing, empty, or not a string.
    *   `404 Not Found`: If no brand exists with the specified `id`.
    *   `409 Conflict`: If updating the name conflicts with another existing brand's name (due to unique constraint).
    *   `500 Internal Server Error`: Database query failed or other server error.

---

## 4. Database Setup

This application requires a PostgreSQL database.

**Schema:**

You need a table named `carbrands` in your PostgreSQL database. You can create it using the following SQL command:

```sql
CREATE TABLE carbrands (
    id SERIAL PRIMARY KEY,             -- Auto-incrementing integer ID
    carbrand VARCHAR(255) NOT NULL UNIQUE -- Name of the car brand (adjust VARCHAR length as needed)
);

-- Optional: Add an index for faster lookups by name if needed
-- CREATE INDEX idx_carbrand_name ON carbrands(carbrand);
### Connection

Configure the connection string in `db.js` or preferably via environment variables (see Installation section).
The current setup in `db.js` uses SSL (`ssl: { rejectUnauthorized: false }`), which is often required for cloud database providers like Heroku or Render. Adjust this based on your database hosting requirements.

## 5. Authentication & Security

*   **Authentication:** Currently, no authentication or authorization mechanisms are implemented on the API endpoints. All endpoints are public. For production or sensitive environments, consider implementing authentication (e.g., JWT, OAuth2, API Keys).
*   **CORS:** Cross-Origin Resource Sharing is enabled via the `cors` middleware with the `origin: '*'` setting in `server.js`. This allows requests from any origin. For production, restrict this to only the domains that need access.
*   **Input Validation:** Basic input validation (checking for presence and type) is performed in the controller functions. Parameterized queries are used (`pg` library handles this) to help prevent SQL injection. Consider adding more robust validation libraries (like `joi` or `express-validator`) for complex scenarios.
*   **Rate Limiting:** Implement rate limiting to prevent abuse.
*   **HTTPS:** Ensure the API is served over HTTPS in production.

## 6. Deployment Guide

This Node.js application can be deployed to various platforms like Heroku, Render, AWS (EC2, Elastic Beanstalk), Google Cloud, DigitalOcean, etc.

**General Steps:**

1.  **Ensure Code is Version Controlled (Git):** Make sure your latest code is committed.
2.  **Choose a Hosting Platform:** Select a platform that supports `Node.js` applications. Render is a good option since the database is already hosted there.
3.  **Configure Environment Variables:** Set necessary environment variables on the hosting platform:
    *   `DATABASE_URL`: The connection string for your PostgreSQL database (recommended).
    *   `NODE_ENV`: Set to `production`.
    *   `PORT`: The platform often sets this automatically; your app should use `process.env.PORT`. (Your current `server.js` uses a fixed port `8004` - adapt it to use `process.env.PORT || 8004`).
4.  **Set Build Command:** Configure the platform to run `npm install` (or `yarn install`) to install dependencies.
5.  **Set Start Command:** Configure the platform to run `npm start` (or `node server.js`) to start the application.
6.  **Deploy:** Push your code to the platform (e.g., via `git push` for Heroku/Render).

**Example (Conceptual Render/Heroku via Git):**

```bash
# Make sure your Procfile (for Heroku) or Render start command is correct
# e.g., web: npm start

git add .
git commit -m "Prepare for deployment"
git push origin main # Or your deployment branch (e.g., git push render main)

## 7. License & Contribution Guidelines

### License

This project is licensed under the MIT License.


### Contribution Guidelines

Contributions are welcome! Please feel free to submit issues or pull requests.

*   For major changes, please open an issue first to discuss what you would like to change.
*   Ensure any code contributions adhere to the existing coding style and include relevant tests if applicable.