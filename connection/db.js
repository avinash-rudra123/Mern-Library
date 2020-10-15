const mongoose = require("mongoose");
const uri =
  "mongodb+srv://avinash12:@avi1L/#@cluster0.ex4b5.mongodb.net/library?retryWrites=true&w=majority";
const connectDb = async () => {
  try {
    await mongoose.connection(uri, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });
    console.log("mongodb connected");
  } catch (err) {
    console.log(" mongodb not connected");
  }
};
module.exports = connectDb;
