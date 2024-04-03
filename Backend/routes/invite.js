const express = require("express");

const router = express.Router();

require("dotenv").config();

const verifyAuthMiddleware = require("../middleware/authMiddleware");

const inviteController = require("../controllers/Dashboard/inviteController");

router.post(
  "/inviteUsers",
  verifyAuthMiddleware.verifyToken,
  inviteController.inviteUsers
);

router.post(
  "/updateInvite",
  inviteController.updateInvite
);

router.put(
  "/updateRole",
  verifyAuthMiddleware.verifyToken,
  inviteController.updateRole
);

router.get(
  "/pendingList/:uuid",
  verifyAuthMiddleware.verifyToken,
  inviteController.pendingList
);

module.exports = router;