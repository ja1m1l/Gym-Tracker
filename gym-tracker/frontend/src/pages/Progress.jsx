import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { apiGet } from "../lib/api";

function Progress() {

    const [progress, setProgress] = useState([]);


    useEffect(() => {

        async function loadProgress() {

            const data =
                await apiGet("/api/progress");

            setProgress(data);

        }

        loadProgress();

    }, []);


    return (

        <>

            <Navbar />

            <main className="page">

                <div className="page-header">

                    <div>

                        <p className="eyebrow">
                            PERFORMANCE
                        </p>

                        <h1>
                            Progress
                        </h1>

                    </div>

                </div>


                <div className="progress-grid">

                    {progress.map(item => (

                        <div
                            className="progress-card"
                            key={item.exercise}
                        >

                            <h2>
                                {item.exercise}
                            </h2>

                            <div className="progress-stat">

                                <span>
                                    Best Weight
                                </span>

                                <strong>
                                    {item.bestWeight} kg
                                </strong>

                            </div>


                            <div className="progress-stat">

                                <span>
                                    Best Reps
                                </span>

                                <strong>
                                    {item.bestReps}
                                </strong>

                            </div>


                            <div className="progress-stat">

                                <span>
                                    Estimated 1RM
                                </span>

                                <strong>
                                    {item.estimated1RM.toFixed(1)} kg
                                </strong>

                            </div>


                            <div className="improved">
                                ↑ Improved
                            </div>

                        </div>

                    ))}

                </div>

            </main>

        </>

    );
}

export default Progress;