const userModel = require("../models/user");
exports.checkRole = async (req, res, next) => {
  try {
    const user = await userModel.findOne(req.user.role);
    console.log(user);
    if (user.role == "superadmin") {
      return res.status(403).jsom(" Access denied u are not a admin");
    }
    next();
  } catch (err) {
    res.send("failed");
  }
};
