# Deployment Guide: Render (Backend) + Vercel (Frontend)

## Overview

Your project has 3 parts that each need to go somewhere in the cloud:
1. **MySQL Database** → Aiven (free cloud MySQL)
2. **Spring Boot Backend (Java)** → Render
3. **React Frontend** → Vercel

The order matters. Do this in order: **Database → Backend → Frontend**.

---

## Step 1: Set Up a Free Cloud MySQL Database (Aiven)

Your local MySQL won't be accessible from the internet, so you need a cloud-hosted one.

1. Go to **https://aiven.io** and create a free account.
2. Click **"Create Service"** → select **MySQL** → choose the **Free plan**.
3. Once it's ready, click on it and go to the **"Connection Information"** tab.
4. Copy these 5 values — you will need them later:
   - **Host** (e.g. `mysql-xxxx.aivencloud.com`)
   - **Port** (e.g. `12345`)
   - **Database** (e.g. `defaultdb`)
   - **Username** (e.g. `avnadmin`)
   - **Password**

> [!TIP]
> Alternative free MySQL options: **Railway.app** (add a MySQL plugin) or **PlanetScale** (very generous free tier).

---

## Step 2: Prepare the Backend for Deployment

### 2a. Remove the hardcoded password from `application.properties`

Replace the contents of `src/main/resources/application.properties` with this. This reads the credentials from environment variables instead of hardcoding them.

```properties
spring.application.name=demo

# These values will be set as Environment Variables on Render
spring.datasource.url=${DB_URL}
spring.datasource.username=${DB_USERNAME}
spring.datasource.password=${DB_PASSWORD}
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQLDialect
```

### 2b. Update CORS to allow your Vercel URL

In `HospitalController.java`, change line 14 from:
```java
@CrossOrigin(origins = "http://localhost:5173")
```
To (you can add both URLs, your Vercel URL will be known after Step 4):
```java
@CrossOrigin(origins = {"http://localhost:5173", "https://your-app.vercel.app"})
```

> [!IMPORTANT]
> You will get the Vercel URL in Step 4. Come back and update this after you deploy the frontend.

### 2c. Build the JAR file

Run this command in your project root:
```
.\mvnw.cmd package -DskipTests
```
This creates a `.jar` file inside the `target/` folder (e.g., `FullStack-Project-0.0.1-SNAPSHOT.jar`).

### 2d. Push code to GitHub

You need your code on GitHub for Render to access it.
1. Create a new repository on **https://github.com/new**.
2. In your project folder, run:
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

---

## Step 3: Deploy Backend to Render

1. Go to **https://render.com** and create a free account.
2. Click **"New +"** → **"Web Service"**.
3. Connect your **GitHub repository**.
4. Fill in the settings:

| Setting | Value |
|---|---|
| **Name** | `hospital-backend` (or any name) |
| **Branch** | `main` |
| **Runtime** | `Java` |
| **Build Command** | `./mvnw package -DskipTests` |
| **Start Command** | `java -jar target/FullStack-Project-0.0.1-SNAPSHOT.jar` |
| **Instance Type** | `Free` |

5. Scroll down to **"Environment Variables"** and add these 3 variables using your Aiven database values from Step 1:

| Key | Value |
|---|---|
| `DB_URL` | `jdbc:mysql://YOUR_AIVEN_HOST:PORT/YOUR_DB_NAME?ssl-mode=REQUIRED` |
| `DB_USERNAME` | `avnadmin` (or your Aiven username) |
| `DB_PASSWORD` | `your-aiven-password` |

6. Click **"Create Web Service"**.
7. Wait for the build to finish. You will get a backend URL like `https://hospital-backend.onrender.com`. **Copy this URL!**

> [!WARNING]
> Render free tier services spin down after 15 minutes of inactivity. The first request after sleeping may take ~30 seconds. This is normal for the free tier.

---

## Step 4: Deploy Frontend to Vercel

### 4a. Update the API URL in the frontend

In `frontend/src/Components/RoomPanel.jsx`, change line 3 from:
```js
const API = "https://hospital-management-system-4bmu.onrender.com/api/hospital"
```
To your Render backend URL:
```js
const API = "https://hospital-backend.onrender.com/api/hospital"
```

Commit and push this change to GitHub.

### 4b. Deploy to Vercel

1. Go to **https://vercel.com** and sign in with your GitHub account.
2. Click **"Add New..."** → **"Project"**.
3. Import your GitHub repository.
4. Configure it:

| Setting | Value |
|---|---|
| **Framework Preset** | `Vite` |
| **Root Directory** | `frontend` |
| **Build Command** | `npm run build` |
| **Output Directory** | `dist` |

5. Click **"Deploy"**.
6. Vercel will give you a URL like `https://your-app.vercel.app`. **Copy this!**

---

## Step 5: Final CORS Fix

Now that you have your Vercel URL, go back to `HospitalController.java` and update the CORS annotation with the real Vercel URL:

```java
@CrossOrigin(origins = {"http://localhost:5173", "https://your-app.vercel.app"})
```

Commit and push to GitHub. Render will automatically redeploy the backend.

---

## Summary of URLs

| Part | Platform | URL Format |
|---|---|---|
| Database | Aiven | `mysql-xxxx.aivencloud.com:PORT` |
| Backend API | Render | `https://hospital-backend.onrender.com` |
| Frontend App | Vercel | `https://your-app.vercel.app` |

Your app is now fully deployed!
