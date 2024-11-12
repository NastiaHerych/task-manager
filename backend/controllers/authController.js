const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { myDB } = require("../config/db");

const secretKey = "your_jwt_secret_key"; // Use a secure secret in production
const saltRounds = 10;

async function signup(req, res) {
  try {
    const { username, email, password, role } = req.body;
    const usersCollection = myDB.collection("users");

    const existingUser = await usersCollection.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "Email already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const result = await usersCollection.insertOne({
      username,
      email,
      password: hashedPassword,
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
}

async function login(req, res) {
  const { usernameOrEmail, password } = req.body;
  const usersCollection = myDB.collection("users");

  const user = await usersCollection.findOne({
    $or: [{ email: usernameOrEmail }, { username: usernameOrEmail }],
  });

  if (!user) {
    return res.status(401).json({ success: false, message: "User not found" });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res
      .status(401)
      .json({ success: false, message: "Invalid password" });
  }

  const token = jwt.sign({ id: user._id, role: user.role }, secretKey, {
    expiresIn: "1h",
  });
  const { password: _, ...userInfo } = user;
  res.status(200).json({ success: true, token, userInfo });
}

module.exports = { signup, login };
