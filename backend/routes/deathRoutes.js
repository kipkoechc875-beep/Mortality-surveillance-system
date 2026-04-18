const express = require("express");
const router = express.Router();

const deathController = require("../controllers/deathController");
const authMiddleware = require("../middleware/authMiddleware");

// Routes
router.post("/", authMiddleware.verifyToken, deathController.addDeath);
router.get("/", authMiddleware.verifyToken, deathController.getDeaths);
router.put("/:id", authMiddleware.verifyToken, deathController.updateDeath);
router.delete("/:id", authMiddleware.verifyToken, authMiddleware.isAdmin, deathController.deleteDeath);
router.get("/stats", authMiddleware.verifyToken, deathController.getStats);

module.exports = router;