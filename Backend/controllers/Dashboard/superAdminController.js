const db = require("../../utils/database");
const User = db.users;
const Unauthorization = db.unAuthorizedDevice;
const { Op, where } = require("sequelize");
const uuid = require("uuid");
const IP = require("ip");
const crypto = require('crypto');
const getAllUsers = async (req, res) => {
  try {
    const findSuperAdmin = await User.findOne({
      where: {
        uuid: req.user.id,
      },
    });

    const users = await User.findAll({
      where: {
        [Op.and]: [
          {
            role_type: {
              [Op.not]: findSuperAdmin.role_type,
            },
          },
          {
            isApproved: 1,
          },
        ],
      },
    });

    // Encrypt the data
    const algorithm = 'aes-256-cbc';
    const key = 'lokesh1234567890'; // Use a secure method to generate a key
    const iv = crypto.randomBytes(16); // Use a secure method to generate an IV

    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encryptedData = cipher.update(JSON.stringify({
        msg: "Users Fetched Successfully",
        users: users,
    }), 'utf-8', 'hex');
    encryptedData += cipher.final('hex');

    const responseData = {
        iv: iv.toString('hex'),
        encryptedData: encryptedData,
    };

    res.json(responseData);
    // return res.status(200).type('plain');
  } catch (err) {
    return res.status(500).json({
      msg: "Users fetching error",
    });
  }
};

const approveWaitingForNewSignups = async (req, res) => {
  try {
    const getSignuplUser = await User.findAll({
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
    const user_uuid = req.body.key;

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
          attributes: ["username", "uuid", "email"], // Specify the attributes you want to retrieve from the User model
        },
      ],
    });

    // Handling the result as a Promise
    getAllUser
      .then((result) => {
        return res.status(200).json({
          msg: "Unauthorisation Users Fetched Successfully",
          users: result,
        });
      })
      .catch((error) => {
        // Handle errors
        console.error(error);
      });
  } catch (err) {
    return res.status(500).json({
      msg: "Unauthorisation Users fetching error",
    });
  }
};

const approvalForNewDevice = async (req, res) => {
  try {
    const user_uuid = req.body.key;

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

const updateUsers = async (req, res) => {
  try {
    const user_uuid = req.body.key;

    const username = req.body.username;
    const email = req.body.email;
    const role_type = req.body.role_type;

    const userFind = await User.findOne({
      where: {
        uuid: user_uuid,
      },
    });
    if (userFind) {
      await User.update(
        { role_type: role_type, email: email, username: username },
        {
          where: {
            uuid: userFind.uuid,
          },
        }
      );

      return res.status(200).json({
        msg: "User details has been successfully updated by super admin",
      });
    } else {
      return res.status(400).json({
        msg: "User details has been can't updated by super admin",
      });
    }
  } catch (err) {
    return res.status(500).json({
      msg: "Ineternal server error",
      err: err,
    });
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
  updateUsers,
};
