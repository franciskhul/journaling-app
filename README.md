# Journaling App

## Table of Contents

1. [Getting Started](#getting-started)
   1. [Prerequisites](#prerequisites)
   2. [Clone the Repository](#clone-the-repository)
   3. [Install Dependencies](#install-dependencies)
   4. [Set Up Environment Variables](#set-up-environment-variables)
   5. [Start PostgreSQL with Docker](#start-postgresql-with-docker)
   6. [Initialize Prisma](#initialize-prisma)
   7. [Run the Development Server](#run-the-development-server)
2. [View API Documentation](#view-api-documentation)

---

## Getting Started

To get started with the Journaling App, follow the steps below:

### Prerequisites

Ensure you have the following installed on your system:

- **Node.js** (v20.19.0 or higher)
- **npm** (v10.8.2 or higher)
- **Docker** (optional for running PostgreSQL in a container)
- **nvm** (Node Version Manager) for managing the Node.js version

### Clone the Repository

To get started, first clone the repository to your local machine using Git:

```bash
git clone [https://github.com/franciskhul/journaling-app.git](https://github.com/franciskhul/journaling-app.git)
cd journaling-app
```

### Install Dependencies

Make sure you have the correct version of Node.js installed. If you're using nvm, you can install and use the required Node version with the following commands:

```bash
nvm install
nvm use
```

Then install the project dependencies using npm. If you encounter peer dependency issues, use the `--legacy-peer-deps` flag to install dependencies:

```bash
npm install --legacy-peer-deps
```

The `--legacy-peer-deps` flag may be necessary due to peer dependency conflicts. It ensures all dependencies are installed correctly without strict peer dependency checks.

### Set Up Environment Variables

Create an .env file in the project root directory by copying the provided .env.example file:

```bash
cp .env.example .env
```

Update the .env file with your environment-specific variables, such as the database connection details. For example:

```bash
DATABASE_URL=postgresql://postgres:yourpassword@localhost:5440/journaling_app
```

### Start PostgreSQL with Docker

You can set up PostgreSQL in two ways: using **Docker Compose** or installing it **manually** on your system. Follow the instructions based on your preference.

#### Option 1: Using Docker Compose

If you prefer to use Docker to manage PostgreSQL, you can spin up the database with Docker Compose:

```bash
docker-compose up -d
```

This will start PostgreSQL in a container and make it available on port 5440 (as defined in docker-compose.yml).

Check if PostgreSQL is running by executing:

```bash
docker ps
```

Make sure the container is up and running before proceeding to the next step.

#### Option 2: Manual PostgreSQL Setup

If you don't want to use Docker, follow these steps to manually set up PostgreSQL:

1. Install PostgreSQL:

- On Linux (Ubuntu):

```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
```

- On macOS:

```bash
brew install postgresql
```

- On Windows: Download the installer from the official PostgreSQL website:
  [https://www.postgresql.org/download/windows](https://www.postgresql.org/download/windows)

2. Start PostgreSQL:

- On Linux:

```bash
sudo service postgresql start
```

- On macOS:

```bash
brew services start postgresql
```

- On Windows: Start the PostgreSQL service via the installed service manager.

3. Create a User and Database: Use psql to create the database and user that matches the details in your `.env` file.

```bash
psql postgres
```

In the PostgreSQL console, run:

```bash
CREATE USER postgres WITH PASSWORD 'yourpassword';
CREATE DATABASE journaling_app;
GRANT ALL PRIVILEGES ON DATABASE journaling_app TO postgres;
```

4. Verify the Database Connection:Test if PostgreSQL is running correctly and can accept connections using:

```bash
psql -h localhost -p 5432 -U postgres -d journaling_app
```

Make sure the connection URL in the `.env` file is updated correctly:

```bash
DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/journaling_app

```

### Initialize Prisma

After setting up the database, generate the Prisma client by running:

```bash
npx prisma generate
```

### Seed the database

Run the following command to seed the database

```bash
npx prisma db seed
```

### Run the Development Server

Once everything is set up, you can run the development server:

```bash
npm run dev
```

After running the command, a link will be logged in the terminal. Use the link provided to open application in your browser.

### Start prisma studio (Optional)

Run the following command to start studio prisma.

```bash
npx prisma studio
```

After running the command, a link will be logged in the terminal. Use the link provided to open Prisma Studio in your browser.

## View API Documentation

The API documentation is automatically generated using Swagger. To view the API documentation:

- Swagger UI: Visit [Swagger API UI](http://localhost:3000/api-docs) to view the API documentation in JSON format.
- Swagger JSON: Visit [Swagger API JSON](http://localhost:3000/api-docs/json) to view the API documentation in JSON format.
