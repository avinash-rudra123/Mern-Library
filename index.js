const express = require("express");
const app = express();
const mongoose = require("mongoose");
const morgan = require("morgan");
const port = 8000;
const cors = require("cors");
const bodyparser = require("body-parser");
const cookieParser = require("cookie-parser");
const userRoutes = require("./routes/user");
const bookRoutes = require("./routes/Book");
const adminRoutes = require("./routes/Admin");
mongoose
  .connect("mongodb://localhost:27017/Book", {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
  })
  .then(() => {
    console.log("databse connected");
  })
  .catch((err) => console.log(err));
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());
app.use(express.json());
app.use(morgan());
app.use(cookieParser());
app.use(cors({ credentials: true, origin: true }));
app.options("*", cors());
app.use("/api", userRoutes);
app.use("/api", bookRoutes);
app.use("/api/admin", adminRoutes);
app.listen(port, () => {
  console.log(`server is listen at ${port}`);
});
