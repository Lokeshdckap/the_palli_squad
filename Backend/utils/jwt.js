const jwt = require("jsonwebtoken");

const config = process.env;

const verifyAdminJwt = (access_token) => {
  
  if (!access_token) return res.sendStatus(401);

  try {
    const decodedToken = jwt.verify(access_token, config.secretKey);
    return decodedToken;
  } catch (err) {
    return decodedToken.err;
  }
};

module.exports = {
  verifyAdminJwt,
};
