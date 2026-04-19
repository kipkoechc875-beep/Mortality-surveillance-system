require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const deathRoutes = require("./routes/deathRoutes");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const locationRoutes = require("./routes/locationRoutes");

const app = express();

app.use(bodyParser.json());
app.use("/api/deaths", deathRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/locations", locationRoutes);

module.exports = app;