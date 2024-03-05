const request = require("supertest");
const app = require("../app");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

function generateMockToken() {
  return jwt.sign({ userId: 'mockUserId' }, process.env.JWT_TOKEN_KEY, { expiresIn: '1h' });;
}

afterAll(done => {
  mongoose.connection.close()
  done()
})

describe('/api/feedback', () => {
  test("POST /api/feedback", async () => {
    const feedbackData = {
        uid: 'user_id',
        inputLang: 'Python',
        outputLang: 'Java',
        translationid: 'translation_id',
        rating: 5,
        review: 'Great translation!',
      };
    const token = generateMockToken();
    return await request(app)
      .post("/api/feedback")
      .send(feedbackData)
      .set('Authorization', `Bearer ${token}`)
      .expect(201)
      .expect('Content-Type', /json/)
      .then(response => {
        expect(response.body).toEqual({ Message: 'Feedback saved!' })
      })
  })
})