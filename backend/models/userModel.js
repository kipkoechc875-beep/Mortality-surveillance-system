const db = require("../config/db");

exports.findUserByUsername = (username, callback) => {
  db.query("SELECT * FROM users WHERE username = ?", [username], callback);
};

exports.createUser = (user, callback) => {
  db.query("INSERT INTO users SET ?", user, callback);
};