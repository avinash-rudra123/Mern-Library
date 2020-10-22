const User = require("../models/user");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const mailgun = require("mailgun-js");
const DOMAIN = "sandbox47f073c58f6c460cb419c48f3f04579c.mailgun.org";
const mg = mailgun({
  apiKey: "30f969092e70c955ec43bfed87113182-2fbe671d-6dcf082d",
  domain: DOMAIN,
});
const jwt = require("jsonwebtoken");
exports.forgetPassword = async (req, res) => {
  const { username } = req.body;
  const userDtls = await User.findOne({ email: username }).exec();

  if (!userDtls) {
    console.log("User Does not Exits");
    res
      .status(206)
      .send({ statusCode: "206", message: "Please Enter valid Email." });
    return;
  }
  const resetToken = crypto.randomBytes(20).toString("hex");
  const tokenExpiration = Date.now() + 3600000;

  const updatedUser = await User.findOneAndUpdate(
    { email: username },
    { $set: { resetToken: resetToken, tokenExpiration: tokenExpiration } },
    { new: true, useFindAndModify: false }
  );
  const link = req.headers.origin + "/reset/" + resetToken;
  const mailOptions = {
    to: username,
    from: process.env.FROM_EMAIL,
    subject: "Password change request",
    text: `Hi \n 
             Please click on the following link ${link} to reset your password. \n\n 
             If you did not request this, please ignore this email and your password will remain unchanged.\n`,
  };

  const smtpTransport = nodemailer.createTransport({
    service: process.env.SERVICE || "Gmail",
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSOWRD,
    },
  });

  try {
    const info = await smtpTransport.sendMail(mailOptions);
    res
      .status(200)
      .send({ statusCode: "200", message: "Successfully send email" });
  } catch (err) {
    res
      .status(209)
      .send({ statusCode: "209", message: "Error in Sending Mail." });
  }
};
exports.resetPassword = async (req, res) => {
  try {
    const user = await User.find({
      resetToken: req.params.token,
      tokenExpiration: { $gt: Date.now() },
    }).exec();
    if (user) {
      res
        .status("200")
        .send({ statusCode: "200", message: "User Token is valid." });
    } else {
      res
        .status("205")
        .send({ statusCode: "205", message: "User Token has Expired." });
    }
  } catch (err) {
    res
      .status("205")
      .send({ statusCode: "205", message: "User Token has Expired." });
  }
};

exports.changePassowrd = async (req, res) => {
  try {
    const user = await User.findOne({
      resetToken: req.params.token,
      tokenExpiration: { $gt: Date.now() },
    }).exec();
    if (!user) {
      res
        .status("205")
        .send({ statusCode: "205", message: "User Token has Expired." });
      return;
    }

    const username = user.email;
    const password = req.body.password;

    const usrDoc = await User.findById(user._id);

    usrDoc.password = password;
    usrDoc.resetToken = "";
    usrDoc.tokenExpiration = null;
    const updatedUser = await usrDoc.save();

    if (updatedUser) {
      const mailOptions = {
        to: username,
        from: process.env.FROM_EMAIL,
        subject: "Password changed Successfully",
        text: `Hello,\n\n'
                  - This is a confirmation that the password for your account ${username} has just been changed.\n`,
      };
      const smtpTransport = nodemailer.createTransport({
        service: process.env.SERVICE || "Gmail",
        auth: {
          user: process.env.EMAIL_USERNAME,
          pass: process.env.EMAIL_PASSOWRD,
        },
      });

      try {
        const info = await smtpTransport.sendMail(mailOptions);
        res.status("201").send({
          statusCode: "201",
          message: "Password has successfully Changed.",
        });
        return;
      } catch (err) {
        res.status("206").send({
          statusCode: "206",
          message: "Could not reset your password.",
        });
        return;
      }
    } else {
      res
        .status("206")
        .send({ statusCode: "206", message: "Could not reset your password." });
      return;
    }
  } catch (err) {
    res
      .status("206")
      .send({ statusCode: "206", message: "Could not reset your password." });
    return;
  }
};

exports.signup = (req, res) => {
  const { name, email, password } = req.body;

  User.findOne({ email }).exec((err, user) => {
      if (user) {
          return res.status(400).json({
              error: 'Email is taken'
          });
      }

      const token = jwt.sign({ name, email, password }, "secret", { expiresIn: '10m' });
      mg.messages().send({
        from: "noreply@gmail.com",
        to: user.email,

        subject: "Account Activation",
        html: `
              <p>You requested for Account Activation</p>
              <h5>click in this <a href="${EMAIL}/auth/activate/${token}">link</a> to activate account</h5>
              `,
      });
              return res.json({
                  message: `Email has been sent to ${email}. Follow the instruction to activate your account`
              });
          })
          .catch(err => {
              return res.json({
                  message: err.message
              });
          });
};

exports.accountActivation = (req, res) => {
  const { token } = req.body;

  if (token) {
      jwt.verify(token, "secret", function(err, decoded) {
          if (err) {
              console.log('JWT VERIFY IN ACCOUNT ACTIVATION ERROR', err);
              return res.status(401).json({
                  error: 'Expired link. Signup again'
              });
          }

          const { name, email, password } = jwt.decode(token);

          const user = new User({ name, email, password });

          user.save((err, user) => {
              if (err) {
                  console.log('SAVE USER IN ACCOUNT ACTIVATION ERROR', err);
                  return res.status(401).json({
                      error: 'Error saving user in database. Try signup again'
                  });
              }
              return res.json({
                  message: 'Signup success. Please signin.'
              });
          });
      });
  } else {
      return res.json({
          message: 'Something went wrong. Try again.'
      });
  }
};

exports.signin = (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email }).exec((err, user) => {
      if (err || !user) {
          return res.status(400).json({
              error: 'User with that email does not exist. Please signup'
          });
      }
      if (!user.authenticate(password)) {
          return res.status(400).json({
              error: 'Email and password do not match'
          });
      }
      const token = jwt.sign({ _id: user._id }, "secret", { expiresIn: '7d' });
      const { _id, name, email, role } = user;

      return res.json({
          token,
          user: { _id, name, email, role }
      });
  });
};
