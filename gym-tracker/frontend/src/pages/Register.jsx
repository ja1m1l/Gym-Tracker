import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { supabase } from "../lib/supabase";

export default function Register() {

    const navigate = useNavigate();

    const [email, setEmail] = useState("");

    const [password, setPassword] = useState("");


    async function register(event) {

        event.preventDefault();

        const { data, error } =
            await supabase.auth.signUp({
                email,
                password
            });


        if (error) {
            const networkError = /load failed|failed to fetch/i.test(
                error.message
            );

            alert(
                networkError
                    ? "Could not reach Supabase. Replace VITE_SUPABASE_URL in frontend/.env with your project URL (Settings → API), then restart npm run dev."
                    : error.message
            );

            return;
        }


        if (data.session) {
            navigate("/dashboard", { replace: true });
            return;
        }

        alert(
            "Account created. Confirm your email if required, then sign in."
        );

        navigate("/login", { replace: true });
    }


    return (

        <div className="auth-page">

            <div className="auth-card">

                <div className="logo">
                    IRONLOG
                </div>

                <p className="eyebrow">
                    START TRAINING
                </p>

                <h1>
                    Create account.
                </h1>

                <p className="muted">
                    Your training data, all in one place.
                </p>


                <form onSubmit={register}>

                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={
                            e =>
                            setEmail(e.target.value)
                        }
                    />


                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={
                            e =>
                            setPassword(e.target.value)
                        }
                    />


                    <button type="submit">
                        Create account
                    </button>

                </form>


                <p className="auth-switch">

                    Already have an account?

                    <a href="/login">
                        Sign in
                    </a>

                </p>

            </div>

        </div>

    );
}