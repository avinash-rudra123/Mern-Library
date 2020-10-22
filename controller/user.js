const User = require("../models/user"),
  Activity = require("../models/handleSchema"),
  Book = require("../models/book"),
  Issue = require("../models/issue");
Notification = require("../models/message");

var nodemailer = require("nodemailer");
exports.getUserDashboard = async (req, res, next) => {
  var page = req.params.page || 1;
  const user_id = req.user._id;

  try {
    const user = await User.findById(user_id);

    if (user.bookIssueInfo.length > 0) {
      const issues = await Issue.find({ "user_id.id": user._id });

      for (let issue of issues) {
        if (issue.book_info.returnDate < Date.now()) {
          user.violatonFlag = true;
          user.save();
          break;
        }
      }
    }
    const activities = await Activity.find({ "user_id.id": req.user._id })
      .sort("-entryTime")
      .skip(PER_PAGE * page - PER_PAGE)
      .limit(PER_PAGE);

    const activity_count = await Activity.find({
      "user_id.id": req.user._id,
    }).countDocuments();

    res.status(201).json({
      user: user,
      current: page,
      pages: Math.ceil(activity_count / PER_PAGE),
      activities: activities,
    });
  } catch (err) {
    console.log(err);
    return res.status(404).json("not found");
  }
};

exports.postIssueBook = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.book_id);
    const user = await User.findById(req.params.user_id);
    if (book.stock < 1) {
      return res.status(404).json("No book is there");
    } else {
      //book.stock -= 1;
      const issue = new Issue({
        book_info: {
          id: book._id,
          title: book.title,
          author: book.author,
          ISBN: book.ISBN,
          category: book.category,
          stock: book.stock,
          issued: "true",
        },
        user_id: {
          id: user._id,
          name: user.name,
        },
      });
      user.bookIssueInfo.push(book._id);
      const activity = new Activity({
        info: {
          id: book._id,
          title: book.title,
        },
        category: "Issue Req",
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
      await user.save();
      await book.save();
      await activity.save();

      res.status(201).json(issue);
    }
  } catch (err) {
    console.log(err);
    return res.status(404).json("success failed");
  }
};

exports.postReturnBook = async (req, res, next) => {
  try {
    const book_id = req.params.book_id;
    const user = await User.findById(req.params.user_id);
    const pos = user.bookIssueInfo.indexOf(req.params.book_id);
    const book = await Book.findById(book_id);
    if (book.stock < 1) {
      return res.status(404).json("u cannot return the book");
    } else {
      book.stock += 1;
      await book.save();

      const issue = await Issue.findOne({ "user_id.id": user._id });
      await issue.remove();

      user.bookIssueInfo.splice(pos, 1);
      await user.save();
      const activity = new Activity({
        info: {
          id: issue.book_info.id,
          title: issue.book_info.title,
        },
        category: "Return",
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
      await activity.save();
    }
    res.status(201).json("return successfully");
  } catch (err) {
    console.log(err);
    res.status(404).json("successfully failed");
  }
};
exports.postRenewBook = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.user_id);
    const searchObj = {
      "user_id.id": user._id,
      "book_info.id": req.params.book_id,
    };
    const issue = await Issue.findOne(searchObj);
    let time = issue.book_info.returnDate.getTime();
    issue.book_info.returnDate = time + 7 * 24 * 60 * 60 * 1000;
    issue.book_info.isRenewed = true;
    const activity = new Activity({
      info: {
        id: issue._id,
        title: issue.book_info.title,
      },
      category: "Renew",
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

    await activity.save();
    await issue.save();

    res.status(201).json("renew successfully");
  } catch (err) {
    console.log(err);

    res.status(404).json("successfully failed");
  }
};
exports.notification = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.book_id);
    const user = await User.findById(req.params.user_id);
    if (book.stock < 1) {
      return res.status(404).json("No book is there");
    } else {
      book.stock -= 1;
      const issue = new Issue({
        book_info: {
          id: book._id,
          title: book.title,
          author: book.author,
          ISBN: book.ISBN,
          category: book.category,
          stock: book.stock,
          issued: book.issued,
        },
        user_id: {
          id: user._id,
          name: user.name,
        },
      });
      user.bookIssueInfo.push(book._id);
      const activity = new Activity({
        info: {
          id: book._id,
          title: book.title,
        },
        category: "Issue Request",
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
      await user.save();
      await book.save();
      await activity.save();
    }
    res.status(201).json("issue successfully");
  } catch (err) {
    console.log(err);
    return res.status(404).json("success failed");
  }
};
exports.cancelrequest = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.book_id);
    const user = await User.findById(req.params.user_id);
    book.stock -= 1;
    const cancel = new Issue({
      book_info: {
        id: book._id,
        title: book.title,
        cancel: "Request has been canceled",
      },
      user_id: {
        id: user._id,
        name: user.name,
      },
    });
    user.bookIssueInfo.push(book._id);
    await cancel.save();
    await user.save();
    await book.save();
    res.status(201).json(cancel);
  } catch (err) {
    console.log(err);
    return res.status(404).json("success failed");
  }
};
exports.getCancel = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.user_id);
    const cancelReq = await Issue.find({ "user_id.id": user._id });
    await user.save();
    const saved = await cancelReq.save();
    res.json(saved);
    next();
  } catch (err) {
    res.status(404).json(err);
  }
};
exports.cancel = (req, res, next) => {
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "gupta95031p@gmail.com",
      pass: "@avi1L/#&&123",
    },
  });

  var mailOptions = {
    from: "gupta95031p@gmail.com",
    to: `avinash@rudrainnovative.in`,
    subject: "Regarding Cancel Request",
    text: `sorry for inconvenience.
          I will not able to issue the book request on your id.`,
    html: `<p> Cancellation Request </p>
    <h5>sorry for inconvenience.
    I will not able to issue the book request on your id</h5>`,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      res.send("Email sent: " + info.response);
    }
  });
};
