const request = require("supertest");
const app = require("../app");
const Translation = require('../models/Translation.model');
const mongoose = require("mongoose");
const nock = require('nock')
const jwt = require("jsonwebtoken");

const baseURL = 'https://api.openai.com'
const endpoint = '/v1/chat/completions'

function generateMockToken() {
    return jwt.sign({ uid: 'mockUserId' }, process.env.JWT_TOKEN_KEY, { expiresIn: '1h' });;
}
  
beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(global.console, 'log').mockImplementationOnce(()=>{})
});

afterAll(done => {
    mongoose.connection.close()
    global.console.log.mockRestore()
    done()
})

describe('OpenAI Token Authentication', () => {
    const originalEnv = process.env;
    beforeAll(() => {
        jest.resetModules();
        process.env = {
          ...originalEnv,
          OPENAI_KEY: 'MOCKED_VALUE',
        };
    });
    afterAll(() => {
        process.env = originalEnv;
    });
    const token = generateMockToken();
    it('should return 500 status code for invalid token', async() => {
        return await request(app)
        .post("/api/translate")
        .send({ inputLang: "Python", outputLang: "Java", inputCode: "print(\"Hello world\")" })
        .set('Authorization', `Bearer ${token}`)
        .expect(500)
    })
})

describe('/api/translate real API requests', () => {
    const token = generateMockToken();
    it("should return 200 status code and translation for successful translation and save translation", async () =>{
        Translation.prototype.save = jest.fn()
        return await request(app)
        .post("/api/translate")
        .send({ inputLang: "Python", outputLang: "Java", inputCode: "print(\"Hello world\")" })
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .then(response => {
            expect(response.body.translation).not.toBe("")
        })
    })
    it("should have a queue if multiple requests are submitted at once", async () => {
      jest.mock("axios", () => ({
        post: jest.fn((_url, _body) => { 
          return new Promise(r => setTimeout(r, 1000))
        })
      }))
      const token = generateMockToken();
      request(app)
          .post("/api/translate")
          .send({inputLang: "Python", outputLang: "Java", inputCode: "print(\"Hello world\")"})
          .set('Authorization', `Bearer ${token}`)
          .then(response => {
            expect(response.body.translation).not.toBe("")
          });
      request(app)
          .post("/api/translate")
          .send({inputLang: "Python", outputLang: "Java", inputCode: "print(\"Hello world\")"})
          .set('Authorization', `Bearer ${token}`)
          .then(response => {
            expect(response.body.translation).not.toBe("")
          });
      await request(app)
          .post("/api/translate")
          .send({inputLang: "Python", outputLang: "Java", inputCode: "print(\"Hello world\")"})
          .set('Authorization', `Bearer ${token}`)
          .then(response => {
            expect(response.body.translation).not.toBe("")
          });
      expect(console.log).toHaveBeenCalledWith("queue length", 1);
      expect(console.log).toHaveBeenCalledWith("queue length", 2);
  });
})

describe('/api/translate mocked API requests', () => {
    afterEach(() => {
        nock.cleanAll()
    })
    const token = generateMockToken();
    it("should return 429 status code with error for rate limit exceeded", async () => {
        nock(baseURL)
        .post(endpoint)
        .reply(429)
        return await request(app)
        .post("/api/translate")
        .send({ inputLang: "Python", outputLang: "Java", inputCode: "print(\"Hello world\")" })
        .set('Authorization', `Bearer ${token}`)
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
        .set('Authorization', `Bearer ${token}`)
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
        .set('Authorization', `Bearer ${token}`)
        .expect(500)
        .expect('Content-Type', /json/)
        .then(response => {
            expect(response.body.error).toBe("Unknown Error Occurred")
        })
    })
})
describe('/api/translate rate limiting', () => {
    const token = generateMockToken();
    beforeAll(() => {
        // Set up any necessary mock responses for the first 3 requests here if needed
    });

    afterAll(() => {
        // Clean up any mocks or nock interceptors
        nock.cleanAll();
    });

    it("should return 429 status code on the 4th attempt within a minute due to rate limiting", async () => {
        // Assuming Translation.prototype.save is mocked if necessary
        // First request
        await request(app)
            .post("/api/translate")
            .send({ inputLang: "Python", outputLang: "Java", inputCode: "print(\"Hello, World!\")" })
            .set('Authorization', `Bearer ${token}`);

        // Second request
        await request(app)
            .post("/api/translate")
            .send({ inputLang: "Python", outputLang: "Java", inputCode: "print(\"Hello again\")" })
            .set('Authorization', `Bearer ${token}`);

        // Third request
        await request(app)
            .post("/api/translate")
            .send({ inputLang: "Python", outputLang: "Java", inputCode: "print(\"And again\")" })
            .set('Authorization', `Bearer ${token}`);

        // Fourth request - Should trigger rate limiting
        const response = await request(app)
            .post("/api/translate")
            .send({ inputLang: "Python", outputLang: "Java", inputCode: "print(\"This should fail\")" })
            .set('Authorization', `Bearer ${token}`);

        // Verify the 429 status code for the fourth request
        expect(response.status).toBe(429);
        expect(response.body.error).toBe("Too many requests, please try again later.");
    });
});
