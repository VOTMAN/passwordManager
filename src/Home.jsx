import { Link } from "react-router-dom"

const Home = () => {

  return(
    <div>
      <div className="navbar">
        <h3>Logo</h3>
        <div className="nav-links">
          <Link to="/Register" className="nav-item">Register</Link>
          <Link to="/Login" className="nav-item">Login</Link>
        </div>
      </div>
      <h1 className="page-title">The Password Manager</h1>
      <p className="page-desc">Lorem ipsum dolor sit amet consectetur adipisicing elit. Laboriosam ullam velit veritatis, aspernatur laudantium non aliquid ratione reprehenderit omnis possimus porro consequatur dolorem consequuntur dolore dolorum itaque facilis quaerat beatae.</p>      
    </div>
  )
}

export default Home