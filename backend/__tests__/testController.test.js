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

describe('/api/test', () => {
  test('GET /api/test', async () => {
    const token = generateMockToken();
    return await request(app)
      .get('/api/test')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect('Content-Type', /json/)
      .then((response) => {
        expect(response.body[0].test).toEqual('hello world');
      });
  });
});
