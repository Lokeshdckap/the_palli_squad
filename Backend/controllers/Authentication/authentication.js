const bcrypt = require("bcrypt");
const db = require("../../utils/database");
const path = require("path");
const fs = require("fs");
const User = db.users;
const Unauthorization = db.unAuthorizedDevice;
const emailVerificationToken = db.email_verification_token; // Email Verification Token
const OTP = db.otp_verifications;
const passPhrase = db.pass_pharse;
const UserTeams = db.user_team_members;
const CryptoJS = require("crypto-js");
const crypto = require("crypto");
const tokens = require("../../utils/generateAuthToken");
const generateAuthToken = tokens.generateAuthToken;
const sendEmail = require("../../utils/sendEmails");
const uuid = require("uuid");
const otpGenerator = require("otp-generator");
const twilio = require("twilio");
const fast2sms = require("fast-two-sms");
const axios = require("axios");
const IP = require("ip");
const { Op, where } = require("sequelize");
require("dotenv").config();
const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const userExists = await User.findOne({
      where: { email },
    });
    if (userExists) {
      return res.status(400).send("Email is already exists");
    }
    const user = await User.create({
      username,
      email,
      password: await bcrypt.hash(password, 15),
      mobile_no: req.body.mobile_no,
      uuid: uuid.v4(),
      device_ip: req.body.device_id,
    });

    if (req.body.team_uuid) {
      const UserTeam = await UserTeams.create({
        user_uuid: user.uuid,
        team_uuid: req.body.team_uuid,
        role_type: req.body.role,
        uuid: uuid.v4(),
      });
    }

    if (user) {
      const expiresAt = new Date(Date.now() + 3600000);
      let setToken = await new emailVerificationToken({
        user_uuid: user.uuid,
        uuid: uuid.v4(),
        token: crypto.randomBytes(32).toString("hex"),
        expires_at: expiresAt,
      }).save();

      if (setToken) {
        const link = `${process.env.FRONTEND_BASE_URL}/email-verify/${user.uuid}/${setToken.token}`;

        const emailTemplate = fs.readFileSync(
          path.join(__dirname, "../../", "public", "emailTemplates/index.html"),
          "utf8"
        );

        const emailink = emailTemplate.replace("{{link}}", link);

        await sendEmail(user.email, "Email Verification", emailink);
      } else {
        return res.status(400).send("token not created");
      }
    } else {
      return res.status(409).send("Details are not correct");
    }

    return res.status(200).json({ msg: "register sucessfully" });
  } catch (err) {
    console.log(err);
    return res.status(500).send("Error in registering user");
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    //find a user by their email
    const user = await User.findOne({
      where: {
        email: email,
      },
    });

    if (user !== null) {
      const unAuthor = await Unauthorization.findOne({
        where: {
          user_uuid: user.uuid,
          device_ip: req.body?.device_id.SecretPublicDeviceID,
          isApproved: 1,
        },
      });

      if (user.isApproved === 0) {
        return res.status(401).json({
          msg: "waiting for super admin approval",
        });
      }

      if (user.role_type != 1) {
        if (
          user.device_ip != req.body.device_id.SecretPublicDeviceID &&
          !unAuthor
        ) {
          return res.status(409).json({
            msg: "unauthorized device logins",
          });
        }
      }

      //if user email is found, compare password with bcrypt
      if (user && user.password) {
        const isSame = await bcrypt.compare(password, user.password);

        if (isSame) {
          // Generate a 6-digit OTP

          const otp = otpGenerator.generate(4, {
            upperCase: false,
            specialChars: false,
            alphabets: false,
          });
          try {
            await sendEmail(user.email, "OTP Verification", otp);

            await OTP.create({
              uuid: uuid.v4(),
              user_uuid: user.uuid,
              otp: otp,
              expires_at: new Date(Date.now() + 3600000),
            });

            return res.status(200).json({
              msg: "OTP Message sent successfully",
            });
          } catch (err) {
            console.error("Error sending OTP:", err);
          }
        } else {
          return res.status(401).send({ password: "Invaild Crendtials" });
        }
      } else {
        return res.status(401).send({ email: "Invaild Crendtials" });
      }
    } else {
      return res.status(404).send({ email: "Invaild Crendtials" });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).send({ email: "Email Not Verified" });
  }
};

const verifyEmail = async (req, res) => {
  try {
    const token = req.params.token ? req.params.token : null;
    const user_uuid = req.params.uuid ? req.params.uuid : null;

    //find user by token using the where clause
    if (user_uuid && token) {
      const usertoken = await emailVerificationToken.findOne({
        token,
        where: {
          user_uuid: user_uuid,
        },
      });

      //     //if token doesnt exist, send status of 400
      if (usertoken.expires_at < new Date()) {
        return res
          .status(400)
          .json({ message: "Token has expired or Invalid Token" });
      }
      if (!usertoken) {
        return res.status(400).send({
          msg: "Your verification link may have expired. Please click on resend for verify your Email.",
        });
        //if token exist, find the user with that token
      } else {
        const user = await User.findOne({ where: { uuid: req.params.uuid } });
        if (!user) {
          return res.status(401).send({
            msg: "We were unable to find a user for this verification. Please SignUp!",
          });
          //if user is already verified, tell the user to login
        } else if (user.isVerified) {
          // JWT TokeN
          return res.status(409).send({
            msg: "User has been already verified. Please Login",
          });
          //if user is not verified, change the verified to true by updating the field
        } else {
          const updated = await User.update(
            { isVerified: true },
            {
              where: {
                uuid: usertoken.user_uuid,
              },
            }
          );
          const user = await User.findOne({
            where: {
              uuid: usertoken.user_uuid,
            },
          });
          //if not updated sencsrfd error message
          if (!updated) {
            return res.status(500).send({ msg: err.message });
          } else {
            return res.status(200).send({
              Success: "Your account has been successfully verified",
            });
          }
        }
      }
    }
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

const verify_otp = async (req, res) => {
  const otp = req.body.otp;

  const userOtp = await OTP.findOne({
    where: {
      otp: otp,
    },
  });

  const findUser = await User.findOne({
    where: {
      uuid: userOtp?.user_uuid,
    },
  });

  if (userOtp && findUser) {
    if (findUser.isVerified && findUser.isApproved) {
      let access_token = generateAuthToken(findUser);

      return res.status(200).json({
        access: access_token,
      });
    } else {
      return res.status(401).json({
        msg: "Please a contact a super admin",
      });
    }
  } else {
    return res.status(401).json({
      msg: "Authorised request",
    });
  }
};

const passphrase = async (req, res) => {
  try {
    const passphrased = req.body.passPhrase;

    console.log(req.body);
    const secretKey = "akash@123";

    const passphrasedDecryption = CryptoJS.AES.decrypt(
      passphrased,
      secretKey
    ).toString(CryptoJS.enc.Utf8);

    const checkPassPhrase = await passPhrase.findOne({
      where: {
        user_uuid: req.user.id,
      },
    });

    if (!checkPassPhrase) {
      const createPassPhrase = await passPhrase.create({
        uuid: uuid.v4(),
        pass_pharse: await bcrypt.hash(passphrasedDecryption, 15),
        user_uuid: req.user.id,
      });
      return res.status(200).json({
        data: createPassPhrase,
        msg: "Your PassPharse Created Sucessfully",
      });
    } else {
      return res.status(500).json({
        msg: "Your PassPharse already exists",
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      err: err,
    });
  }
};

const checkPassPhrase = async (req, res) => {
  try {
    const passPhrased = req.body.passPhrase;

    const secretKey = "akash@123";

    const passphrasedDecryption = CryptoJS.AES.decrypt(
      passPhrased,
      secretKey
    ).toString(CryptoJS.enc.Utf8);

    const user = await passPhrase.findOne({
      where: {
        user_uuid: req.user.id,
      },
    });

    if (user && user.pass_pharse) {
      await bcrypt.compare(
        passphrasedDecryption,
        user.pass_pharse,
        (err, isSame) => {
          if (err) {
            console.log(err);
            return res.status(500).json({ error: "Internal Server Error" });
          }
          if (isSame) {
            return res.status(200).json({
              data: true,
              msg: "You are now accessing the PassPhrase",
            });
          } else {
            return res.status(404).json({
              msg: "Unauthorized Access",
            });
          }
        }
      );
    } else {
      return res.status(404).json({
        msg: "Unauthorized Access",
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  register,
  login,
  verifyEmail,
  verify_otp,
  passphrase,
  checkPassPhrase,
};
