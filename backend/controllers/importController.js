const fs = require("fs");
const csv = require("csv-parser");
const { ObjectId } = require("mongodb");
const path = require("path");
const { myDB } = require("../config/db");

// Import tasks from file
async function importTasks(req, res) {
  try {
    // Validate if the file is provided
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "No file uploaded" });
    }
    // File path and initialize task array
    const filePath = path.join(__dirname, "uploads", req.file.filename);
    const tasks = [];
    // Parse the CSV file
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (data) => {
        // Prepare task object for each row
        const task = {
          title: data.Title,
          description: data.Description,
          status: data.Status,
          is_important: data.Important === "Yes",
          is_completed: data.Completed === "Yes",
          story_points: parseInt(data.StoryPoints),
          project_id: new ObjectId(data.ProjectId),
          dev_id: new ObjectId(data.DevId),
          qa_id: new ObjectId(data.QaId),
          created_by: new ObjectId(data.CreatedBy),
          created_at: new Date(),
        };
        tasks.push(task);
      })
      .on("end", async () => {
        // Insert tasks into the database
        const tasksCollection = myDB.collection("tasks");
        // Insert tasks one by one
        for (const task of tasks) {
          try {
            const result = await tasksCollection.insertOne(task);
          } catch (error) {
            console.error("Error inserting task:", error);
          }
        }
        // Respond with success
        res.status(201).json({
          success: true,
          message: "Tasks imported successfully",
          tasks,
        });
      })
      .on("error", (error) => {
        console.error("Error reading file:", error);
        res
          .status(500)
          .json({ success: false, message: "Failed to parse file" });
      });
  } catch (error) {
    console.error("Error importing tasks:", error);
    res.status(500).json({ success: false, message: "Failed to import tasks" });
  }
}

module.exports = { importTasks };
