const request = require("supertest");
const app = require("../app");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = require('../models/User.model');


afterAll(done => {
    mongoose.connection.close()
    done()
})


describe('/api/login', () => {
    describe("Testing empty fields", () =>{
        test("Empty Name", async () => {
            return await request(app)
              .post("/api/login")
              .send({
                  name:'',
                  email:'abc',
                  uid:'abc'
              })
              .expect(400)
              .expect('Content-Type', /json/)
              .then(response => {
                expect(response.body.error).toEqual("Please fill in all fields!")
              })
          })
          test("Empty Email", async () => {
            return await request(app)
              .post("/api/login")
              .send({
                  name:'abc',
                  email:'',
                  uid:'abc'
              })
              .expect(400)
              .expect('Content-Type', /json/)
              .then(response => {
                expect(response.body.error).toEqual("Please fill in all fields!")
              })
          })
          test("Empty UID", async () => {
            return await request(app)
              .post("/api/login")
              .send({
                  name:'abc',
                  email:'abc@gmail.com',
                  uid:''
              })
              .expect(400)
              .expect('Content-Type', /json/)
              .then(response => {
                expect(response.body.error).toEqual("Something went wrong with third-party sign in")
              })
          })
    })

    test("Testing for Invalid Email", async () => {
        return await request(app)
          .post("/api/login")
          .send({
              name:'abc',
              email:'abc',
              uid:'abc'
          })
          .expect(400)
          .expect('Content-Type', /json/)
          .then(response => {
            expect(response.body.error).toEqual("Invalid email!")
          })
      })

      test("Testing for Non-Registered User", async () => {
        User.findOne = jest.fn(()=>null)
        return await request(app)
          .post("/api/login")
          .send({
              name:'test-user',
              email:'test@test.com',
              uid:'test123'
          })
          .expect(404)
          .expect('Content-Type', /json/)
          .then(response => {
            expect(response.body.error).toEqual("User not found! Please sign up!");
          })
      })


      test("Testing for Existing User", async () => {
        const mockedUser = new User({
            name:"test",
            email:"test@test.com",
            uid:"test123",
        })
        User.findOne = jest.fn(()=>mockedUser)
        return await request(app)
          .post("/api/login")
          .send({
              name:'test-user',
              email:'test@test.com',
              uid:'test123'
          })
          .expect(201)
          .expect('Content-Type', /json/)
          .then(response => {
            expect(response.body.Message).toEqual("User logged in!")
            expect(response.body.uid).toEqual("test123")
            expect(response.body.token).not.toBe('')
          })
      })
      test("Testing for Error Handling", async () => {
        User.findOne = jest.fn().mockRejectedValue(new Error("error"))
        return await request(app)
          .post("/api/login")
          .send({
              name:'test-user',
              email:'test@test.com',
              uid:'test123'
          })
          .expect(400)
          .expect('Content-Type', /json/)
          .then(response => {
            expect(response.body.error).toEqual("Something went wrong!")
          })
      })
    
  })