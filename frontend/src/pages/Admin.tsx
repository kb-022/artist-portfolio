import {useAuth} from "../components/AuthContext.tsx";
import {useNavigate} from "react-router-dom";
import {RouterPath} from "../enums/RouterPath.ts";
import AdminMediumDisplay from "../components/admin/AdminMediumDisplay.tsx";
import AdminWorkDisplay from "../components/admin/AdminWorkDisplay.tsx";
import AdminCollectionDisplay from "../components/admin/AdminCollectionDisplay.tsx";

export default function Admin(){
    const {logout} = useAuth();
    const navigate = useNavigate();
    const handleLogout = async () => {
        await logout();
        navigate(RouterPath.HOME);
    };
    return (
        <main>

            <div className="p-6">
                <div className="grid grid-cols-3 gap-6">
                    <AdminMediumDisplay/>
                    <AdminWorkDisplay/>
                    <AdminCollectionDisplay/>
                </div>
                <button className="bg-red-500" onClick={handleLogout}>Log out</button>
            </div>
        </main>
    )
}