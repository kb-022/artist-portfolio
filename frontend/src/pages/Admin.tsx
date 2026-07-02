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
            <div>admin</div>
            <button onClick={handleLogout}>Log out</button>

            <div className="p-6">
                <h2 className="text-2xl font-semibold text-neutral-900 mb-6">Mediums</h2>

                <div className="grid grid-cols-3 gap-6">
                    <AdminMediumDisplay/>
                    <AdminWorkDisplay/>
                    <AdminCollectionDisplay/>

                </div>
            </div>
        </main>
    )
}