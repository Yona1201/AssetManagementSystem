const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const customer = require("../controllers/customerController");
const category = require("../controllers/categoryController");
const assets = require("../controllers/assetController");
const about = require("../controllers/aboutController");
const user = require("../controllers/userController");
const User = require("../models/User")
const jwt = require('jsonwebtoken');


const app = express();
app.use(bodyParser.json());
function checkSession(req, res, next) {
  const authorizationHeader = req.headers.authorization;

  if (!authorizationHeader) {
    return res.status(401).json({ message: "Unauthorized - Missing Authorization header" });
  }

  const [bearer, token] = authorizationHeader.split(' ');
  if (bearer !== 'Bearer' || !token) {
    return res.status(401).json({ message: "Unauthorized - Invalid Authorization header format" });
  }

  // Verifikasi token
  jwt.verify(token, 'secret', async (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Unauthorized - Invalid token" });
    }

    // Token valid, dapatkan ID pengguna dari token
    const userId = decoded.userId;

    try {
      // Cari pengguna berdasarkan ID pengguna dari token
      const user = await User.findById(userId);

      if (!user) {
        return res.status(401).json({ message: "Unauthorized - User not found" });
      }

      // Token cocok dengan pengguna yang ditemukan, lanjutkan ke middleware/rute berikutnya
      req.user = user;
      next();
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
}

app.use("/customers", checkSession, customer);
app.use("/categories", checkSession, category);
app.use("/assets", checkSession, assets);
app.use("/user", user);
app.use("/about", about);


module.exports = app;
