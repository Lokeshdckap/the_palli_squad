const express = require("express");

const db = require("./utils/database");

const Roles = db.role_types;

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

const teamRoute = require("./routes/teams");

const inviteRoute = require("./routes/invite");

const secretRoute = require("./routes/secrets");

app.use(`${apiBasePath}/auth`, authRoute);

app.use(`${apiBasePath}/superAdmin`, superAdminRoute);

app.use(`${apiBasePath}/user`, userRoute);

app.use(`${apiBasePath}/teams`, teamRoute);

app.use(`${apiBasePath}/invites`, inviteRoute);

app.use(`${apiBasePath}/secrets`, secretRoute);


app.set("views", path.join(__dirname, "views"));

//listening to server connection

app.use("/uploads", express.static("uploads"));

const blukCreation = async () => {
  try {
    const existsRoles = await Roles.findAll({});
    if (existsRoles.length === 0) {
      await Roles.bulkCreate([
        { name: "admin" },
        { name: "collaborator" },
        { name: "viewer" },
      ])
        .then(() => {
          console.log("Default roles inserted successfully.");
        })
        .catch((error) => {
          console.error("Error inserting default roles:", error);
        });
    } else {
      console.log("Roles already exist.");
    }
  } catch (error) {
    console.error(error);
  }
};

blukCreation();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () =>
  console.log(`Serpassportver running server on port ${PORT}`)
);
