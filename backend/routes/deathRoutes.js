const express = require("express");
const router = express.Router();

const deathController = require("../controllers/deathController");
const authMiddleware = require("../middleware/authMiddleware");

// Routes
router.post("/", authMiddleware.verifyToken, deathController.addDeath);
router.get("/", authMiddleware.verifyToken, deathController.getDeaths);
router.delete("/:id", authMiddleware.verifyToken, authMiddleware.isAdmin, deathController.deleteDeath);

module.exports = router;