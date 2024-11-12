// controllers/projectController.js
const { myDB } = require("../config/db");
const { ObjectId } = require("mongodb");

async function addProject(req, res) {
  try {
    const { name, created_by } = req.body;
    const projectsCollection = myDB.collection("projects");

    const newProject = {
      name,
      created_by: new ObjectId(created_by),
      created_at: new Date(),
    };

    const result = await projectsCollection.insertOne(newProject);

    res.status(201).json({
      success: true,
      message: "Project created successfully",
      project: { _id: result.insertedId, ...newProject },
    });
  } catch (error) {
    console.error("Error creating project:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to create project" });
  }
}

// New function to get all projects for a specific user by user_id
async function getUserProjects(req, res) {
  try {
    const { user_id } = req.params;

    // Fetch all project IDs associated with the user from user_projects collection
    const userProjectsCollection = myDB.collection("user_projects");
    const userProjects = await userProjectsCollection
      .find({ user_id: new ObjectId(user_id) })
      .toArray();

    if (userProjects.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No projects found for this user" });
    }

    // Extract project IDs from user_projects and fetch details from the projects collection
    const projectIds = userProjects.map((up) => up.project_id);
    const projectsCollection = myDB.collection("projects");
    const projects = await projectsCollection
      .find({ _id: { $in: projectIds } })
      .toArray();

    res.status(200).json({ success: true, projects });
  } catch (error) {
    console.error("Error fetching user projects:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch user projects" });
  }
}

module.exports = { addProject, getUserProjects };
