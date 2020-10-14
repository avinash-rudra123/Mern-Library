const User = require("../models/user");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
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
