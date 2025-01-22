import { Link } from "react-router-dom"
import styles from "./Home.module.css"

const Home = () => {

  return(
    <div>
      <div className={styles.navbar}>
        <h3>Logo</h3>
        <div className={styles.navLinks}>
          <Link to="/Register" className={styles.navItem}>Register</Link>
          <Link to="/Login" className={styles.navItem}>Login</Link>
        </div>        
      </div>
      <h1 className={styles.pageTextCenter}>The Password Manager</h1>
      <p className={styles.pageTextCenter}>Lorem ipsum dolor sit amet consectetur adipisicing elit. Laboriosam ullam velit veritatis, aspernatur laudantium non aliquid ratione reprehenderit omnis possimus porro consequatur dolorem consequuntur dolore dolorum itaque facilis quaerat beatae.</p>      
    </div>
  )
}

export default Home