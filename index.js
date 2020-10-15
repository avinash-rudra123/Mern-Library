const express = require("express");
const mongoose = require("mongoose");
var port = process.env.PORT || 8000;
const cors = require("cors");
const bodyparser = require("body-parser");
const cookieParser = require("cookie-parser");
const userRoutes = require("./routes/user");
const bookRoutes = require("./routes/Book");
const adminRoutes = require("./routes/Admin");
const app = express();
require("dotenv").config();
const mongourl =
  "mongodb+srv://atlas123:ravi123@cluster0.ex4b5.mongodb.net/book?retryWrites=true&w=majority";
mongoose
  .connect(mongourl, {
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
app.use(cookieParser());
app.use(cors({ credentials: true, origin: true }));
app.options("*", cors());
app.use("/api", userRoutes);
app.use("/api", bookRoutes);
app.use("/api/admin", adminRoutes);
if (process.env.NODE_ENV === "production") {
  app.use(express.static("frontend/library/build"));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"));
  });
}
app.listen(port, () => {
  console.log(`server is listen at ${port}`);
});
