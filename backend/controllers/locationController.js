const db = require("../config/db");

// GET ALL HOSPITAL LOCATIONS
const getLocations = (req, res) => {
  db.query("SELECT id, name FROM hospital_locations ORDER BY name ASC", (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ message: "Error fetching locations", error: err.message });
    }
    res.json(results);
  });
};

// ADD NEW HOSPITAL LOCATION (Admin only)
const addLocation = (req, res) => {
  const { name } = req.body;

  if (!name || !name.trim()) {
    return res.status(400).json({ message: "Location name is required" });
  }

  const trimmedName = name.trim();

  db.query(
    "INSERT INTO hospital_locations (name) VALUES (?)",
    [trimmedName],
    (err, result) => {
      if (err) {
        // Handle duplicate entry
        if (err.code === "ER_DUP_ENTRY") {
          return res.status(409).json({ message: "This hospital location already exists" });
        }
        console.error("Database error:", err);
        return res.status(500).json({ message: "Error adding location", error: err.message });
      }
      res.status(201).json({
        message: "Hospital location added successfully",
        id: result.insertId,
        name: trimmedName,
      });
    }
  );
};

// DELETE HOSPITAL LOCATION (Admin only)
const deleteLocation = (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: "Location ID is required" });
  }

  db.query(
    "DELETE FROM hospital_locations WHERE id = ?",
    [id],
    (err, result) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ message: "Error deleting location", error: err.message });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Hospital location not found" });
      }

      res.json({ message: "Hospital location deleted successfully" });
    }
  );
};

module.exports = {
  getLocations,
  addLocation,
  deleteLocation,
};
