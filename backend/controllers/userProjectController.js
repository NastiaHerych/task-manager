// controllers/userProjectController.js
const { myDB } = require("../config/db");
const { ObjectId } = require("mongodb");

async function addUserToProject(req, res) {
  try {
    const { user_id, project_id } = req.body;
    const userProjectsCollection = myDB.collection("user_projects");

    const newUserProject = {
      user_id: new ObjectId(user_id),
      project_id: new ObjectId(project_id),
    };

    const result = await userProjectsCollection.insertOne(newUserProject);

    res.status(201).json({
      success: true,
      message: "User added to project successfully",
      userProject: { _id: result.insertedId, ...newUserProject },
    });
  } catch (error) {
    console.error("Error adding user to project:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to add user to project" });
  }
}

module.exports = { addUserToProject };
