const db = require("../../utils/database");
const { Op, where } = require("sequelize");
const { sequelize, col } = require("../../utils/database");
const Team = db.teams;
const User = db.users;
const Share = db.shares;
const UserTeams = db.user_team_members;
const Invite = db.invitations;
const uuid = require("uuid");
const secrets = db.secret;

const shareSecrets = async (req, res) => {
  try {
    const team_uuid = req.body.team_uuid;
    const user_uuid = req.body.email;
    const secret_uuid = req.body.secret_uuid;
    const time_limit = req.body.time_limit;
    const access_type = req.body.access_type;

    const findUser = await User.findOne({
      where: {
        email: user_uuid,
      },
    });

    const findTeam = await Team.findOne({
      where: {
        uuid: team_uuid,
      },
    });
    const findSecrets = await secrets.findOne({
      where: {
        uuid: secret_uuid,
      },
    });

    if (findUser != null || findTeam != null) {
      await Share.create({
        uuid: uuid.v4(),
        user_uuid: findUser ? findUser.uuid : null,
        team_uuid: findTeam ? team_uuid : null,
        secret_uuid: findSecrets.uuid,
        expiration_date: time_limit,
      });
    } else {
      return res.status(500).json({
        Error: "Users or Teams not found",
      });
    }
  } catch (err) {
    return res.status(500).json({
      Error: "Not share the secrets",
    });
  }
};

module.exports = {
  shareSecrets,
};
