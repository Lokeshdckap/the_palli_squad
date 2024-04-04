const express = require("express");

const db = require("./utils/database");

const Roles = db.role_types;

const ShareUser = db.shares_users;

const User = db.users;

const { Op, where } = require("sequelize");

const cron = require("node-cron");

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

const shareRoute = require("./routes/share");

app.use(`${apiBasePath}/auth`, authRoute);

app.use(`${apiBasePath}/superAdmin`, superAdminRoute);

app.use(`${apiBasePath}/user`, userRoute);

app.use(`${apiBasePath}/teams`, teamRoute);

app.use(`${apiBasePath}/invites`, inviteRoute);

app.use(`${apiBasePath}/secrets`, secretRoute);

app.use(`${apiBasePath}/shares`, shareRoute);

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


cron.schedule("* * * * *", async () => {
  try {
    const expiredRecords = await ShareUser.findAll({
      where: {
        expiration_date: {
          [Op.lt]: new Date(), // Less than current time
        },
      },
    });

    await ShareUser.destroy({
      where: {
        expiration_date: {
          [Op.lt]: new Date(), // Less than current time
        },
      },
    });
    console.log(`Deleted ${expiredRecords.length} expired records.`);
  } catch (error) {
    console.error("Error deleting expired records:", error);
  }
});


// const creationAdmin = async () => {
//   try {
//     const existsadmin = await User.findAll({});
//     if (existsRoles.length === 0) {
//       await User.bulkCreate([
//         { username: "Super Admin"
          
//        },
//         { name: "collaborator" },
//         { name: "viewer" },
//       ])
//         .then(() => {
//           console.log("Default roles inserted successfully.");
//         })
//         .catch((error) => {
//           console.error("Error inserting default roles:", error);
//         });
//     } else {
//       console.log("Roles already exist.");
//     }
//   } catch (error) {
//     console.error(error);
//   }
// };

// creationAdmin();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () =>
  console.log(`Serpassportver running server on port ${PORT}`)
);
