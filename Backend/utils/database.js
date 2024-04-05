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

db.shares = require("../models/shares")(sequelize, DataTypes);

db.shares_users = require("../models/shares_users")(sequelize, DataTypes);

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

db.secret.hasMany(db.shares_users, {
  foreignKey: "secret_uuid",
  targetKey: "uuid",
});

db.shares_users.belongsTo(db.secret, {
  foreignKey: "secret_uuid",
  targetKey: "uuid",
});

db.secret.hasMany(db.shares, {
  foreignKey: "secret_uuid",
  targetKey: "uuid",
});

db.shares.belongsTo(db.secret, {
  foreignKey: "secret_uuid",
  targetKey: "uuid",
});

db.teams.hasMany(db.shares, {
  foreignKey: "team_uuid",
  targetKey: "uuid",
});

db.shares.belongsTo(db.teams, {
  foreignKey: "team_uuid",
  targetKey: "uuid",
});

db.users.hasMany(db.shares_users, {
  foreignKey: "share_uuid",
  targetKey: "uuid",
});

db.shares_users.belongsTo(db.users, {
  foreignKey: "share_uuid",
  targetKey: "uuid",
  as: "sharedWithUser",
});

db.users.hasMany(db.shares, {
  foreignKey: "share_uuid",
  targetKey: "uuid",
});

db.shares.belongsTo(db.users, {
  foreignKey: "share_uuid",
  targetKey: "uuid",
  as: "sharedBy",

});

module.exports = db;
