const express = require("express");

const router = express.Router();

require("dotenv").config();

const path = require("path");

const verifyAuthMiddleware = require("../middleware/authMiddleware");

const teamController = require("../controllers/Dashboard/TeamsController");

router.post(
  "/create-team",
  verifyAuthMiddleware.verifyToken,
  teamController.createTeams
);

router.get(
  "/getTeam/:uuid",
  verifyAuthMiddleware.verifyToken,
  teamController.getTeam
);

router.get(
  "/getAllTeam",
  verifyAuthMiddleware.verifyToken,
  teamController.getAllTeam
);

router.post(
  "/updateTeamName",
  verifyAuthMiddleware.verifyToken,
  teamController.teamNameUpdate
);

router.get(
  "/getAciveUsers/:uuid",
  verifyAuthMiddleware.verifyToken,
  teamController.getActiveUsersForTeam
);

router.delete(
  "/removeUserFromTeam",
  verifyAuthMiddleware.verifyToken,
  teamController.activeUserRemove
);

module.exports = router;
