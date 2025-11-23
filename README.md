# CRM PRO 

A modern, open-source ERP/CRM system built with the MERN stack (MongoDB, Express.js, React, Node.js).

## Project Structure

The project is divided into two main directories:

*   **`backend/`**: The server-side application built with Node.js, Express, and MongoDB.
*   **`frontend/`**: The client-side application built with React, Vite, and Ant Design.

## Tech Stack

### Backend
*   **Runtime**: Node.js
*   **Framework**: Express.js
*   **Database**: MongoDB (with Mongoose)
*   **Authentication**: JWT (JSON Web Tokens)
*   **Other Tools**: Nodemon, Dotenv

### Frontend
*   **Framework**: React
*   **Build Tool**: Vite
*   **UI Library**: Ant Design
*   **State Management**: Redux Toolkit
*   **Routing**: React Router DOM

## Getting Started

### Prerequisites

*   Node.js (v14 or higher recommended)
*   npm or yarn
*   MongoDB (Local or Atlas connection string)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd crm-pro
    ```

2.  **Install Backend Dependencies:**
    ```bash
    cd backend
    npm install
    ```

3.  **Install Frontend Dependencies:**
    ```bash
    cd ../frontend
    npm install
    ```

### Configuration

1.  **Backend Configuration:**
    *   Navigate to the `backend` directory.
    *   Create a `.env` file (copy from `.env.example` if available, or set up required variables like `MONGO_URI`, `JWT_SECRET`, etc.).

2.  **Frontend Configuration:**
    *   Navigate to the `frontend` directory.
    *   Create a `.env` file if needed for API endpoints (e.g., `VITE_API_BASE_URL`).

### Running the Application

1.  **Start the Backend:**
    ```bash
    cd backend
    npm run dev
    ```
    The server should start on the defined port (default is usually 8888 or 5000).

2.  **Start the Frontend:**
    ```bash
    cd frontend
    npm run dev
    ```
    The application will be available at `http://localhost:5173` (or the port shown in the terminal).

## Scripts

### Backend
*   `npm start`: Start the production server.
*   `npm run dev`: Start the development server with Nodemon.
*   `npm run setup`: Run the initial setup script.

### Frontend
*   `npm run dev`: Start the development server.
*   `npm run build`: Build for production.
*   `npm run preview`: Preview the production build.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
