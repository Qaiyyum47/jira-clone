# Jira Clone

A full-stack project management application inspired by Jira for tracking issues, managing projects, and team collaboration.

## Features

*   User authentication (register and login)
*   Create, Read, Update, and Delete projects
*   Create, Read, Update, and Delete issues within projects
*   Add comments to issues
*   Assign issues to users
*   Change issue status (e.g., To Do, In Progress, Done)
*   Upload attachments to issues
*   Profile picture uploads
*   "For You" dashboard with project and issue overviews
*   Project and issue filtering and search
*   Rich text editing for issue descriptions and comments
*   Charts for project visualization

## Tech Stack

### Frontend

*   **Framework:** [React](https://reactjs.org/)
*   **State Management:** [Redux Toolkit](https://redux-toolkit.js.org/)
*   **Routing:** [React Router](https://reactrouter.com/)
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
*   **Build Tool:** [Vite](https://vitejs.dev/)
*   **API Communication:** [Axios](https://axios-http.com/)
*   **Date Handling:** [date-fns](https://date-fns.org/)
*   **Icons:** [Lucide Icons](https://lucide.dev/)
*   **Rich Text Editor:** [Quill](https://quilljs.com/)
*   **Charts:** [Recharts](https://recharts.org/)

### Backend

*   **Runtime:** [Node.js](https://nodejs.org/)
*   **Framework:** [Express.js](https://expressjs.com/)
*   **Database:** [MongoDB](https://www.mongodb.com/)
*   **ODM:** [Mongoose](https://mongoosejs.com/)
*   **Authentication:** [JWT](https://jwt.io/)
*   **Password Hashing:** [Bcrypt](https://www.npmjs.com/package/bcrypt)
*   **File Uploads:** [Multer](https://www.npmjs.com/package/multer)
*   **Middleware:** [CORS](https://www.npmjs.com/package/cors), [Dotenv](https://www.npmjs.com/package/dotenv)

## Getting Started

### Prerequisites

*   [Node.js](https://nodejs.org/en/download/) (includes npm)
*   [MongoDB](https://www.mongodb.com/try/download/community) installed and running.

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/Qaiyyum47/jira-clone.git
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

    In the `backend` directory, create a `.env` file with the following variables:

    ```env
    # .env
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret
    ```

## Usage

1.  **Start the backend server:**
    From the `backend` directory:
    ```bash
    npm start
    ```
    The server will run on `http://localhost:5000`.

2.  **Start the frontend development server:**
    From the `frontend` directory:
    ```bash
    npm run dev
    ```
    The frontend will be available at `http://localhost:3000`.

3.  Open your browser and navigate to `http://localhost:3000`.

## Project Structure

```
jira-clone/
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   └── server.js
└── frontend/
    ├── src/
    │   ├── assets/
    │   ├── components/
    │   ├── pages/
    │   ├── store/
    │   └── App.jsx
    └── ...
```

## License

Distributed under the MIT License. See `LICENSE` for more information.
