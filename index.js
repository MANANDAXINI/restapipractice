const express = require("express");
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const app = express();
const PORT = 8000;

// Connection mongoose with database
mongoose
  .connect('mongodb://127.0.0.1:27017/yt-app-1')
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB connection error:", err));

// Schema
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

// Middleware to parse URL-encoded data and JSON data
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Middleware for logging requests
app.use((req, res, next) => {
  console.log("Hello from middleware 1");
  next();
});

// Middleware for conditional handling and logging requests
app.use((req, res, next) => {
  const logFilePath = path.join(__dirname, "log.txt");
  const logEntry = `\n${Date.now()}: ${req.method}:${req.path}`;

  fs.appendFile(logFilePath, logEntry, (err) => {
    if (err) {
      console.error("Failed to write to log file:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
    next(); // Continue to the next middleware or route handler
  });
});

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
app.get("/user", (req, res) => {
  const users = getUsers();
  res.setHeader("X-Custom-Header", "CustomHeaderValue"); // Set custom header
  const html = `
        <ul>
            ${users.map((user) => `<li>${user.first_name}</li>`).join('')}
        </ul>
    `;
  res.send(html);
});

// Route to get a specific user by ID
app.get("/api/user/:id", (req, res) => {
  const id = Number(req.params.id); // Convert id to a number
  const users = getUsers();
  const user = users.find((user) => user.id === id);
  if (user) {
    res.setHeader("X-Custom-Header", "CustomHeaderValue"); // Set custom header
    return res.json(user);
  } else {
    return res.status(404).json({ error: "User not found" });
  }
});

// Route to update a user by ID (patch)
app.patch("/api/user/:id", async (req, res) => {
  const id = Number(req.params.id);
  const updatedUser = req.body;
  let users = getUsers();
  const index = users.findIndex((user) => user.id === id);
  if (index !== -1) {
    users[index] = { ...users[index], ...updatedUser };
    saveUsers(users);

    await User.create({
      first_name: updatedUser.first_name,
      last_name: updatedUser.last_name,
      email: updatedUser.email,
    });

    return res.json({ status: "success", user: users[index] });
  } else {
    return res.status(404).json({ error: "User not found" });
  }
});

// Route to create a new user (post)
app.post("/api/user", async (req, res) => {
  const body = req.body;
  if (!body.first_name || !body.email) {
    return res.status(400).json({ msg: "First name and email are required" });
  }
  const newUser = {
    first_name: body.first_name,
    last_name: body.last_name,
    email: body.email,
  };

  // Save to the MongoDB database
  try {
    const savedUser = await User.create(newUser);

    // Optionally save to the JSON file
    const users = getUsers();
    users.push(newUser);
    saveUsers(users);

    return res.status(201).json({ status: "success", user: savedUser });
  } catch (error) {
    return res.status(500).json({ error: "Failed to create user", details: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
