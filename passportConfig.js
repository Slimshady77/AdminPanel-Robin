const LocalStrategy = require("passport-local").Strategy;
const passport = require("passport");
const userModel = require("./model/model.js");
const bcrypyt = require("bcrypt");

exports.initializingPassport = (passport) => {
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await userModel.findOne({ username });

        if (!user) return done(null, false, { message: "Incorrect username" });

        const isPasswordValid = bcrypyt.compareSync(password, user.password);
        if (!isPasswordValid)
          return done(null, false, { message: "Incorrect password" });
        else {
          // Store user information in the session
          // const userSessionData = {
          //   id: user._id,
          //   username: user.username,
          //   // Add more user details as needed
          // };
          // console.log(userSessionData);

          return done(null, user);
        }
      } catch (error) {
        return done(error, false);
      }
    })
  );
};

passport.serializeUser((user, done) => {
  done(null, user.email);
});
passport.deserializeUser(async (email, done) => {
  try {
    const user = await userModel.findOne({email});
    done(null, user);
  } catch (error) {
    done(error, false);
  }
});


exports.isAuthenticated=(req, res, done)=>{
  if (req.user) {
    console.log(req.user)
    return done();
  }
  res.send("not allowed!");
  return false;
}