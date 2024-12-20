const { myDB } = require("../config/db");
const { ObjectId } = require("mongodb");

async function createTask(req, res) {
  try {
    const {
      title,
      description,
      project_id,
      dev_id,
      qa_id,
      created_by,
      is_important,
      is_completed,
      status,
      story_points,
    } = req.body;

    // Validate that the status is one of the allowed values
    const validStatuses = [
      "new",
      "in_progress",
      "in_review",
      "blocked",
      "done",
      "ready_for_qa",
      "in_qa",
      "qa_passed",
      "preprod_passed",
      "deployed",
    ];

    if (!validStatuses.includes(status)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid status" });
    }

    // Insert task into the tasks collection
    const tasksCollection = myDB.collection("tasks");

    const newTask = {
      title,
      description,
      project_id: new ObjectId(project_id),
      dev_id: new ObjectId(dev_id),
      qa_id: new ObjectId(qa_id),
      created_by: new ObjectId(created_by),
      created_at: new Date(),
      is_important: is_important || false,
      is_completed: is_completed || false,
      status,
      story_points,
    };

    const result = await tasksCollection.insertOne(newTask);

    res.status(201).json({
      success: true,
      message: "Task created successfully",
      task: { _id: result.insertedId, ...newTask },
    });
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).json({ success: false, message: "Failed to create task" });
  }
}

async function updateImportance(req, res) {
  try {
    const { task_id } = req.params;
    const { is_important } = req.body;
    // Validate the input
    if (typeof is_important !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "Invalid value for is_important. Must be a boolean.",
      });
    }
    // Access the tasks collection
    const tasksCollection = myDB.collection("tasks");
    // Update the is_important field
    const result = await tasksCollection.updateOne(
      { _id: new ObjectId(task_id) },
      { $set: { is_important } }
    );
    // Check if the task was found and updated
    if (result.matchedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Task not found with the provided task ID",
      });
    }
    // Respond with success
    res.status(200).json({
      success: true,
      message: "Task importance updated successfully",
      updatedTask: { task_id, is_important },
    });
  } catch (error) {
    console.error("Error updating task importance:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update task importance",
    });
  }
}

async function getTasksByUserId(req, res) {
  try {
    const { user_id } = req.params; // Extract user_id from request parameters
    // Find all tasks that have either dev_id, qa_id, or created_by matching the user_id
    const tasksCollection = myDB.collection("tasks");
    const projectsCollection = myDB.collection("projects");
    const usersCollection = myDB.collection("users");
    const tasks = await tasksCollection
      .aggregate([
        {
          $match: {
            $or: [
              { dev_id: new ObjectId(user_id) },
              { qa_id: new ObjectId(user_id) },
              { created_by: new ObjectId(user_id) }, // Check for created_by field
            ],
          },
        },
        {
          $lookup: {
            from: "projects", // Join with the 'projects' collection
            localField: "project_id",
            foreignField: "_id",
            as: "project_info",
          },
        },
        {
          $unwind: "$project_info", // Flatten the project_info array
        },
        {
          $lookup: {
            from: "users", // Join with the 'users' collection
            let: {
              dev_id: "$dev_id",
              qa_id: "$qa_id",
              created_by: "$created_by",
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $or: [
                      { $eq: ["$_id", "$$dev_id"] },
                      { $eq: ["$_id", "$$qa_id"] },
                      { $eq: ["$_id", "$$created_by"] },
                    ],
                  },
                },
              },
              {
                $project: {
                  _id: 1,
                  username: 1,
                  email: 1,
                  role: 1,
                },
              },
            ],
            as: "user_info",
          },
        },
        {
          $project: {
            _id: 1,
            title: 1,
            description: 1,
            project_id: 1,
            dev_id: 1,
            qa_id: 1,
            created_by: 1,
            created_at: 1,
            is_important: 1,
            is_completed: 1,
            status: 1,
            story_points: 1,
            project_info: {
              _id: 1,
              name: 1,
              created_by: 1,
              created_at: 1,
            },
            user_info: 1, // Include user info in the final projection
          },
        },
      ])
      .toArray();

    if (tasks.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No tasks found for this user" });
    }

    // Group tasks by project_id
    const groupedTasks = tasks.reduce((acc, task) => {
      const projectId = task.project_id.toString(); // Convert ObjectId to string for key
      if (!acc[projectId]) {
        acc[projectId] = {
          project_id: task.project_id,
          project_info: task.project_info,
          tasks: [],
        };
      }
      acc[projectId].tasks.push(task);
      return acc;
    }, {});

    // Convert grouped tasks into an array of project details
    const structuredTasks = Object.values(groupedTasks);

    res.status(200).json({ success: true, tasks: structuredTasks });
  } catch (error) {
    console.error("Error fetching tasks by user ID:", error);
    res.status(500).json({ success: false, message: "Failed to fetch tasks" });
  }
}

// Function to update task status by task ID
async function updateTaskStatus(req, res) {
  try {
    const { task_id } = req.params;
    let { status } = req.body;

    // Define allowed statuses
    const allowedStatuses = [
      "new",
      "in_progress",
      "in_review",
      "blocked",
      "done",
      "ready_for_qa",
      "in_qa",
      "qa_passed",
      "preprod_passed",
      "deployed",
    ];

    // Check if the provided status is valid
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid status. Must be one of: " + allowedStatuses.join(", "),
      });
    }

    // If status is 'done', automatically set to 'ready_for_qa'
    if (status === "done") {
      status = "ready_for_qa";
    }

    // Define the condition for setting the 'is_completed' field
    const isCompleted = status === "done" || status === "deployed";

    // Update task status and set 'is_completed' if status is 'done' or 'deployed'
    const tasksCollection = myDB.collection("tasks");
    const result = await tasksCollection.updateOne(
      { _id: new ObjectId(task_id) },
      {
        $set: {
          status,
          is_completed: isCompleted, // set is_completed field based on status
        },
      }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Task not found with the provided task ID",
      });
    }

    res.status(200).json({
      success: true,
      message: "Task status updated successfully",
      updatedTask: { task_id, status, is_completed: isCompleted },
    });
  } catch (error) {
    console.error("Error updating task status:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update task status",
    });
  }
}

module.exports = {
  createTask,
  updateImportance,
  getTasksByUserId,
  updateTaskStatus,
};
