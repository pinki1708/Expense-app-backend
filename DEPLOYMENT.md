# Deployment Guide for Expense App Backend

## Deploying to Render

### Prerequisites
1. A Render account (sign up at https://render.com)
2. Your code pushed to a Git repository (GitHub, GitLab, or Bitbucket)

### Step 1: Create a Database
1. In your Render dashboard, click "New +"
2. Select "MySQL"
3. Choose "Free" plan
4. Name it "expense-app-database"
5. Click "Create Database"
6. Note down the connection details (host, database name, username, password, port)

### Step 2: Deploy Your Backend
1. In your Render dashboard, click "New +"
2. Select "Web Service"
3. Connect your Git repository
4. Configure the service:
   - **Name**: expense-app-backend
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

### Step 3: Set Environment Variables
In your web service settings, add these environment variables:

```
NODE_ENV=production
PORT=10000
DB_HOST=<your-database-host>
DB_NAME=<your-database-name>
DB_USER=<your-database-username>
DB_PASSWORD=<your-database-password>
DB_PORT=3306
DB_DIALECT=mysql
JWT_SECRET=<generate-a-strong-secret>
FRONTEND_URL=<your-frontend-url>
```

**Important**: Make sure to set `DB_DIALECT=mysql` to force MySQL usage!

### Step 4: Database Configuration
The app is configured to use MySQL. The following packages are included:
- `mysql2` - MySQL driver for Node.js

The database configuration uses MySQL by default.

### Step 5: Deploy
1. Click "Create Web Service"
2. Render will automatically build and deploy your application
3. Your API will be available at the provided URL

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `production` |
| `PORT` | Server port | `10000` |
| `DB_HOST` | Database host | `mysql-host.render.com` |
| `DB_NAME` | Database name | `expense_app_db` |
| `DB_USER` | Database username | `expense_app_user` |
| `DB_PASSWORD` | Database password | `your_password` |
| `DB_PORT` | Database port | `3306` |
| `JWT_SECRET` | JWT signing secret | `your_jwt_secret` |
| `FRONTEND_URL` | Frontend URL for CORS | `https://your-frontend.onrender.com` |

## API Endpoints
Once deployed, your API will be available at:
- `https://your-app-name.onrender.com/api/auth/*`
- `https://your-app-name.onrender.com/api/expenses/*`
- `https://your-app-name.onrender.com/api/categories/*`
- `https://your-app-name.onrender.com/api/budgets/*`

## Troubleshooting
- Check Render logs if deployment fails
- Ensure all environment variables are set correctly
- Verify database connection details
- Make sure your JWT_SECRET is set for authentication to work
