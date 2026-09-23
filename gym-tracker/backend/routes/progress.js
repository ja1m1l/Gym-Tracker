const express = require("express");
const supabase = require("../supabase");
const auth = require("../middleware/auth");

const router = express.Router();


router.get("/", auth, async (req, res) => {

    const { data, error } = await supabase
        .from("workout_exercises")
        .select(`
            exercise_id,
            exercises (
                id,
                name
            ),
            workout_sets (
                weight,
                reps
            ),
            workouts!inner (
                user_id,
                workout_date
            )
        `)
        .eq("workouts.user_id", req.user.id);

    if (error) {
        return res.status(500).json({
            error: error.message
        });
    }


    const progress = {};

    data.forEach(item => {

        const exerciseName = item.exercises.name;

        if (!progress[exerciseName]) {

            progress[exerciseName] = {
                exercise: exerciseName,
                bestWeight: 0,
                bestReps: 0,
                estimated1RM: 0
            };

        }


        item.workout_sets.forEach(set => {

            const weight = Number(set.weight);
            const reps = Number(set.reps);

            const oneRM =
                weight * (1 + reps / 30);


            if (weight > progress[exerciseName].bestWeight) {
                progress[exerciseName].bestWeight = weight;
            }

            if (reps > progress[exerciseName].bestReps) {
                progress[exerciseName].bestReps = reps;
            }

            if (oneRM > progress[exerciseName].estimated1RM) {
                progress[exerciseName].estimated1RM = oneRM;
            }

        });

    });


    res.json(Object.values(progress));
});


module.exports = router;