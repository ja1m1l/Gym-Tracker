const express = require("express");
const supabase = require("../supabase");
const auth = require("../middleware/auth");

const router = express.Router();


// GET ALL EXERCISES
router.get("/", auth, async (req, res) => {

    const { data, error } = await supabase
        .from("exercises")
        .select("*")
        .eq("user_id", req.user.id)
        .order("created_at", { ascending: false });

    if (error) {
        return res.status(500).json({
            error: error.message
        });
    }

    res.json(data);
});


// ADD EXERCISE
router.post("/", auth, async (req, res) => {

    const {
        name,
        muscle_group,
        equipment
    } = req.body;

    if (!name || !muscle_group || !equipment) {
        return res.status(400).json({
            error: "All fields are required"
        });
    }

    const { data, error } = await supabase
        .from("exercises")
        .insert([
            {
                user_id: req.user.id,
                name,
                muscle_group,
                equipment
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


// UPDATE EXERCISE
router.put("/:id", auth, async (req, res) => {

    const {
        name,
        muscle_group,
        equipment
    } = req.body;

    const { data, error } = await supabase
        .from("exercises")
        .update({
            name,
            muscle_group,
            equipment
        })
        .eq("id", req.params.id)
        .eq("user_id", req.user.id)
        .select()
        .single();

    if (error) {
        return res.status(500).json({
            error: error.message
        });
    }

    res.json(data);
});


// DELETE EXERCISE
router.delete("/:id", auth, async (req, res) => {

    const { error } = await supabase
        .from("exercises")
        .delete()
        .eq("id", req.params.id)
        .eq("user_id", req.user.id);

    if (error) {
        return res.status(500).json({
            error: error.message
        });
    }

    res.json({
        message: "Exercise deleted successfully"
    });
});


module.exports = router;