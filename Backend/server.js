const express = require("express");

const cors = require("cors");

const app = express();

require("dotenv").config();

const passport = require("passport");

const session = require("express-session");

app.use(
  session({ secret: "lokesh123", resave: true, saveUninitialized: true })
);

app.use(passport.initialize());

app.use(passport.session());

// Middlewares

const path = require("path");

app.use(cors({ origin: "http://localhost:3000", credentials: true })); // Local

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

const apiBasePath = "/api";

const authRoute = require("./routes/authentication");

const superAdminRoute = require("./routes/superAdmin");

const userRoute = require("./routes/userInfo");

app.use(`${apiBasePath}/auth`, authRoute);

app.use(`${apiBasePath}/superAdmin`, superAdminRoute);

app.use(`${apiBasePath}/user`, userRoute);

app.set("views", path.join(__dirname, "views"));

//listening to server connection

app.use("/uploads", express.static("uploads"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
  console.log(`Serpassportver running server on port ${PORT}`)
);
