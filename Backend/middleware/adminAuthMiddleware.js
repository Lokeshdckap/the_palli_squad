const { verifyAdminJwt } = require("../utils/jwt");
const db = require("../utils/database");
const User = db.users;

const verifyTokenAdmin = async (req, res, next) => {
  const token =
    req.body.token || req.query.token || req.headers["authorization"];

  if (!token) {
    return res.status(401).json({
      msg: "Invaild Token or Missing the Token",
    });
  }

  const access_token = token.replace("Bearer ", "");

  try {
    const decodeToken = verifyAdminJwt(access_token);

    const superAdminCheck = await User.findOne({
      where: {
        uuid: decodeToken.id,
      },
    });

    if (superAdminCheck.role_type != 1) {
      return res.status(401).json({
        err: "Access forbidden. Super Admins only.",
      });
    }

    if (decodeToken.err) {
      return res.status(401).json({
        err: decodeToken.err,
      });
    }
    if (superAdminCheck.role_type == 1) {
      req.user = decodeToken;
      next();
    }
  } catch (err) {
    return res.status(401).json({
      err: "Unauthorized : Invaild Token",
    });
  }
};

module.exports = {
  verifyTokenAdmin,
};
