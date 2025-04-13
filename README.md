# Wise Ox Media Website

This repository contains the source code for the Wise Ox Media company website.

## Overview

Wise Ox is a digital marketing agency. This website serves as the primary online presence, showcasing services, case studies, and providing contact information.

It is built using:
*   HTML
*   CSS (Modularized)
*   JavaScript (with jQuery, Swiper.js, Lottie, Waypoints)
*   Vite (for building and development)
*   Node.js (for the contact form API backend)
*   Vercel (for deployment)

## Getting Started

### Prerequisites

*   Node.js (version 18.x or later recommended)
*   npm (usually included with Node.js)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Set up environment variables:**
    *   Copy the example environment file:
        ```bash
        cp .env.example .env
        ```
    *   Edit the `.env` file and fill in the required values (e.g., for email sending). Refer to `.env.example` for the necessary variables.

## Development

To run the website locally with hot-reloading for development:

```bash
npm run dev
```

This command starts:
*   The Vite development server for the frontend (usually on `http://localhost:5173`).
*   The Vercel development server (`vercel dev`) for the backend API functions (usually on `http://localhost:3000`).

The Vite server is configured to proxy `/api` requests to the Vercel server.

## Building for Production

To create an optimized build of the frontend assets:

```bash
npm run build
```

This command will:
*   Bundle and minify CSS and JavaScript.
*   Copy assets from the `public` directory.
*   Place the optimized files into the `dist/` directory.

The API functions (`api/**/*.js`) are serverless and do not require a separate build step; Vercel handles them during deployment.

## Deployment

This project is configured for deployment on Vercel.

1.  Connect your Git repository to a Vercel project.
2.  Configure the build settings in Vercel:
    *   **Build Command:** `npm run build`
    *   **Output Directory:** `dist`
    *   **Install Command:** `npm install`
3.  Add your environment variables (from your `.env` file) to the Vercel project settings.
4.  Deployments will typically happen automatically when changes are pushed to the main branch.

## Project Structure

```
./
├── api/              # Serverless functions (e.g., contact form)
├── css/              # Modular CSS files
├── public/           # Static assets (images, favicon) copied to dist root
│   ├── images/
│   └── favicon.ico
├── src/              # Frontend source code
│   ├── templates/    # HTML template generator functions (JS)
│   ├── styles.css    # Main CSS entry point (imports files from css/)
│   └── main.js       # Main JavaScript entry point
├── .env.example      # Example environment variables
├── .gitignore
├── contact.html      # Contact page HTML
├── case-studies.html # Case Studies page HTML
├── index.html        # Home page HTML
├── package.json
├── package-lock.json
├── vercel.json       # Vercel configuration
├── vite.config.js    # Vite configuration
└── README.md         # This file
```

## COPYRIGHT 2025 WiseOx Media
## -T.J.W