const jwt = require("jsonwebtoken");
const { myDB } = require("../config/db");
const { ObjectId } = require("mongodb");
const secretKey = "your_jwt_secret_key";

async function getUser(req, res) {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ success: false, message: "Token missing" });
    }

    const decoded = jwt.verify(token, secretKey);
    const user = await myDB
      .collection("users")
      .findOne({ _id: new ObjectId(decoded.id) });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const { password: _, ...userInfo } = user;
    res.status(200).json({ success: true, userInfo });
  } catch (error) {
    console.error("Fetch user error:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch user data" });
  }
}

async function getUsersByRole(req, res) {
  try {
    const { role } = req.query; // e.g., role=developer or role=qa
    // Validate that role is provided
    if (!role) {
      return res
        .status(400)
        .json({ success: false, message: "Role is required" });
    }
    // Fetch users with the specified role from the users collection
    const usersCollection = myDB.collection("users");
    const users = await usersCollection.find({ role }).toArray();
    res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      users,
    });
  } catch (error) {
    console.error("Error fetching users by role:", error);
    res.status(500).json({ success: false, message: "Failed to fetch users" });
  }
}

async function updateUserLanguage(req, res) {
  try {
    const { userId, language } = req.body; // language can be "EN", "FR", "ES"
    const usersCollection = myDB.collection("users");

    const result = await usersCollection.updateOne(
      { _id: new ObjectId(userId) },
      { $set: { language: language || "EN" } } // Default to "EN" if not provided
    );

    if (result.modifiedCount === 0) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Language updated successfully" });
  } catch (error) {
    console.error("Error updating language:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to update language" });
  }
}

async function getUserLanguage(req, res) {
  try {
    const userId = req.params.userId; // Accepts userId as a URL parameter

    const user = await myDB
      .collection("users")
      .findOne({ _id: new ObjectId(userId) });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const language = user.language || "EN"; // Default to "EN" if no language is set
    res.status(200).json({ success: true, language });
  } catch (error) {
    console.error("Error fetching user language:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch language preference" });
  }
}

module.exports = { getUser, getUsersByRole, updateUserLanguage, getUserLanguage };
