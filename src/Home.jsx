import { Link } from "react-router-dom"
import { useState, useEffect } from "react"

const Home = () => {
  
  return(
    <>
      <h1>The Password Manager</h1>
      <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Laboriosam ullam velit veritatis, aspernatur laudantium non aliquid ratione reprehenderit omnis possimus porro consequatur dolorem consequuntur dolore dolorum itaque facilis quaerat beatae.</p>      
      <div>
        <Link to="/Register">Register</Link>
        <br/>
        <Link to="/Login">Login</Link>
      </div>
    </>
  )
}

export default Home