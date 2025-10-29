# Jira Clone

A Jira-like project management web app.

## Tech Stack

**Frontend:**

*   React
*   Redux for state management
*   React Router for navigation
*   Tailwind CSS for styling
*   Vite for frontend tooling
*   Axios for API requests
*   date-fns for date formatting
*   Lucide Icons for icons
*   Quill for rich text editing
*   Recharts for charts

**Backend:**

*   Node.js
*   Express.js framework
*   MongoDB for the database
*   Mongoose for object data modeling
*   JWT for authentication
*   Bcrypt for password hashing
*   Multer for file uploads
*   CORS for cross-origin resource sharing
*   Dotenv for environment variables

## Features

*   User authentication (register and login)
*   Create, Read, Update, and Delete projects
*   Create, Read, Update, and Delete issues within projects
*   Add comments to issues
*   Assign issues to users
*   Change issue status (e.g., To Do, In Progress, Done)
*   Upload attachments to issues
*   Profile picture uploads
*   For you with project and issue overview
*   Project and issue filtering and search

## Getting Started

### Prerequisites

*   Node.js and npm installed
*   MongoDB installed and running

### Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/your-username/jira-clone.git
    cd jira-clone
    ```

2.  **Install backend dependencies:**

    ```bash
    cd backend
    npm install
    ```

3.  **Install frontend dependencies:**

    ```bash
    cd ../frontend
    npm install
    ```

4.  **Set up environment variables:**

    Create a `.env` file in the `backend` directory and add the following:

    ```
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret
    ```

## Usage

1.  **Start the backend server:**

    ```bash
    cd backend
    npm start
    ```

    The backend server will be running on `http://localhost:5000` (or your configured port).

2.  **Start the frontend development server:**

    ```bash
    cd ../frontend
    npm run dev
    ```

    The frontend will be running on `http://localhost:3000` (or your configured port).

3.  Open your browser and navigate to `http://localhost:3000`.