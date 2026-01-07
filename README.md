# FairRide

FairRide is a hackathon project that addresses the problem of price fairness in online cab booking. It provides a single platform to compare cab fares from various providers for a given route, ensuring users get the best price for their travel.

## Features

*   **Fare Comparison:** Compares cab fares from major ride-sharing platforms.
*   **Best Price:** Shows the best price for travel from one place to another.
*   **Route Information:** Displays route distance and estimated travel time.
*   **Live Fare Estimates:** Fetches real-time fare estimates from backend services.
*   **Modern UI:** A clean and modern user interface with a black and white theme.

## Tech Stack

*   **Frontend:**
    *   HTML5, CSS3, JavaScript
    *   [OpenRouteService](https://openrouteservice.org/) for geocoding and routing.
*   **Backend:**
    *   Node.js
    *   Express.js
    *   CORS
*   **Monorepo:** The project is structured as a monorepo, with separate packages for the frontend and backend.

## Getting Started

### Prerequisites

*   Node.js and npm installed on your machine.
*   An API key from [OpenRouteService](https://openrouteservice.org/dev/#/signup).

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd fair_ride
    ```

2.  **Install frontend dependencies:**
    ```bash
    cd packages/frontend
    npm install
    ```

3.  **Install backend dependencies:**
    ```bash
    cd ../backend
    npm install
    ```

## Running the Application

1.  **Configure OpenRouteService API Key:**
    *   In the `packages/frontend/public` directory, create a file named `ors-config.js`.
    *   Add the following content to the file, replacing `YOUR_API_KEY` with your OpenRouteService API key:
        ```javascript
        window.orsConfig = {
            apiKey: 'YOUR_API_KEY'
        };
        ```

2.  **Start the backend server:**
    *   Navigate to the `packages/backend` directory.
    *   Run the following command:
        ```bash
        npm start
        ```
    *   The backend server will start on `http://localhost:8080`.

3.  **Start the frontend application:**
    *   Open a new terminal and navigate to the `packages/frontend` directory.
    *   Since there is no dev server, you can serve the `public` directory using a simple HTTP server. If you have Python installed:
        ```bash
        cd public
        python -m http.server
        ```
    *   Or using `npx`:
        ```bash
        npx serve -s packages/frontend/public
        ```
    *   The application will be accessible at `http://localhost:8000` (for python) or another port shown in the terminal. The `index.html` is inside the `public` directory. A simple way is to just open `packages/frontend/public/index.html` in your browser.

## Project Structure

The project is organized as a monorepo with the following structure:

```
fair_ride/
├── packages/
│   ├── backend/      # Node.js backend
│   └── frontend/     # HTML/CSS/JS frontend
├── package.json
└── README.md
```