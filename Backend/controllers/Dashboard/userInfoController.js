const db = require("../../utils/database");
const { Op, where } = require("sequelize");
const { sequelize, col } = require("../../utils/database");
const User = db.users;

const getUserInfo = async (req, res) => {

  const userInfo = await User.findOne({
    where: {
      uuid: req.user.id,
    },
  });
  if (userInfo) {
    return res
      .status(200)
      .json({ userInfo, message: "UserInfo Fetched Sucessfully" });
  } else {
    return res.status(404).json({ error: "No matching records found!" });
  }
};



module.exports = {
  getUserInfo,

};
