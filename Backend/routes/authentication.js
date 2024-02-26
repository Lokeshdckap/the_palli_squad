const express = require("express");

const router = express.Router();

require("dotenv").config();

const authController = require("../controllers/Authentication/authentication");

router.post("/register", authController.register);

router.post("/login", authController.login);

router.get("/verify-email/:uuid/:token", authController.verifyEmail);

router.post("/verify-otp",authController.verify_otp)

// Script User Authentication

module.exports = router;
