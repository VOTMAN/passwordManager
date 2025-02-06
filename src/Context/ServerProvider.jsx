import { useState } from "react";
import { ServerContext } from "./ServerContext";

export const ServerProvider = ({ children }) => {
    const [server, setServer] = useState("http://127.0.0.1:5000");

    return (
        <ServerContext.Provider value={{ server, setServer }}>
            {children}
        </ServerContext.Provider>
    );
};
