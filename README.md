# Northcoders News API

Hosted app version: https://news-data-app.onrender.com

Project Summary: This project allows users to access and view any given article. They can sort them and narrow the selection of aritcles according to the query.

If you want to try out my Hosted app follow the steps below:

1. Get started by heading to my Github repo: https://github.com/DarenzCustodio/NC-News

2. fork my Github repo

3. After forking, copy the HTTPS link and in your terminal you will need to clone, run:
   git clone "insert HTTPS URL"

4. You have now got a copy of my Hosted app.

How to install Dependencies:

> Dotenv (module that loads environment variables from a .env file into process.env)
>
> - To install Dotenv run :

                npm i dotenv

> express (Node.js module available through npm-registry)
>
> - To install express run:

                npm i express

> jest-sorted (allow custom matchers toBeSorted and toBeSortedBy to be used)
>
> - To install jest-sorted run :

                npm i jest-sorted

> nodemon (command-line tool that helps Node.js applications)
>
> - To install nodemon run :

                npm i nodemon

> pg (node-postgres, can store data in a PostgreSQL database)

> - To install pg run :

                npm i pg

** Having multiple .env files **

- Multiple .env files represent different environment variables

1. To create the files install "Dotenv" dependency above.

2. make a new file beginning with ".env."

3. insert "test" and "development" after the
   .env.
   (e.g. .env.test and .env.development)

4. Inside these files set PGDATABASE= to the database name

--- Minimum version of Node.js ---

- v20.7.0

--- Minimum version of Postgres ---

- 8.7.3
