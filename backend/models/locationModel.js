const db = require("../config/db");

const getAllLocations = async () => {
  const [rows] = await db.execute("SELECT * FROM locations ORDER BY name");
  return rows;
};

const addLocation = async (name) => {
  const [result] = await db.execute("INSERT INTO locations (name) VALUES (?)", [name]);
  return result.insertId;
};

const deleteLocation = async (id) => {
  await db.execute("DELETE FROM locations WHERE id = ?", [id]);
};

module.exports = {
  getAllLocations,
  addLocation,
  deleteLocation,
};