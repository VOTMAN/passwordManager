import styles from "./Navbar.module.css"
import { Link } from "react-router-dom"
import { useContext } from "react"
import { ModeContext } from "../Context/ModeContext"


const Navbar = () => {
  const { darkMode, changeMode } = useContext(ModeContext)

  return (
    <div className={styles.navbar}>
        <h3>Logo</h3>
        <div className={styles.navLinks}>
          <button className={styles.themeBtn} onClick={() => changeMode(darkMode)}>{darkMode ? "☀️" : "🌔"}</button>
          <Link to="/" className={styles.navItem}>Home</Link>
          <Link to="/Register" className={styles.navItem}>Register</Link>
          <Link to="/Login" className={styles.navItem}>Login</Link>
        </div>
    </div>
    )
}
export default Navbar