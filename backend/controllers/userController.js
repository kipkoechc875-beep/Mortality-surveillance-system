const userModel = require("../models/userModel");

exports.getUsers = (req, res) => {
  userModel.getAllUsers((err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
};

exports.updateUserStatus = (req, res) => {
  const id = req.params.id;
  const { is_active } = req.body;

  if (typeof is_active !== "number") {
    return res.status(400).json({ message: "is_active must be a number" });
  }

  userModel.updateUserStatusById(id, is_active, (err, result) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "User status updated" });
  });
};

exports.deleteUser = (req, res) => {
  const id = req.params.id;

  userModel.deleteUserById(id, (err, result) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "User deleted" });
  });
};

exports.updateMe = (req, res) => {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ message: 'Not authenticated' });

  const { email } = req.body;
  if (typeof email !== 'string') return res.status(400).json({ message: 'Invalid email' });

  userModel.updateUserEmailById(userId, email, (err, result) => {
    if (err) return res.status(500).json(err);
    res.json({ message: 'Email updated' });
  });
};
