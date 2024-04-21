const request = require("supertest");
const app = require("../app");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const Feedback = require('../models/Feedback.model');

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
        translationId: 'translation_id',
        rating: 5,
        review: 'Great translation UNIT TEST 2!',
      };
    const token = generateMockToken();
    Feedback.prototype.save = jest.fn(()=>true);
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

describe('/api/feedbackDisplay', () => {
  test("GET /api/feedbackDisplay/metrics", async () => {
    Feedback.countDocuments = jest.fn().mockReturnValue(15);
    Feedback.countDocuments.mockImplementationOnce(() => 1)
      .mockImplementationOnce(() => 2)
      .mockImplementationOnce(() => 3)
      .mockImplementationOnce(() => 4)
      .mockImplementationOnce(() => 5);

    return await request(app)
      .get("/api/feedbackDisplay/metrics")
      .expect(200)
      .expect('Content-Type', /json/)
      .then(response => {
        const { RatingCounts, AverageRating } = response.body;
        // Check that RatingCounts array contains counts for each rating from 1 to 5
        expect(RatingCounts).toEqual([1, 2, 3, 4, 5]);
        // Check that AverageRating is calculated correctly (for mocked data)
        expect(AverageRating).toBeCloseTo(3.67); // Calculated manually for mocked data
      });
  })

  test("GET /api/feedbackDisplay/", async () => {
    const feedbackData = {
        inputLang: 'Python',
        outputLang: 'Java',
        rating: "5",
        review: 'Great translation UNIT TEST 2!',
      };
    Feedback.find = jest.fn(()=>[feedbackData]);

    return await request(app)
      .get("/api/feedbackDisplay/")
      .expect(200)
      .expect('Content-Type', /json/)
      .then(response => {
        const { AllFeedback } = response.body;

        // Check that RatingCounts array contains counts for each rating from 1 to 5
        expect(AllFeedback).toEqual([feedbackData]);
      });
  })
})