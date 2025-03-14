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
  test("200: responds with an object detailing the documentation for each endpoint", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toEqual(endpointsJson);
      });
  });
});

describe("GET /api/topics", () => {
  test("200: responds with an object that has a key called topics, value of which is an object of all topics available", () => {
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
  test("404: responds with an error when an invalid request had been made to the endpoint", () => {
    return request(app)
      .get("/api/cola")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not found");
      });
  });
});

describe("GET /api/articles/:article_id", () => {
  test("200: responds with a specific object with a requested id", () => {
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
          comment_count,
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
        expect(response.body.article).toHaveProperty("comment_count");
        expect(typeof comment_count).toBe("number");
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
  test("200: responds with an array of article objects, that are sorted in descending order by created_at", () => {
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
  test("404: responds with an error when a request to an invalid endpoint has been made", () => {
    return request(app)
      .get("/api/articlez")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not found");
      });
  });
  test("200: responds with an array of article objects that are sorted by authors and order is descending", () => {
    return request(app)
      .get("/api/articles?sort_by=author&order=desc")
      .expect(200)
      .then((response) => {
        const articlesArray = response.body.articles;
        expect(articlesArray).toBeSortedBy("author", { descending: true });
      });
  });
  test("200: responds with an array of article objects that are sorted by title and order is ascending", () => {
    return request(app)
      .get("/api/articles?sort_by=title&order=asc")
      .expect(200)
      .then((response) => {
        const articlesArray = response.body.articles;
        expect(articlesArray).toBeSortedBy("title", { descending: false });
      });
  });
  test("200: responds with an array of article objects that are sorted by created_at and order is descending when sort_by query is missing", () => {
    return request(app)
      .get("/api/articles?order=asc")
      .expect(200)
      .then((response) => {
        const articlesArray = response.body.articles;
        expect(articlesArray).toBeSortedBy("created_at", { descending: false });
      });
  });
  test("400:responds with an error when query has an invalid value for sort_by", () => {
    return request(app)
      .get("/api/articles/?sort_by=banana&order=desc")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  test("400: responds with an error when query has an invalid value for order", () => {
    return request(app)
      .get("/api/articles/?sort_by=title&order=distance")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  test("200: responds with an array of article objects that are sorted by specific topic", () => {
    return request(app)
      .get("/api/articles?topic=mitch")
      .expect(200)
      .then((response) => {
        const articlesArray = response.body.articles;
        expect(articlesArray).toBeSortedBy("topic", { descending: true });
      });
  });
  test("404: responds with an error when query has an invalid value for topic", () => {
    return request(app)
      .get("/api/articles?topic=dancetillyoucan't")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not found");
      });
  });
  test("400: responds with an error when query has invalid characters", () => {
    return request(app)
      .get("/api/articles?thadfhdfh")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
});

describe("POST /api/articles", () => {
  test("200: responds with the newly added article", () => {
    return request(app)
      .post("/api/articles")
      .send({
        author: "butter_bridge",
        title: "I enjoy sailing my 200 metre yacht",
        body: "It costed me around 2 million quid..I guess I can allow myself a treat from time to time",
        topic: "cats",
        article_img_url:
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
      })
      .expect(201)
      .then((response) => {
        const {
          author,
          body,
          title,
          topic,
          article_img_url,
          comment_count,
          created_at,
          votes,
          article_id,
        } = response.body.newArticle;
        expect(comment_count).toBe(0);
        expect(author).toBe("butter_bridge");
        expect(title).toBe("I enjoy sailing my 200 metre yacht");
        expect(body).toBe(
          "It costed me around 2 million quid..I guess I can allow myself a treat from time to time"
        );
        expect(topic).toBe("cats");
        expect(article_img_url).toBe(
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
        );
        expect(typeof comment_count).toBe("number");
        expect(typeof created_at).toBe("string");
        expect(typeof votes).toBe("number");
        expect(typeof article_id).toBe("number");
      });
  });
  test("400: responds with an error when any of the keys are missing", () => {
    return request(app)
      .post("/api/articles")
      .send({
        author: "butter_bridge",
        title: "title-eliminator",
        topic: "cats",
        article_img_url:
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid request");
      });
  });
  test("400: responds with an error when the author in send request doesn't exist", () => {
    return request(app)
      .post("/api/articles")
      .send({
        author: "moy_bratanchik_rodya",
        title: "Boxing Day",
        body: "I did boxing when I was a little boy",
        topic: "mitch",
        article_img_url:
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid request");
      });
  });
  test("404: responds with an error when the topic in send request doesn't exist", () => {
    return request(app)
      .post("/api/articles")
      .send({
        author: "icellusedkars",
        title: "Boxing Day",
        body: "I did boxing when I was a little boy",
        topic: "nocik",
        article_img_url:
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
      })
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
  test("400: responds with an error when inc_votes key is missing from request", () => {
    return request(app)
      .patch("/api/articles/3")
      .send({})
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

describe("GET /api/users", () => {
  test("200: responds with an array of users objects", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then((response) => {
        const usersArray = response.body.users;
        expect(usersArray.length > 0).toBe(true);
        usersArray.forEach((user) => {
          const { username, name, avatar_url } = user;
          expect(typeof username).toBe("string");
          expect(typeof name).toBe("string");
          expect(typeof avatar_url).toBe("string");
        });
      });
  });
  test("404: responds with an error when a request to an invalid endpoint has been made", () => {
    return request(app)
      .get("/api/userzz")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not found");
      });
  });
});

describe("GET /api/users/:username", () => {
  test("200: responds with an object of user that has username provided", () => {
    return request(app)
      .get("/api/users/rogersop")
      .expect(200)
      .then((response) => {
        const { name, username, avatar_url } = response.body.user;
        expect(name).toBe("paul");
        expect(username).toBe("rogersop");
        expect(avatar_url).toBe(
          "https://avatars2.githubusercontent.com/u/24394918?s=400&v=4"
        );
      });
  });
  test("404: responds with an error when the username provided doesn't exist", () => {
    return request(app)
      .get("/api/users/rodion_bratanchik")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not found");
      });
  });
  test("400: responds with an error when the username provided has no letters", () => {
    return request(app)
      .get("/api/users/234423")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid request");
      });
  });
  test("400: responds with an error when the username provided starts with non-alphabetic value", () => {
    return request(app)
      .get("/api/users/2sonya_barambonya")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid request");
      });
  });
});

describe("PATCH /api/comments/:comment_id", () => {
  test("200: responds with an object of comment with relevant comment_id of and inc_votes key passed has a postiive number", () => {
    return request(app)
      .patch("/api/comments/3")
      .send({ inc_votes: 23 })
      .expect(200)
      .then((response) => {
        const { article_id, comment_id, body, votes, author, created_at } =
          response.body.newComment;
        expect(votes).toBe(123);
        expect(comment_id).toBe(3);
        expect(typeof article_id).toBe("number");
        expect(typeof body).toBe("string");
        expect(typeof author).toBe("string");
        expect(typeof created_at).toBe("string");
      });
  });
  test("200: responds with an object of comment with relevant comment_id of and inc_votes key passed has a negative number", () => {
    return request(app)
      .patch("/api/comments/3")
      .send({ inc_votes: -200 })
      .expect(200)
      .then((response) => {
        const { article_id, comment_id, body, votes, author, created_at } =
          response.body.newComment;
        expect(votes).toBe(-100);
        expect(comment_id).toBe(3);
        expect(typeof article_id).toBe("number");
        expect(typeof body).toBe("string");
        expect(typeof author).toBe("string");
        expect(typeof created_at).toBe("string");
      });
  });
  test("404: responds with an error when a comment_id provided is a valid value but doesn't exist", () => {
    return request(app)
      .patch("/api/comments/4444")
      .send({ inc_votes: 12 })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not found");
      });
  });
  test("400: responds with an error when a comment_id provided has a non-numeric value", () => {
    return request(app)
      .patch("/api/comments/wabalabadabdab")
      .send({ inc_votes: 10 })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid request");
      });
  });
  test("400: responds with an error when inc_votes key in request has a non-numeric value", () => {
    return request(app)
      .patch("/api/comments/3")
      .send({ inc_votes: "funny cat videos" })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid request");
      });
  });
  test("400: responds with an error when inc_votes key is missing from request", () => {
    return request(app)
      .patch("/api/comments/3")
      .send({})
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid request");
      });
  });
});
