const express = require("express");
const supabase = require("../supabase");
const auth = require("../middleware/auth");
const { calculateStreaks } = require("../lib/streaks");

const router = express.Router();

router.get("/", auth, async (req, res) => {

    const userId = req.user.id;

    // Get workouts
    const { data: workoutRows, error } = await supabase
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

    const workouts = workoutRows || [];

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


    const { currentStreak, longestStreak } = calculateStreaks(
        workouts.map(workout => workout.workout_date)
    );


    res.json({
        totalWorkouts: workouts.length,
        totalExercisesPerformed,
        totalVolume,
        workoutsThisWeek,
        currentStreak,
        longestStreak
    });
});

module.exports = router;