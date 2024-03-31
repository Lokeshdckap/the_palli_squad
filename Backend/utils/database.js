//importing modules

const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize(
  `postgres://postgres:postgres@localhost:5432/secret_manager`,
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

db.teams = require("../models/teams")(sequelize, DataTypes);

db.user_team_members = require("../models/user_team_members")(
  sequelize,
  DataTypes
);

db.role_types = require("../models/role_type")(sequelize, DataTypes);

db.email_verification_token = require("../models/email_verification_tokens")(
  sequelize,
  DataTypes
);

db.otp_verifications = require("../models/otp_verifications")(
  sequelize,
  DataTypes
);

db.unAuthorizedDevice = require("../models/unauthorized")(sequelize, DataTypes);

db.invitations = require("../models/invitations")(sequelize, DataTypes);

db.secret = require("../models/secrets")(sequelize, DataTypes);

db.pass_pharse = require("../models/pass_pharse")(sequelize, DataTypes);


db.users.hasMany(db.user_team_members, {
  foreignKey: "user_uuid",
  sourceKey: "uuid",
});

db.user_team_members.belongsTo(db.users, {
  foreignKey: "user_uuid",
  sourceKey: "uuid",
});

db.teams.hasMany(db.user_team_members, {
  foreignKey: "team_uuid",
  sourceKey: "uuid",
});

db.user_team_members.belongsTo(db.teams, {
  foreignKey: "team_uuid",
  sourceKey: "uuid",
});

db.unAuthorizedDevice.belongsTo(db.users, {
  foreignKey: "user_uuid",
  targetKey: "uuid",
});

// User model
db.users.hasMany(db.unAuthorizedDevice, {
  foreignKey: "user_uuid",
  sourceKey: "uuid",
});

db.users.hasMany(db.secret, {
  foreignKey: "user_uuid",
  sourceKey: "uuid",
});

db.secret.belongsTo(db.users, {
  foreignKey: "user_uuid",
  sourceKey: "uuid",
});

module.exports = db;
