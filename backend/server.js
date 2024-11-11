const express = require("express");
const axios = require("axios");
const app = express();
const port = 3000;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { ObjectId } = require("mongodb");

app.use(express.json());

var cors = require("cors");
app.use(cors());
const { MongoClient, ServerApiVersion } = require("mongodb");
const secretKey = "your_jwt_secret_key"; // Use a secure secret in production
const saltRounds = 10;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function connectToDatabase() {
  try {
    await client.connect();
    console.log("Connected to the database");
  } catch (error) {
    console.error("Error connecting to the database:", error);
  }
}
connectToDatabase();
let myDB = client.db("trackWise");

app.post("/api/signup", async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    const usersCollection = myDB.collection("users");
    // Check if email already exists
    const existingUser = await usersCollection.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "Email already in use" });
    }
    // Hash the password with bcrypt
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    // Insert new user with hashed password
    const result = await usersCollection.insertOne({
      username,
      email,
      password: hashedPassword, // Store the hashed password
      role,
      createdAt: new Date(),
    });
    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: { _id: result.insertedId, username, email, role },
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ success: false, message: "Failed to create user" });
  }
});

app.post("/api/login", async (req, res) => {
  try {
    const { usernameOrEmail, password } = req.body;
    const usersCollection = myDB.collection("users");

    // Find user by email or username
    const user = await usersCollection.findOne({
      $or: [{ email: usernameOrEmail }, { username: usernameOrEmail }],
    });

    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "User not found" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid password" });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id, role: user.role }, secretKey, {
      expiresIn: "1h",
    });

    // Exclude password from user info
    const { password: _, ...userInfo } = user;

    // Return success, token, and user information
    res.status(200).json({ success: true, token, userInfo });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ success: false, message: "Failed to login" });
  }
});

app.get("/api/user", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1]; // Extract token from header
    if (!token) {
      return res.status(401).json({ success: false, message: "Token missing" });
    }
    // Verify token
    const decoded = jwt.verify(token, secretKey);
    const user = await myDB
      .collection("users")
      .findOne({ _id: new ObjectId(decoded.id) });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    const { password: _, ...userInfo } = user; // Exclude password
    res.status(200).json({ success: true, userInfo });
  } catch (error) {
    console.error("Fetch user error:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch user data" });
  }
});

app.get("/get/user", async (req, res) => {
  console.log(req.query);
  const { email } = req.query;
  const myColl = myDB.collection("users");
  const findResult = await myColl.findOne({ email: email });
  res
    .status(200)
    .json({ success: true, message: "GET request successful", findResult });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
