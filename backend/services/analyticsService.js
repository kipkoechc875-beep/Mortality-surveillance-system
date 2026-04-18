const db = require("../config/db");

exports.getStatistics = (callback) => {
  const query = `
    SELECT cause_of_death, COUNT(*) as total
    FROM deaths
    GROUP BY cause_of_death
  `;
  db.query(query, callback);
};