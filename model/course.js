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
    file_name: {
        type: String,
        // required:true
    },
    price: Number,
    duration:Number,
    Photo: String,
})

const course = mongoose.model('TOROFX_course', courseSchema);
module.exports = course;