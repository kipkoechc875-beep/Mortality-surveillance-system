const db = require("../config/db");

exports.findUserByUsername = (username, callback) => {
  db.query("SELECT * FROM users WHERE username = ?", [username], callback);
};

exports.createUser = (user, callback) => {
  db.query("INSERT INTO users SET ?", user, callback);
};

exports.getAllUsers = (callback) => {
  db.query("SELECT id, username, role, IFNULL(is_active, 1) AS is_active FROM users", callback);
};

exports.updateUserStatusById = (id, isActive, callback) => {
  db.query("UPDATE users SET is_active = ? WHERE id = ?", [isActive, id], callback);
};

exports.deleteUserById = (id, callback) => {
  db.query("DELETE FROM users WHERE id = ?", [id], callback);
};