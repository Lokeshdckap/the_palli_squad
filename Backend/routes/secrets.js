const express = require("express");

const router = express.Router();

require("dotenv").config();

const verifyAuthMiddleware = require("../middleware/authMiddleware");

const secretController = require("../controllers/Dashboard/secretController");

const multer = require('multer');

const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },

  filename: (req, file, cb) => {
    const filename = `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`;
    cb(null, filename);
  },
});


const upload = multer({storage : storage});

router.post(
  "/secret-encryption",
  upload.single('file'),
  verifyAuthMiddleware.verifyToken,
  secretController.encryptionData
);

router.get(
    "/secret-decryption/:uuid",
    verifyAuthMiddleware.verifyToken,
    secretController.decryptionData
  );

router.get("/getAllSecretsForUsers",
verifyAuthMiddleware.verifyToken,
secretController.getAllSecretsForUsers
)


module.exports = router;