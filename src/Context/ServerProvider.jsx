import { useState } from "react";
import { ServerContext } from "./ServerContext";

export const ServerProvider = ({ children }) => {
    const [server, setServer] = useState("https://pws.vnarnav.online/");

    return (
        <ServerContext.Provider value={{ server, setServer }}>
            {children}
        </ServerContext.Provider>
    );
};
