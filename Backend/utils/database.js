//importing modules

const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize(
  `postgres://dckap:admin@localhost:5432/secret_manager`,
  { dialect: "postgres" }
); // Local

sequelize
  .authenticate()
  .then(() => {
    console.log(`Database connected to Secret Manager Database`);
  })
  .catch((err) => {
    console.log(err);
  });

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

//connecting to model

db.users = require("../models/users")(sequelize, DataTypes);

db.email_verification_token = require("../models/email_verification_tokens")(
  sequelize,
  DataTypes
);

db.otp_verifications = require("../models/otp_verifications")(
  sequelize,
  DataTypes
);

db.unAuthorizedDevice = require("../models/unauthorized")(sequelize, DataTypes);

db.unAuthorizedDevice.belongsTo(db.users, {
  foreignKey: "user_uuid",
  targetKey: "uuid",
});

// User model
db.users.hasMany(db.unAuthorizedDevice, {
  foreignKey: "user_uuid",
  sourceKey: "uuid",
});

module.exports = db;
