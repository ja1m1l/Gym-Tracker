import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, session, authReady }) {

    if (!authReady) {
        return null;
    }

    if (!session) {
        return <Navigate to="/login" replace />;
    }

    return children;
}

export default ProtectedRoute;