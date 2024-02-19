const express = require('express')
const cors = require('cors');
const connectDB = require("./db/conn");
const router = require('./routes');
require('dotenv').config();

const app = express()

app.use(cors());
app.use(express.json());

connectDB();

const path = require("path");

//link frontend on heroku
if (process.env.NODE_ENV === "production") {

    app.use(express.static("frontend/build"));

    app.get("*", (req, res) => {

    res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"));
   });
}

app.use('/', router);

module.exports = app;
