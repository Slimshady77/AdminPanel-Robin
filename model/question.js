const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
url = process.env.DATABASE;

mongoose.connect(url, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});

const userSchema = mongoose.Schema({
  question: String,
  answer: {
    type: String,
    required: true,
  },
});

const question = mongoose.model("question", userSchema);
module.exports = question;
