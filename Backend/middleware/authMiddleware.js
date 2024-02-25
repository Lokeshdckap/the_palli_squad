const jwt = require("jsonwebtoken");

const config = process.env;

const verifyToken = (req, res, next) => {
  const token =
    req.body.token || req.query.token || req.headers["authorization"];

  const tokenWithoutBearer = token.replace("Bearer ", "");

  if (!tokenWithoutBearer) {
    return res.status(403).send("A token is required for authentication");
  }
  try {
    const decoded = jwt.verify(tokenWithoutBearer, config.secretKey);
    req.user = decoded;
  } catch (err) {
    return res.status(401).send("Unauthorization Token");
  }
  return next();
};

module.exports = {
  verifyToken,
};
