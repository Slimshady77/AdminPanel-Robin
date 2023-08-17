const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth2").Strategy;
const userModel=require('./model/model')
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      passReqToCallback: true,
    },
    function (request, accessToken, refreshToken, profile, done) {
      console.log(profile);
      return done(null, profile);
    }
  )
);
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