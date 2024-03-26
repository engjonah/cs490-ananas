const request = require("supertest");
const app = require("../app");
const mongoose = require("mongoose");

const User = require('../models/User.model');
jest.mock('../models/User.model');

afterAll(done => {
  mongoose.connection.close()
  done()
})

describe('Account Controller', () => {
  describe('getUser', () => {
    test("GET /api/account/:uid", async () => {
      const mockUser = { uid: 'mockUserId', name: 'John Doe' };
      User.findOne.mockResolvedValueOnce(mockUser);

      return await request(app)
        .get("/api/account/mockUserId")
        .expect(200)
        .expect('Content-Type', /json/)
        .then(response => {
          expect(response.body).toEqual(mockUser);
        });
    });

    test("GET /api/account/:uid - User not found", async () => {
      User.findOne.mockResolvedValueOnce(null);

      return await request(app)
        .get("/api/account/nonExistingUserId")
        .expect(404)
        .expect('Content-Type', /json/)
        .then(response => {
          expect(response.body).toEqual({ error: "User not found! Please sign up!" });
        });
    });

    test("GET /api/account/:uid - Internal server error", async () => {
      User.findOne.mockRejectedValueOnce(new Error('Database error'));

      return await request(app)
        .get("/api/account/errorUserId")
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
      User.findOneAndUpdate.mockResolvedValueOnce(mockUpdatedUser);

      return await request(app)
        .put("/api/account/mockUserId")
        .send({ name: 'Jane Doe' })
        .expect(200)
        .expect('Content-Type', /json/)
        .then(response => {
          expect(response.body).toEqual(mockUpdatedUser);
        });
    });

    test("PUT /api/account/:uid - User not found", async () => {
      User.findOneAndUpdate.mockResolvedValueOnce(null);

      return await request(app)
        .put("/api/account/nonExistingUserId")
        .send({ name: 'Jane Doe' })
        .expect(404)
        .expect('Content-Type', /json/)
        .then(response => {
          expect(response.body).toEqual({ error: "User not found! Please sign up!" });
        });
    });

    test("PUT /api/account/:uid - Internal server error", async () => {
      User.findOneAndUpdate.mockRejectedValueOnce(new Error('Database error'));

      return await request(app)
        .put("/api/account/errorUserId")
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
      User.findOneAndDelete.mockResolvedValueOnce(null);

      return await request(app)
        .delete("/api/account/nonExistingUserId")
        .expect(404)
        .expect('Content-Type', /json/)
        .then(response => {
          expect(response.body).toEqual({ error: "User not found! Please sign up!" });
        });
    });

    test("DELETE /api/account/:uid - Internal server error", async () => {
      User.findOneAndDelete.mockRejectedValueOnce(new Error('Database error'));

      return await request(app)
        .delete("/api/account/errorUserId")
        .expect(500)
        .expect('Content-Type', /json/)
        .then(response => {
          expect(response.body).toEqual({ error: "Internal server error" });
        });
    });
  });
});
