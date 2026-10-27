# BlogSpace

BlogSpace is a full-stack blogging application. Readers can browse published
posts, and registered writers can publish and manage their own stories.

## Features

- Account registration and login with hashed passwords and HTTP-only session
  cookies
- MongoDB-backed users and blog posts
- Create, read, update, and delete blog posts
- Personal dashboard with search and category filters
- Responsive pages for the home page, authentication, dashboard, editor, and
  blog details
- Legacy blog ownership fallback for older posts that have an author email
  but no owner ID

## Requirements

- Node.js 20.19 or newer
- npm
- MongoDB, locally or through MongoDB Atlas

## Run locally

1. Install the backend dependencies:

   ```sh
   npm ci --prefix backend
   ```

2. Copy `backend/.env.example` to `backend/.env`, then set `MONGODB_URI` to
   your database connection string. Set `JWT_SECRET` to a random secret of at
   least 32 characters. Generate one with:

   ```sh
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

3. Start the application from the project root:

   ```sh
   npm start
   ```

4. Open [http://localhost:5000](http://localhost:5000).

The Express server serves both the web pages and API, so use the server URL
instead of opening HTML files directly or using a separate Live Server origin.
The website can serve its pages while MongoDB reconnects; database-backed
requests become available when the database connection succeeds.

## Commands

| Command | Description |
| --- | --- |
| `npm start` | Start the application |
| `npm run dev` | Start the backend with nodemon |
| `npm test` | Run backend unit and integration tests |

`GET /health` is a liveness endpoint. It returns the application status and
whether MongoDB is connected or reconnecting.

## API overview

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `POST` | `/api/register` | Register an account |
| `POST` | `/api/login` | Sign in and set the session cookie |
| `GET` | `/api/auth/me` | Get the signed-in user |
| `POST` | `/api/auth/logout` | Sign out |
| `GET` | `/api/blogs` | Browse published posts |
| `GET` | `/api/blogs/:id` | Read a post |
| `GET` | `/api/my/blogs` | List the signed-in user's posts |
| `GET` | `/api/my/blogs/:id` | Read one of the signed-in user's posts |
| `POST` | `/api/blogs` | Publish a post |
| `PATCH` / `PUT` | `/api/blogs/:id` | Update an owned post |
| `DELETE` | `/api/blogs/:id` | Delete an owned post |

Authentication uses an HTTP-only cookie and protected routes require a valid
session. The API returns JSON errors for failed requests.

## Deploy to Render

The included [`render.yaml`](./render.yaml) configures a single Node web
service for both the frontend and API.

1. Push this project to a GitHub repository.
2. In Render, choose **New → Blueprint**, then connect the repository and
   deploy the blueprint.
3. When prompted, provide `MONGODB_URI` as a Render secret. Use the Atlas
   connection string for the database that contains your app's users and
   posts.
4. In MongoDB Atlas, allow the Render service's outbound IP addresses in
   **Network Access**. Prefer fixed outbound IPs where your Render plan
   supports them; avoid broad IP allowlists when possible.
5. Wait for `/health` to pass, then open the Render service URL.

Render generates `JWT_SECRET` for the service. Keep database credentials and
signing secrets in Render's environment settings; do not commit `.env` files
or paste secrets into source code.

## Project structure

```text
.
├── backend/
│   ├── auth.js
│   ├── models/
│   ├── server.js
│   └── auth*.test.js
├── blog-detail.html
├── create-blog.html
├── dashboard.html
├── index.html
├── login.html
├── register.html
├── render.yaml
└── style.css
```
