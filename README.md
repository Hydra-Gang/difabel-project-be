# About
Backend of the difabel project. This project is using the project template from BNCC@Bandung RnD division.

## Dependencies
1. [express](https://www.npmjs.com/package/express) <br>
   * Node.js backend framework.
   * Extra note, `body-parser` is already built-in to this package (ex: `express.json()`) so you don't need to install it.
1. [cors](https://www.npmjs.com/package/cors) <br>
   * Middleware to enable CORS (Cross-origin resource sharing).
   * Allows the frontend devs to access the backend.
1. [helmet](https://www.npmjs.com/package/helmet)
   * Secures the backend HTTP headers.
   * It doesn't protect you from literally everything, but at least there's something.
1. [http-status-codes](https://www.npmjs.com/package/http-status-codes) <br>
   * To avoid _magic numbers_ and use constants enum, ex: using `BAD_REQUEST` instead of `400`.
1. [joi](https://www.npmjs.com/package/joi) <br>
   * Library for validating JSON, making it easy to make sure all (or certain) properties exists and valid.
1. [luxon](https://www.npmjs.com/package/luxon) <br>
   * Better date and time library than the default `Date` from JS.
   * Why not `momentjs`? It has stopped it's development, [check here](https://momentjs.com/docs/#/-project-status/).
1. [pg](https://www.npmjs.com/package/pg) <br>
   * PostgreSQL database for our backend projects, although we won't be using this directly, but through `typeorm`.
1. [typeorm](https://www.npmjs.com/package/typeorm) <br>
   * ORM (Object-relational mapping) library for Node.js.
   * Helps us to access the database without a need to write SQL queries.
     * It can prevent typos in SQL query.
     * It can make cleaner codes, thus more readable.
     * It's perfect for TypeScript users.
1. [bcrypt](https://www.npmjs.com/package/bcrypt) <br>
   * Securing passwords easily, it hashes and also adds salt to it.
   * It's a bad practice to store passwords in plain-text, [this forum explains why it's bad](https://security.stackexchange.com/q/120540).
1. [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken) <br>
    * Token based user authentication, we need to know whether user is logged in or not.
    * It's [more secure](https://stackoverflow.com/a/38855050) when compared to _Cookie and Session_.

## Quick Start
1. Make sure you have installed [yarn](https://classic.yarnpkg.com/lang/en/) and [PostgreSQL](https://www.postgresql.org/download/).
1. Clone the repo
   ```sh
   git clone https://github.com/Hydra-Gang/difable-project-be.git
   ```
1. Install the dependencies
   ```sh
   yarn install
   ```
1. Duplicate the `.env.example` file to `.env` and fill the database credentials
1. Generate JWT secrets
   ```sh
   yarn jwt:generate
   ```
1. Run the dev server
   ```sh
   yarn auto
   ```

## Project Structure
```
<your project>\
 |--scripts\             # User scripts for automating
 |--src\                 # Source folder
     |--configs\         # Application configs
     |--controllers\     # Route controllers
     |--decorators\      # Custom decorators
     |--entities\        # Database models/entities (represents table)
     |--middlewares\     # Custom middlewares
     |--routes\          # Server routes, provides automatic routing
     |--typings\         # Custom types/interface for type assertion
     |--utils\           # Utility classes and functions
         |--api.util.ts  # Server response utility
     |--validations\     # Schemas for validating JSON
     |--app.ts           # Express app and it's configuration
     |--ormconfig.ts     # TypeORM config
     |--server.ts        # Program entry point (db connection is also here)
 |--.eslintrc.json       # ESLint config
 |--tsconfig.json        # TypeScript compiler config
 |--...
```

## Commands
Running:
```sh
# compiles the project to `dist` directory
yarn compile

# diagnose the TS compiler
yarn compile:debug

# starts the program (must be compiled first)
yarn start

# automatically compiles and starts the program (not used in production)
yarn auto
```

Cleans the compiled files (in `dist` directory):
```sh
yarn clean
```

Linting:
```sh
# runs ESLint to `src` directory
yarn lint

# fixes ESLint errors (for fixable errors only)
yarn lint:fix
```

TypeORM:
```sh
# shows TypeORM commands
yarn typeorm -h

# example: shows the migration status
yarn typeorm migration:show
```

JSONWebToken:
```sh
# generate JWT secrets (both access and refresh secrets)
yarn jwt:generate
```

## Environment Variables
Found in the `.env` file
```sh
# the JWT secrets
JWT_ACCESS_SECRET=
JWT_REFRESH_SECRET=

# the postgres database credentials
DB_HOST=
DB_DATABASE=
DB_USERNAME=
DB_PASSWORD=
```