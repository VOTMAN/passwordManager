import { useState } from "react"
import { Link } from "react-router-dom"


const Register = () => {
  const handleSubmit = async (e) => {
    e.preventDefault()
    const username = document.getElementById('user-r').value
    const password = document.getElementById('pass-r').value
    const repass = document.getElementById('repass-r').value
    const statText = document.getElementById('statusText-r')
    
    if (username === '' || password === '' || repass === '') {
      alert("Fill all the fields")
      return
    }

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
        const errorData = await res.json()
        statText.style.color = 'red'        
        statText.innerText = errorData.error
        return
      }
        
      const data = await res.json()
      statText.style.color = 'green'
      statText.innerText = data.message
      alert("User Created")
      
    } catch (error) {
      statText.style.color = "blue"
      statText.innerText = "Server Down, Try Again Later" 
    }  
  }

  return (
    <div>
      <h2>Register</h2>
      <div>
        <div>
          <label htmlFor="name">Username</label>
          <input type="text" name="username" id="user-r" />
        </div>
        <br/>
        <div>
          <label htmlFor="password">Password</label>
          <input type="password" name="password" id="pass-r" />
        </div>
        <br/>
        <div>
          <label htmlFor="password">Re-Enter Password</label>
          <input type="password" name="password" id="repass-r" />
        </div>
        <br/>
        <button onClick={handleSubmit}>Register</button>
        <p id="statusText-r"></p>
      </div>
      <p>Already a user? Go to the <Link to='/Login'>Login Page</Link></p>
    </div>
  )
}
export default Register