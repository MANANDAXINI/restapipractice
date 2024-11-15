const express = require("express");

const router=express.Router();



  
  // Route to get a specific user by ID
  router.get("/api/:id", (req, res) => {
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
  router.patch("/api/user/:id", async (req, res) => {
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
  router.post("/api/user", async (req, res) => {
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

  module.export=router();