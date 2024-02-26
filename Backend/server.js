const express = require("express");
const client = require('./db')
const app = express();


const PORT = 5000;
app.listen(PORT, () =>
  console.log(`Serpassportver running server on port ${PORT}`)
);
