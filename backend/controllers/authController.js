const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");

const SECRET = process.env.JWT_SECRET || "mysecretkey";

// REGISTER
exports.register = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  // Validate username: must contain letters and numbers
  const usernameRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]+$/;
  if (!usernameRegex.test(username)) {
    return res.status(400).json({ message: "Username must contain letters and numbers only (at least one of each)" });
  }

  // Validate password: min 6, at least one letter and one number
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{6,}$/;
  if (!passwordRegex.test(password)) {
    return res.status(400).json({ message: "Password must be at least 6 characters and include letters and numbers" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  // Create user but mark inactive (awaiting admin verification)
  userModel.createUser(
    { username, password: hashedPassword, role: "user", is_active: 0 },
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "User registered successfully. Awaiting admin verification." });
    }
  );
};

// LOGIN
exports.login = (req, res) => {
  const { username, password } = req.body;

  // Basic validation on input format
  const usernameRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]+$/;
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{6,}$/;
  if (!usernameRegex.test(username) || !passwordRegex.test(password)) {
    return res.status(400).json({ message: "Invalid username or password format" });
  }

  userModel.findUserByUsername(username, async (err, results) => {
    if (err) return res.status(500).json(err);
    if (results.length === 0)
      return res.status(404).json({ message: "User not found" });

    const user = results[0];

    if (user.is_active === 0) {
      return res.status(403).json({ message: "Account not verified by admin" });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid)
      return res.status(401).json({ message: "Invalid password" });

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token, role: user.role, id: user.id });
  });
};

exports.me = (req, res) => {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ message: 'Not authenticated' });
  const userModel = require('../models/userModel');
  userModel.getUserById(userId, (err, results) => {
    if (err) return res.status(500).json(err);
    if (!results || results.length === 0) return res.status(404).json({ message: 'User not found' });
    const u = results[0];
    res.json({ id: u.id, username: u.username, role: u.role, email: u.email, is_active: u.is_active });
  });
};