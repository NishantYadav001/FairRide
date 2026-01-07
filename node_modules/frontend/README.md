# FairRide Frontend

This is the frontend for the FairRide application. It's a static HTML, CSS, and JavaScript application that provides the user interface for comparing cab fares.

## UI Theme

The UI of the application has a modern black and white theme. The pages with this theme are:
- `index.html` (Main page)
- `dashboard.html`
- `history.html`
- `about.html`
- `profile.html`
- `admin.html`

## How it Works

The frontend communicates with the FairRide backend to fetch fare estimates. It also uses the [OpenRouteService](https://openrouteservice.org/) for geocoding addresses and getting route information.

## Running the Frontend

The frontend is a static application. You can run it by opening the `public/index.html` file in your web browser.

For the application to be fully functional, the backend server must be running. You also need to configure the OpenRouteService API key as described in the root `README.md`.