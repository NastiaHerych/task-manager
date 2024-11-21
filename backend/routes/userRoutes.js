const express = require("express");
const {
  getUser,
  getUsersByRole,
  updateUserLanguage,
  getUserLanguage,
} = require("../controllers/userController");

const router = express.Router();

router.get("/user", getUser);
router.put("/language", updateUserLanguage);
router.get("/:userId/language", getUserLanguage); // Matches GET /api/users/:userId/language
router.get("/users-role", getUsersByRole);

module.exports = router;
