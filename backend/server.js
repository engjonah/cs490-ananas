const app = require('./app');
const express = require('express')
require('dotenv').config();

const path = require("path");

//link frontend on heroku
if (process.env.NODE_ENV === "production") {

  app.use(express.static("frontend/build"));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"));
  });
}

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});