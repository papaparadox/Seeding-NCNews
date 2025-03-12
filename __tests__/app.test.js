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
  test("404: responds 404 when an invalid request had been made to the endpoint", () => {
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

describe("GET /api/articles", () => {
  test("200: Responds with an array of objects, that are sorted in descending order", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((response) => {
        const articlesArray = response.body.articles;
        expect(articlesArray.length > 0).toBe(true);
        expect(articlesArray).toBeSortedBy("created_at", { descending: true });
        articlesArray.forEach((article) => {
          const {
            author,
            title,
            article_id,
            topic,
            created_at,
            votes,
            article_img_url,
            comment_count,
          } = article;
          expect(typeof author).toBe("string");
          expect(typeof title).toBe("string");
          expect(typeof article_id).toBe("number");
          expect(typeof topic).toBe("string");
          expect(typeof created_at).toBe("string");
          expect(typeof votes).toBe("number");
          expect(typeof article_img_url).toBe("string");
          expect(typeof comment_count).toBe("number");
          expect(article).not.toHaveProperty("body");
        });
      });
  });
  test("404: responds 404 when a request to an invalid endpoint has been made", () => {
    return request(app)
      .get("/api/articlez")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not found");
      });
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  test("200: responds with an array of comments for the given article_id", () => {
    return request(app)
      .get("/api/articles/3/comments")
      .expect(200)
      .then((response) => {
        const commentsArray = response.body.comment;
        expect(commentsArray.length > 0).toBe(true);
        expect(commentsArray).toBeSortedBy("created_at", { descending: true });
        commentsArray.forEach((comment) => {
          const { comment_id, votes, created_at, author, body, article_id } =
            comment;
          expect(article_id).toBe(3);
          expect(typeof comment_id).toBe("number");
          expect(typeof votes).toBe("number");
          expect(typeof created_at).toBe("string");
          expect(typeof author).toBe("string");
          expect(typeof body).toBe("string");
          expect(typeof article_id).toBe("number");
        });
      });
  });
  test("404: responds with an error if the article doesn't exist by provided value", () => {
    return request(app)
      .get("/api/articles/2128/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not found");
      });
  });
  test("400: responds with an error if instead of numeric value provided a non-existent path", () => {
    return request(app)
      .get("/api/articles/banana/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid request");
      });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  test("201: responds with a posted comment", () => {
    return request(app)
      .post("/api/articles/2/comments")
      .send({
        username: "butter_bridge",
        body: "serendipity is real",
      })
      .expect(201)
      .then((response) => {
        const { comment_id, article_id, body, votes, author, created_at } =
          response.body.newComment;
        expect(typeof comment_id).toBe("number");
        expect(article_id).toBe(2);
        expect(body).toBe("serendipity is real");
        expect(votes).toBe(0);
        expect(author).toBe("butter_bridge");
        expect(typeof created_at).toBe("string");
      });
  });
  test("400: responds with an error when body key is missing from request", () => {
    return request(app)
      .post("/api/articles/3/comments")
      .send({ username: "lurker" })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid request");
      });
  });
  test("404: responds with an error if the article doesn't exist by provided value", () => {
    return request(app)
      .post("/api/articles/200/comments")
      .send({ username: "butter_bridge", body: "nice one!" })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not found");
      });
  });
  test("400: responds with an error if the article_id is a non-numeric value", () => {
    return request(app)
      .post("/api/articles/banana/comments")
      .send({ username: "lurker", body: "bananas are good" })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid request");
      });
  });
  test("404:responds with an error if the username provided doesn't exist", () => {
    return request(app)
      .post("/api/articles/3/comments")
      .send({ username: "tim2004", body: "bananas are good" })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not found");
      });
  });
});

describe("PATCH /api/articles/:article_id", () => {
  test("200: updates an article by votes and responds with an article that has been updated by a positive number", () => {
    return request(app)
      .patch("/api/articles/3")
      .send({ inc_votes: 5 })
      .expect(200)
      .then((response) => {
        const {
          article_id,
          title,
          topic,
          author,
          body,
          created_at,
          votes,
          article_img_url,
        } = response.body.newArticle;
        expect(votes).toBe(5);
        expect(article_id).toBe(3);
        expect(typeof author).toBe("string");
        expect(typeof title).toBe("string");
        expect(typeof article_id).toBe("number");
        expect(typeof topic).toBe("string");
        expect(typeof created_at).toBe("string");
        expect(typeof votes).toBe("number");
        expect(typeof article_img_url).toBe("string");
        expect(typeof body).toBe("string");
      });
  });
  test("200: updates an article by votes and responds with an article that has been updated by a negative number", () => {
    return request(app)
      .patch("/api/articles/3")
      .send({ inc_votes: -100 })
      .expect(200)
      .then((response) => {
        const {
          article_id,
          title,
          topic,
          author,
          body,
          created_at,
          votes,
          article_img_url,
        } = response.body.newArticle;
        expect(votes).toBe(-100);
        expect(article_id).toBe(3);
        expect(typeof author).toBe("string");
        expect(typeof title).toBe("string");
        expect(typeof article_id).toBe("number");
        expect(typeof topic).toBe("string");
        expect(typeof created_at).toBe("string");
        expect(typeof votes).toBe("number");
        expect(typeof article_img_url).toBe("string");
        expect(typeof body).toBe("string");
      });
  });
  test("400: responds with an error when inc_votes key has an invalid value", () => {
    return request(app)
      .patch("/api/articles/3")
      .send({ inc_votes: "lizard" })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid request");
      });
  });
  test("400: responds with an error if the article_id is a non-numeric value", () => {
    return request(app)
      .patch("/api/articles/wabalabadabdab")
      .send({ inc_votes: 10 })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid request");
      });
  });
  test("404: responds with an error if the article_id doesn't exist", () => {
    return request(app)
      .patch("/api/articles/2004")
      .send({ inc_votes: 23 })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not found");
      });
  });
});

describe("DELETE /api/comments/:comment_id", () => {
  test("204: comment by a specific comment id gets deleted and responds with an object having statusCode 204 and message of 'No content'", () => {
    return request(app)
      .delete("/api/comments/4")
      .expect(204)
      .then((response) => {
        expect(response.body).toEqual({});
        expect(response.res.statusMessage).toBe("No Content");
      })
      .then(() => {
        return db.query("SELECT * FROM comments WHERE comment_id = 4");
      })
      .then(({ rows }) => {
        console.log(rows);
        expect(rows.length).toBe(0);
      });
  });
  test("400: responds with an error if the comment_id is a non-numeric value", () => {
    return request(app)
      .delete("/api/comments/solutionnotvent")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid request");
      });
  });
  test("404: responds with an error if the comment_id doesn't exist", () => {
    return request(app)
      .delete("/api/comments/4945")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not found");
      });
  });
});
