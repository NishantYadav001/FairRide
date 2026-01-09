# FairRide

FairRide is a full-stack application designed to solve the problem of price fairness in online cab booking. It allows users to compare real-time prices from various ride-sharing providers for a given route, highlighting surge pricing and suggesting the fairest deal.

This project was built for a hackathon and is organized as a monorepo with separate packages for the frontend and backend.

## Project Structure

The project is divided into two main packages located in the `packages/` directory:

-   `./packages/frontend`: A **React-based** single-page application that provides the user interface. It allows users to input their pickup and drop-off locations and view a list of available rides with their prices.
-   `./packages/backend`: A **Node.js (Express)** server that provides a REST API. It fetches real-time price estimates from external services (like Uber) and serves this data to the frontend.

## Getting Started

To run the full application, you must run both the backend and frontend servers simultaneously.

### Prerequisites

-   [Node.js](https://nodejs.org/) (which includes `npm`)
-   Valid API keys for services like Google Maps and Uber (see backend/frontend READMEs for details)

### 1. Run the Backend Server

First, navigate to the backend directory, install its dependencies, and start the server.

```sh
cd packages/backend
npm install
npm start
```
For detailed configuration and API setup, please see the [backend README](./packages/backend/README.md).

### 2. Run the Frontend Application

In a separate terminal, navigate to the frontend directory, install its dependencies, and start the React development server.

```sh
cd packages/frontend
npm install
npm start
```

The frontend requires some initial setup to fix the project structure and configure API keys. Please follow the instructions in the [frontend README](./packages/frontend/README.md) carefully.

Once both servers are running, you can access the application at `http://localhost:3000`.