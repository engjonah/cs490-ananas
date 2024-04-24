const request = require('supertest');
const app = require('../app');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

function generateMockToken() {
  return jwt.sign({ userId: 'mockUserId' }, process.env.JWT_TOKEN_KEY, {
    expiresIn: '1h',
  });
}

afterAll((done) => {
  mongoose.connection.close();
  done();
});

describe('/api/error', () => {
  test('POST /api/error', async () => {
    const error = {
      uid: 'user_id',
      error: 'Translation page: something went wrong',
    };
    const token = generateMockToken();
    return await request(app)
      .post('/api/error')
      .send(error)
      .set('Authorization', `Bearer ${token}`)
      .expect(201)
      .expect('Content-Type', /json/)
      .then((response) => {
        expect(response.body).toEqual({ Message: 'Error saved!' });
      });
  });
});
