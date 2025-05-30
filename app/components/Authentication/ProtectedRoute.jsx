import { Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext.jsx";

const ProtectedRoute = ({ children, requiredRoles }) => {
    const { user } = useAuth();
    

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (
        requiredRoles &&
        !requiredRoles.every(role => user.roles.includes(role))
        ) {
            return <Navigate to="/" replace />;
        }

    return children;
};

export default ProtectedRoute;
