const db = require("../config/db");

// ADD RECORD
const addDeath = (req, res) => {
  const data = req.body;

  db.query("INSERT INTO deaths SET ?", data, (err, result) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Death recorded" });
  });
};

// GET ALL RECORDS
const getDeaths = (req, res) => {
  db.query("SELECT * FROM deaths", (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
};

// DELETE RECORD
const deleteDeath = (req, res) => {
  const id = req.params.id;

  db.query("DELETE FROM deaths WHERE id = ?", [id], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Deleted successfully" });
  });
};

// ✅ VERY IMPORTANT EXPORT
module.exports = {
  addDeath,
  getDeaths,
  deleteDeath
};