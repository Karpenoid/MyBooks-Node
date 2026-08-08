
# MyBooks — Book Catalog API

A RESTful API for a personal book catalog. Manage books, genres, user bookshelves, reviews with authentication, rate-limiting and caching.

## Tech Stack
- **Runtime:** Node.js, TypeScript
- **Web framework:** Express
- **ORM:** Prisma (Postgres compatible)
- **Cache / Session:** Redis
- **API docs:** Swagger (swagger-jsdoc + swagger-ui-express)
- **Testing:** Vitest

## Key Features
- CRUD operations for books and genres
- User management and JWT authentication
- Rate-limiting via express-rate-limit
- Caching with Redis
- Personal bookshelves per user
- Reviews and ratings for books
- OpenAPI documentation via Swagger UI

## Run Locally
You need to have installed Node.js and Docker (for PostgreSQL and Redis).

1. Install dependencies
```bash
npm install
```

2. Set up environment variables
```dotenv
PORT=2000

POSTGRES_USER=mybooks_admin
POSTGRES_PASSWORD=your_password
POSTGRES_DB=mybooks_db
DB_PORT=5433
REDIS_PORT=6379

DATABASE_URL="postgresql://mybooks_admin:your_password@localhost:5433/mybooks_db?schema=public"
REDIS_URL=redis://localhost:6379

JWT_SECRET=your_own_secret_key
```

3. Start PostgreSQL and Redis
```bash
docker-compose up -d
```

4. Apply database migrations
```bash
npx prisma migrate dev --name init
```

5. Run the development server
```bash
npm run dev
```

## API Documentation
Once the server is running, explore the API via Swagger UI:
```
http://localhost:2000/api-docs/#/
```
Adjust the port if your server uses a different one.

## Testing
```bash
npm test
```