const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/", authMiddleware.verifyToken, authMiddleware.isAdmin, userController.getUsers);
router.patch("/me", authMiddleware.verifyToken, userController.updateMe);
router.patch("/:id/status", authMiddleware.verifyToken, authMiddleware.isAdmin, userController.updateUserStatus);
router.delete("/:id", authMiddleware.verifyToken, authMiddleware.isAdmin, userController.deleteUser);

module.exports = router;
