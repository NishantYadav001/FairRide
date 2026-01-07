# FairRide Backend

This is the backend server for the FairRide application. It provides an API for fare estimation.

## Prerequisites

*   Node.js and npm installed.

## Installation

1.  Navigate to the `packages/backend` directory.
2.  Install the dependencies:
    ```bash
    npm install
    ```

## Running the Server

1.  Start the server:
    ```bash
    npm start
    ```
2.  The server will be running on `http://localhost:8080`.

## API

### `POST /api/fare-estimates`

This endpoint provides fare estimates for a given distance and duration.

**Request Body:**
```json
{
  "distanceKm": 10.5,
  "durationMin": 25
}
```

**Response Body:**
An array of fare objects, for example:
```json
[
  {
    "provider": "Ola",
    "vehicle": "Mini",
    "price": 150,
    "surge": 1.2
  },
  {
    "provider": "Uber",
    "vehicle": "Go",
    "price": 160,
    "surge": 1.0
  }
]
```
