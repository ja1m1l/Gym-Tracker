import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import Navbar from "../components/Navbar";
import {
    apiGet,
    apiPost,
    apiDelete
} from "../lib/api";

function Exercises() {

    const [exercises, setExercises] = useState([]);

    const [name, setName] = useState("");
    const [muscle, setMuscle] = useState("");
    const [equipment, setEquipment] = useState("");

    async function loadExercises() {

        const data = await apiGet("/api/exercises");

        setExercises(data);
    }


    async function addExercise(e) {

        e.preventDefault();

        if (!name || !muscle || !equipment) {
            alert("Please fill all fields");
            return;
        }

        await apiPost("/api/exercises", {

            name,

            muscle_group: muscle,

            equipment

        });

        setName("");
        setMuscle("");
        setEquipment("");

        loadExercises();
    }


    async function deleteExercise(id) {

        await apiDelete(
            `/api/exercises/${id}`
        );

        loadExercises();
    }


    useEffect(() => {

        loadExercises();

    }, []);


    return (

        <>

            <Navbar />

            <main className="page">

                <div className="page-header">

                    <div>
                        <p className="eyebrow">
                            TRAINING LIBRARY
                        </p>

                        <h1>
                            Exercises
                        </h1>
                    </div>

                </div>


                <div className="form-card">

                    <h2>
                        Add Exercise
                    </h2>

                    <form onSubmit={addExercise}>

                        <input
                            placeholder="Exercise name"
                            value={name}
                            onChange={
                                e => setName(e.target.value)
                            }
                        />

                        <input
                            placeholder="Muscle group"
                            value={muscle}
                            onChange={
                                e => setMuscle(e.target.value)
                            }
                        />

                        <input
                            placeholder="Equipment"
                            value={equipment}
                            onChange={
                                e => setEquipment(e.target.value)
                            }
                        />

                        <button className="primary-btn">
                            Add Exercise
                        </button>

                    </form>

                </div>


                <div className="exercise-grid">

                    {exercises.map(exercise => (

                        <div
                            className="exercise-card"
                            key={exercise.id}
                        >

                            <button
                                type="button"
                                className="card-delete"
                                aria-label={`Delete ${exercise.name}`}
                                onClick={() =>
                                    deleteExercise(exercise.id)
                                }
                            >
                                <Trash2 size={15} />
                            </button>

                            <div className="exercise-card-body">

                                <h3>
                                    {exercise.name}
                                </h3>

                                <p>
                                    {exercise.muscle_group}
                                </p>

                                <span>
                                    {exercise.equipment}
                                </span>

                            </div>

                        </div>

                    ))}

                </div>

            </main>

        </>

    );
}

export default Exercises;