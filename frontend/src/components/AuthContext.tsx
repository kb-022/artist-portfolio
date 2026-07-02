import {createContext, useState, useEffect, useContext, type ReactNode} from "react";
import config from "../config.ts";

interface AuthContextType{
    isAuthenticated: boolean;
    isLoading: boolean;
    login : (username : string, password : string) => Promise<void>;
    logout : () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({children} : {children : ReactNode}) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const checkAuth = async () => {
        try{
            const response = await fetch(`${config.apiUrl}/users/me`, {
                method: "GET",
                credentials: "include"
            });
            setIsAuthenticated(response.ok);
        } catch {
            setIsAuthenticated(false);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        checkAuth();
    }, []);

    const login = async (username : string, password : string) => {
        try{
            const response = await fetch(`${config.apiUrl}/auth/login`,{
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({username, password}),
                credentials: "include"
            });
            if (!response.ok) throw new Error("Invalid credentials");
            setIsAuthenticated(true);
        } catch {
            throw new Error("Invalid username or password");
        }

    };
    const logout = async () => {
        await fetch(`${config.apiUrl}/auth/logout`, {
            method: "GET",
            credentials: "include"
        });
        setIsAuthenticated(false);
    };

    return (<AuthContext.Provider value={{isAuthenticated, isLoading, login, logout}}>
        {children}
    </AuthContext.Provider>);
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error ("useAuth must be used within AuthProvider");
    return context;
};

