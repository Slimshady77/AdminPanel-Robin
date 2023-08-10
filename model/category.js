const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

const url = process.env.DATABASE;

mongoose
  .connect(url, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then(() => console.log("connected!"))
  .catch((err) => console.log(err));

const categorySchema = mongoose.Schema({
  category:String,
  category_id:String
});
const cat = mongoose.model("category", categorySchema);
module.exports = cat;
