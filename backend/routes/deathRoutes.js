const express = require("express");
const router = express.Router();

const deathController = require("../controllers/deathController");

// Routes
router.post("/", deathController.addDeath);
router.get("/", deathController.getDeaths);
router.delete("/:id", deathController.deleteDeath);

module.exports = router;