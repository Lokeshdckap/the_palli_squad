const db = require("../../utils/database");
const User = db.users;
const Unauthorization = db.unAuthorizedDevice;
const { Op, where } = require("sequelize");

const getAllUsers = async (req, res) => {
  try {
    const getAllUser = User.findAll({
      where: {
        [Op.and]: [
          {
            role_type: {
              [Op.not]: 1,
            },
          },
          {
            isApproved: 1,
          },
        ],
      },
    });
    return res.status(200).json({
      msg: "Users Fetched Successfully",
      users: getAllUser,
    });
  } catch (err) {
    return res.status(500).json({
      msg: "Users fetching error",
    });
  }
};

const approveWaitingForNewSignups = async (req, res) => {
  try {
    const getSignuplUser = User.findAll({
      where: {
        [Op.and]: [
          {
            role_type: {
              [Op.not]: 1,
            },
          },
          {
            isApproved: 0,
          },
        ],
      },
    });
    return res.status(200).json({
      msg: "Waiting Approval Users fetched Successfully",
      users: getSignuplUser,
    });
  } catch (err) {
    return res.status(500).json({
      msg: "users fetching error",
    });
  }
};

const approvalForNewSignups = async (req, res) => {
  try {
    const user_uuid = req.body.user_uuid;

    const isApprovedStatus = req.body.isApproved;

    const userFind = await User.findOne({
      where: {
        uuid: user_uuid,
      },
    });
    if (userFind) {
      await User.update(
        { isApproved: isApprovedStatus },
        {
          where: {
            uuid: userFind.uuid,
          },
        }
      );

      return res.status(200).json({
        msg: "Your account has been successfully approved by super admin",
      });
    } else {
      return res.status(404).json({
        msg: "User Can't Found",
      });
    }
  } catch (err) {
    return res.status(500).json({
      msg: "Ineternal server error",
      err: err,
    });
  }
};

const unAuthorizedDeviceLogin = async (req, res) => {
  try {
    const email = req.body.email;
    const justification = req.body.justification;

    const user = await User.findOne({
      where: {
        email: email,
      },
    });
    const unAuthorizedDevice = await Unauthorization.create({
      user_uuid: user.uuid,
      justification: justification,
      uuid: uuid.v4(),
      device_ip: IP.address(),
    });
    if (unAuthorizedDevice) {
      return res.status(200).json({
        msg: "Your request has been successfully sended to super admin please wait...",
      });
    } else {
      return res.status(400).json({
        msg: "can't send the unAuthorizedDevice login request",
      });
    }
  } catch (err) {
    console.log(err, "unAuthorizedDeviceLogin");
    return res.status(500).json({
      msg: "Internal server error",
    });
  }
};

const approvalWaitingUnAuthorizedDeviceLogin = (req, res) => {
  try {
    const getAllUser = Unauthorization.findAll({
      where: {
        isApproved: 0,
      },
      include: [
        {
          model: User,
          attributes: ["username", "uuid"], // Specify the attributes you want to retrieve from the User model
        },
      ],
    });
    return res.status(200).json({
      msg: "Users Fetched Successfully",
      users: getAllUser,
    });
  } catch (err) {
    return res.status(500).json({
      msg: "Users fetching error",
    });
  }
};

const approvalForNewDevice = async (req, res) => {
  try {
    const user_uuid = req.body.user_uuid;

    const isApprovedStatus = req.body.isApproved;

    const userFind = await User.findOne({
      where: {
        uuid: user_uuid,
      },
    });
    if (userFind) {
      await Unauthorization.update(
        { isApproved: isApprovedStatus },
        {
          where: {
            user_uuid: userFind.uuid,
          },
        }
      );

      return res.status(200).json({
        msg: "Your UnAuthorized Device has been successfully approved by super admin",
      });
    } else {
      return res.status(400).json({
        msg: "can't approve  the unAuthorized Device  by super admin.",
      });
    }
  } catch (err) {
    return res.status(500).json({
      msg: "Ineternal server error",
      err: err,
    });
  }
};

const existingUserRemove = async (req, res) => {
  try {
    const user_uuid = req.query.uuid;

    const userFind = await User.findOne({
      where: {
        uuid: user_uuid,
      },
    });
    if (userFind) {
      await User.destroy({
        where: {
          uuid: user_uuid,
        },
      });

      return res.status(200).json({ msg: "user removed successfully" });
    } else {
      return res.status(500).json({ msg: "user can't removed" });
    }
  } catch (err) {
    return res.status(500).json({ msg: "Internal server server" });
  }
};

module.exports = {
  approvalForNewSignups,
  getAllUsers,
  approveWaitingForNewSignups,
  unAuthorizedDeviceLogin,
  approvalWaitingUnAuthorizedDeviceLogin,
  approvalForNewDevice,
  existingUserRemove,
};