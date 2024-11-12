// server.js
const express = require("express");
const { connectToDatabase } = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const projectRoutes = require("./routes/projectRoutes");
const userProjectRoutes = require("./routes/userProjectRoutes");
const taskRoutes = require("./routes/taskRoutes");

const app = express();
app.use(express.json());
var cors = require("cors");
app.use(cors());

// Connect to the database
connectToDatabase();

// Define routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/user-projects", userProjectRoutes);
app.use("/api/tasks", taskRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
