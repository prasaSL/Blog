# Full Stack Blog Platform

A modern blog application built with React (Vite), Express.js, Sequelize, and MySQL. Features user authentication, admin panel, image uploads, and a responsive UI.

## Features

- User registration and login (JWT, refresh tokens)
- Role-based access (user/admin)
- Admin dashboard for managing posts
- Image upload for blog posts
- Search, pagination, and filtering
- Responsive design with Material UI
- Social login UI (Google, Facebook, GitHub)
- Error handling and notifications

## Tech Stack

- **Frontend:** React, Vite, Material UI, Axios, React Router
- **Backend:** Express.js, Sequelize ORM, MySQL
- **Auth:** JWT, bcrypt, cookies
- **Styling:** CSS variables, Tailwind, MUI

## Folder Structure

```
├── app.js
├── server.js
├── config/
│   └── database.js
├── controllers/
│   ├── Post.Controller.js
│   └── User.Controller.js
├── middleware/
│   ├── authMiddleware.js
│   └── errorHandler.js
├── models/
│   ├── Post.model.js
│   └── User.model.js
├── public/
│   └── uploads/
│       └── posts/
├── routes/
│   ├── Post.route.js
│   └── User.route.js
├── utils/
│   └── seeder/
│       └── adminSeeder.js
├── front/
│   ├── index.html
│   ├── package.json
│   ├── src/
│   │   ├── App.jsx
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   └── utils/
│   └── public/
│       └── vite.svg
├── .env
├── .env.example
├── .gitignore
├── package.json
└── readme.md
```

## Getting Started

### Prerequisites

- Node.js (v16+)
- MySQL

### Backend Setup

1. Install dependencies:
	```sh
	npm install
	```
2. Configure `.env` with your DB and JWT secrets.
3. Create the database:
	```sql
	CREATE DATABASE blog_db;
	```
4. Run the server:
	```sh
	npm run dev
	```

### Frontend Setup

1. Go to `front/` and install dependencies:

	```sh 
    cd front npm install
     ```

2. Configure `front/.env`:

	```
    VITE_API_URL=http://localhost:5000	
    ```

3. Start the frontend:
	```sh 
    npm run dev
     ```

## API Endpoints

- `POST /api/users/signup` - Register
- `POST /api/users/login` - Login
- `POST /api/users/admin/login` - Admin login
- `GET /api/posts/posts` - Get published posts
- `GET /api/posts/:id` - Get single post
- `GET /api/posts/all-list` - Admin: all posts
- `POST /api/posts/create` - Admin: create post
- `PUT /api/posts/:id` - Admin: update post
- `DELETE /api/posts/:id` - Admin: delete post

## Assumptions and Limitations

- Requires Node.js and MySQL
- Images are stored as base64 or file uploads; large images may impact performance
- Admin panel is single-admin; multi-admin support would require further development
- Content moderation is basic
- No analytics or SEO optimization included

## License

MIT

---

Designed and developed by Prasad Madushan.
