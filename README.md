# Book Store

## Getting up and running

Prerequisited:

1. Docker
2. NodeJS (development)

---

1. Starts with API's environment variables. Copy `bs-backend/.env.example` to `bs-backend/.env`.
    1. Set `JWT_SECRET` to a random value. (Something safe)
    2. for `CORS_ALLOWED_ORIGINS`, set to `*` for an easy deployment.
    3. `DB_HOST` to `localhost` for development. (for deployment, the variable will be overrided in the docker compose, so this variable doesn't have to be defined)
    4. `DB_USER`, `DB_PASSWORD`, `DB_NAME`.
2. Build and pull neccessary images.
```bash
docker compose pull
docker compose build
```
3. Get the database (PostgreSQL) up running.
```bash
docker compose up -d postgres
```
> The API is listening to port `5432`
4. Create user and table for the API in the database.
There are 3 things.
    1. Database User
    2. Database User Password
    3. Database Name

The `1.` will be the `DB_USER` in the `bs-backend/.env`.

The `2.` will be the `DB_PASSWORD` in the `bs-backend/.env`.

The `3.` will be the `DB_NAME` in the `bs-backend/.env`.

```bash
docker compose run --rm -it postgres psql -h postgres -U postgres
```
> PostgreSQL console password is `postgres`
```bash
CREATE USER "your_db_user" WITH PASSWORD 'your_db_password';
CREATE DATABASE "your_db_name";
GRANT ALL PRIVILEGES ON DATABASE "your_db_name" TO "your_db_user";
ALTER DATABASE "your_db_name" OWNER TO "your_db_user";
```
> then, press `CTRL+D` or enter `\q` to quit the console.
5. Apply migrations to the database.
```bash
docker compose run --rm api npm run db:migrate
```
6. Create an admin user.
By setting environment variables through Docker CLI `ADMIN_EMAIL` and `ADMIN_PASSWORD` for admin email and admin password, respectively.

```bash
# defaults to:
#   email:    admin@localhost
#   password: admin123
docker compose run --rm api node ./scripts/add-admin-user.js

# example: only password
docker compose run --rm -e "ADMIN_PASSWORD=very_safe_admin_password" api node ./scripts/add-admin-user.js

# example: both email and password
docker compose run --rm -e "ADMIN_EMAIL=admin@localhost" -e "ADMIN_PASSWORD=very_safe_admin_password" api node ./scripts/add-admin-user.js
```

> Emails are recommended to have top-level domain as well (e.g. `.com`, `.net`)
>
> Since the `admin@localhost` is hard-coded for an easy admin logging in for demo purpose.

7. Get the API (backend) up running.
```bash
docker compose up -d api
```
> The API is listening to port `3000`
> 
> [http://localhost:3000](http://localhost:3000)
8. Get the web (frontend) up running.
```bash
docker compose up -d frontend
```
> The API is listening to port `8000`
>
> [http://localhost:8000](http://localhost:8000)

## API Endpoints

The API endpoints and routers live in `bs-backend/src/index.ts` and every `.ts` files in the `bs-backend/src/routers`.

### Local Authorization
 - `/auth/register`: email and password must be provided to create an account, will responses with a JWT token.
 - `/auth/login`: email and password must be provided to logging in to an account, will responses with a JWT token.

### Image serving

 - `/images/<file path>`: image path must be provided, will serving an image

### Categories
 - `/categories`:
   - `GET`: responses with every category ID & name. (no books)
   - Must be an admin:
     - `POST`: any essential category information must be provided, will create a category.       
 - `/categories/<category id>`:
   - `GET`: responses with the given category information.
   - Must be an admin:
     - `PUT`: any essential category information must be provided, will update a category.
     - `DELETE`: will delete a category with a given category ID.
 - `/categories?method=search?q=<search query>`: responses with category IDs & names, which any names similiar to the `<search query>`. (no books)
 - `/categories?method=books?q=<category id>`: responses with category IDs, names, & books related to the category, which the category will be the same as given category ID.
  
### Books
 - `/books`:
   - `GET`: responses with every book information.
   - Must be an admin:
     - `POST`: any essential book information must be provided, will create a book.
 - `/books/<book id>`:
   - `GET`: responses with the given book information.
   - Must be an admin:
     - `PUT`: any essential book information must be provided, will update a book.
     - `DELETE`: a book ID must be provided, will delete a book with a given book ID.
 - `/books?method=search?q=<search query>`: responses with book informations, which any titles similiar to the `<search query>`.
 - `/books?method=newest`: responses with book informations, ordered from new to oldest.
 - `/books?method=best-selling`: responses with book informations, ordered from most sold to least sold.
 - `/books/<book id>/favorite`: must be logged in, will add the book to the user's wishlist.
 - `/books/<book id>/unfavorite`: must be logged in, will remove the book from the user's wishlist.
 - `/books/upload-cover`: must be an admin, will saves the uploaded book cover image and responses with path to the image.
  
### Cart

All endpoints related to the cart, the user must be logged in.
 - `/cart`:
   - `GET`: responses with all items and total price in the cart.
   - `POST`: add/remove an item from the cart or increase/decrease an item quanitity the cart.
 - `/checkout`: checkout the cart.

## Essential Folders
  
```
├── bs-backend: API service
│   ├── drizzle: Database migrations and Drizzle-related files
│   ├── scripts: Handy scripts for frequent operations
│   ├── src
│       ├── db: Essential database adapter for the service
│           ├── schema: Schema for the database
│       ├── passport: Essential authentication adapter for the service
│       ├── routers: Essential routers/endpoints for the service
├── bs-frontend: Web UI service
│   ├── src
│       ├── public: Neccessary assets for the website
│       ├── components: Components as building blocks for pages
│       ├── page: Pages for the website
├── docker-compose.yml: Docker compose for production deployment
```
