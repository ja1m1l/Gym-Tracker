const express = require("express");
const cors = require("cors");
require("dotenv").config();

const exerciseRoutes = require("./routes/exercises");
const workoutRoutes = require("./routes/workouts");
const dashboardRoutes = require("./routes/dashboard");
const progressRoutes = require("./routes/progress");

const app = express();


// Middleware
app.use(cors());
app.use(express.json());


// Routes
app.use("/api/exercises", exerciseRoutes);
app.use("/api/workouts", workoutRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/progress", progressRoutes);


// Health check
app.get("/health", (req, res) => {

    res.json({
        status: "OK",
        message: "Gym Tracker API is running"
    });

});


// Home
app.get("/", (req, res) => {

    res.json({
        message: "Welcome to Gym Tracker API"
    });

});


const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {

    console.log(
        `Server running on port ${PORT}`
    );

});