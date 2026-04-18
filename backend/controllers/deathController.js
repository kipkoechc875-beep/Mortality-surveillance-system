const db = require("../config/db");

// ADD RECORD
const addDeath = (req, res) => {
  const { name, age, sex, cause_of_death, location, date_of_death } = req.body;
  const user_id = req.user.id;

  db.query("INSERT INTO deaths (user_id, name, age, sex, cause_of_death, location, date_of_death) VALUES (?, ?, ?, ?, ?, ?, ?)", 
    [user_id, name, age, sex, cause_of_death, location, date_of_death], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Death recorded", id: result.insertId });
  });
};

// GET ALL RECORDS
const getDeaths = (req, res) => {
  let query = "SELECT * FROM deaths";
  let params = [];
  if (req.user.role !== 'admin') {
    query += " WHERE user_id = ?";
    params.push(req.user.id);
  }
  db.query(query, params, (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
};

// UPDATE RECORD
const updateDeath = (req, res) => {
  const id = req.params.id;
  const { name, age, sex, cause_of_death, location, date_of_death } = req.body;
  let query = "UPDATE deaths SET name = ?, age = ?, sex = ?, cause_of_death = ?, location = ?, date_of_death = ?";
  let params = [name, age, sex, cause_of_death, location, date_of_death];
  if (req.user.role !== 'admin') {
    query += " WHERE id = ? AND user_id = ?";
    params.push(id, req.user.id);
  } else {
    query += " WHERE id = ?";
    params.push(id);
  }
  db.query(query, params, (err, result) => {
    if (err) return res.status(500).json(err);
    if (result.affectedRows === 0) return res.status(404).json({ message: "Record not found or not authorized" });
    res.json({ message: "Record updated" });
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

// GET STATISTICS
const getStats = (req, res) => {
  const analyticsService = require("../services/analyticsService");
  analyticsService.getStatistics(req.user, (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
};

// ✅ VERY IMPORTANT EXPORT
module.exports = {
  addDeath,
  getDeaths,
  updateDeath,
  deleteDeath,
  getStats
};