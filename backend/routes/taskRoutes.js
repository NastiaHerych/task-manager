const express = require("express");
const {
  createTask,
  getTasksByUserId,
  updateTaskStatus,
} = require("../controllers/taskController");

const router = express.Router();

router.post("/create", createTask); // Create a new task
router.get("/user/:user_id", getTasksByUserId); // Get tasks by user_id, structured by projects
router.patch("/:task_id/status", updateTaskStatus);

module.exports = router;
