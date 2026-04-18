const db = require("../config/db");

exports.getStatistics = (user, callback) => {
  let query = `
    SELECT cause_of_death, COUNT(*) as total
    FROM deaths
    WHERE 1=1
  `;
  let params = [];
  if (user.role !== 'admin') {
    query += " AND user_id = ?";
    params.push(user.id);
  }
  query += " GROUP BY cause_of_death";
  db.query(query, params, callback);
};