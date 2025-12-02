# Estate Commission API

This project is a NestJS application that provides a simple backend service for real estate transactions and commission calculations.

## Features

- Create, update, and list transactions.
- Manage transaction stages (`agreement`, `earnest_money`, `title_deed`, `completed`).
- Automatically calculate commissions when a transaction is completed.
- API documentation via Swagger.

---

## Setup

Follow the steps below to run the project on your local machine.

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later)
- npm (comes with Node.js)
- [MongoDB](https://www.mongodb.com/try/download/community) or a [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account

### 1. Clone the Repository

```bash
git clone <repository-url>
cd estate-commission-case
```

### 2. Install Dependencies

```bash
npm install
```

---

## Environment Variables

To run the project, you need to set up some environment variables. Create a file named `.env` in the root directory of the project.

```bash
touch .env
```

Edit the `.env` file you just created with the following content:

```env
# Your MongoDB connection string.
# For local MongoDB: MONGODB_URI=mongodb://localhost:27017/estate-commission
# For MongoDB Atlas, use a string like the one below.
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-url>/<database-name>?retryWrites=true&w=majority

# The port the application will run on (default: 3000)
PORT=3000
```

**For MongoDB Atlas:**

1.  Create a cluster in MongoDB Atlas.
2.  Create a user under the "Database Access" section and note down the password.
3.  Grant access to your IP address under the "Network Access" section (you can use `0.0.0.0/0` for development purposes).
4.  Click the "Connect" button for your cluster, select "Connect your application," and copy the provided connection string.
5.  Replace `<username>`, `<password>`, `<cluster-url>`, and `<database-name>` with your own credentials and add the string to your `.env` file.

---

## Running the Project

You can start the project in different modes:

```bash
# Development mode (watches for file changes and restarts)
npm run start:dev

# Production mode
npm run start:prod

# Standard start
npm run start
```

Once the application starts successfully, it will be running at `http://localhost:3000` by default.

---

## Running Tests

You can use the following commands to run the tests in the project:

```bash
# Run all unit tests
npm run test

# Run tests in watch mode
npm run test:watch

# Report test coverage
npm run test:cov

# Run end-to-end (e2e) tests
npm run test:e2e
```

---

## API Documentation

While the application is running, you can use the Swagger documentation to view API endpoints and DTOs. Navigate to the following address in your browser:

[http://localhost:3000/docs](http://localhost:3000/docs)

---

## Live API URL

> **Note:** This section should be filled out once the project is deployed to a live server.

You can access the live version of the project and its API documentation at the following address:

**[NOT YET DEPLOYED - URL WILL BE PLACED HERE]**
