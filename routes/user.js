const express = require("express");
const { check } = require("express-validator");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const validateSchema = require("../middleware/user");
const { validationResult, body } = require("express-validator");
const userController = require("../controller/user");
const authController = require("../controller/auth");
const User = require("../models/user");
const Book = require("../models/book");
const issueUser = require("../models/issue");
const Handle = require("../models/handleSchema");
const { auth, checkRole } = require("../middleware/authenticate");
const mailgun = require("mailgun-js");
const DOMAIN = "sandbox47f073c58f6c460cb419c48f3f04579c.mailgun.org";
const mg = mailgun({
  apiKey: "30f969092e70c955ec43bfed87113182-2fbe671d-6dcf082d",
  domain: DOMAIN,
});
const {
  forgetPassword,
  resetPassword,
  changePassowrd,
} = require("../controller/auth");
const router = express.Router();
router.post(
  "/reset-password",
  [check("email", "Please include a valid email").isEmail()],

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const EMAIL = "http://localhost:3000";
    crypto.randomBytes(32, (err, buffer) => {
      if (err) {
        console.log(err);
      }
      const token = buffer.toString("hex");
      User.findOne({ email: req.body.email }).then((user) => {
        if (!user) {
          return res
            .status(422)
            .json({ error: "User dont exists with that email" });
        }
        user.resetToken = token;
        user.expireToken = Date.now() + 3600000;
        user.save().then((result) => {
          mg.messages().send({
            from: "noreply@gmail.com",
            to: user.email,

            subject: "password reset",
            html: `
                  <p>You requested for password reset</p>
                  <h5>click in this <a href="${EMAIL}/reset/${token}">link</a> to reset password</h5>
                  `,
          });
          res.json({ message: "check your email" });
        });
      });
    });
  }
);
router.post(
  "/signup",
  [
    check("name", "Name is required").not().isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check(
      "password",
      "Please enter password minimum with 6 characters"
    ).isLength({ min: 6 }),
  ],
  validateSchema,
  async (req, res) => {
    const { name, email, password, confirm_password } = req.body;
    if (password !== confirm_password) {
      return res.status(400).json({
        msg: "password doesnt match Plz type correct password",
      });
    }

    try {
      let user = await User.findOne({ email });

      if (user) {
        return res.status(400).json({
          errors: [{ msg: "User already exists" }],
        });
      }

      user = new User({
        name,
        email,
        password,
      });

      const salt = await bcrypt.genSalt(10);

      user.password = await bcrypt.hash(password, salt);

      await user.save();
      res.status(201).json(user);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);
router.post(
  "/admin/signup",
  [
    check("name", "Name is required").not().isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check(
      "password",
      "Please enter password minimum with 6 characters"
    ).isLength({ min: 6 }),
  ],
  validateSchema,
  async (req, res) => {
    const { name, email, password, confirm_password } = req.body;
    if (password !== confirm_password) {
      return res.status(400).json({
        msg: "password doesnt match Plz type correct password",
      });
    }
    try {
      let user = await User.findOne({ email });

      if (user) {
        return res.status(400).json({
          errors: [{ msg: "User already exists" }],
        });
      }

      user = new User({
        name,
        email,
        password,
        role: "superadmin",
      });

      const salt = await bcrypt.genSalt(10);

      user.password = await bcrypt.hash(password, salt);

      await user.save();
      res.status(201).json(user);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);
router.post(
  "/login",

  [
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password is required").exists(),
  ],

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      let user = await User.findOne({ email });

      if (!user) {
        return res.status(400).json({
          errors: [{ msg: "Invalid credentials" }],
        });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({
          errors: [{ msg: "Invalid credentials" }],
        });
      }

      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(payload, "secret", { expiresIn: 360000 }, (err, token) => {
        if (err) {
          throw err;
        }
        const id = payload.user.id;
        const role = user.role;
        res.status(201).json({ id, token });
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);
router.post(
  "/admin/login",

  [
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password is required").exists(),
  ],
  // [auth, checkRole],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(422).json({ error: "please add all the fields" });
    }
    try {
      let user = await User.findOne({ email });

      if (!user) {
        return res.status(400).json({
          errors: [{ msg: "Invalid credentials" }],
        });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
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
        const id = payload.user.id;
        const role = payload.user.role;
        console.log({ id, token });
        res.json({ token, id, role });
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);
router.get("/user/:id", async (req, res) => {
  try {
    const user = await Book.findById(req.params.id);
    return res.json(user);
  } catch (err) {
    return res.status(404).send("err");
  }
});
router.post("/issueBook/:book_id/book/:user_id", async (req, res) => {
  try {
    const findBook = await Book.findById(req.params.book_id);
    const userInfo = await User.findById(req.params.user_id);
    if (findBook.stock < 1) {
      return res.status(404).json("No book is there");
    } else {
      findBook.stock -= 1;
      const issue = new issueUser({
        book_info: {
          id: findBook._id,
          title: findBook.title,
          ISBN: findBook.ISBN,
          description: findBook.description,
          category: findBook.category,
          stock: findBook.stock,
        },
        user_id: {
          id: userInfo._id,
          name: userInfo.name,
        },
      });
      userInfo.bookIssueInfo.push(findBook._id);
      const handleUser = new Handle({
        info: {
          id: findBook._id,
          title: findBook.title,
        },
        category: "Issue",
        time: {
          id: issue._id,
          issueDate: issue.book_info.issueDate.ISODate(),
          returnDate: issue.book_info.returnDate.ISODate(),
        },
        user_id: {
          id: userInfo._id,
          username: userInfo.name,
        },
      });
      const issuebook = await issue.save();
      await findBook.save();
      await userInfo.save();
      await handleUser.save();
      return res
        .status(201)
        .json({ msg: "issue book successfully", issuebook, findBook });
    }
  } catch (err) {
    return res.status(404).json({ msg: "Cannot issue book" });
  }
});
router.post("/books/:book_id/renew/:user_id", async (req, res, next) => {
  try {
    const user = await User.findById(req.params.user_id);
    const Obj = {
      "user_id.id": user.id,
      "book_info.id": req.params.book_id,
    };
    const issue = await issueUser.findOne(Obj);
    if (issue.book_info.stock < 1) {
      return res.status(404).json("you cannot renew the book ");
    } else {
      let time = issue.book_info.returnDate.getTime();
      issue.book_info.returnDate = time + 7 * 24 * 60 * 60 * 1000;
      issue.book_info.isRenewed = true;
      const handleUser = new Handle({
        info: {
          id: issue._id,
          title: issue.book_info.title,
        },
        category: "renew",
        time: {
          id: issue._id,
          issueDate: issue.book_info.issueDate,
          returnDate: issue.book_info.returnDate,
        },
        user_id: {
          id: user._id,
          name: user.name,
        },
      });

      await issue.save();
      await handleUser.save();
      res.status(201).json({
        msg: "Renew successfully",
        issue,
      });
      next();
    }
  } catch (err) {
    return res.status(403).send({
      msg: "success failed",
    });
  }
});
router.post("/books/return/:id/:user_id", async (req, res, next) => {
  try {
    const book_id = req.params.id;
    const user = await User.findById(req.params.user_id);
    const index = user.bookIssueInfo.indexOf(req.params.id);
    console.log(index);
    const book = await Book.findById(book_id);
    if (book.stock < 1) {
      return res.status(404).json("u cannot return the book");
    } else {
      book.stock += 1;
      await book.save();
      const issue = await issueUser.findOne({ "user_id.id": user._id });
      await issue.remove();
      user.bookIssueInfo.splice(index, 1);
      await user.save();
      const handleUser = new Handle({
        info: {
          id: issue.book_info.id,
          title: issue.book_info.title,
        },
        category: "return",
        time: {
          id: issue._id,
          issueDate: issue.book_info.issueDate,
          returnDate: issue.book_info.returnDate,
        },
        user_id: {
          id: user._id,
          name: user.name,
        },
      });
      await handleUser.save();
      return res.status(201).json({ msg: "successfully" });
    }
  } catch (err) {
    return res.status(403).json("error occured");
  }
});
router.get("/books/issue", async (req, res) => {
  try {
    const issue = await issueUser.find();
    res.json(issue);
  } catch (err) {
    res.json("error occurred");
  }
});
router.get("/list/book", async (req, res) => {
  try {
    const bookById = await Book.find().select(
      "title book author stock category description ISBN "
    );
    res.json(bookById);
  } catch (err) {
    res.status(404).json(err);
  }
});
router.put(
  "/update/books/:id",
  [
    body("title", "Please include a valid Title").notEmpty(),
    body("ISBN", "ISBN is NUMBER").notEmpty().isNumeric(),
    body("stock", "stock is NUMBER").notEmpty().isNumeric(),
    body("description", "description is string")
      .notEmpty()
      .isString()
      .isLength(40),
    body("category", "category is string").notEmpty().isString(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const admin = await Book.findByIdAndUpdate(req.params.id, req.body);
      return res.status(201).json(admin);
    } catch (err) {
      res.status(400).json({
        msg: err,
      });
    }
  }
);
router.get("/books/issue/:user_id", async (req, res) => {
  try {
    const user = await User.findById(req.params.user_id);
    const issue = await issueUser.find({ "user_id.id": user._id });
    console.log(issue);
    res.json(issue);
  } catch (err) {
    res.json("error occurred");
  }
});
router.delete("/delete/books/:id", async (req, res) => {
  try {
    const admin = await Book.remove({ _id: req.params.id });
    return res.status(201).json(admin);
  } catch (err) {
    res.status(400).json({
      msg: err,
    });
  }
});
// router.post(
//   "/reset",
//   body("email").not().isEmpty().isLength({ max: 50 }).isEmail(),
//   (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }
//     crypto.randomBytes(32, (err, buffer) => {
//       if (err) {
//         console.log(err);
//       }
//       const token = buffer.toString("hex");
//       userModel.findOne({ email: req.body.email }, (err, user) => {
//         if (!user) {
//           return res
//             .status(422)
//             .json({ error: "User dont exists with that email" });
//         }
//         var transporter = nodemailer.createTransport({
//           service: "gmail",
//           port: 2525,
//           auth: {
//             user: "gupta95031p@gmail.com",
//             pass: "",
//           },
//         });
//         let currentTime = new Date();
//         const siteurl = "http://localhost:3000";
//         var mailOptions = {
//           from: "gupta95031p@gmail.com",
//           to: req.body.email,
//           subject: "Password Reset",
//           html: `<h1>Welcome To Password Reset </h1>
//           <P> You are required for password Reset</p>
//            <h5> click on this link <a href="${siteurl}/reset?token=${token}">to reset password</a>
//           `,
//         };
//         transporter.sendMail(mailOptions, (err, info) => {
//           if (err) {
//             console.log(err);
//           } else {
//             console.log("Email sent: " + info.response);
//             userModel.updateOne(
//               { email: user.email },
//               {
//                 token: currentTime,
//               },
//               { multi: true },
//               (err, resp) => {
//                 return res.status(200).json({
//                   success: false,
//                   msg: info.response,
//                   userlist: resp,
//                 });
//               }
//             );
//           }
//         });
//       });
//     });
//   }
// );
// router.post("/updatePassword", function (req, res) {
//   userModel.findOne({ email: req.body.email }, function (error, user) {
//     if (req.body.password == req.body.confirm_password) {
//       bycrypt.genSalt(10, (err, salt) => {
//         bycrypt.hash(req.body.password, salt, (err, hash) => {
//           if (err) throw err;
//           let newPassword = hash;
//           //let userId = { _id: user._id };
//           let dataForUpdate = {
//             password: newPassword,
//             updatedDate: new Date(),
//           };
//           userModel.findOneAndUpdate(
//             //userId,
//             dataForUpdate,
//             { new: true },
//             (error, updatedUser) => {
//               if (error) {
//                 if (err.name === "MongoError" && error.code === 11000) {
//                   return res
//                     .status(500)
//                     .json({ msg: "Mongo Db Error", error: error.message });
//                 } else {
//                   return res.status(500).json({
//                     msg: "Unknown Server Error",
//                     error: "Unknow server error when updating User",
//                   });
//                 }
//               } else {
//                 if (!updatedUser) {
//                   return res.status(404).json({
//                     msg: "User Not Found.",
//                     success: false,
//                   });
//                 } else {
//                   return res.status(200).json({
//                     success: true,
//                     msg: "Your password are Successfully Updated",
//                     updatedData: updatedUser,
//                   });
//                 }
//               }
//             }
//           );
//         });
//       });
//     }
//     if (error) {
//       return res.status(401).json({
//         msg: "Something Went Wrong",
//         success: false,
//       });
//     }
//   });
// });
router.get("/logout", auth, (req, res) => {
  User.findOneAndUpdate(req.user._id, { token: "" }, function (err) {
    if (err) res.send(err);
    res.json({ message: "User looged out!" });
  });
});
router.get("/admin/logout", auth, (req, res) => {
  User.findOneAndUpdate(req.user._id, { token: "" }, function (err) {
    if (err) res.send(err);
    res.json({ message: "User looged out!" });
  });
});

router.post("/new-password", (req, res) => {
  const newPassword = req.body.password;
  const sentToken = req.body.token;
  User.findOne({ resetToken: sentToken })
    .then((user) => {
      if (!user) {
        return res.status(422).json({ error: "Try again session expired" });
      }
      bcrypt.hash(newPassword, 12).then((hashedpassword) => {
        user.password = hashedpassword;
        user.resetToken = undefined;
        user.expireToken = undefined;
        user.save().then((saveduser) => {
          res.json({ message: "password updated success" });
        });
      });
    })
    .catch((err) => {
      console.log(err);
    });
});
router.get("/user/:page", userController.getUserDashboard);
router.post("/books/:book_id/issue/:user_id", userController.postIssueBook);
router.post("/books/:book_id/renew/:user_id", userController.postRenewBook);
router.post("/books/:book_id/return/:user_id", userController.postReturnBook);
router.post("/notify/:book_id/issue/:user_id", userController.notification);
// router.post("/cancel/:book_id/req/:user_id", userController.cancelrequest);
router.get("/cancel/:user_id", userController.getCancel);
router.post("/cancel", userController.cancel);

module.exports = router;
