import { useEffect, useState } from "react";
import {
    BrowserRouter,
    Routes,
    Route,
    Navigate
} from "react-router-dom";

import { supabase } from "./lib/supabase";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Exercises from "./pages/Exercises";
import Workouts from "./pages/Workouts";
import Progress from "./pages/Progress";

import ProtectedRoute from "./components/ProtectedRoute";


function App() {

    const [session, setSession] = useState(null);
    const [authReady, setAuthReady] = useState(false);

    useEffect(() => {

        let mounted = true;

        supabase.auth.getSession()
            .then(({ data }) => {

                if (!mounted) {
                    return;
                }

                setSession(data.session);
                setAuthReady(true);

            })
            .catch(() => {

                if (!mounted) {
                    return;
                }

                setAuthReady(true);

            });


        const {
            data: listener
        } = supabase.auth.onAuthStateChange(
            (_event, nextSession) => {

                setSession(nextSession);

            }
        );


        return () => {

            mounted = false;
            listener.subscription.unsubscribe();

        };

    }, []);


    return (

        <BrowserRouter>

            <Routes>

                <Route
                    path="/login"
                    element={
                        !authReady
                            ? null
                            : session
                                ? <Navigate to="/dashboard" replace />
                                : <Login />
                    }
                />

                <Route
                    path="/register"
                    element={
                        !authReady
                            ? null
                            : session
                                ? <Navigate to="/dashboard" replace />
                                : <Register />
                    }
                />


                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute
                            session={session}
                            authReady={authReady}
                        >
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />


                <Route
                    path="/exercises"
                    element={
                        <ProtectedRoute
                            session={session}
                            authReady={authReady}
                        >
                            <Exercises />
                        </ProtectedRoute>
                    }
                />


                <Route
                    path="/workouts"
                    element={
                        <ProtectedRoute
                            session={session}
                            authReady={authReady}
                        >
                            <Workouts />
                        </ProtectedRoute>
                    }
                />


                <Route
                    path="/progress"
                    element={
                        <ProtectedRoute
                            session={session}
                            authReady={authReady}
                        >
                            <Progress />
                        </ProtectedRoute>
                    }
                />


                <Route
                    path="/"
                    element={
                        <Navigate to="/dashboard" />
                    }
                />

            </Routes>

        </BrowserRouter>

    );
}

export default App;