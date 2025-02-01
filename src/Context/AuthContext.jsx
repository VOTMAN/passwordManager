import { createContext, useState } from "react";

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(null)
    const [passwords, setPasswords] = useState([])

    return (
        <AuthContext.Provider value={{ token, passwords, setToken, setPasswords }}>
            {children}
        </AuthContext.Provider>
    )
}