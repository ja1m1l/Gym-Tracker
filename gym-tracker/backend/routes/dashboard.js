const express = require("express");
const supabase = require("../supabase");
const auth = require("../middleware/auth");

const router = express.Router();

router.get("/", auth, async (req, res) => {

    const userId = req.user.id;

    // Get workouts
    const { data: workouts, error } = await supabase
        .from("workouts")
        .select(`
            id,
            workout_date,
            workout_exercises (
                id,
                workout_sets (
                    weight,
                    reps
                )
            )
        `)
        .eq("user_id", userId);

    if (error) {
        return res.status(500).json({
            error: error.message
        });
    }

    // Get exercises
    const { count: exerciseCount } = await supabase
        .from("exercises")
        .select("*", {
            count: "exact",
            head: true
        })
        .eq("user_id", userId);

    let totalExercisesPerformed = 0;
    let totalVolume = 0;

    workouts.forEach(workout => {

        workout.workout_exercises.forEach(exercise => {

            totalExercisesPerformed++;

            exercise.workout_sets.forEach(set => {
                totalVolume += Number(set.weight) * Number(set.reps);
            });

        });

    });


    // Calculate workouts this week
    const today = new Date();

    const startOfWeek = new Date(today);

    const day = startOfWeek.getDay();

    const difference = day === 0 ? 6 : day - 1;

    startOfWeek.setDate(
        startOfWeek.getDate() - difference
    );

    startOfWeek.setHours(0, 0, 0, 0);

    const workoutsThisWeek = workouts.filter(workout => {

        const date = new Date(workout.workout_date);

        return date >= startOfWeek;

    }).length;


    res.json({
        totalWorkouts: workouts.length,
        totalExercisesPerformed,
        totalVolume,
        workoutsThisWeek
    });
});

module.exports = router;