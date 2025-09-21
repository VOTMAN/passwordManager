import styles from "./Navbar.module.css"
import { Link } from "react-router-dom"
import { useContext } from "react"
import { ModeContext } from "../Context/ModeContext"

const Navbar = () => {
  const { darkMode, changeMode } = useContext(ModeContext)

  return (
    <>
      <div className={styles.navbar}>
          <button className={styles.menu} onClick={() => document.querySelector("#menu").style.width = "100%"}>🍔</button>
          <aside className={styles.navLinks}>
            <button className={styles.themeBtn} onClick={() => changeMode(darkMode)}>{darkMode ? "☀️" : "🌔"}</button>
            <Link to="/" className={styles.navItem}>Home</Link>
            <Link to="/Register" className={styles.navItem}>Register</Link>
            <Link to="/Login" className={styles.navItem}>Login</Link>
            <Link to="/Server" className={styles.navItem}>⚙️</Link>
          </aside>
      </div>
        <span className={styles.navLinkSmallScreen} id="menu">
        <button className={styles.themeBtn} onClick={() => document.querySelector("#menu").style.width = "0%"}>❌</button>
          <hr width="40%" size="1"/>
          <button className={styles.themeBtn} onClick={() => changeMode(darkMode)}>{darkMode ? "☀️" : "🌔"}</button>
          <hr width="30%" size="1"/>
          <Link to="/" className={styles.navItem}>Home</Link>
          <Link to="/Register" className={styles.navItem}>Register</Link>
          <Link to="/Login" className={styles.navItem}>Login</Link>
          <Link to="/Server" className={styles.navItem}>⚙️</Link>
        </span>
    </>
    )
}
export default Navbar