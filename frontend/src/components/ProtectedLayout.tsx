import {AuthProvider, useAuth} from "./AuthContext.tsx";
import {Navigate, Outlet, useLocation} from "react-router-dom";
import {RouterPath} from "../enums/RouterPath.ts";

function ProtectedLayoutInner() {
    const {isAuthenticated, isLoading} = useAuth();
    const location = useLocation();

    if (isLoading) return <p>Loading...</p>;
    if (!isAuthenticated && location.pathname !== RouterPath.LOGIN) return <Navigate to={RouterPath.HOME} replace/>
    return <Outlet/>;
}

export default function ProtectedLayout(){
    return(
        <AuthProvider>
            <ProtectedLayoutInner/>
        </AuthProvider>
    )
}