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
      
            return done(null, user);
          } catch (error) {
            return done(error, false);
          }
        })
      );
      
};

passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser(async (id, done) => {
  try {
    const user = await userModel.findById(id);
    done(null, user);
  } catch (error) {
    done(error, false);
  }
});
