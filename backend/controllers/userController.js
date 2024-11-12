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

module.exports = { getUser };
