<h1 align="center" id="title">Mini Job Board</h1>

<p align="center"><img src="public/img.png" alt="project-image"></p>

<p id="description">A simple job board web application built with Next.js PostgreSQL Prisma and TailwindCSS. that connects talented professionals with employment opportunities.</p>

<h2>🚀 Demo</h2>

[https://mini-job-board-five.vercel.app/](https://mini-job-board-five.vercel.app/)
  
  
<h2>🧐 Features</h2>

Here're some of the project's best features:

*   Public Job Listings Page: Displays all job posts with details (title company location job type description) fetched from a PostgreSQL database.
*   Authentication: Implements email/password authentication using JWT (JSON Web Tokens).
*   Filter jobs by type (Full-time Part-time Contract Remote)
*   Job listing cards with company location job type and posting date
*   Job search functionality
*   Admin Dashboard: Allows logged-in users to add and delete job postings.
*   Responsive design for all device sizes

<h2>🛠️ Installation Steps:</h2>

<p>1. Clone the Repository:</p>

```
git clone https://github.com/sandundil2002/Mini_Job_Board.git
```

<p>2. Install Dependencies:</p>

```
npm install
```

<p>3. Create a PostgreSQL database named jobboard &amp; implement the .env file with your database URL and JWT secret:</p>

```
DATABASE_URL="postgresql://username:password@localhost:5432/jobboard?schema=public"
JWT_SECRET=your-secret-key
```

<p>4. Run Prisma Migrations: </p>

```
npx prisma db push
```

<p>5. Generate Prisma Client:</p>

```
npx prisma generate
```

<p>6. Start the Development Server:</p>

```
npm run dev
```

<p>7. The app will be available at:</p>

```
http://localhost:3000
```
  
  
<h2>💻 Built with</h2>

Technologies used in the project:

*   Next.js: React framework for server-side rendering and API routes.
*   PostgreSQL: Database for storing users and jobs.
*   Prisma: ORM for database interactions.
*   TailwindCSS: Utility-first CSS framework for styling.
*   JWT: Used for authentication.
*   TypeScript: For type safety and better development experience.
