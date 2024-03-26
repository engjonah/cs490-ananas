const request = require("supertest");
const app = require("../app");
const Translation = require('../models/Translation.model');
const mongoose = require("mongoose");
const nock = require('nock')

const baseURL = 'https://api.openai.com'
const endpoint = '/v1/chat/completions'

afterAll(done => {
    mongoose.connection.close()
    done()
})

describe('/api/translate real API requests', () => {
    it("should return 200 status code and translation for successful translation and save translation", async () =>{
        Translation.prototype.save = jest.fn()
        return await request(app)
        .post("/api/translate")
        .send({ inputLang: "Python", outputLang: "Java", inputCode: "print(\"Hello world\")" })
        .expect(200)
        .expect('Content-Type', /json/)
        .then(response => {
            expect(response.body.translation).not.toBe("")
        })
    })
})

describe('/api/translate mocked API requests', () => {
    afterEach(() => {
        nock.cleanAll()
    })
    it("should return 429 status code with error for rate limit exceeded", async () => {
        nock(baseURL)
        .post(endpoint)
        .reply(429)
        return await request(app)
        .post("/api/translate")
        .send({ inputLang: "Python", outputLang: "Java", inputCode: "print(\"Hello world\")" })
        .expect(429)
        .expect('Content-Type', /json/)
        .then(response => {
            expect(response.body.error).toBe("Rate Limit Exceeded")
        })
    })
    it("should return 503 status code with error for API connection error", async () => {
        nock(baseURL)
        .post(endpoint)
        .reply(503)
        return await request(app)
        .post("/api/translate")
        .send({ inputLang: "Python", outputLang: "Java", inputCode: "print(\"Hello world\")" })
        .expect(503)
        .expect('Content-Type', /json/)
        .then(response => {
            expect(response.body.error).toBe("API Connection Error")
        })
    })
    it("should return 500 status code with error for unknown error occurred", async () => {
        nock(baseURL)
        .post(endpoint)
        .reply(500)
        return await request(app)
        .post("/api/translate")
        .send({inputLang: "Python", outputLang: "Java", inputCode: "print(\"Hello world\")"})
        .expect(500)
        .expect('Content-Type', /json/)
        .then(response => {
            expect(response.body.error).toBe("Unknown Error Occurred")
        })
    })
})