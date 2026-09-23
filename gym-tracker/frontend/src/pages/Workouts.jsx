import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import Navbar from "../components/Navbar";
import {
    apiGet,
    apiPost,
    apiDelete
} from "../lib/api";

function Workouts() {

    const [workouts, setWorkouts] = useState([]);
    const [exercises, setExercises] = useState([]);

    const [name, setName] = useState("");
    const [date, setDate] = useState("");

    const [selectedWorkout, setSelectedWorkout] =
        useState(null);

    const [selectedExercise, setSelectedExercise] =
        useState("");

    const [weight, setWeight] = useState("");
    const [reps, setReps] = useState("");


    async function loadData() {

        const workoutData =
            await apiGet("/api/workouts");

        const exerciseData =
            await apiGet("/api/exercises");

        setWorkouts(workoutData);
        setExercises(exerciseData);

    }


    async function createWorkout(e) {

        e.preventDefault();

        if (!name || !date) {
            alert("Enter workout name and date");
            return;
        }

        await apiPost("/api/workouts", {

            name,

            workout_date: date

        });

        setName("");
        setDate("");

        loadData();
    }


    async function addExercise() {

        if (!selectedWorkout || !selectedExercise) {
            return;
        }

        await apiPost(
            `/api/workouts/${selectedWorkout}/exercises`,
            {
                exercise_id: selectedExercise
            }
        );

        loadData();
    }


    async function addSet(workoutExerciseId) {

        if (!weight || !reps) {
            alert("Enter weight and reps");
            return;
        }

        await apiPost(
            `/api/workouts/exercises/${workoutExerciseId}/sets`,
            {
                weight: Number(weight),
                reps: Number(reps),
                set_number: 1
            }
        );

        setWeight("");
        setReps("");

        loadData();
    }


    async function deleteSet(setId) {

        await apiDelete(
            `/api/workouts/sets/${setId}`
        );

        loadData();
    }


    async function deleteWorkout(id) {

        await apiDelete(
            `/api/workouts/${id}`
        );

        loadData();
    }


    useEffect(() => {

        loadData();

    }, []);


    return (

        <>

            <Navbar />

            <main className="page">

                <div className="page-header">

                    <div>

                        <p className="eyebrow">
                            TRAINING LOG
                        </p>

                        <h1>
                            Workouts
                        </h1>

                    </div>

                </div>


                <div className="form-card">

                    <h2>
                        New Workout
                    </h2>

                    <form onSubmit={createWorkout}>

                        <input
                            placeholder="Workout name"
                            value={name}
                            onChange={
                                e => setName(e.target.value)
                            }
                        />

                        <input
                            type="date"
                            value={date}
                            onChange={
                                e => setDate(e.target.value)
                            }
                        />

                        <button className="primary-btn">
                            Start Workout
                        </button>

                    </form>

                </div>


                <div className="workout-list">

                    {workouts.map(workout => (

                        <div
                            className="workout-card"
                            key={workout.id}
                        >

                            <button
                                type="button"
                                className="card-delete"
                                aria-label={`Delete ${workout.name}`}
                                onClick={() =>
                                    deleteWorkout(workout.id)
                                }
                            >
                                <Trash2 size={15} />
                            </button>

                            <div className="workout-header">

                                <div>

                                    <h2>
                                        {workout.name}
                                    </h2>

                                    <p>
                                        {workout.workout_date}
                                    </p>

                                </div>

                            </div>


                            <div className="add-exercise-row">

                                <select
                                    value={
                                        selectedWorkout === workout.id
                                            ? selectedExercise
                                            : ""
                                    }
                                    onChange={e => {

                                        setSelectedWorkout(
                                            workout.id
                                        );

                                        setSelectedExercise(
                                            e.target.value
                                        );

                                    }}
                                >

                                    <option value="">
                                        Select exercise
                                    </option>

                                    {exercises.map(exercise => (

                                        <option
                                            key={exercise.id}
                                            value={exercise.id}
                                        >
                                            {exercise.name}
                                        </option>

                                    ))}

                                </select>


                                <button
                                    className="secondary-btn"
                                    onClick={addExercise}
                                >
                                    Add Exercise
                                </button>

                            </div>


                            {workout.workout_exercises?.map(
                                workoutExercise => (

                                    <div
                                        className="logged-exercise"
                                        key={
                                            workoutExercise.id
                                        }
                                    >

                                        <h3>
                                            {
                                                workoutExercise
                                                    .exercises
                                                    ?.name
                                            }
                                        </h3>


                                        <div className="set-row">

                                            <input
                                                type="number"
                                                placeholder="Weight"
                                                value={weight}
                                                onChange={
                                                    e =>
                                                        setWeight(
                                                            e.target.value
                                                        )
                                                }
                                            />

                                            <input
                                                type="number"
                                                placeholder="Reps"
                                                value={reps}
                                                onChange={
                                                    e =>
                                                        setReps(
                                                            e.target.value
                                                        )
                                                }
                                            />

                                            <button
                                                className="secondary-btn"
                                                onClick={() =>
                                                    addSet(
                                                        workoutExercise.id
                                                    )
                                                }
                                            >
                                                Add Set
                                            </button>

                                        </div>


                                        <div className="sets">

                                            {
                                                workoutExercise
                                                    .workout_sets
                                                    ?.map(set => (

                                                        <div
                                                            className="set"
                                                            key={set.id}
                                                        >

                                                            <span>
                                                                Set {set.set_number}
                                                            </span>

                                                            <strong>
                                                                {set.weight} kg × {set.reps}
                                                            </strong>

                                                            <button
                                                                onClick={() =>
                                                                    deleteSet(
                                                                        set.id
                                                                    )
                                                                }
                                                            >
                                                                ×
                                                            </button>

                                                        </div>

                                                    ))
                                            }

                                        </div>

                                    </div>

                                )
                            )}

                        </div>

                    ))}

                </div>

            </main>

        </>

    );
}

export default Workouts;