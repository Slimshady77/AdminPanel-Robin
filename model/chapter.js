const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

const url = process.env.DATABASE;
mongoose.connect(url, {
    useUnifiedTopology: true, useNewUrlParser: true
})
    .then(() => console.log("successfully connected to Database!"))
    .catch((err) => console.log(err));

const courseSchema = mongoose.Schema({
    chapter_name: {
        type: String,
        // required:true
    },
    program:{
        type: String
    },
    Photo: String,
    video:String
})

const chapter = mongoose.model('TOROFX_Chapter', courseSchema);
module.exports = chapter;