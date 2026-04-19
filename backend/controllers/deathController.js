const db = require("../config/db");

// ADD RECORD
const addDeath = (req, res) => {
  const data = {
    ...req.body,
    user_id: req.user.id, // Associate record with authenticated user
    is_read: 0,
  };

  db.query("INSERT INTO deaths SET ?", data, (err, result) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Death recorded", id: result.insertId });
  });
};

// GET ALL RECORDS
const getDeaths = (req, res) => {
  let query = "SELECT * FROM deaths";
  let params = [];

  // Filter by user_id for non-admin users
  if (req.user.role !== "admin") {
    query += " WHERE user_id = ?";
    params.push(req.user.id);
  }

  query += " ORDER BY created_at DESC";

  db.query(query, params, (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
};

// GET UNREAD COUNT (Admin only)
const getUnreadCount = (req, res) => {
  db.query("SELECT COUNT(*) AS count FROM deaths WHERE is_read = 0", (err, results) => {
    if (err) return res.status(500).json(err);
    res.json({ count: results[0]?.count || 0 });
  });
};

// MARK ALL AS READ (Admin only)
const markAllDeathsRead = (req, res) => {
  db.query("UPDATE deaths SET is_read = 1 WHERE is_read = 0", (err, result) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "All reports marked as read", updated: result.affectedRows });
  });
};

// UPDATE RECORD (Admin only)
const updateDeath = (req, res) => {
  const id = req.params.id;
  const updates = req.body;

  // Remove id and user_id from updates to prevent tampering
  delete updates.id;
  delete updates.user_id;
  delete updates.created_at;

  db.query("UPDATE deaths SET ? WHERE id = ?", [updates, id], (err, result) => {
    if (err) return res.status(500).json(err);
    if (result.affectedRows === 0) return res.status(404).json({ message: "Record not found" });
    res.json({ message: "Record updated successfully" });
  });
};

// DELETE RECORD
const deleteDeath = (req, res) => {
  const id = req.params.id;

  // For non-admin users, check ownership before deleting
  if (req.user.role !== "admin") {
    db.query("SELECT user_id FROM deaths WHERE id = ?", [id], (err, results) => {
      if (err) return res.status(500).json(err);
      if (results.length === 0) return res.status(404).json({ message: "Record not found" });
      if (results[0].user_id !== req.user.id) return res.status(403).json({ message: "Access denied" });

      // Proceed with deletion
      db.query("DELETE FROM deaths WHERE id = ?", [id], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ message: "Deleted successfully" });
      });
    });
  } else {
    // Admin can delete any record
    db.query("DELETE FROM deaths WHERE id = ?", [id], (err, result) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Deleted successfully" });
    });
  }
};

// ✅ VERY IMPORTANT EXPORT
module.exports = {
  addDeath,
  getDeaths,
  getUnreadCount,
  markAllDeathsRead,
  updateDeath,
  deleteDeath,
};