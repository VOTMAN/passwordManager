import styles from "./Home.module.css"
import Navbar from "../Nav/Navbar.jsx"

const Home = () => {

  return(
    <div>
      <Navbar/>
      <h1 className={styles.pageTextCenter}>The Password Manager</h1>
      <h4 className={styles.pageTextCenter}>A password manager build with your privacy in mind</h4>      
      <div className={styles.banner}></div>  
    </div>
  )
}

export default Home