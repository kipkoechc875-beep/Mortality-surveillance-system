const express = require("express");
const router = express.Router();

const deathController = require("../controllers/deathController");
const authMiddleware = require("../middleware/authMiddleware");

// Routes
router.post("/", authMiddleware.verifyToken, deathController.addDeath);
router.get("/", authMiddleware.verifyToken, deathController.getDeaths);
router.get("/unread-count", authMiddleware.verifyToken, authMiddleware.isAdmin, deathController.getUnreadCount);
router.get("/stats/gender", authMiddleware.verifyToken, authMiddleware.isAdmin, deathController.getGenderStats);
router.patch("/mark-read", authMiddleware.verifyToken, authMiddleware.isAdmin, deathController.markAllDeathsRead);
router.put("/:id", authMiddleware.verifyToken, authMiddleware.isAdmin, deathController.updateDeath);
router.delete("/:id", authMiddleware.verifyToken, deathController.deleteDeath);

module.exports = router;