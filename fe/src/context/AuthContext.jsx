import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export function AuthProvider({children}) {
    const [user, setUser] = useState(null);
    const [accessToken, setAccessToken] = useState(localStorage.getItem("accessToken") || null);

    useEffect(() =>{
        if(accessToken) {
            localStorage.setItem("accessToken", accessToken);
        } else {
            localStorage.removeItem("accessToken");
        }
    },[accessToken])

    const login = (userData, token) => {
        setUser(userData);
        setAccessToken(token);
    }

    const logout = () => {
        setUser(null);
        setAccessToken(null);
    };

    return (
        <AuthContext.Provider value={{ user, accessToken, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}