const express = require("express");

const router = express.Router();

require("dotenv").config();

const verifyAuthMiddleware = require("../middleware/authMiddleware");

const shareController = require("../controllers/Dashboard/shareController");

router.post(
  "/share-secrets",
  verifyAuthMiddleware.verifyToken,
  shareController.shareSecrets
);



router.get(
  "/getShareWithMe",
  verifyAuthMiddleware.verifyToken,
  shareController.getShareWithMe
);

router.get(
  "/getShareWithTeams",
  verifyAuthMiddleware.verifyToken,
  shareController.getShareWithTeam
);

router.delete("/removeSharedSecrets/:uuid",
verifyAuthMiddleware.verifyToken,
shareController.removeSharedSecrets)



module.exports = router;
