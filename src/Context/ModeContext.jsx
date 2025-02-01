import { createContext, useState } from "react";

export const ModeContext = createContext()

export const ModeProvider = ({ children }) => {
    const [darkMode, setDarkMode] = useState(false)

    const changeMode = (darkMode) => {
        setDarkMode(!darkMode)
        document.documentElement.setAttribute("data-theme", darkMode ? "light" : "dark")
    }

    return (
        <ModeContext.Provider value={{ darkMode, setDarkMode, changeMode }} >
            {children}
        </ModeContext.Provider>
    )
}