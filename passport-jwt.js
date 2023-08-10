const jwtStrategy=require('passport-jwt').Strategy
const Extractjwt=require('passport-jwt').ExtractJwt
const dotenv=require('dotenv');
 dotenv.config({path:'./config'})
module.exports=function(passport){
passport.use(
    new jwtStrategy(
        {
            secretKey:process.env.SECRET,
            jwtFromRequest:Extractjwt.fromAuthHeaderAsBearerToken()

        },
        function(jwt_payload,cb){
            cb(null, false)
        }
    )

)
}



 
 