const express = require('express')
const cors = require('cors');

require('dotenv').config();

const connectDB = require("./db/conn");

const app = express()
const port = process.env.PORT || 3000;

connectDB();

app.use(cors());
app.use(express.json());

const testRouter = require('./routes/test');  
app.use('/test', testRouter);

const path = require("path");

if (process.env.NODE_ENV === "production") {

    app.use(express.static("frontend/build"));

    app.get("*", (req, res) => {

    res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"));

   });

}

/* app.get('/', (req, res) => {
  res.send('Hello World!')
}) */

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});