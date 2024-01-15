const db = require("../db/connection")
const request = require("supertest");
const app = require("../app");

const testdata = require("../db/data/test-data");

const seed = require("../db/seeds/seed")

beforeEach(() => {
    return seed(testdata)
});

afterAll(() => {
    return db.end()
});

describe("GET /api/topics", () => {
    test("returns status: 200 with an array of topics", () => {
    return request(app)
   .get("/api/topics")
   .expect(200)
   .then((res)=>{
    const { topic } = res.body;
    
    topic.forEach((topic)=>{
        expect(typeof topic.description).toBe('string')
        expect(typeof topic.slug).toBe('string')
        });
        })
    });
    test("returns status: 200 and make sure array is an array", ()=>{
        return request(app)
        .get("/api/topics")
        .expect(200)
        .then((res)=>{
            const { topic } = res.body;

            expect(Array.isArray(topic)).toBe(true)
            expect(topic.length).toBe(3)
        })
    })
    test("return status: 200 and should have slug and description property",()=>{
        return request(app)
        .get("/api/topics")
        .expect(200)
        .then((res)=>{
            const { topic } = res.body;

            topic.forEach((topic)=>{
                expect(topic).toHaveProperty("slug")
                expect(topic).toHaveProperty("description")
            })

        })
    })
})

