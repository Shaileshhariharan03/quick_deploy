# Quick Deploy

**Quick Deploy** is a streamlined platform for deploying web applications using a GitHub repository URL. Simply provide your repo link, and our system takes care of cloning, building, storing, and serving your application—all powered by Node.js backend services and a React frontend.

![Vercel - Architecture](https://github.com/user-attachments/assets/9d62926c-1621-4ad4-9072-d4b1695935e3)

---

## 🧠 Architecture Overview

Quick Deploy consists of the following components:

### Backend Services (Node.js)

1. **Upload Service**

   * Accepts a GitHub repo URL from the frontend
   * Clones the repo
   * Uploads the source to S3/Cloudflare
   * Sends a message to SQS with an Upload ID

2. **Deploy Service**

   * Listens to SQS for new uploads
   * Builds the repo
   * Uploads build artifacts to S3/Cloudflare
   * Updates Redis DB with deployment status

3. **Request Handler Service**

   * Fetches the deployment status and files from S3
   * Responds to frontend/browser requests
   * Routes incoming traffic to the correct deployed application

### Frontend (React)

* A simple interface to input the GitHub repo URL
* Displays status updates and deployed app links

---

## 🛠️ How It Works

1. **User submits a GitHub repo URL** via the frontend.
2. **Upload Service**:

   * Clones the repository.
   * Pushes source to S3.
   * Triggers **Deploy Service** via SQS.
3. **Deploy Service**:

   * Builds the application.
   * Uploads build files to S3.
   * Updates Redis with deployment status.
4. **Request Handler Service**:

   * Retrieves build files for the given ID.
   * Serves them to the browser.

---

## 🚧 Technologies Used

* **Backend**: Node.js, Express.js
* **Frontend**: React
* **Queue**: AWS SQS
* **Storage**: AWS S3 or Cloudflare
* **Database**: Redis

---

## React APP
<img width="1104" alt="Screenshot 2025-05-16 at 12 16 38 AM" src="https://github.com/user-attachments/assets/beed0878-985f-4942-a852-81ce52b04fe8" />
<img width="1104" alt="Screenshot 2025-05-16 at 12 17 54 AM" src="https://github.com/user-attachments/assets/70d0fbbf-b022-4795-9ab5-19744c0b57bf" />
<img width="1104" alt="Screenshot 2025-05-16 at 12 18 04 AM" src="https://github.com/user-attachments/assets/e723d7c9-f410-4c02-9624-fb0146cec83a" />

---

## 🚀 Getting Started (Local Setup)

### Prerequisites

* Node.js (v18+)
* Docker (optional for Redis/SQS mock)
* Git

### Clone the Repo

```bash
git clone https://github.com/your-org/quick-deploy.git
cd quick-deploy
```

### Install Dependencies

```bash
cd upload-service && npm install
cd ../deploy-service && npm install
cd ../request-handler-service && npm install
cd ../frontend && npm install
```

### Run Redis and SQS (Locally)

Use Docker or AWS Localstack for local testing.

```bash
docker run -d -p 6379:6379 redis
# Use localstack or mock SQS for development
```

### Start All Services

```bash
# In separate terminals
cd upload-service && npm start
cd deploy-service && npm start
cd request-handler-service && npm start
cd frontend && npm start
```

---

## 🌐 Deployment

To deploy Quick Deploy to production:

* Set up hosted Redis, SQS, and S3/Cloudflare.
* Deploy services on serverless or container infrastructure (e.g., AWS Lambda, ECS, or Heroku).
* Configure environment variables for service integration.

---
