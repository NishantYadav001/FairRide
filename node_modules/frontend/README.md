# FairRide Frontend (React)

This is the frontend for the FairRide application, built with React and Bootstrap. It provides a user interface to compare ride-sharing prices, spot surge pricing, and find the fairest deal.

## Features

- **Address Autocomplete:** Uses Google Maps for easy address input.
- **Multi-Provider Comparison:** Fetches real-time data from a backend for Uber and simulates prices for other providers like Ola and Rapido.
- **Surge Pricing Insights:** Identifies high surge and shows an estimated "fair price".

---

## Getting Started

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app). To get it running, you first need to fix a conflict in the project structure and configure the necessary API keys.

### 1. Prerequisites

- [Node.js](https://nodejs.org/) (which includes `npm`) installed on your machine.
- A running instance of the [backend service](../backend) on `http://localhost:8080`.
- A valid **Google Maps API Key** from the [Google Cloud Console](https://cloud.google.com/maps-platform/).

### 2. Initial Setup: Fix `index.html`

The default `public/index.html` contains a separate static website that conflicts with the React application. You must replace its content.

**Replace the entire content of `packages/frontend/public/index.html` with the following:**
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <link rel="icon" href="%PUBLIC_URL%/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#000000" />
    <meta
      name="description"
      content="FairRide - Compare cab fares"
    />
    <link rel="apple-touch-icon" href="%PUBLIC_URL%/logo192.png" />
    <link rel="manifest" href="%PUBLIC_URL%/manifest.json" />
    <title>FairRide App</title>
    <!-- Config file for API Keys -->
    <script src="%PUBLIC_URL%/config.js"></script>
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
  </body>
</html>
```

### 3. Configure API Key

The application needs your Google Maps API key to work.

**Create a new file named `config.js` inside the `packages/frontend/public/` directory and add the following content:**

```javascript
// public/config.js
window.config = {
  googleMapsApiKey: "YOUR_GOOGLE_MAPS_API_KEY_HERE"
};
```
**Important:** Replace `"YOUR_GOOGLE_MAPS_API_KEY_HERE"` with your actual API key.

### 4. Install Dependencies

Navigate to this directory in your terminal and run:

```sh
npm install
```

### 5. Run the Application

After completing the setup, you can start the development server:

```sh
npm start
```
*(Note: `npm start` is an alias for `npm run dev` as defined in `package.json`)*

This will open the application in your browser, usually at [http://localhost:3000](http://localhost:3000). The page will reload as you make edits.
