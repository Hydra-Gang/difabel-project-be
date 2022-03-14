# About
This is the standard template for creating **Backend** applications. The template itself is a **To-Do List** REST API for you to see how to apply the tools and libraries provided.

But it's not complete? Yep, that is on purpose since I can't cover everything and will instead make it more complicated for you to understand. Therefore, the rest of it is up to you :)

## Dependencies
1. [express](https://www.npmjs.com/package/express) <br>
   * Node.js backend framework.
   * `body-parser` is already built-in to this package (ex: `express.json()`).
2. [cors](https://www.npmjs.com/package/cors) <br>
   * Express middleware used to enable CORS (Cross-origin resource sharing).
   * TLDR: Allows the frontend guys to access the backend.
3. [http-status-codes](https://www.npmjs.com/package/http-status-codes) <br>
   * To avoid _magic numbers_ and use constants enum, ex: using `BAD_REQUEST` instead of `400`.
4. [joi](https://www.npmjs.com/package/joi) <br>
   * JSON validation library.
   * Making it easy to make sure all (or certain) properties exists and valid.
5. [luxon](https://www.npmjs.com/package/luxon) <br>
   * TLDR: Library that provides better date and time than default `Date` from JS.
   * Why not `momentjs`? It has stopped it's development, [check here](https://momentjs.com/docs/#/-project-status/).
6. [pg](https://www.npmjs.com/package/pg) <br>
   * PostgreSQL database library for Node.js.
   * We use PostgreSQL as our main DBMS.
7. [typeorm](https://www.npmjs.com/package/typeorm) <br>
   * ORM (Object-relational mapping) library for Node.js.
   * Helps us to access the database without a need to write SQL queries.
     * It can prevent typos in SQL query.
     * It can make cleaner codes, thus more readable.
     * It's perfect for TypeScript users.
8. [bcrypt](https://www.npmjs.com/package/bcrypt) <br>
   * To hash password, add salt to it, and also verify the hashed passwords easily.
   * It's a bad practice to store passwords in plain-text, [this forum explains why it's bad](https://security.stackexchange.com/q/120540).
9. [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken) <br>
    * For user authentication, like so we can tell whether a user is logged-in or not.
    * There are other methods like _Cookies_ and _Sessions_, [but this is more secure](https://stackoverflow.com/a/38855050).

## Usage
1. Clone the template using git.
   ```sh
   git clone https://github.com/BNCC-Bandung/project-template.git -b backend <project-name>
   ```
2. Remove the `.git` folder after you've cloned it to disconnect from the this repo.
3. Install the packages using [yarn](https://classic.yarnpkg.com/lang/en/).
   ```sh
   yarn install
   ```
4. Edit the `package.json` and fill blank fields.
   ```jsonc
   {
       "name": "",           // project name (lowercase and separate with '-').
       "version": "",        // project version (use semantic versioning).
       "description": "",    // describe the project.
       "author": "",         // who creates the project? (use "collaborator" if more than 1).
       ...
   }
   ```

## Commands
Running:
```sh
# compiles the project to `dist` directory
yarn compile

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
yarn lint --fix
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
yarn generate:jwt
```

## Environment Variables
Found in the `.env` file
```sh
# the JWT access secret
JWT_ACCESS_SECRET=
# the JWT refresh secret
JWT_REFRESH_SECRET=
```

## Project Structure
```
<project>\
 |-scripts\             # User scripts for automating
 |-src\                 # Source folder
    |--controllers\     # Route controllers
    |--entities\        # Database models / entities (represents table)
    |--middlewares\     # Custom middlewares
    |--routes\          # Routes
        |--index.ts     # Responsible for routing all routes
    |--utils\           # Utility classes and functions
        |--api.util.ts  # Server response utility
    |--validations\     # Request data validation schemas
    |--app.ts           # Express app and it's configuration
    |--server.ts        # Program entry point (db connection is also here)
 |-.eslintrc.json       # ESLint config
 |-ormconfig.json       # TypeORM config (database credentiails)
 |-tsconfig.json        # TypeScript compiler config
 |-...
```