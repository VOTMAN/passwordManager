import styles from "./Home.module.css"
import Navbar from "../Nav/Navbar.jsx"

const Home = () => {

  return(
    <div>
      <Navbar/>
      <h1 className={styles.pageTextCenter}>The Password Manager</h1>
      <p className={styles.pageTextCenter}>Lorem ipsum dolor sit amet consectetur adipisicing elit. Laboriosam ullam velit veritatis, aspernatur laudantium non aliquid ratione reprehenderit omnis possimus porro consequatur dolorem consequuntur dolore dolorum itaque facilis quaerat beatae.</p>      
    </div>
  )
}

export default Home