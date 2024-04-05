const db = require("../../utils/database");
const { Op, where } = require("sequelize");
const { sequelize, col } = require("../../utils/database");
const Team = db.teams;
const User = db.users;
const Share = db.shares;
const ShareUser = db.shares_users;
const UserTeams = db.user_team_members;
const Invite = db.invitations;
const uuid = require("uuid");
const secrets = db.secret;

const shareSecrets = async (req, res) => {
  try {
    // const team_uuid = req.body.team_uuid ? req.body.team_uuid : null;
    // const user_uuid = req.body.email ? req.body.email : null;
    // const access_type = req.body.access_type;

    const secret_uuid = req.body.secret_uuid;
    const time_limit = req.body.time_limit;
    const expirationDate = calculateExpirationDate(time_limit);
    const data =
      req.body.email.length > 0
        ? req.body.email.map((email) => email.value)
        : null;
    const findUser = await User.findAll({
      where: {
        email: data,
      },
    });
    const allUserId = findUser.map((user) => user.uuid);

    const teamUuid =
      req.body.team_uuid.length > 0
        ? req.body.team_uuid.map((team) => team.value)
        : null;

    const findSecrets = await secrets.findOne({
      where: {
        uuid: secret_uuid,
      },
    });

    if (teamUuid?.length > 0) {
      const findShareExistSecrets = await Share.findAll({
        where: {
          [Op.and]: [
            {
              team_uuid: teamUuid,
            },
            {
              secret_uuid: secret_uuid,
            },
          ],
        },
      });
      const availableId = findShareExistSecrets.map((team) => team.team_uuid);

      const newIds = teamUuid.filter((id) => !availableId.includes(id));

      if (newIds.length > 0) {
        for (const newId of newIds) {
          await Share.create({
            uuid: uuid.v4(),
            team_uuid: newId,
            share_uuid: req.user.id,
            secret_uuid: findSecrets.uuid,
            expiration_date: expirationDate,
          });
        }

        return res.status(200).json({
          msg: "Secrets  shared Successfully",
        });
      } else {
        return res.status(409).json({
          Error: "Secrets Already shared",
        });
      }
    }
    if (allUserId.length > 0) {
      const findShareExistSecretsUsers = await ShareUser.findAll({
        where: {
          [Op.and]: [
            {
              user_uuid: allUserId,
            },
            {
              secret_uuid: secret_uuid,
            },
          ],
        },
      });

      const availableId = findShareExistSecretsUsers.map(
        (user) => user.user_uuid
      );

      const newIds = allUserId.filter((id) => !availableId.includes(id));

      if (newIds.length > 0) {
        for (const newId of newIds) {
          await ShareUser.create({
            uuid: uuid.v4(),
            user_uuid: newId,
            share_uuid: req.user.id,
            secret_uuid: findSecrets.uuid,
            expiration_date: expirationDate,
          });
        }
        return res.status(200).json({
          msg: "Secrets shared Successfully",
        });
      } else {
        return res.status(409).json({
          Error: "Secrets Already shared",
        });
      }
    } else {
      return res.status(500).json({
        Error: "Users or Teams not found",
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      Error: "Not share the secrets",
    });
  }
};

const getShareWithMe = async (req, res) => {
  try {
    const getAllSecrets = ShareUser.findAll({
      where: {
        user_uuid: req.user.id,
      },
      include: [
        {
          model: secrets,
          attributes: { exclude: ["createdAt", "updatedAt"] },
        },
        {
          model: User, // Include the users table
          as: "sharedWithUser", // Alias for the joined users table
          attributes: ["username"], // Include specific attributes from users
        },
      ],
    });
    // Handling the result as a Promise
    getAllSecrets
      .then((result) => {
        return res.status(200).json({
          msg: "Shared Secrets Fetched Successfully",
          users: result,
        });
      })
      .catch((error) => {
        // Handle errors
        console.error(error);
      });
  } catch {
    return res.status(500).json({
      Error: "Can't Fetch Secrets",
    });
  }
};

const getShareWithTeam = async (req, res) => {
  try {
    let teamId = [];

    const findUserTeams = await UserTeams.findAll({
      where: {
        user_uuid: req.user.id,
      },
    });

    for (let teamIds of findUserTeams) {
      teamId.push(teamIds.team_uuid);
    }

    const getAllSecrets = Share.findAll({
      where: {
        team_uuid: teamId,
      },
      include: [
        {
          model: Team, // Assuming Team is the name of your team model
          attributes: ["name"], // Include specific attributes of the team model
        },
        {
          model: secrets,
          attributes: { exclude: ["createdAt", "updatedAt"] },
        },
        {
          model: User, // Include the users table
          as: "sharedBy", // Alias for the joined users table
          attributes: ["username"], // Include specific attributes from users
        },
      ],
    });
    // Handling the result as a Promise

 
    getAllSecrets
      .then((result) => {
        const getAllSecretsWithUserTeams = result.map((secret) => {
          const userTeams = findUserTeams.filter((team) => team.team_uuid === secret.team_uuid);
          return {
            ...secret.toJSON(),
            userTeams: userTeams.map((team) => team.toJSON()),
          };
        });
        
        return res.status(200).json({
          msg: "Shared Secrets Fetched Successfully",
          // data: result, 
          data:getAllSecretsWithUserTeams// Assuming "data" is the alias for the included models
        });
      })
      .catch((error) => {
        // Handle errors
        console.error(error);
        return res.status(500).json({
          Error: "Can't Fetch Secrets",
        });
      });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      Error: "Can't Fetch Secrets",
    });
  }
};

const calculateExpirationDate = (expirationTime) => {
  // Split the expiration time input into number and unit (e.g., "1 hour" => ["1", "hour"])
  const [amount, unit] = expirationTime.split(" ");

  let expirationDate = new Date(); // Current date/time
  expirationDate.setMilliseconds(0); // Clear milliseconds for accuracy

  // Calculate the expiration date based on the unit (hours, minutes, etc.)
  if (unit.toLowerCase() === "hour" || unit.toLowerCase() === "hours") {
    expirationDate.setHours(expirationDate.getHours() + parseInt(amount));
  } else if (
    unit.toLowerCase() === "minute" ||
    unit.toLowerCase() === "minutes"
  ) {
    expirationDate.setMinutes(expirationDate.getMinutes() + parseInt(amount));
  }

  return expirationDate;
};

const removeSharedSecrets = async (req, res) => {

  try{
  const team_uuid = req.params.uuid;

  const secretFind = await Share.findOne({
    where: {
      team_uuid: team_uuid,
    },
  });
  if (secretFind) {
    await Share.destroy({
      where: {
        team_uuid: team_uuid,
      },
    });

    return res.status(200).json({ msg: "Secrets SSucessFully Removed " });
  } else {
    return res.status(404).json({ msg: "Not Found Can't Removed" });
  }
}
catch(err){
  return res.status(500).json({ msg: "Internal server error" });
}
};

module.exports = {
  shareSecrets,
  getShareWithMe,
  getShareWithTeam,
  removeSharedSecrets
};
