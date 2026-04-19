const express = require("express");
const router = express.Router();
const locationController = require("../controllers/locationController");
const authMiddleware = require("../middleware/authMiddleware");

// Routes
router.get("/", locationController.getLocations); // Public - can be accessed by anyone
router.post("/", authMiddleware.verifyToken, authMiddleware.isAdmin, locationController.addLocation); // Admin only
router.delete("/:id", authMiddleware.verifyToken, authMiddleware.isAdmin, locationController.deleteLocation); // Admin only

module.exports = router;
