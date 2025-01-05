import { Link } from "react-router-dom"
import { useState, useEffect } from "react"

const Home = () => {
  const handleSubmit = async (e) => {
    e.preventDefault()
    const username = document.getElementById('username').value
    const password = document.getElementById('password').value

    const userDetails = {
      username,
      password
    }
    try {
      
      const req = await fetch("http://localhost:5000/", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userDetails)
      })
  
      const res = await req.json()
      console.log(res)  
      alert('Submitted')
    } catch (error) {
      console.log(error)      
    }
    
  }

  return(
    <>
      <h1>The Password Manager</h1>
      <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Laboriosam ullam velit veritatis, aspernatur laudantium non aliquid ratione reprehenderit omnis possimus porro consequatur dolorem consequuntur dolore dolorum itaque facilis quaerat beatae.</p>      
      <div>
        <Link to="/Register">Register</Link>
        <br/>
        <Link to="/Login">Login</Link>
      </div>
      <div>
        <input type="text" name="username" id="username" onChange={e => e.target.value}/>
        <br/>
        <input type="password" id="password" onChange={e => e.target.value}/>
        <button onClick={handleSubmit}>Submit</button>
      </div>
    </>
  )
}

export default Home