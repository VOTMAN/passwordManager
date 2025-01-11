import { Link, useNavigate } from "react-router-dom"
import { AuthContext } from "./AuthContext"
import { useContext, useEffect } from "react"

const Login = () => {
  const {setToken} = useContext(AuthContext)
  const navigate = useNavigate()
  const statText = document.getElementById("statusText-l")

  const handleSubmit = async (e) => {
    e.preventDefault()
    const username = document.getElementById("user-l").value
    const password = document.getElementById("password-l").value
    
    if (username === '' || password === '') {
      alert("Fill all the fields")
      return
    }

    const userData = {
      username,
      password
    }

    try {
      const res = await fetch("http://127.0.0.1:5000/api/login", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData)
      })

      if (!res.ok) {
        statText.style.color = "red"
        const err = await res.json()
        statText.innerText = err.error
      }

      const data = await res.json()
      const accessToken = data.access_token
      statText.style.color = 'black'
      statText.innerText = data.message + ", Please wait..."
      setToken(accessToken)
      navigate("/PMpage/" + username)
    } catch (error) {
      statText.style.color = "blue"
      statText.innerText = "Server Down, Try Again Later"
    }
  }

  return (
    <div>
      <h2>Login</h2>
      <div>
        <div>
          <label htmlFor="username">Username</label>
          <input type="text" name="username" id="user-l" />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input type="password" name="username" id="password-l" />
        </div>
        <button id="submit" onClick={handleSubmit}>Login</button>
        <h4 id="statusText-l"></h4>
      </div>
      <h3>Not a user? <Link to='/Register'>Register</Link></h3>
    </div>
  )
}
export default Login