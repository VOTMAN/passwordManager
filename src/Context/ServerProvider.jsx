import { useState } from "react";
import { ServerContext } from "./ServerContext";

export const ServerProvider = ({ children }) => {
    const [server, setServer] = useState("https://pwserver.onrender.com/");

    return (
        <ServerContext.Provider value={{ server, setServer }}>
            {children}
        </ServerContext.Provider>
    );
};
