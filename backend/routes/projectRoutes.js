// routes/projectRoutes.js
const express = require("express");
const {
  addProject,
  getUserProjects,
} = require("../controllers/projectController");

const router = express.Router();

// Add a new project
router.post("/add", addProject);

// Get all projects for a specific user by user_id
router.get("/user/:user_id", getUserProjects);

module.exports = router;
