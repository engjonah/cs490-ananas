const request = require("supertest");
const app = require("../app");
const mongoose = require("mongoose");

afterAll(done => {
  mongoose.connection.close()
  done()
})

describe('/api/test', () => {
  test("GET /api/test", async () => {
    return await request(app)
      .get("/api/test")
      .expect(200)
      .expect('Content-Type', /json/)
      .then(response => {
        expect(response.body[0].test).toEqual("hello world")
      })
  })
})