# FairRide Frontend

This document provides an overview of the changes made to the FairRide frontend application.

## UI Redesign: Black and White Theme

The entire UI of the application has been redesigned with a modern and user-friendly black and white theme. This includes the following pages:

-   **Dashboard (`dashboad.html`)**: The dashboard has been updated with a dark background, white text, and green accents for a visually appealing and easy-to-read layout.
-   **Index (`index.html`)**: The main landing page has been updated to match the new black and white theme, providing a consistent user experience.
-   **History (`history.html`)**: The trip history page now follows the new theme, with improved readability for the trip data.
-   **About (`about.html`)**: The about page has been restyled to match the new theme.
-   **Profile (`profile.html`)**: The user profile page has been updated with the new theme.
-   **Admin (`admin.html`)**: The admin panel has also been updated with the new theme for a consistent experience.
-   **Main Application (`App.js`)**: The main React component has been updated to use the new theme. The `react-bootstrap` components have been replaced with standard HTML elements and styled with the new black and white theme.

## Dependency Changes

The following dependencies have been removed from the `package.json` file:

-   `bootstrap`
-   `react-bootstrap`

This was done to remove the unused bootstrap styles and use the new custom theme.

## How to Run the Application

To run the application, please follow these steps:

1.  Navigate to the `packages/frontend` directory.
2.  Install the dependencies by running the following command:
    ```
    npm install
    ```
3.  Start the development server:
    ```
    npm run dev
    ```
4.  Open your browser and navigate to `http://localhost:3000` to see the application.
