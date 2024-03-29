const db = require("../db/connection");
const request = require("supertest");
const fs = require("fs/promises");
const app = require("../app");
const endPointsFile = require("../endpoints.json");

const testdata = require("../db/data/test-data");

const seed = require("../db/seeds/seed");

beforeEach(() => {
  return seed(testdata);
});

afterAll(() => {
  return db.end();
});

describe("GET /api/topics", () => {
  test("returns status: 200 with an array of topics", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then((res) => {
        const { topic } = res.body;

        topic.forEach((topic) => {
          expect(typeof topic.description).toBe("string");
          expect(typeof topic.slug).toBe("string");
          expect(topic).toHaveProperty("slug");
          expect(topic).toHaveProperty("description");
        });
        expect(Array.isArray(topic)).toBe(true);
        expect(topic.length).toBe(3);
      });
  });
});

describe("GET /api/endpoints", () => {
  test("returns status:200 with an array of all the available endpoints", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(() => {
        let arrayOfEndPoints = Object.keys(endPointsFile);
        expect(arrayOfEndPoints).toEqual([
          "GET /api",
          "GET /api/topics",
          "GET /api/articles",
          "GET /api/articles/:article_id",
          "GET /api/articles/:article_id/comments",
          "POST /api/articles/:article_id/comments",
          "PATCH /api/articles/:article_id",
          "DELETE /api/comments/:comment_id",
          "GET /api/users",
          "GET /api/articles?topic",
        ]);
      });
  });
  test("GET:200 checking all the available endpoints include a description property", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(() => {
        let arrayOfEndPoints = Object.keys(endPointsFile);
        arrayOfEndPoints.forEach((element) => {
          expect(endPointsFile[element]).toHaveProperty("description");
        });
      });
  });
  test("dynamic test, should return the correct amount of endpoints", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then((res) => {
        const { endpoints } = res.body;

        let arrayOfEndPoints = Object.keys(endpoints);

        return fs.readFile(`./endpoints.json`, `utf-8`).then((data) => {
          const parsedData = JSON.parse(data);

          let fileEndpoints = Object.keys(parsedData);

          expect(arrayOfEndPoints.length).toEqual(fileEndpoints.length);
        });
      });
  });
});

describe("GET /api/articles/article_id", () => {
  test("returns status:200 and returns all the articles according to article_id", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then((res) => {
        const { article } = res.body;

        expect(article.title).toBe("Living in the shadow of a great man");
        expect(article.topic).toBe("mitch");
        expect(article.author).toBe("butter_bridge");
        expect(article.created_at).toBe("2020-07-09T20:11:00.000Z");
        expect(article.votes).toBe(100);
        expect(article.article_img_url).toBe(
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
        );
        expect(article.comment_count).toBe("11");
      });
  });
  test("returns status:400 with a error message when provided with non-existent article_id", () => {
    return request(app)
      .get("/api/articles/not_a_id")
      .expect(400)
      .then((res) => {
        const { msg } = res.body;

        expect(msg).toBe("Bad request");
      });
  });
  test("returns status:404 with a error message when provided with valid but non-existent article_id", () => {
    return request(app)
      .get("/api/articles/100")
      .expect(404)
      .then((res) => {
        const { msg } = res.body;

        expect(msg).toBe("Not found");
      });
  });
});

describe("GET /api/articles", () => {
  test("GET:200 and returns all data from all endpoints", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((res) => {
        const { article } = res.body;
        expect(article.length > 0).toBe(true);

        article.forEach((article) => {
          expect(article).toHaveProperty("author", expect.any(String));
          expect(article).toHaveProperty("title", expect.any(String));
          expect(article).toHaveProperty("article_id", expect.any(Number));
          expect(article).toHaveProperty("topic", expect.any(String));
          expect(article).toHaveProperty("created_at", expect.any(String));
          expect(article).toHaveProperty("votes", expect.any(Number));
          expect(article).toHaveProperty("article_img_url", expect.any(String));
          expect(article).toHaveProperty("comment_count", expect.any(String));
        });
      });
  });
  test("returns the articles sorted by date in descending order", () => {
    return request(app)
      .get("/api/articles?sort_by=created_at")
      .then((res) => {
        const { article } = res.body;

        expect(article).toBeSortedBy("created_at", {
          descending: true,
        });
      });
  });
  test("200 the number of articles associated with given topic has the correct length", () => {
    return request(app)
      .get("/api/articles?topic=mitch")
      .expect(200)
      .then((res) => {
        const { article } = res.body;

        expect(article.length === 12).toBe(true);

        article.forEach((element) => {
          expect(element).toHaveProperty("topic", "mitch");
        });
      });
  });
  test("400: returns error message when sending a get request to a topic that does not exist", () => {
    return request(app)
      .get("/api/articles?topic=not_a_topic")
      .expect(400)
      .then((res) => {
        const { msg } = res.body;
        expect(msg).toBe("Bad request");
      });
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  test("returns status: 200 and returns all comemnts on any given article ", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then((res) => {
        const { comments } = res.body;
        expect(comments.length > 0).toBe(true);

        comments.forEach((comment) => {
          expect(comment).toHaveProperty("comment_id");
          expect(comment).toHaveProperty("votes");
          expect(comment).toHaveProperty("created_at");
          expect(comment).toHaveProperty("author");
          expect(comment).toHaveProperty("body");
          expect(comment).toHaveProperty("article_id");
        });
      });
  });
  test("returns status:400 when given invalid article_id", () => {
    return request(app)
      .get("/api/articles/invalid_id/comments")
      .expect(400)
      .then((res) => {
        const { msg } = res.body;

        expect(msg).toBe("Bad request");
      });
  });
  test("returns status:200 and the comments sorted by date in descending order", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then((res) => {
        const { comments } = res.body;

        expect(comments).toBeSortedBy("created_at", {
          descending: true,
        });
      });
  });
  test("returns status:404 if the article_id is not found in the database ", () => {
    return request(app)
      .get("/api/articles/100")
      .expect(404)
      .then((res) => {
        const { msg } = res.body;

        expect(msg).toBe("Not found");
      });
  });
  test("returns status:200 If the article is valid but doesn't have any comments associated with it", () => {
    return request(app)
      .get("/api/articles/2/comments")
      .expect(200)
      .then((res) => {
        const { comments } = res.body;

        expect(comments.length).toBe(0);
      });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  test("returns status:201 and POST comment retruns all the properties of the posted object", () => {
    const addComment = {
      username: "rogersop",
      body: "testComment",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(addComment)
      .expect(201)
      .then((res) => {
        const { comment } = res.body;

        expect(comment).toHaveProperty("comment_id", 19);
        expect(comment).toHaveProperty("article_id", 1);
        expect(comment).toHaveProperty("author", "rogersop");
        expect(comment).toHaveProperty("body", "testComment");
        expect(comment).toHaveProperty("votes", 0);
        expect(comment).toHaveProperty("created_at", expect.any(String));
      });
  });
  test("returns status:404 and returns error message when posting comment to invalid article_id", () => {
    const addComment = {
      username: "rogersop",
      body: "testComment",
    };
    return request(app)
      .post("/api/articles/100/comments")
      .send(addComment)
      .expect(404)
      .then((res) => {
        const { msg } = res.body;
        expect(msg).toBe("Not found");
      });
  });
  test("returns status:400 and returns error message when posting comment to invalid article_id", () => {
    const addComment = {
      username: "rogersop",
      body: "testComment",
    };
    return request(app)
      .post("/api/articles/invalid_id/comments")
      .send(addComment)
      .expect(400)
      .then((res) => {
        const { msg } = res.body;
        expect(msg).toBe("Bad request");
      });
  });
});

describe("PATCH /api/articles/:article_id", () => {
  test("returns status:200 and updates the article votes", () => {
    const newVotes = {
      inc_votes: 1,
    };
    return request(app)
      .patch("/api/articles/1")
      .send(newVotes)
      .expect(200)
      .then((res) => {
        const { updatedArticle } = res.body;

        expect(updatedArticle).toHaveProperty("article_id", 1);
        expect(updatedArticle).toHaveProperty(
          "title",
          "Living in the shadow of a great man"
        );
        expect(updatedArticle).toHaveProperty("author", "butter_bridge");
        expect(updatedArticle).toHaveProperty("topic", "mitch");
        expect(updatedArticle).toHaveProperty(
          "body",
          "I find this existence challenging"
        );
        expect(updatedArticle).toHaveProperty("created_at", expect.any(String));
        expect(updatedArticle).toHaveProperty("votes", 101);
        expect(updatedArticle).toHaveProperty(
          "article_img_url",
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
        );
      });
  });
  test("returns status:404 and returns error message when patch request to non-existent article_id", () => {
    const newVotes = {
      inc_votes: 1,
    };
    return request(app)
      .patch("/api/articles/200")
      .send(newVotes)
      .expect(404)
      .then((res) => {
        const { msg } = res.body;

        expect(msg).toBe("Not found");
      });
  });
  test("returns status:400 and retruns error message when patch request to valid article_d but invalid votes", () => {
    const newVotes = {
      inc_votes: "invalid_votes",
    };
    return request(app)
      .patch("/api/articles/1")
      .send(newVotes)
      .expect(400)
      .then((res) => {
        const { msg } = res.body;

        expect(msg).toBe("Bad request");
      });
  });
  test("returns status:400 and retruns error message when patch request to invalid article_id", () => {
    const newVotes = {
      inc_votes: 1,
    };
    return request(app)
      .patch("/api/articles/invalid_id")
      .send(newVotes)
      .expect(400)
      .then((res) => {
        const { msg } = res.body;

        expect(msg).toBe("Bad request");
      });
  });
});

describe("DELETE /api/comments/:comment_id", () => {
  test("DELETE: 204 deletes the given comment by comment_id and send no body back", () => {
    return request(app).delete("/api/comments/1").expect(204);
  });
  test("DELETE: 404 responds with an appropriate  error message when given a non-existent id", () => {
    return request(app)
      .delete("/api/comments/100")
      .expect(404)
      .then((res) => {
        const { msg } = res.body;

        expect(msg).toBe("Not found");
      });
  });
  test("DELETE: 400 responds with an appropriate error message when given an invalid id", () => {
    return request(app)
      .delete("/api/comments/invalid_id")
      .expect(400)
      .then((res) => {
        const { msg } = res.body;

        expect(msg).toBe("Bad request");
      });
  });
});

describe("GET /api/users", () => {
  test("GET: 200 returns all users", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then((res) => {
        const { users } = res.body;

        expect(users.length > 0).toBe(true);

        users.forEach((user) => {
          expect(user).toHaveProperty("username", expect.any(String));
          expect(user).toHaveProperty("name", expect.any(String));
          expect(user).toHaveProperty("avatar_url", expect.any(String));
        });
      });
  });
});
