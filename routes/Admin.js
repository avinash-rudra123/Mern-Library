const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../models/user");
const Book = require("../models/book");
const { auth } = require("../middleware/authenticate");
const { check, validationResult } = require("express-validator");
const router = express.Router();
router.post(
  "/login",

  [
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password is required").exists(),
  ],

  async (req, res) => {
    const { email, password } = req.body;
    console.log(req.body);
    try {
      let user = await Admin.findOne({ email });
      if (!user) {
        return res.status(400).json({
          errors: [{ msg: "Invalid credentials" }],
        });
      }

      if (user.password != password) {
        return res.status(400).json({
          errors: [{ msg: "Invalid credentials" }],
        });
      }

      const payload = {
        user: {
          id: user.id,
          role: user.role,
        },
      };
      jwt.sign(payload, "secret", { expiresIn: 360000 }, (err, token) => {
        if (err) {
          throw err;
        }
        res.json({ token });
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);
router.post("/admin/books/add", (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        msg: "image not uploaded",
      });
    }
    const {
      title,
      ISBN,
      available,
      author,
      description,
      category,
      photo,
    } = fields;
    let bookCreate = new Book(fields);
    if (files.photo) {
      if (files.photo.size > 1000000) {
        return res.status.json({
          msg: "image should not be greater than 1000000",
        });
      }
      bookCreate.photo.data = fs.readFileSync(files.photo.path);
      bookCreate.photo.contenType = files.photo.type;
    }
    bookCreate.save((err, success) => {
      if (err) {
        return res.status(400).json({
          msg: "Book not created suceessfully",
        });
      }
      return res.status(201).json("sucess");
    });
  });
});

module.exports = router;
