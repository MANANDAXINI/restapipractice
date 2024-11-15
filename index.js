const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 8000;
const userroutes=require('./routes/users')

const {connectmongodb}=require("./views/connections");
const logreqres = require("./middlewares");

connectmongodb('mongodb://127.0.0.1:27017/yt-app-1 ')
// Connection mongoose with database
mongoose
  .connect('mongodb://127.0.0.1:27017/yt-app-1')
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB connection error:", err));

// Schema


// Middleware to parse URL-encoded data and JSON data
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Middleware for logging requests
app.use((req, res, next) => {
  console.log("Hello from middleware 1");
  next();
});


app.use(logreqres("log.txt"));




// Path to the JSON file
const filePath = path.join(__dirname, "MOCK_DATA (1).json");

// Function to read users from the JSON file
const getUsers = () => {
  if (!fs.existsSync(filePath)) {
    // If the file does not exist, create an empty array
    return [];
  }
  const data = fs.readFileSync(filePath, "utf8");
  return JSON.parse(data);
};

// Function to save users to the JSON file
const saveUsers = (users) => {
  fs.writeFileSync(filePath, JSON.stringify(users, null, 2));
};

// Route to get all users
app.get("/api/users", (req, res) => {
  const users = getUsers();
  res.setHeader("X-Custom-Header", "CustomHeaderValue"); // Set custom header
  return res.json(users);
});

// Route to display users as an HTML list

app.use("/user",userroutes)
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
