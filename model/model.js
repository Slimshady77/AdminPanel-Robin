const mongoose=require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

const url= process.env.DATABASE;
mongoose.connect(url,{
    useUnifiedTopology:true,useNewUrlParser:true
})
.then(()=>console.log("successfully connected to Database!"))
.catch((err)=>console.log(err));

const userSchema=mongoose.Schema({
    fname:{
        type:String,
        // required:true
    },
    lname:{
        type:String,
        // required:true
    },
    email:{
        type:String,
        // required:true
    },
    username:{
        type:String,
        // required:true
    },
    password:{
        type:String,
        // required:true
    },
    Photo:String,
})

const register= new mongoose.model('TOROFX', userSchema);
module.exports=register;