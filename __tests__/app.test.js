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
