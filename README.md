# Voyage Tasks

Welcome to the `voyage-tasks` project! This README serves as the central guide for understanding, running, and contributing to the project. A well-maintained README is as crucial to a project's success as the code itself, so we encourage you to treat this document with the same care.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [How to Run the Application](#how-to-run-the-application)
3. [Environment Setup](#environment-setup)
4. [Database Setup and Prisma Migrations](#database-setup-and-prisma-migrations)
5. [Team Documents](#team-documents)
6. [Our Team](#our-team)

---

## Project Overview

<img src='public/assets/images/coverSippy.png' with='auto' />

preview on [figma](https://www.figma.com/proto/WXv61LBeFxIKHLu8qH2EVp/Sippy?node-id=229-2860&node-type=frame&t=g7scVLUxAPK4Gljo-1&scaling=min-zoom&content-scaling=fixed&page-id=1%3A37893&starting-point-node-id=223%3A1089)

The `voyage-tasks` project is developed by a collaborative team within the Chingu Community. This project aims to streamline task management with features for scheduling appointments, tracking progress, and managing user information. The project is structured using Docker and Prisma for database management, with a backend API developed in Next.js to handle user requests and appointments.

For more insights into writing a great README, refer to this article by an experienced Chingu member: [Keys to a well-written README](https://tinyurl.com/yk3wubft).

### How to Run the Application

---

Follow these steps to set up and run the application locally:

1. **Install Dependencies**

   First, install the required dependencies by running:

   ```bash
   npm install
   ```

2. **Run Docker Compose**

   Ensure Docker is installed and running on your machine. Navigate to the root of the project directory and execute:

   ```bash
   docker-compose up -d
   ```

   This command will start a PostgreSQL database as defined in `docker-compose.yml` with persistent storage, ensuring data retention across restarts.

3. **Set Up Environment Variables**

   In the root directory, create a `.env` file with the following content:

   ```env
   DATABASE_URL="postgresql://docker:docker@localhost:5432/apisippy"
   ```

   Ensure that `DATABASE_URL` matches the credentials and database settings configured in `docker-compose.yml`.

   Create a environment variable called `AUTH_SECRET` and assign some string (any string) to it.
   This is used by NextAuth to generate a token.

   ### Google Maps

   To enable address autocomplete functionality, you need to set up a Google API key and assign it to an environment variable named `GOOGLEMAPS_API_KEY`. This key is required for using the Google Places API to fetch address suggestions. Click [here](https://developers.google.com/maps/documentation/places/web-service/get-api-key) for instructions on how to obtain the key.

   To render the map, you'll need an environment variable that is available on the client side. Create `NEXT_PUBLIC_GOOGLEMAPS_API_KEY` and use the same value as your Google Maps API key.

   In your Google console, ensure that the `Places`, `PlacesDetails`, `Directions` APIs are switched on.

   ### For mock e-mail functionality using Ethereal:

   - Create a free account at https://ethereal.email/
   - Copy credentials (user, password and host) and paste them into the appropriate environment variables:
     `SMTP_HOST=smtp.ethereal.email` (or whatever ethereal indicates)
     `SMTP_USER=<copy from ethereal>`
     `SMTP_PASSWORD=<copy from ethereal>`
     `SMTP_FROM="'Admin' <admin@sippy.com>"`

   ### Admin Access

   - Supply your own custom values for the environment variables `ADMIN_USERNAME` `ADMIN_PASSWORD`.

4. **Generate Prisma Client**

   To generate the Prisma client based on the defined schema, run:

   ```bash
   npm run prisma:generate
   ```

5. **Run Prisma Migrations**

   Apply migrations to the PostgreSQL database to set up the initial schema:

   ```bash
   npm run prisma:migrate
   ```

   This command will create tables and relationships as specified in `prisma/schema.prisma`.

6. **Start the Development Server**

   Finally, start the Next.js development server:

   ```bash
   npm run dev
   ```

   The application should now be running locally. Visit [http://localhost:3000](http://localhost:3000) to view the project in your browser.

## oAuth

### Google

1. Sign up for Google Cloud and navigate to your console https://console.cloud.google.com/
2. Create an oAuth consent screen
3. The Callback url for dev is `http://localhost:3000/api/auth/callback/google`
4. Copy your Google clientID and secret to the `.env`

### Github

1. Sign up for Github oAuth in Settings / Developer Settings
2. Enter relavent app details
3. The Callback url for dev is `http://localhost:3000/api/auth/callback/github`
4. Generate a secret and copy and paste ID and secret to appropriate `.env` variable

## Environment Setup

To ensure a consistent development experience, configure the following:

1. **Node.js & npm**: Make sure Node.js and npm are installed on your machine.
2. **Docker**: Required for containerizing the PostgreSQL database.
3. **Environment Variables**: Configure the `.env` file as described above.

---

## Database Setup and Prisma Migrations

This project uses **Prisma** as the ORM and **PostgreSQL** as the database. Here are the main steps:

1. **Define Services** in `docker-compose.yml` for containerized environments, with PostgreSQL setup using the Bitnami PostgreSQL image and persistent storage.
2. **Prisma Scripts**: Scripts for Prisma (`prisma:generate`, `prisma:migrate`, and `prisma:deploy`) are added to the `package.json` for easy schema management and migrations.
3. **Database Schema**: The schema includes tables like `users`, `resident_requests`, `addresses`, and `time_slots`, all with defined relationships and constraints.

## E-mail mocking using Ethereal

Review the FAQ https://ethereal.email/faq

- All e-mails sent by our service are mocked and will be intercepted by Ethereal.
- Log into your Ethereal mailbox to inspect the e-mails.

## Giving users admin access

- You can upgrade users to admin status by having them enter the credentials in the `Admin Tool`.
- Click on `ADMIN TOOL` on the home page (it is at the buttom in the footer, note: this is only visible for users who have a session and are NOT already admins).
- A credentials page will be displayed, allowing them to enter the admin username and password.
- If successful, their `isAdmin` flag will be set to `true`, and they will be directed to the dashboard.

## Our Team

Meet our awesome team! Everyone has added their GitHub and LinkedIn profiles for easy access.

- **Suruchi Patki**: [GitHub](https://github.com/Supatki) / [LinkedIn](https://www.linkedin.com/in/suruchi-patki-b0710b195/)
- **David Eastmond**: [GitHub](https://github.com/davideastmond) / [LinkedIn](https://www.linkedin.com/in/david-eastmond-2783ab18a/)
- **Mahyar Erfanian**: [GitHub](https://github.com/Mahyar-98) / [LinkedIn](https://www.linkedin.com/in/mahyar-erfanian-67968279/)
- **Franklin Macedo**: [GitHub](https://github.com/frankdias92) / [LinkedIn](https://linkedin.com/in/franklin-md)
- **Nandor Nagy**: [GitHub](https://github.com/n3ndor) / [LinkedIn](https://www.linkedin.com/in/nandornagylinked/)
- **Eoin McDonnell**: [GitHub](https://github.com/oldmcdonnell) / [LinkedIn](https://www.linkedin.com/in/mcdonnell-eoin/)

---

## Additional Notes

This project is built and maintained as part of the Chingu Community. We're constantly learning, adapting, and collaborating, so expect more updates and enhancements as we progress. We welcome feedback, contributions, and suggestions.

---

- Suruchi Patki: [GitHub](https://github.com/Supatki) / [LinkedIn](https://www.linkedin.com/in/suruchi-patki-b0710b195/)
- David Eastmond: [GitHub](https://github.com/davideastmond) / [LinkedIn](https://www.linkedin.com/in/david-eastmond-2783ab18a/)
- Mahyar Erfanian: [GitHub](https://github.com/Mahyar-98) / [LinkedIn](https://www.linkedin.com/in/mahyar-erfanian-67968279/)
- Franklin Macedo: [GitHub](https://github.com/frankdias92) / [LinkedIn](https://linkedin.com/in/franklin-md)
- Nandor Nagy: [GitHub](https://github.com/n3ndor) / [LinkedIn](https://www.linkedin.com/in/nandornagylinked/)
- Eoin McDonnell [GitHub](https://github.com/oldmcdonnell) / [LinkedIn](https://www.linkedin.com/in/mcdonnell-eoin/)...

## Future Contributions

As the project evolves, additional features, components, and updates will be documented here. Stay tuned for more detailed posts as we continue building together!
