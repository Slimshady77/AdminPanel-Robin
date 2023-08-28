const express = require("express");
const app = express();
var http = require("http").Server(app);
const dotenv = require("dotenv");
const multer = require("multer");
const axios = require("axios");
const bcrypyt = require("bcrypt");
const jwt = require("jsonwebtoken");
// const fs = require("fs");
// const sgMail = require("@sendgrid/mail");
const Nodemailer = require("nodemailer");
const API_KEY =
  "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";
const { v4: uuidV4 } = require("uuid");
const passport = require("passport");

const BodyParser = require("body-parser");
const expressSession = require("express-session");
// const fileStore = require("session-file-store")(expressSession);
// const cookieParser = require('cookie-parser');
app.use(BodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(__dirname + "/public"));
// app.use("/course-chapter", express.static("course-chapter"));
const path = require("path");
dotenv.config({ path: "./config.env" });
require("./passport-setup");

// const userModel1 = require('./model/library.js');

const { model } = require("mongoose");
const library = require("./model/library");
const Course = require("./model/course");
const userModel = require("./model/model");
const chapter = require("./model/chapter");
const userModel1 = require("./model/user");
const questionModel = require("./model/question");
const categoryModel = require("./model/category");
const PORT = process.env.PORT;
const secret = process.env.SECRET;

app.use(
  expressSession({
    secret: secret,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 60000 },
    // store: new fileStore()
  })
);
require("./passport-jwt")(passport);

// user Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// call Local strategy
const { initializingPassport } = require("./passportConfig");
const user = require("./model/user");

initializingPassport(passport);

// var authJWT = (req, res, next) => {
//   var token = req.headers.authorization;
//   token = token.split(" ")[1];
//   jwt.verify(token, process.env.SECRET, function (err, decoded) {
//     if (err) {
//       res.send({ message: "Invalid Token" });
//     } else next();
//   });
// };
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

const io = require("socket.io")(http, {
  cors: {
    origin: "*",
  },
});

//  middleware function to check for logged-in users

// app.use(cookieParser());
// app.use(
//     expressSession({
//         key: "user_id",
//         secret: secret,
//         resave: false,
//         saveUninitialized: true,
//         store: new fileStore(),
//         cookies: {
//             secure: false,
//             expires: 60000,
//         }
//     })
// );

function isAuthenticated(req, res, next) {
  console.log("isAuthenticated middleware executed");
  console.log("req.user:", req.userID);

  if (req.isAuthenticated()) {
    return next();
  }

  res.status(401).send("Not authorized");
}

app.use((req, res, next) => {
  // console.log("Request Headers:", req.headers);
  next();
});
// app.use((req,res,next)=>{
//     if(req.cookies.user_id && !req.expressSession.user )
//     {
//         res.clearCookie('user_id');
//     }
//     next();
// })

// var sessionChecker = (req, res, next) => {
//     if (req.expressSession.user && req.cookies.user_id) {
//         res.redirect("/index");
//     }
//     else {
//         next();
//     }
// }

// Routes
app.get("/category-upload", (req, res) => {
  res.render("category-upload");
});

// app.get("/index", isAuthenticated, (req, res) => {
//   if (req.user) {
//     const id = req.user.id;
//     res.render("index", { userID: id });
//   } else res.status(401).json({ msg: "err found" });
// });
app.get("/index", isAuthenticated, (req, res) => {
  res.render("index");
});

app.get("/setting", (req, res) => {
  res.render("setting");
});
app.get("/index-crypto-currency", (req, res) => {
  res.render("index-crypto-currency");
});
app.get("/auth-lockscreen", (req, res) => {
  res.render("auth-lockscreen");
});
app.get("/auth-login", (req, res) => {
  res.render("auth-login");
});
app.get("/auth-register", (req, res) => {
  res.render("auth-register");
});
app.get("/calendar-full", (req, res) => {
  res.render("calendar-full");
});
app.get("/calendar-list", (req, res) => {
  res.render("calendar-list");
});
app.get("/layout-mini", (req, res) => {
  res.render("layout-mini");
});
app.get("/page-404", (req, res) => {
  res.render("page-404");
});
app.get("/page-500", (req, res) => {
  res.render("page-500");
});

app.get("/page-clients", (req, res) => {
  res.render("page-clients");
});
app.get("/page-coming-soon", (req, res) => {
  res.render("page-coming-soon");
});
app.get("/page-contacts", (req, res) => {
  res.render("page-contacts");
});
app.get("/page-employees", (req, res) => {
  res.render("page-employees");
});
app.get("/page-faq", (req, res) => {
  res.render("page-faq");
});
app.get("/page-file-manager", (req, res) => {
  res.render("page-file-manager");
});
app.get("/page-gallery", (req, res) => {
  res.render("page-gallery");
});
app.get("/page-pricing", (req, res) => {
  res.render("page-pricing");
});
app.get("/page-task-list", (req, res) => {
  res.render("page-task-list");
});
app.get("/chart-apex", (req, res) => {
  res.render("chart-apex");
});
app.get("/chart-c3", (req, res) => {
  res.render("chart-c3");
});
app.get("/chart-chartist", (req, res) => {
  res.render("chart-chartist");
});
app.get("/chart-chartjs", (req, res) => {
  res.render("chart-chartjs");
});
app.get("/chart-flot", (req, res) => {
  res.render("chart-flot");
});
app.get("/chart-knob", (req, res) => {
  res.render("chart-knob");
});
app.get("/chart-morris", (req, res) => {
  res.render("chart-morris");
});
app.get("/chart-sparkline", (req, res) => {
  res.render("chart-sparkline");
});
app.get("/app-chat", (req, res) => {
  userModel
    .findOne(req.body.id)
    .then((data) => res.render("app-chat", { data: data }))
    .catch((err) => console.log(err));
});
app.get("/course-upload", (req, res) => {
  Course.find()
    .then((data) => res.render("course-upload", { data: data }))
    .catch((err) => console.log(err));
});
app.get("/login", (req, res) => {
  res.render("login");
});
app.get("/login-by-email", (req, res) => {
  res.render("login-by-email");
});
app.get("/subscribers", (req, res) => {
  userModel1.find().then((data) => {
    res.render("subscribers", { data: data });
  });
});
app.get("/final", (req, res) => {
  userModel.find().then((data) => {
    res.render("final", { data: data });
  });
});
app.get("/final-exam-upload", (req, res) => {
  res.render("final-exam-upload");
});

app.get("/assistant", (req, res) => {
  res.render("assistant");
});
app.get("/support", (req, res) => {
  res.render("support");
});
app.get("/calculator", (req, res) => {
  res.render("calculator");
});
app.get("/chapter-assignment", (req, res) => {
  res.render("chapter-assignment");
});

app.get("/user-profile", (req, res) => {
  userModel1
    .find({ _id: "64e5b42abd4526dfd776be37" })
    .then((data) => {
      res.render("user-profile", { data: data }); // Include the data in the render call
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("An error occurred");
    });
});

app.get("/Charts", (req, res) => {
  res.render("Charts");
});
app.get("/static-charts", (req, res) => {
  res.render("static-charts");
});

// GET API for  course/Program starts
app.get("/course-page", function (req, res) {
  Course.find()
    .then((data) => {
      res.render("course-page", { data: data });
      console.log(data);
    })
    .catch((error) => {
      console.log(error);
    });
});

// GET API for  program/course ENDS

// app.get("/course-chapter/:id", (req, res) => {
//   chapter.find().then((data) => {
//     res.render("course-chapter", { data: data });
//   });
// });

// app.get("/course-chapter", (req, res) => {
//   const chapterId = req.params.id; // Get the chapter ID from the URL parameter
//   console.log(chapterId)
//   // Assuming you are using a model named 'Chapter'
//   chapter.find().then((data) => {
//     if (!chapter) {
//       return res.status(404).send("Chapter not found"); // Handle if chapter doesn't exist
//     }
//     res.render("course-chapter", { data: data });
//   }).catch((error) => {
//     console.error(error);
//     res.status(500).send("Internal Server Error");
//   });
// });

// app.get("/course-chapter/:id", (req, res) => {
//   const courseId = req.params.id;

//   // Assuming you have a courseChapters field in your Course model
//   chapter.findById(courseId)
//     .then((data) => {
//       res.render("course-chapter", { data: data });

//       if (!data) {
//         return res.status(404).send("Course not found");
//       }
//       // console.log(data);
//     })
//     .catch((error) => {
//       console.log(error);
//       res.status(500).send("Internal Server Error");
//     });
// });

// app.get('/course-chapter/:id ', async (req, res) => {
//   const courseId = req.params.id;
//   try {
//     // Fetch course details and its chapters using courseId
//     const data1 = await Course.findById(courseId).populate('courseChapters');
//     console.log(data1)
//     res.render('course-chapter', { data:data1  });
//   } catch (error) {
//     console.log(error);
//   }
// });

app.get("/course-chapter/:id", (req, res) => {
  const courseId = req.params.id;

  // Assuming you have a courseChapter field in your chapter schema
  chapter
    .aggregate([
      {
        $match: { cid: courseId }, // Filter chapters by courseChapter
      },
      {
        $lookup: {
          from: "TOROFX_courses", // Use the correct model or collection name
          localField: "cid",
          foreignField: "_id",
          as: "courseDetails", // Name for the new field containing course information
        },
      },
    ])
    .then((data) => {
      if (!data || data.length === 0) {
        res.redirect(`/course-chapter-upload/${courseId}`);
        console.log(`No chapters found for courseId: ${courseId}`);
        // return res.status(404).send("Chapters not found");
      }
      console.log("Course found:", data);
      res.render("course-chapter", { data: data });
    })
    .catch((error) => {
      console.log("Error:", error);
      res.status(500).send("Internal Server Error");
    });
});

app.get("/course-chapter-upload/:cid", (req, res) => {
  const cid = req.params.cid;
  console.log(`course id is ${cid}`);
  chapter.find().then((data) => {
    res.render("course-chapter-upload", { data: data });
  });
});

app.post("/submit-quiz", async (req, res) => {
  try {
    const quizAnswer = {
      question: req.body.question,
      option1: req.body.option1,
      option2: req.body.option2,
      option3: req.body.option3,
      option4: req.body.option4,
      correctAnswer: req.body.correctAnswer,
    };
    const quiz = await questionModel(quizAnswer);
    quiz.save();
    res.status(201).json({
      success: true,
      quiz,
    });
  } catch (err) {
    console.log("internal err");
    res.status(500).json({
      success: false,
      err: err,
    });
  }
});
// app.get('/', (req, res)=>{
//     res.redirect(`/${uuidV4()}`);
// })
// app.get('/:room', (req, res)=>{
//     res.render('room', {roomId: req.params.room});
// })

// register

app.post("/auth-register", async (req, res) => {
  const { fname, lname, email, username } = req.body;
  var salt = bcrypyt.genSaltSync(10);
  // console.log(salt);
  var password = bcrypyt.hashSync(req.body.password, salt);

  const user = await userModel.findOne({ email: email });
  if (user) {
    return res.status(400).send("user already exists!");
  }

  const register = new userModel({
    fname,
    lname,
    email,
    username,
    password,
  });

  register
    .save()
    .then(() => {
      res.status(200).json({ message: "Registration successfull" });
    })
    .catch((err) => {
      res.status(400).json({ err: "internal err" });
      console.log(err);
    });
});
// const fileFilter2 = (req, res, cb) => {
//   const allowedFileTypes = ["image/png", "image/jpg", "image/png"];
//   if (allowedFileTypes.includes(file.mimetype)) {
//     cb(null, true);
//   } else cb(null, false);
// };
// const storage4 = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "./public/user");
//   },
//   filename: function (req, file, cb) {
//     cb(null, file.originalname);
//   },
// });
// const upload4=multer({storage:storage4,fileFilter:fileFilter2});
// app.post("/user-profile",upload4.single('photo'), async (req, res) => {
//   const { username, email, mob, status, acheivement, location, pro, program } =
//     req.body;
//  const {photo}=req.file;
//   console.log("Received data from the form:", req.body);

//   try {
//     const user = await userModel1.findOne({ email: email });
//     console.log("User found in the database:", user);

//     if (user) {
//       console.log("User already exists!");
//       return res.status(400).send("User already exists!");
//     }

//     const register1 = new userModel1({
//       status,
//       pro,
//       program,
//       email,
//       username,
//       location,
//       mob,
//       acheivement,
//       photo: photo ? photo.filename : null,
//     });

//     await register1.save();

//     console.log("User registered successfully!");
//     return res.status(200).json({ message: "Registration successful" });
//   } catch (err) {
//     console.error("Error occurred while processing registration:", err);
//     return res.status(500).json({ err: "Internal server error" });
//   }
// });
const fileFilter2 = (req, file, cb) => {
  const allowedFileTypes = ["image/png", "image/jpg", "image/jpeg"];
  if (allowedFileTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const storage4 = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/user");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload4 = multer({ storage: storage4, fileFilter: fileFilter2 });

app.post("/user-profile", upload4.single("photo"), async (req, res) => {
  const { username, email, mob, status, acheivement, location, pro, program } =
    req.body;
  const photo = req.file;
  console.log("Received data from the form:", req.body);

  try {
    const user = await userModel1.findOne({ email: email });
    console.log("User found in the database:", user);

    if (user) {
      console.log("User already exists!");
      return res.status(400).send("User already exists!");
    }

    const register1 = new userModel1({
      status,
      pro,
      program,
      email,
      username,
      location,
      mob,
      acheivement,
      // photo: photo ? photo.filename : null,
      photo: photo.filename,
    });

    await register1.save();

    console.log("User registered successfully!");
    return res.status(200).json({ message: "Registration successful" });
  } catch (err) {
    console.error("Error occurred while processing registration:", err);
    return res.status(500).json({ err: "Internal server error" });
  }
});

app.get("/admin-profile", isAuthenticated, (req, res) => {
  // res.send();
  const id = req.user;
  console.log(id);
  userModel
    .findOne(id)
    .then((data) => {
      res.render("admin-profile", { data: data });
      // console.log(data);
    })
    .catch((err) => console.log(err));
});

// Logout
app.get("/logout", function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/login");
  });
});

// login

app.post(
  "/login",
  passport.authenticate("local", { successRedirect: "/index" }),
  (req, res) => {
    // app.post('/login', (req,res)=>{

    // const { email, password } = req.body;

    // if (!email || !password) {
    //     res.status(400).json({ Error: "invalid credintials" });
    // }

    // const user = userModel.findOne({ email: email }).exec();
    // if (!user) {
    //     return res.status(400).json({ error: "Email does not exist!" });

    // }
    // req.session.user=user;
    // res.redirect('/index');
    res.json(req.user);
  }
);

// app.post(
//   "/login",
//   passport.authenticate("local", { session: false }), // Disable session-based authentication for JWT
//   (req, res) => {
//     // Generate JWT token for the authenticated user
//     const payload = { id: req.user.id, username: req.user.username };
//     const token = jwt.sign(payload, process.env.SECRET, { expiresIn: "300s" });

//     // Return the token as a response
//     console.log("Token generated successfully");
//     res.status(200).json({ token: token });
//   }
// );

// Login by email Nodemailer starts

// sgMail.setApiKey(API_KEY);

// app.post("/Login-by-email", async (req, res) => {
//   try {
//     const userEmail = req.body.email;
//     const userData = await userModel.findOne({ email: userEmail }).exec();

//     if (userData) {
//       const token =
//         Math.random().toString(36).substring(2, 15) +
//         Math.random().toString(36).substring(2, 15);
//       const newEmail = await userModel.updateOne(
//         { email: userEmail },
//         { $set: { token: token } }
//       );
//       // res.status(200).send({ success: true, msg: " try Login by link" });

//       const mailOptions = {
//         to: userEmail,
//         from: {
//           name: "sendgrid",
//           email: "noreply@debopay.com",
//         },
//         subject: `Login link`,
//         text: `Click the following link to login your account: http://localhost:8000/index?token=${token}`,
//         html: `<p>Click the following link to login your account: <a href="http://localhost:8000/index?token=${token}">Login</a></p>`,
//       };

//       sgMail
//         .send(mailOptions)
//         .then(() => res.send("Login link sent"))
//         .catch((err) => {
//           console.log(err);
//           res.status(500).send("Error sending email");
//         });
//     } else {
//       res.status(200).send({ msg: "Email does not exist" });
//     }
//   } catch (error) {
//     res.status(400).send({ success: false, msg: error.message });
//   }
// });

app.post("/login-by-email", async (req, res) => {
  try {
    const userEmail = req.body.email;
    const userData = await userModel.findOne({ email: userEmail }).exec();

    if (userData) {
      const token = generateJwtToken(userData.id);

      console.log(token);

      const newEmail = await userModel.updateOne(
        { email: userEmail },
        { $set: { token: token } }
      );

      res.status(200).send({
        success: true,
        msg: "link has been sent to your email, kindly click on the link to continue logging in...",
      });

      const transporter = Nodemailer.createTransport({
        service: "Gmail",
        auth: {
          user: "robin.cyril@appsimagica.com",
          pass: "luohzfqmgbxnbmuh", // Update this with your Gmail password
        },
      });

      const mailOptions = {
        to: userEmail,
        subject: `Login link`,
        text: `Click the following link to access your account: http://localhost:8000/verify?token=${token}&userID=${userData.id}`,
        html: `<p>Click the following link to access your account: http://localhost:8000/verify?token=${token}&userID=${userData.id}</p>`,
      };

      transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
          console.log(err);
          res.send("Error sending email");
        } else {
          console.log(info);
          res.send("Link sent");
        }
      });
    } else {
      res.status(200).send({ msg: "Email does not exist" });
    }
  } catch (error) {
    res.status(400).send({ success: false, msg: error.message });
  }
});

function generateJwtToken(userID) {
  const token = jwt.sign({ userID: userID }, process.env.secret, {
    expiresIn: "1h",
  });
  console.log(userID);
  return token;
}

app.get("/verify", async (req, res) => {
  const token = req.query.token;
  console.log("Received token:", token);
  console.log("Req User:", req.user);
  try {
    const decodedToken = jwt.verify(token, process.env.secret);
    console.log("Decoded token:", decodedToken);

    if (decodedToken && decodedToken.userID) {
      const user = await userModel.findById(decodedToken.userID).exec();
      console.log("Found user:", user);

      if (user) {
        // res.redirect('/login')
        console.log(`Welcome ${user.username}`);
        // res.send(`Welcome ${user.username}`);
        res.render("index", { user: user });
      } else {
        console.log("User not found");
        res.sendStatus(404); // User not found
      }
    } else {
      console.log("Invalid token or missing userID");
      res.sendStatus(401); // Invalid token or missing userID
    }
  } catch (error) {
    console.log("Token verification error:", error.message);
    res.sendStatus(401); // Invalid token
  }
});
// app.get("/verify", passport.authenticate("jwt", { session: false }), async (req, res) => {
//   try {
//     const user = req.user;
//     const authorizationHeader = req.headers.authorization;
//     console.log("Authorization Header:", authorizationHeader);
//     // Rest of your code
//     if (user) {
//       console.log(`Welcome ${user.username}`);
//       // Render the index view with the user data
//       res.render("index", { user: user }); // Pass the user data to the view
//     } else {
//       console.log("User not found");
//       res.sendStatus(404); // User not found
//     }
//   } catch (error) {
//     console.log("Token verification error:", error.message);
//     res.sendStatus(401); // Invalid token
//   }
// });

// Nodemailer ends
//  Google Login starts

app.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

app.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
    successRedirect: "/admin-profile",
  }),
  function (req, res) {
    // Successful authentication, redirect to the desired page
    // res.redirect("/index");
  }
);

//  Google Login ends
// Chat server

// Node server will handle socet.io connection

const users = {};
io.on("connection", (socket) => {
  socket.on("new-user-joined", (name) => {
    console.log("New User:", name);
    users[socket.id] = name;
    socket.broadcast.emit("user-joined", name);
  });

  socket.on("send", (message) => {
    socket.broadcast.emit("receive", {
      message: message,
      name: users[socket.id],
    });
  });
  socket.on("disconnect", (message) => {
    socket.broadcast.emit("left", users[socket.id]);
    delete users[socket.id];
  });
});

// End of Chat Server
// start of video Server

io.on("connection", (socket) => {
  socket.on("join-room", (roomId, userID) => {
    // console.log(roomId, userID)
    socket.join(roomId);
    socket.to(roomId).emit("user-conected", userID);

    socket.on("disconnected", () => {
      socket / to(roomId).emit("user-dosconnect");
    });
  });
});
// End of video Server

// Profile update
const filter1 = (req, file, cb) => {
  const allowedFileTypes = ["image/jpeg", "image/png", "image/svg"];
  if (allowedFileTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const storage3 = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, "./public/profile");
  },
  filename: function (req, file, callback) {
    callback(null, file.originalname);
  },
});

const upload3 = multer({ storage: storage3, fileFilter: filter1 });
app.post("/update/v1/:id", upload3.single("Photo"), async (req, res) => {
  const { id } = req.params;
  // const { password } = req.body;

  try {
    // Hash the new password
    // const hashedPassword = bcrypt.hashSync(password, 10);

    // Construct the update object
    const updatedUser = {
      // pass: hashedPassword,
      fname: req.body.fname,
      username: req.body.username,
      email: req.body.email,
      Photo: req.file.filename,
    };

    // Find the user by ID and update the fields
    await userModel.findByIdAndUpdate(id, { $set: updatedUser });

    res.status(200).json({ message: "Successfully updated!", success: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server error" });
  }
});
// Profile update ends

// Category
app.post("/createCategory", async (req, res) => {
  try {
    const category_data = await categoryModel.find();
    let checking = false;

    if (category_data.length > 0) {
      for (let i = 0; i < category_data.length; i++) {
        if (
          category_data[i].category.toLowerCase() ===
          req.body.category.toLowerCase()
        ) {
          checking = true;
          break;
        }
      }
    }

    if (checking) {
      return res.status(200).send({
        success: false,
        msg: "This category already exists.",
      });
    }
    const { category, category_id } = req.body;
    // Create a new category instance
    const newCategory = new categoryModel({
      category,
      category_id,
    });
    console.log(category);

    // Save the new category to the database
    const savedCategory = await newCategory.save();

    res.status(201).send({
      success: true,
      msg: "Category created successfully.",
      data: savedCategory,
    });
  } catch (error) {
    res.status(400).send({
      success: false,
      msg: error.message,
    });
  }
});

// category ends

// TradingView Charts starts

// app.get(':/symbol/:interval', async(req,res)=>{
//   try {
//     const {symbol, interval}=req.params;
//     const resp=await globalThis()
//   } catch (error) {

//   }
// })
// TradingView Charts ends

// Course Starts

const FileFilter1 = (req, file, cb) => {
  const allowedFileTypes = [
    "application/pdf",
    "image/jpg",
    "image/jpeg",
    "image/png",
    "video/mp4",
  ];
  if (allowedFileTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const storage1 = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, "./public/course-list");
  },
  filename: function (req, file, callback) {
    callback(null, file.originalname);
  },
});

const upload1 = multer({ storage: storage1, fileFilter: FileFilter1 });

app.post(
  "/course",
  upload1.fields([{ name: "photo", maxCount: 1 }]),
  (req, res) => {
    const { file_name, price, duration } = req.body;

    // Access the uploaded files from the request object
    const files = req.files;

    // Check if the files are uploaded and available in the files object
    if (!files || !files.photo) {
      res.status(400).json({ error: "Both video and photo are required." });
      return;
    }

    // Access the file paths for further processing
    const photoPath = path.basename(files.photo[0].path);

    // Assuming you have a Mongoose model called `li    brary` for saving the file paths
    const courseMain = new Course({
      file_name,
      price,
      duration,
      Photo: photoPath,
    });

    courseMain
      .save()
      .then(() => {
        console.log("Successfully added the program..");
        res.status(200).json({ message: "program Added" });
      })
      .catch((err) => {
        console.log(err);
        res
          .status(500)
          .json({ error: "An error occurred while saving the course." });
      });
  }
);
// Course ends

// Chapter STarts
const Filter = (req, file, cb) => {
  const allowedFileTypes = [
    "image/jpeg",
    "image/png",
    "image/svg",
    "video/mp4",
  ];
  if (allowedFileTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
const storage2 = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, "./public/chapters");
  },
  filename: function (req, file, callback) {
    callback(null, file.originalname);
  },
});

const upload2 = multer({ storage: storage2, fileFilter: Filter });

app.post(
  "/course-chapter-upload/:cid",
  upload2.fields([{ name: "video" }, { name: "Photo" }]),
  (req, res) => {
    const cid = req.params.cid;
    console.log(cid);
    const { chapter_name, program } = req.body;
    const files = req.files;
    if (!files || !files.Photo || !files.video) {
      res.send("required fields are empty");
      return;
    }
    const photoPath = path.basename(files.Photo[0].path);
    const videoPath = path.basename(files.video[0].path);

    const chpater_upload = new chapter({
      chapter_name,
      program,
      Photo: photoPath,
      video: videoPath,
      cid: cid,
    });
    chpater_upload
      .save()
      .then(() =>
        res.status(200).json({ message: "successfully uploaded the chapter" })
      )
      .catch((err) => console.log(err));
  }
);

// Chapter Ends

// uploading file using Multer

const FileFilter = (req, file, cb) => {
  const allowedFileTypes = [
    "application/pdf",
    "image/jpg",
    "image/jpeg",
    "image/png",
    "video/mp4",
  ];
  if (allowedFileTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
// const allowedFileTypes = ['application/pdf', 'image/jpg', 'image/jpeg', 'image/png', 'video/mp4'];

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         if (allowedFileTypes.includes(file.mimetype)) {
//             if (!fs.existsSync('public')) {
//                 fs.mkdirSync('public');
//             }
//             if (!fs.existsSync('public/videos')) {
//                 fs.mkdirSync('public/videos');
//             }
//             if (!fs.existsSync('public/photos')) {
//                 fs.mkdirSync('public/photos');
//             }

//             if (file.mimetype.startsWith('video/')) {
//                 cb(null, 'public/videos');
//             } else if (file.mimetype.startsWith('image/')) {
//                 cb(null, 'public/photos');
//             } else {
//                 cb(null, './assets/imgs');
//             }
//         } else {
//             cb(new Error('Invalid file type.'));
//         }
//     },
//     filename: function (req, file, cb) {
//         cb(null, file.originalname);
//     }
// });
const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, "./public/photos");
  },
  filename: function (req, file, callback) {
    callback(null, file.originalname);
  },
});

const upload = multer({ storage, fileFilter: FileFilter });

// Library Starts
app.post(
  "/library-upload",
  upload.fields([{ name: "video" }, { name: "photo" }]),
  (req, res) => {
    var { file_name, category } = req.body;

    // Access the uploaded files from the request object
    const files = req.files;

    // Check if the files are uploaded and available in the files object
    if (!files || !files.video || !files.photo) {
      res.status(400).json({ error: "Both video and photo are required." });
      return;
    }

    // Access the file paths for further processing
    const videoPath = path.basename(files.video[0].path);
    const photoPath = path.basename(files.photo[0].path);

    // Assuming you have a Mongoose model called `library` for saving the file paths
    const Library = new library({
      file_name,
      category,
      video: videoPath,
      Photo: photoPath,
    });

    Library.save()
      .then(() => {
        console.log("Successfully added the course..");
        res.status(200).json({ message: "Course Added" });
      })
      .catch((err) => {
        console.log(err);
        res
          .status(500)
          .json({ error: "An error occurred while saving the course." });
      });
  }
);

// app.get('/video', (req, res) => {

//     const range = req.headers.range;

//     if (!range) {
//         res.status(400).send('err');
//     }
//     const videoPath = "./public/videos/video (2160p).mp4";
//     const videosize = fs.statSync(videoPath).size;

//     const chunkSize = 10 ** 6;
//     const start = Number(range.replace(/\D/g, ""));
//     const end = Math.min(start + chunkSize, videosize - 1);
//     const contentLength = end - start + 1;

//     const headers = {
//         "Content-Range": `bytes ${start}-${end}/${videosize}`,
//         "Accept-Ranges": 'bytes',
//         "Content-Length": contentLength,
//         "Content-Type": 'video/mp4'
//     }
//     res.writeHead(206, headers);

//     const videoStream = fs.createReadStream(videoPath, { start, end });
//     videoStream.on('open', () => {
//         videoStream.pipe(res);
//     });

//     videoStream.on('error', (err) => {
//         console.error('Error reading video stream:', err);
//         res.status(500).send('Video streaming error.');
//     });

// })

app.get("/Library", (req, res) => {
  library
    .find()
    .then((data) => {
      res.render("Library", { data: data });
    })
    .catch((err) => console.log(err));
});

app.get("/library-upload", (req, res) => {
  categoryModel
    .find()
    .then((data) => {
      res.render("library-upload", { data: data });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("An error occurred");
    });
});

// Library Ends

// Delete CHapters

app.get("/delete/:id", isAuthenticated, (req, res) => {
  console.log(req.params.id);

  chapter
    .findByIdAndRemove(req.params.id)
    .then(() => {
      res.send("successfully deleted");
    })
    .catch((err) => console.log(err));
});
// Delete Chapter ENDS

// Delete Course

app.get("/delete/V1/:id", isAuthenticated, (req, res) => {
  console.log(req.params.id);

  Course.findByIdAndRemove(req.params.id)
    .then(() => {
      res.send("successfully deleted");
    })
    .catch((err) => console.log(err));
});
// Delete Course ENDS

// Delete Library starts

app.get("/delete/V2/:id", isAuthenticated, (req, res) => {
  console.log(req.params.id);

  library
    .findByIdAndRemove(req.params.id)
    .then(() => {
      res.send("successfully deleted");
    })
    .catch((err) => console.log(err));
});
// Delete Library ENDS

app.get("/course-edit", (req, res) => {
  // console.log(req.user._id);

  Course.find()
    .then((data) => {
      res.render("course-edit", { data: data });
      // console.log(data);
    })
    .catch((error) => {
      console.log(error);
    });
});

app.get("/chapter-edit/:id", (req, res) => {
  // console.log(req.user._id);
const id=req.params.id;
console.log(`course id is ${id}`);

  chapter
    .find({cid:id})
    .then((data) => {
      res.render("chapter-edit", { data: data });
      // console.log(data);
    })
    .catch((error) => {
      console.log(error);
    });
});

app.get("/library-edit", (req, res) => {
  library
    .find()
    .then((data) => {
      res.render("library-edit", { data: data });
      console.log(data);
    })
    .catch((error) => {
      console.log(error);
    });
});

// app.get('/library-edit/:id', (req, res) => {

//     library.findById(req.params.id)
//         .then((data) => {
//             console.log(data);
//             res.render('library-edit', { data: data });
//         })
//         .catch((error) => {
//             console.log(error);
//         })
// })

// EDIT STARTS
app.post("/edit/:id", (req, res) => {
  // id = req.params.id;
  var updatedit = {
    file_name: req.body.file_name,
    // lname: req.body.lname,
    price: req.body.price,
    // duration: req.body.duration,
    Photo: req.body.Photo,
  };
  // if (req.file) {
  //     updatedit.photo = {
  //         data: req.file.filename,
  //         contentType: 'image/jpg',
  //     };
  // }
  Course
    .findByIdAndUpdate(req.params.id, updatedit)
    .then(() => {
      // res.redirect('course-page');
      res.send("successfully updated!");
    })
    .catch((error) => {
      // res.redirect('/dashboard');
      console.log(error);
    });
});
// EDIT ENDS

// Library Edit starts

// app.post('/update-selected-videos', upload.fields([
//     { name: 'video', maxCount: 1 }, // 'video' field is for video file (maxCount: 1 means only one file)
//     { name: 'Photo', maxCount: 1 } // 'Photo' field is for photo file (maxCount: 1 means only one file)
//   ]), (req, res) => {
//     const selectedVideoIds = req.body.selectedItems;
//        console.log(selectedVideoIds)
//     var updatedVideo = {
//       file_name: req.body.file_name,
//       category: req.body.category,
//       video: req.files['video'][0].filename, // Access the video file name from req.files
//       Photo: req.files['Photo'][0].filename // Access the photo file name from req.files
//     };
// //   console.log(selectedVideoIds)
//     // Use the 'findOneAndUpdate' method to find and update the video by its ID
//     library.findByIdAndUpdate( selectedVideoIds , updatedVideo)
//       .then(() => {
//         res.send('Successfully updated!');
//       })
//       .catch((error) => {
//         console.log(error);
//         res.status(500).send('Error occurred while updating the video.');
//       });
//   });
app.post(
  "/update-selected-videos",
  upload.fields([
    { name: "video", maxCount: 2 },
    { name: "Photo", maxCount: 2 },
  ]),
  (req, res) => {
    const selectedVideoIds = req.body.selectedItems;
    console.log(selectedVideoIds);

    // Extract file_name and category and take the first element if they are arrays
    const updatedVideo = {
      file_name: Array.isArray(req.body.file_name)
        ? req.body.file_name[0]
        : req.body.file_name,
      category: Array.isArray(req.body.category)
        ? req.body.category[0]
        : req.body.category,
      video: req.files["video"][0].filename,
      Photo: req.files["Photo"][0].filename,
    };

    // Convert selectedVideoIds to an array if it's not already one
    const videoIdsArray = Array.isArray(selectedVideoIds)
      ? selectedVideoIds
      : [selectedVideoIds];

    // Use Promise.all to update each video with its ID in parallel
    Promise.all(
      videoIdsArray.map((videoId) => {
        return library.findByIdAndUpdate(videoId, updatedVideo);
      })
    )
      .then(() => {
        res.send("Successfully updated selected Liberary!");
      })
      .catch((error) => {
        console.log(error);
        res.status(500).send("Error occurred while updating the Liberary.");
      });
  }
);

// Library Edit ends

// Course Edit starts
app.post(
  "/update-selected-course",
  upload.fields([{ name: "Photo", maxCount: 2 }]),
  (req, res) => {
    const selectedVideoIds = req.body.selectedItems;
    console.log(selectedVideoIds);

    // Extract file_name and category and take the first element if they are arrays
    const updatedCourse = {
      file_name: Array.isArray(req.body.file_name)
        ? req.body.file_name[0]
        : req.body.file_name,
      price: Array.isArray(req.body.price) ? req.body.price[0] : req.body.price,
      Photo: req.files["Photo"][0].filename,
    };

    // Convert selectedVideoIds to an array if it's not already one
    const idsArray = Array.isArray(selectedVideoIds)
      ? selectedVideoIds
      : [selectedVideoIds];

    // Use Promise.all to update each video with its ID in parallel
    Promise.all(
      idsArray.map((videoId) => {
        return course.findByIdAndUpdate(videoId, updatedCourse);
      })
    )
      .then(() => {
        res.send("Successfully updated the course!");
      })
      .catch((error) => {
        console.log(error);
        res.status(500).send("Error occurred while updating the course.");
      });
  }
);
// Course Edit Ends

// Chapter Starts
app.post(
  "/update-selected-chapters",
  upload.fields([
    { name: "video", maxCount: 2 },
    { name: "Photo", maxCount: 2 },
  ]),
  (req, res) => {
    const selectedChapterIds = req.body.selectedItems;
    console.log(selectedChapterIds);

    // Extract chapter_name and program and take the first element if they are arrays
    const updatedChapter = {
      chapter_name: req.body.chapter_name[0],
      program: req.body.program[0],
      video: req.files["video"][0].filename,
      Photo: req.files["Photo"][0].filename,
    };
    console.log(updatedChapter);

    // Convert selectedChapterIds to an array if it's not already one
    const chapterIdsArray = Array.isArray(selectedChapterIds)
      ? selectedChapterIds
      : [selectedChapterIds];

    // Use Promise.all to update each chapter with its ID in parallel
    Promise.all(
      chapterIdsArray.map((chapterId) => {
        return chapter.findByIdAndUpdate(chapterId, updatedChapter);
      })
    )
      .then(() => {
        res.send("Successfully updated selected Chapters!");
      })
      .catch((error) => {
        console.log(error);
        res.status(500).send("Error occurred while updating the Chapters.");
      });
  }
);

// Chapter Edit
// Server listening
http.listen(PORT, () => {
  console.log(`server is runinng on PORT  ${PORT}`);
});
