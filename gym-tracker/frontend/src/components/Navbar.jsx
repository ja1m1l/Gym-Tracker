import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

function Navbar() {

    const navigate = useNavigate();

    async function logout() {

        await supabase.auth.signOut();

        navigate("/login");
    }

    return (

        <nav className="navbar">

            <div className="logo">
                IRONLOG
            </div>

            <div className="nav-links">

                <Link to="/dashboard">
                    Dashboard
                </Link>

                <Link to="/exercises">
                    Exercises
                </Link>

                <Link to="/workouts">
                    Workouts
                </Link>

                <Link to="/progress">
                    Progress
                </Link>

                <button
                    className="logout-btn"
                    onClick={logout}
                >
                    Logout
                </button>

            </div>

        </nav>

    );
}

export default Navbar;