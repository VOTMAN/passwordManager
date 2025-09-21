import { useContext } from "react"
import { ServerContext } from "../Context/ServerContext"
import Navbar from "../Nav/Navbar"
import styles from "./ServerPage.module.css"

const ServerPage = () => {
    const { server, setServer } = useContext(ServerContext)

    const handleUserServer = (url) => {
        setServer(url)
        localStorage.setItem("server_url", url)
        alert(`Set the URL as: ${localStorage.getItem("server_url")}`)
    }

    return (
        <div className={styles.container}>
            <Navbar/>
            <main className={styles.main}>
                <h1 className={styles.title}>Server Configuration</h1>

                <div className={styles.form}>
                    <div className={styles.inputGroup}>
                        <input
                            type="text"
                            placeholder="Enter Server URL..."
                            id="server-url"
                            className={styles.input}
                        />
                    </div>

                    <div className={styles.buttonGroup}>
                        <button
                            className={`${styles.button} ${styles.submitButton}`}
                            onClick={() => handleUserServer(document.querySelector("#server-url").value)}
                        >
                            Submit
                        </button>
                        <button
                            className={`${styles.button} ${styles.resetButton}`}
                            onClick={() => handleUserServer("https://pwserver.onrender.com/")}
                        >
                            Reset to Default
                        </button>
                    </div>
                </div>

                <div className={styles.info}>
                    <p>
                        Default server: <strong>http://127.0.0.1:5000</strong>
                        <br />
                        Enter your URL with format: <code>http://yourserverurl:yourport</code>
                        <br />
                        <br />
                        Current server: <span className={styles.currentServer}>
                            {localStorage.getItem("server_url") || "Not set"}
                        </span>
                    </p>
                </div>
            </main>
        </div>
    )
}

export default ServerPage