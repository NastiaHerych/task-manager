const express = require("express");
const {
  createTask,
  getTasksByUserId,
  updateTaskStatus,
} = require("../controllers/taskController");

const router = express.Router();

// Create a new task
router.post("/create", createTask);
// Get tasks by user_id, structured by projects
router.get("/user/:user_id", getTasksByUserId);
router.patch("/:task_id/status", updateTaskStatus);

module.exports = router;
