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

async function getTasksByUserId(req, res) {
  try {
    const { user_id } = req.params; // Extract user_id from request parameters

    // Find all tasks that have either dev_id or qa_id matching the user_id
    const tasksCollection = myDB.collection("tasks");
    const projectsCollection = myDB.collection("projects");

    // Use aggregate to find tasks and join with project details
    const tasks = await tasksCollection
      .aggregate([
        {
          $match: {
            $or: [
              { dev_id: new ObjectId(user_id) },
              { qa_id: new ObjectId(user_id) },
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

module.exports = { createTask, getTasksByUserId };
