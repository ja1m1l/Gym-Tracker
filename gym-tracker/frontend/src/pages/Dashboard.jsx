import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { apiGet } from "../lib/api";

function Dashboard() {

    const [stats, setStats] = useState({
        totalWorkouts: 0,
        totalExercisesPerformed: 0,
        totalVolume: 0,
        workoutsThisWeek: 0,
        currentStreak: 0,
        longestStreak: 0
    });


    useEffect(() => {

        async function loadDashboard() {

            const data =
                await apiGet("/api/dashboard");

            setStats(data);

        }

        loadDashboard();

    }, []);


    return (

        <>

            <Navbar />

            <main className="page">

                <section className="hero">

                    <div>

                        <p className="eyebrow">
                            TRAINING OVERVIEW
                        </p>

                        <h1>
                            Build strength.<br />
                            Track everything.
                        </h1>

                        <p className="hero-text">
                            Your training data, sessions and
                            progress in one place.
                        </p>

                    </div>

                </section>


                <section className="stats-grid">

                    <div className="stat-card">

                        <span>
                            TOTAL WORKOUTS
                        </span>

                        <strong>
                            {stats.totalWorkouts}
                        </strong>

                    </div>


                    <div className="stat-card">

                        <span>
                            EXERCISES PERFORMED
                        </span>

                        <strong>
                            {stats.totalExercisesPerformed}
                        </strong>

                    </div>


                    <div className="stat-card">

                        <span>
                            TOTAL VOLUME
                        </span>

                        <strong>
                            {stats.totalVolume} kg
                        </strong>

                    </div>


                    <div className="stat-card accent-card">

                        <span>
                            THIS WEEK
                        </span>

                        <strong>
                            {stats.workoutsThisWeek}
                        </strong>

                        <small>
                            workouts
                        </small>

                    </div>

                </section>


                <section className="streak-grid">

                    <div className="stat-card accent-card">

                        <span>
                            CURRENT STREAK
                        </span>

                        <strong>
                            {stats.currentStreak}
                        </strong>

                        <small>
                            {stats.currentStreak === 1 ? "day" : "days"}
                        </small>

                    </div>


                    <div className="stat-card">

                        <span>
                            LONGEST STREAK
                        </span>

                        <strong>
                            {stats.longestStreak}
                        </strong>

                        <small>
                            {stats.longestStreak === 1 ? "day" : "days"}
                        </small>

                    </div>

                </section>

            </main>

        </>

    );
}

export default Dashboard;