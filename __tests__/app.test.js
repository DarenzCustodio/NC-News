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
        ]);
      });
  });
  test("returns status:200 checking all the available endpoints include a description property", () => {
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
        expect(article.body).toBe("I find this existence challenging");
        expect(article.created_at).toBe("2020-07-09T20:11:00.000Z");
        expect(article.votes).toBe(100);
        expect(article.article_img_url).toBe(
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
        );
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
  test("returns status:200 and returns all data from all endpoints", () => {
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
      author: "rogersop",
      body: "testComment",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(addComment)
      .expect(201)
      .then((res) => {
        const { comment } = res.body;

        expect(comment).toHaveProperty("comment_id", expect.any(Number));
        expect(comment).toHaveProperty("article_id", 1);
        expect(comment).toHaveProperty("author", expect.any(String));
        expect(comment).toHaveProperty("body", expect.any(String));
        expect(comment).toHaveProperty("votes", expect.any(Number));
        expect(comment).toHaveProperty("created_at", expect.any(String));
      });
  });
  test("returns status:400 and returns error message when posting comment to invalid article_id", () => {
    const addComment = {
      author: "rogersop",
      body: "testComment",
    };
    return request(app)
      .post("/api/articles/100/comments")
      .expect(400)
      .then((res) => {
        const { msg } = res.body;
        expect(msg).toBe("Bad request");
      });
  });
});
