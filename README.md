# NC News Seeding

# NC News API

## Hosted Version

You can access the hosted version of the NC News API here: [NC News Hosted API](https://seeding-ncnews.onrender.com/api)

---

## Project Summary

NC News is a RESTful API that provides access to a database of articles, users, topics, and comments. It allows users to interact with the data by retrieving articles, posting comments, voting on articles, and more. This project serves as the backend for a news website and follows MVC (Model-View-Controller) architecture.

---

## Getting Started

### Cloning the Repository

To get a local copy of this project up and running, run the following command in your terminal:

```bash
  git clone https://github.com/papaparadox/Seeding-NCNews.git
```

### Installing Dependencies

Ensure you have [Node.js](https://nodejs.org/),[PostgreSQL](https://www.postgresql.org/), [Jest-sorted](https://www.npmjs.com/package/jest-sorted), [Supertest](https://www.npmjs.com/package/supertest), [Express](https://www.npmjs.com/package/express) installed. Then, install dependencies:

```bash
  npm install
```

---

## Setting Up the Databases

### Creating .env Files

You will need to create two `.env` files to specify the database names for development and testing:

1. Create a `.env.development` file and add:

   ```env
   PGDATABASE=nc_news
   ```

2. Create a `.env.test` file and add:

   ```env
   PGDATABASE=nc_news_test
   ```

These files ensure that the correct databases are used during development and testing.

### Seeding the Local Database

Run the following command to set up and seed your database:

```bash
  npm run setup-dbs
  npm run seed-dev
```

---

## Running Tests

To run the test suite and verify functionality, use:

```bash
  npm test
```

---

## Minimum Requirements

Ensure your environment meets the following requirements:

- **Node.js**: v18+
- **PostgreSQL**: v12+

---

## Running the Server Locally

To start the server locally, run:

```bash
  npm start
```

The server will run on `http://localhost:2309/` by default.

---

## Contributions

Contributions are welcome! Feel free to fork the repo and submit pull requests.

For any questions or issues, contact [@papaparadox](https://github.com/papaparadox).
