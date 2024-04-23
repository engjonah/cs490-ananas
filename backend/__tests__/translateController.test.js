const request = require("supertest");
const app = require("../app");
const Translation = require('../models/Translation.model');
const mongoose = require("mongoose");
const nock = require('nock')
const jwt = require("jsonwebtoken");
const { cache } = require('../controllers/translateController.js')
const axios = require('axios')

const baseURL = 'https://api.openai.com'
const endpoint = '/v1/chat/completions'

function generateMockToken(id = 'default') {
    return jwt.sign({ uid: `mockUserId${id}` }, process.env.JWT_TOKEN_KEY, { expiresIn: '1h' });
}

beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(global.console, 'log').mockImplementationOnce(() => { })
    cache.clear();
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
    const token = generateMockToken('InvalidTest');
    it('should return 500 status code for invalid token', async () => {
        return await request(app)
            .post("/api/translate")
            .send({ inputLang: "Python", outputLang: "Java", inputCode: "print(\"Hello world\")" })
            .set('Authorization', `Bearer ${token}`)
            .expect(500)
    })
})

describe('/api/translate real API requests', () => {
    const token = generateMockToken('RealTest');
    it("should return 200 status code and translation for successful translation and save translation and cache results", async () => {
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
        const tokenMulti = generateMockToken('QueueTest');
        request(app)
            .post("/api/translate")
            .send({ inputLang: "Python", outputLang: "Java", inputCode: "print(\"Hello world\")" })
            .set('Authorization', `Bearer ${tokenMulti}`)
            .then(response => {
                expect(response.body.translation).not.toBe("")
            });
        request(app)
            .post("/api/translate")
            .send({ inputLang: "Python", outputLang: "Java", inputCode: "print(\"Hello world\")" })
            .set('Authorization', `Bearer ${token}`)
            .then(response => {
                expect(response.body.translation).not.toBe("")
            });
        await request(app)
            .post("/api/translate")
            .send({ inputLang: "Python", outputLang: "Java", inputCode: "print(\"Hello world\")" })
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
    const token = generateMockToken('MockTest');
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
            .send({ inputLang: "Python", outputLang: "Java", inputCode: "print(\"Hello world\")" })
            .set('Authorization', `Bearer ${token}`)
            .expect(500)
            .expect('Content-Type', /json/)
            .then(response => {
                expect(response.body.error).toBe("Unknown Error Occurred")
            })
    })
})

describe('Caching Unit Tests', () => {
    const token = generateMockToken()
    const inputs = [{ inputLang: 'Python', outputLang: 'Java', inputCode: 'MockCode' }, { inputLang: 'Python', outputLang: 'C++', inputCode: 'MockCode' }, { inputLang: 'Python', outputLang: 'Ruby', inputCode: 'MockCode' }]
    const cacheContents = [{ inputLang: 'Python', outputLang: 'Java', inputCode: 'MockCode', outputCode: 'MockTranslation' }, { inputLang: 'Python', outputLang: 'C++', inputCode: 'MockCode', outputCode: 'MockTranslation' }, { inputLang: 'Python', outputLang: 'Ruby', inputCode: 'MockCode', outputCode: 'MockTranslation' }]
    afterEach(() => {
        jest.restoreAllMocks()
    })
    it('should correctly cache any unique translations', async () => {
        // mocking requests
        const spy = jest.spyOn(axios, 'post').mockImplementation(() => (
            Promise.resolve({
                status: 200,
                data: {
                    choices: [
                        { message: { content: "MockTranslation" } }
                    ]
                }
            })
        ));
        // sending requests to endpoint, ensuring successful response and request being sent via axios
        for (let i = 0; i < inputs.length; i++) {
            const response = await request(app).post('/api/translate').send(inputs[i]).set('Authorization', `Bearer ${token}`)
            expect(response.status).toBe(200)
        }
        expect(spy).toHaveBeenCalledTimes(3)
        // ensuring cache contains correct contents
        expect(cache.contents).toStrictEqual(cacheContents)
    });
    it('should correctly retrieve cached translations', async () => {
        // mocking requests
        const spy = jest.spyOn(axios, 'post').mockImplementation(() => (
            Promise.resolve({
                status: 200,
                data: {
                    choices: [
                        { message: { content: "MockTranslation" } }
                    ]
                }
            })
        ));
        // settings cache contents
        cache.contents = cacheContents
        // sending requests to endpoint, ensuring successful response but response not being sent via axios due to caching
        for (let i = 0; i < inputs.length; i++) {
            const response = await request(app).post('/api/translate').send(inputs[i]).set('Authorization', `Bearer ${token}`)
            expect(response.status).toBe(200)
        }
        expect(spy).toHaveBeenCalledTimes(0)
    })
})

describe('/api/translate rate limiting', () => {
    const token = generateMockToken('RateLimit');
    it("should return 429 status code on the 21sh attempt within a minute due to rate limiting", async () => {
        //send 20 requests to endpoint
        for (let i = 0; i < 20; i++) {
            await request(app)
                .post("/api/translate")
                .send({ inputLang: "Python", outputLang: "Java", inputCode: "print(\"Hello, World!\")" })
                .set('Authorization', `Bearer ${token}`);
        }
        const response = await request(app)
            .post("/api/translate")
            .send({ inputLang: "Python", outputLang: "Java", inputCode: "print(\"Hello, World!\")" })
            .set('Authorization', `Bearer ${token}`);
        // Verify the 429 status code for the 21st request
        expect(response.status).toBe(429);
        expect(response.body.error).toBe("Ananas Rate Limit Exceeded");
    });
});