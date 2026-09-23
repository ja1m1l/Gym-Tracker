const express = require("express");
const supabase = require("../supabase");
const auth = require("../middleware/auth");

const router = express.Router();


// GET WORKOUTS
router.get("/", auth, async (req, res) => {

    const { data, error } = await supabase
        .from("workouts")
        .select(`
            *,
            workout_exercises (
                *,
                exercises (
                    id,
                    name,
                    muscle_group,
                    equipment
                ),
                workout_sets (
                    id,
                    weight,
                    reps,
                    set_number
                )
            )
        `)
        .eq("user_id", req.user.id)
        .order("workout_date", { ascending: false });

    if (error) {
        return res.status(500).json({
            error: error.message
        });
    }

    res.json(data);
});


// CREATE WORKOUT
router.post("/", auth, async (req, res) => {

    const {
        name,
        workout_date
    } = req.body;

    if (!name || !workout_date) {
        return res.status(400).json({
            error: "Workout name and date are required"
        });
    }

    const { data, error } = await supabase
        .from("workouts")
        .insert([
            {
                user_id: req.user.id,
                name,
                workout_date
            }
        ])
        .select()
        .single();

    if (error) {
        return res.status(500).json({
            error: error.message
        });
    }

    res.status(201).json(data);
});


// ADD EXERCISE TO WORKOUT
router.post("/:workoutId/exercises", auth, async (req, res) => {

    const {
        exercise_id
    } = req.body;

    // Check workout belongs to current user
    const { data: workout } = await supabase
        .from("workouts")
        .select("id")
        .eq("id", req.params.workoutId)
        .eq("user_id", req.user.id)
        .single();

    if (!workout) {
        return res.status(403).json({
            error: "Workout not found"
        });
    }

    // Check exercise belongs to current user
    const { data: exercise } = await supabase
        .from("exercises")
        .select("id")
        .eq("id", exercise_id)
        .eq("user_id", req.user.id)
        .single();

    if (!exercise) {
        return res.status(403).json({
            error: "Exercise not found"
        });
    }

    const { data, error } = await supabase
        .from("workout_exercises")
        .insert([
            {
                workout_id: req.params.workoutId,
                exercise_id
            }
        ])
        .select()
        .single();

    if (error) {
        return res.status(500).json({
            error: error.message
        });
    }

    res.status(201).json(data);
});


// ADD SET
router.post(
    "/exercises/:workoutExerciseId/sets",
    auth,
    async (req, res) => {

        const {
            weight,
            reps,
            set_number
        } = req.body;

        // Verify ownership
        const { data: workoutExercise } = await supabase
            .from("workout_exercises")
            .select(`
                id,
                workouts (
                    user_id
                )
            `)
            .eq("id", req.params.workoutExerciseId)
            .single();

        if (
            !workoutExercise ||
            workoutExercise.workouts.user_id !== req.user.id
        ) {
            return res.status(403).json({
                error: "Not authorized"
            });
        }

        const { data, error } = await supabase
            .from("workout_sets")
            .insert([
                {
                    workout_exercise_id:
                        req.params.workoutExerciseId,
                    weight,
                    reps,
                    set_number
                }
            ])
            .select()
            .single();

        if (error) {
            return res.status(500).json({
                error: error.message
            });
        }

        res.status(201).json(data);
    }
);


// DELETE SET
router.delete("/sets/:setId", auth, async (req, res) => {

    const { data: set } = await supabase
        .from("workout_sets")
        .select(`
            id,
            workout_exercises (
                workouts (
                    user_id
                )
            )
        `)
        .eq("id", req.params.setId)
        .single();

    if (
        !set ||
        set.workout_exercises.workouts.user_id !== req.user.id
    ) {
        return res.status(403).json({
            error: "Not authorized"
        });
    }

    const { error } = await supabase
        .from("workout_sets")
        .delete()
        .eq("id", req.params.setId);

    if (error) {
        return res.status(500).json({
            error: error.message
        });
    }

    res.json({
        message: "Set deleted"
    });
});


// DELETE WORKOUT
router.delete("/:id", auth, async (req, res) => {

    const { error } = await supabase
        .from("workouts")
        .delete()
        .eq("id", req.params.id)
        .eq("user_id", req.user.id);

    if (error) {
        return res.status(500).json({
            error: error.message
        });
    }

    res.json({
        message: "Workout deleted"
    });
});


module.exports = router;