const jwt = require("jsonwebtoken");
const userModel = require("../models/user");
exports.auth = (req, res, next) => {
  const token = req.header("auth-token");
  if (!token) return res.status(401).send("Access denied");
  try {
    const verifyfd = jwt.verify(token, "secret");
    req.user = verifyfd;
    next();
  } catch (err) {
    res.status(400).send("invalid token");
  }
};
exports.checkRole = async (req, res, next) => {
  try {
    const id = req.user.id;
    const user = await userModel.findById(id);
    console.log(user);
    if (user.role == "superadmin") {
      return res.status(403).jsom(" Access denied u are not a admin");
    }
    next();
  } catch (err) {
    res.send("failed");
  }
};
exports.signout = (req, res) => {
  res.clearCookie("token");
  res.send("Signout successfully");
};