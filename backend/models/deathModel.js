const db = require("../config/db");

const Death = {
  create: (data, callback) => {
    const query = `
      INSERT INTO deaths (name, age, sex, cause_of_death, location, date_of_death)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    db.query(query, [
      data.name,
      data.age,
      data.sex,
      data.cause_of_death,
      data.location,
      data.date_of_death
    ], callback);
  },

  getAll: (callback) => {
    db.query("SELECT * FROM deaths", callback);
  }
};

module.exports = Death;