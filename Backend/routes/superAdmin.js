const express = require("express");

const router = express.Router();

require("dotenv").config();

const superAdminController = require("../controllers/Dashboard/superAdminController");

const verifyAuthAdminMiddleware = require("../middleware/adminAuthMiddleware");

router.get(
  "/getAllUsers",
  verifyAuthAdminMiddleware.verifyTokenAdmin,
  superAdminController.getAllUsers
);

router.get(
  "/approveWaitingForNewSignups",
  verifyAuthAdminMiddleware.verifyTokenAdmin,
  superAdminController.approveWaitingForNewSignups
);

router.get(
  "/approvalWaitingUnAuthorizedDeviceLogin",
  verifyAuthAdminMiddleware.verifyTokenAdmin,
  superAdminController.approvalWaitingUnAuthorizedDeviceLogin
);

router.post(
  "/unAuthorizedDeviceLogin",
  superAdminController.unAuthorizedDeviceLogin
);

router.delete(
  "/existingUserRemove",
  verifyAuthAdminMiddleware.verifyTokenAdmin,
  superAdminController.existingUserRemove
);

router.put(
  "/approvalForNewSignups",
  verifyAuthAdminMiddleware.verifyTokenAdmin,
  superAdminController.approvalForNewSignups
);

router.put(
  "/approvalForNewDevice",
  verifyAuthAdminMiddleware.verifyTokenAdmin,
  superAdminController.approvalForNewDevice
);

module.exports = router;
