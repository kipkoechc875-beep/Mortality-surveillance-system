require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const deathRoutes = require("./routes/deathRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();

app.use(bodyParser.json());
app.use("/api/deaths", deathRoutes);
app.use("/api/auth", authRoutes);

module.exports = app;