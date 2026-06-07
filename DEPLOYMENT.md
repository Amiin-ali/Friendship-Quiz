# Deployment Guide for Friendship Quiz

## 1. Frontend deployment to Vercel

1. In Vercel, create a new project from this repository.
2. Set the project root to `frontend`.
3. Use the default build command: `npm run build`.
4. Use the default output directory: `dist`.
5. Add an environment variable under Vercel project settings:
   - `VITE_API_BASE_URL` = `https://your-backend-url.com/api`
6. Deploy the frontend.

## 2. Backend hosting

This backend is an Express + MongoDB app and is not fully compatible with Vercel serverless hosting as-is, because it uses persistent uploads and a MongoDB database.

Recommended hosting options:
- Railway
- Render
- Fly.io
- DigitalOcean App Platform
- Heroku alternative

### Required environment variables for backend

- `MONGODB_URI` = your MongoDB connection string
- `JWT_SECRET` = your authentication secret
- `NODE_ENV` = `production`

### Notes

- Do not commit your real `.env` file to Git.
- Use `backend/.env.example` as a template.
- Use `frontend/.env.example` as a template for the frontend backend URL.

## 3. Local development

### Frontend

1. `cd frontend`
2. `npm install`
3. `npm run dev`

### Backend

1. `cd backend`
2. `npm install`
3. Create `.env` from `backend/.env.example`
4. `npm run dev`

## 4. Important change for deployment

The frontend API URL is configured with `VITE_API_BASE_URL` so the app can call the correct deployed backend instead of localhost.
