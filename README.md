## Getting Started

### Database Setup

First, set up a PostgreSQL database using one of these options:

-   Start a PostgreSQL instance in Docker:
    ```bash
    docker run --name postgres -e POSTGRES_PASSWORD=mysecretpassword -p 5432:5432 -d postgres
    ```
-   Or grab a free PostgreSQL database instance from [Aiven](https://aiven.io/postgresql) or [Neon](https://neon.tech/)

### Environment Configuration

Copy the example environment file and configure your environment variables:

```bash
cp .env.example .env
```

Edit the `.env` file and add the required variables, especially your database connection string.

### Database Migration

Run the Prisma migration to set up your database schema:

```bash
yarn prisma migrate dev
```

### Starting the Development Server

Run the development server:

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Testing

For testing purposes, you can use the following credentials:

```bash
Email: zydova2236@dropjar.com
Password: password
```
