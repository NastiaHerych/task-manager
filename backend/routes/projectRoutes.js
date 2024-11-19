// routes/projectRoutes.js
const express = require("express");
const {
  addProject,
  getAllProjectsForPM,
  getUserProjects,
} = require("../controllers/projectController");

const router = express.Router();

router.post("/add", addProject);// Add a new project
router.get("/:user_id", getAllProjectsForPM);
router.get("/user/:user_id", getUserProjects);// Get all projects for a specific user by user_id

module.exports = router;
