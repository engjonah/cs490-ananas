const request = require("supertest");
const app = require("../app");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const User = require('../models/User.model');
// jest.mock('../models/User.model');

function generateMockToken() {
  return jwt.sign({ uid: 'mockUserId' }, process.env.JWT_TOKEN_KEY, { expiresIn: '1h' });;
}

afterAll(done => {
  mongoose.connection.close()
  done()
})

describe('Account Controller', () => {
  describe('getUser', () => {
    test("GET /api/account/:uid", async () => {
      const mockUser = { uid: 'mockUserId', name: 'John Doe' };
      const token = generateMockToken();
      User.findOne = jest.fn(()=>mockUser);
      return await request(app)
        .get("/api/account/mockUserId")
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .then(response => {
          expect(response.body).toEqual(mockUser);
        });
    });

    test("GET /api/account/:uid - User not found", async () => {
      User.findOne.mockResolvedValueOnce(null);
      const token = generateMockToken();
      return await request(app)
        .get("/api/account/nonExistingUserId")
        .set('Authorization', `Bearer ${token}`)
        .expect(404)
        .expect('Content-Type', /json/)
        .then(response => {
          expect(response.body).toEqual({ error: "User not found! Please sign up!" });
        });
    });

    test("GET /api/account/:uid - Internal server error", async () => {
      User.findOne.mockRejectedValueOnce(new Error('Database error'));
      const token = generateMockToken();
      return await request(app)
        .get("/api/account/errorUserId")
        .set('Authorization', `Bearer ${token}`)
        .expect(500)
        .expect('Content-Type', /json/)
        .then(response => {
          expect(response.body).toEqual({ error: "Internal server error" });
        });
    });
  });

  describe('updateName', () => {
    test("PUT /api/account/:uid", async () => {
      const mockUpdatedUser = { uid: 'mockUserId', name: 'Jane Doe' };
      User.findOneAndUpdate = jest.fn(()=>mockUpdatedUser);
      const token = generateMockToken();
      return await request(app)
        .put("/api/account/mockUserId")
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Jane Doe' })
        .expect(200)
        .expect('Content-Type', /json/)
        .then(response => {
          expect(response.body).toEqual(mockUpdatedUser);
        });
    });

    test("PUT /api/account/:uid - User not found", async () => {
      User.findOneAndUpdate.mockResolvedValueOnce(null);
      const token = generateMockToken();
      return await request(app)
        .put("/api/account/nonExistingUserId")
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Jane Doe' })
        .expect(404)
        .expect('Content-Type', /json/)
        .then(response => {
          expect(response.body).toEqual({ error: "User not found! Please sign up!" });
        });
    });

    test("PUT /api/account/:uid - Internal server error", async () => {
      User.findOneAndUpdate.mockRejectedValueOnce(new Error('Database error'));
      const token = generateMockToken();
      return await request(app)
        .put("/api/account/errorUserId")
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Jane Doe' })
        .expect(500)
        .expect('Content-Type', /json/)
        .then(response => {
          expect(response.body).toEqual({ error: "Internal server error" });
        });
    });
  });

  describe('deleteUser', () => {
    // test("DELETE /api/account/:uid", async () => {
    //   const mockDeletedUser = { uid: 'mockUserId', name: 'John Doe' };
    //   User.findOneAndDelete.mockResolvedValue(true);
    //   jest.setTimeout(10000);
    //   return await request(app)
    //     .delete("/api/account/mockUserId")
    //     .expect(200);
    // });

    

    test("DELETE /api/account/:uid - User not found", async () => {
      User.findOneAndDelete = jest.fn(()=>null);
      const token = generateMockToken();
      return await request(app)
        .delete("/api/account/nonExistingUserId")
        .set('Authorization', `Bearer ${token}`)
        .expect(404)
        .expect('Content-Type', /json/)
        .then(response => {
          expect(response.body).toEqual({ error: "User not found! Please sign up!" });
        });
    });

    test("DELETE /api/account/:uid - Internal server error", async () => {
      User.findOneAndDelete.mockRejectedValueOnce(new Error('Database error'));
      const token = generateMockToken();
      return await request(app)
        .delete("/api/account/errorUserId")
        .set('Authorization', `Bearer ${token}`)
        .expect(500)
        .expect('Content-Type', /json/)
        .then(response => {
          expect(response.body).toEqual({ error: "Internal server error" });
        });
    });
  });
});
