import styles from "./Home.module.css"
import Navbar from "../Nav/Navbar.jsx"
import { useContext, useEffect } from "react"
import { ServerContext } from "../Context/ServerContext.jsx"

const Home = () => {
  const { setServer } = useContext(ServerContext)

  useEffect(() => {
    setServer(localStorage.getItem("server_url"))
  }, [])

  return (
    <div className={styles.container}>
      <Navbar />
      <header className={styles.hero}>
        <h1 className={styles.title}>The Password Manager</h1>
        <h4 className={styles.subtitle}>
          A password manager built with your privacy in mind
        </h4>
      </header>
      <div className={styles.banner}></div>
    </div>
  )
}

export default Home
