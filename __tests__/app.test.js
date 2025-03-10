const endpointsJson = require("../endpoints.json");
/* Set up your test imports here */
const request = require("supertest");
const app = require("../app.js");
const db = require("../db/connection.js");
const seed = require("../db/seeds/seed.js");
const data = require("../db/data/test-data");
/* Set up your beforeEach & afterAll functions here */

beforeEach(() => {
  return seed(data);
});
afterAll(() => {
  return db.end();
});

describe("GET /api", () => {
  test("200: Responds with an object detailing the documentation for each endpoint", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toEqual(endpointsJson);
      });
  });
});

describe("GET /api/topics", () => {
  test("200: Responds with an object that has a key called topics, value of which is an object of all topics available", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then((response) => {
        const topicsArray = response.body.topics;
        expect(topicsArray.length > 0).toBe(true);
        topicsArray.forEach((topic) => {
          const { slug, description, img_url } = topic;
          expect(typeof slug).toBe("string");
          expect(typeof description).toBe("string");
          expect(typeof img_url).toBe("string");
        });
      });
  });
  test("GET /api/topicz, 404: responds 404 when an invalid request had been made to the endpoint", () => {
    return request(app)
      .get("/api/cola")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not found");
      });
  });
});

describe("GET /api/articles/:article_id", () => {
  test("200: Responds with a specific object with a requested id", () => {
    return request(app)
      .get("/api/articles/3")
      .expect(200)
      .then((response) => {
        const {
          author,
          title,
          article_id,
          body,
          topic,
          created_at,
          votes,
          article_img_url,
        } = response.body.article;
        expect(article_id).toBe(3);
        expect(author).toBe("icellusedkars");
        expect(title).toBe("Eight pug gifs that remind me of mitch");
        expect(body).toBe("some gifs");
        expect(topic).toBe("mitch");
        expect(created_at).toBe("2020-11-03T09:12:00.000Z");
        expect(votes).toBe(0);
        expect(article_img_url).toBe(
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
        );
      });
  });
  test("404: responds with an error if the article doesn't exist by provided value", () => {
    return request(app)
      .get("/api/articles/2129")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not found");
      });
  });
  test("400: responds with an error if instead of numeric value provided a non-existent path", () => {
    return request(app)
      .get("/api/articles/universeexplosion")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid request");
      });
  });
});
