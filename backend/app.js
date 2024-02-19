const cors = require('cors');
const connectDB = require("./db/conn");
const router = require('./routes');
const express = require('express')

const app = express()

app.use(cors());
app.use(express.json());

connectDB();

app.use('/', router);

module.exports = app;
