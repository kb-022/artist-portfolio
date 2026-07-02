import {type SubmitEventHandler, useState} from "react";
import {useNavigate} from "react-router-dom";
import {useAuth} from "../components/AuthContext.tsx";
import {RouterPath} from "../enums/RouterPath.ts";

export default function Login() {
    const {login} = useAuth();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const navigate = useNavigate();

    const handleSubmit: SubmitEventHandler<HTMLFormElement> = async (e ) => {
        e.preventDefault();
        setError("");
        try{
            await login(username, password);
            navigate(RouterPath.ADMIN);
        } catch {
            setError("Invalid username or password");
            return;
        }
    }
    return(
        <div>
        <label htmlFor="username">Username</label>
        <form onSubmit={handleSubmit}>
            <input type = "text"
                   id="username"
                   name="username"
                   onChange={(e) => setUsername(e.target.value)}
                   placeholder="Enter username"
                   required
            />
            <label htmlFor="password">Password</label>
            <input type = "password"
                   id="password"
                   name="password"
                   onChange={(e) => setPassword(e.target.value)}
                   placeholder="Enter password"
                   required
            />
            {error && <p>{error}</p>}
            <button type="submit">Log in</button>
        </form>
        </div>
    )
}