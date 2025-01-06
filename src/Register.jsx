import { useState } from "react"
import { Link } from "react-router-dom"


const Register = () => {
  const handleSubmit = async (e) => {
    e.preventDefault()
    const username = document.getElementById('user').value
    const password = document.getElementById('pass').value
    const repass = document.getElementById('repass').value
    const statText = document.getElementById('statusText')
    
    if (password != repass) {
      alert("The passwords are not the same")
      return
    }
    
    const userDetails = {
      username,
      password
    }
    
    try {
      const res = await fetch("http://localhost:5000/api/reg", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userDetails)
      })
      
      if (!res.ok) {
        statText.style.color = 'red'
        const errorData = await res.json()
        statText.innerText = errorData.error
      }
        
        
      const data = await res.json()
      statText.style.color = 'green'
      statText.innerText = data.message
      alert("User Created")
      
    } catch (error) {
      if (error instanceof TypeError) {
        statText.innerText = "Server Down, Try later"
      } else {
        console.log("Error: ", error)
      }
    }  
  }

  return (
    <div>
      <h2>Register</h2>
      <div>
        <label htmlFor="name">Username</label>
        <input type="text" name="username" id="user" />
        <br/>
        <label htmlFor="password">Password</label>
        <input type="password" name="password" id="pass" />
        <br/>
        <label htmlFor="password">Re-Enter Password</label>
        <input type="password" name="password" id="repass" />
        <br/>
        <button onClick={handleSubmit}>Register</button>
        <p id="statusText"></p>
      </div>
      <p>Already a user? Go to the <Link to='/Login'>Login Page</Link></p>
    </div>
  )
}
export default Register