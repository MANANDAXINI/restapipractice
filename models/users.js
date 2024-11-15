const mongoose = require("mongoose");
mongoose
  .connect('mongodb://127.0.0.1:27017/yt-app-1')
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB connection error:", err));


  const userSchema = new mongoose.Schema({
    first_name: {
      type: String,
      required: true,
    },
    last_name: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
  });

  const User = mongoose.model('User', userSchema);

  module.exports(users);