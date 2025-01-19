# Finance Tracker App - Backend

This repository contains the backend code for the Finance Tracker App, a web application designed to help users manage their finances by tracking income, expenses, and overall balance. The backend is built using Node.js and Express.js and connects to a MongoDB database hosted on MongoDB Atlas.

## Features

- **User Authentication**: Secure registration and login using JSON Web Tokens (JWT).
- **Transaction Management**: APIs to add, edit, and delete income and expense transactions.
- **Balance Calculation**: Real-time computation of the user's balance based on transactions.
- **Data Security**: Passwords are hashed using bcrypt, and all sensitive data is secured.

## Technology Stack

- **Backend Framework**: Node.js with Express.js
- **Database**: MongoDB (hosted on MongoDB Atlas)
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcrypt
- **Deployment**: Render or Cyclic

## Installation

### Prerequisites

Ensure you have the following installed:

- Node.js (>=14.x)
- npm (>=6.x)
- MongoDB Atlas account (for database setup)

### Steps to Run Locally

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd finance-tracker-backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory and add the following:

   ```env
   PORT=5000
   MONGO_URI=<your-mongodb-atlas-uri>
   JWT_SECRET=<your-jwt-secret>
   ```

4. Start the server:
   ```bash
   npm start
   ```
   The server will run on `http://localhost:5000` by default.
