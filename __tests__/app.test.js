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

describe("GET/api/endpoints", () => {
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

describe("GET/api/articles/article_id", () => {
  test("returns status:200 and returns all the articles according to article_id", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then((res) => {
        const { article } = res.body;

        expect(article).toHaveProperty("article_id");
        expect(article).toHaveProperty("title");
        expect(article).toHaveProperty("topic");
        expect(article).toHaveProperty("author");
        expect(article).toHaveProperty("body");
        expect(article).toHaveProperty("created_at");
        expect(article).toHaveProperty("votes");
        expect(article).toHaveProperty("article_img_url");
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
