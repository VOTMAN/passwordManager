import { useContext } from "react"
import { ServerContext } from "../Context/ServerContext"
import Navbar from "../Nav/Navbar"

const ServerPage = () => {
    const { setServer } = useContext(ServerContext)
    const handleUserServer = (url) => {
        setServer(url)
        localStorage.setItem("server_url", url)
        alert(`set the url as: ${url}`)
    }

    return (
        <div>
            <Navbar/>
            <input type="text" placeholder="Enter Server Url..." id="server-url"/>
            <button onClick={() => handleUserServer(document.querySelector("#server-url").value)}>Submit</button>
            <button onClick={() => handleUserServer("http://127.0.0.1:5000")}>Reset</button>
            <p>default is http://127.0.0.1:5000: Enter your url with http://yourserverurl. it will always run on port 5000</p>
        </div>
    )
}

export default ServerPage