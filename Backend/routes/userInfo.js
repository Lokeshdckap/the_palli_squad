const express = require("express");

const router = express.Router();

require("dotenv").config();

const verifyAuthMiddleware = require("../middleware/authMiddleware");

const userController = require("../controllers/Dashboard/userInfoController");

router.get(
  "/getUserInfo",
  verifyAuthMiddleware.verifyToken,
  userController.getUserInfo
);

module.exports = router;
