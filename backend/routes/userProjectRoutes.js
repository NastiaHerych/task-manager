// routes/userProjectRoutes.js
const express = require("express");
const { addUserToProject } = require("../controllers/userProjectController");

const router = express.Router();

router.post("/addUser", addUserToProject);

module.exports = router;
