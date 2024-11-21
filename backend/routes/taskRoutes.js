const express = require("express");
const {
  createTask,
  getTasksByUserId,
  updateTaskStatus,
  updateImportance,
} = require("../controllers/taskController");
const multer = require("multer");
const { importTasks } = require("../controllers/importController"); // Import controller
const path = require("path");

// Set up multer for file uploads
const upload = multer({
  dest: path.join(__dirname, "../controllers/uploads"), // Set file upload directory
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB max file size
});

const router = express.Router();

router.post("/create", createTask); // Create a new task
router.get("/user/:user_id", getTasksByUserId); // Get tasks by user_id, structured by projects
router.patch("/:task_id/status", updateTaskStatus);
router.post("/import-tasks", upload.single("file"), importTasks); // Route to handle task import
router.put("/importance/:task_id", updateImportance);

module.exports = router;
