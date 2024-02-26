const jwt = require("jsonwebtoken");

const generateAuthToken = (user) => {
  const payload = { id: user.uuid || user.id || user };
  const access_token = jwt.sign(payload, process.env.secretKey, {
    expiresIn: "24h",
  });

  return access_token;
};

module.exports = {
  generateAuthToken,
};
