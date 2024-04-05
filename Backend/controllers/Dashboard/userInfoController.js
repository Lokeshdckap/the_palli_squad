const db = require("../../utils/database");
const { Op, where } = require("sequelize");
const { sequelize, col } = require("../../utils/database");
const User = db.users;
const passPhrase = db.pass_pharse;

const getUserInfo = async (req, res) => {

  const userInfo = await User.findOne({
    where: {
      uuid: req.user.id,
    },
  });

  const checkSecretCode = await passPhrase.findOne({
    where: {
      user_uuid: req.user.id,
    },
  });

  const is_secretCode = checkSecretCode ? true : false;
  if (userInfo) {
    return res
      .status(200)
      .json({ userInfo, is_secretCode:is_secretCode, message: "UserInfo Fetched Sucessfully" });
  } else {
    return res.status(404).json({ error: "No matching records found!" });
  }
};


module.exports = {
  getUserInfo,

};
