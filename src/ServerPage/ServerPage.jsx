import { useContext } from "react"
import { ServerContext } from "../Context/ServerContext"
import Navbar from "../Nav/Navbar"

const ServerPage = () => {
    const { server, setServer } = useContext(ServerContext)
    const handleUserServer = (url) => {
        setServer(url)
        localStorage.setItem("server_url", url)
        alert(`set the url as: ${localStorage.getItem("server_url")}`)
    }

    return (
        <div>
            <Navbar/>
            <input type="text" placeholder="Enter Server Url..." id="server-url"/>
            <button onClick={() => handleUserServer(document.querySelector("#server-url").value)}>Submit</button>
            <button onClick={() => handleUserServer("https://pwserver.onrender.com/api/protected")}>Reset</button>
            <p>default is http://127.0.0.1:5000: Enter your url with http://yourserverurl:yourport, Your current server is {localStorage.getItem("server_url")}</p>
        </div>
    )
}

export default ServerPage
