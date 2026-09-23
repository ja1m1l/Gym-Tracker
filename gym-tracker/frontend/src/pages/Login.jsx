import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { supabase } from "../lib/supabase";

export default function Login() {

    const navigate = useNavigate();

    const [email, setEmail] = useState("");

    const [password, setPassword] = useState("");

    async function login(event) {

        event.preventDefault();

        const { data, error } =
            await supabase.auth.signInWithPassword({
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

        if (!data.session) {
            alert(
                "Signed in, but no session was created. Confirm your email in Supabase, or disable email confirmation in Authentication → Providers."
            );

            return;
        }

        navigate("/dashboard", { replace: true });
    }


    return (

        <div className="auth-page">

            <div className="auth-card">

                <div className="logo">
                    IRONLOG
                </div>

                <p className="eyebrow">
                    TRAINING TRACKER
                </p>

                <h1>
                    Welcome back.
                </h1>

                <p className="muted">
                    Keep your training moving.
                </p>


                <form onSubmit={login}>

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
                        Sign in
                    </button>

                </form>


                <p className="auth-switch">

                    Don't have an account?

                    <a href="/register">
                        Create one
                    </a>

                </p>

            </div>

        </div>

    );
}