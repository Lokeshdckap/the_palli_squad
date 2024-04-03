const express = require("express");

const router = express.Router();

require("dotenv").config();

const verifyAuthMiddleware = require("../middleware/authMiddleware");

const shareController = require("../controllers/Dashboard/shareController");

router.post(
  "/share-secrets",
  verifyAuthMiddleware.verifyToken,
  shareController.encryptionData
);

// router.get(
//   "/secret-decryption/:uuid",
//   verifyAuthMiddleware.verifyToken,
//   secretController.decryptionData
// );
