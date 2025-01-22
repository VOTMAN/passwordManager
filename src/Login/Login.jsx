import { Link, useNavigate } from "react-router-dom"
import { AuthContext } from "../Context/AuthContext"
import { useContext, useEffect } from "react"
import styles from "./Login.module.css"

const Login = () => {
  const {setToken} = useContext(AuthContext)
  const navigate = useNavigate()
  
  const handleSubmit = async (e) => {
    
    const username = document.getElementById("user-l").value
    const password = document.getElementById("password-l").value
    let statText = document.getElementById("statusText-l")
    
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

      const data = await res.json()
      if (!res.ok) {
        statText.style.color = "red"
        statText.innerText = data.error
        return
      }

      const accessToken = data.access_token
      statText.style.color = 'black'
      statText.innerText = data.message + ", Please wait..."
      setToken(accessToken)
      navigate("/PMpage/" + username)
    } catch (error) {
      console.error(error)
      statText.style.color = "blue"
      statText.innerText = "Server Down, Try Again Later"
    }
  }

  return (
    <>
    <div className={styles.navbar}>
      <h3>Logo</h3>
      <div className={styles.navLinks}>
        <Link to="/" className={styles.navItem}>Home</Link>
        <Link to="/Register" className={styles.navItem}>Register</Link>
        <Link to="/Login" className={styles.navItem}>Login</Link>
      </div>        
    </div>    
    <div className={styles.loginContainer}>
      <h2>Login</h2>
      <div className={styles.formContainer}>
        <div className={styles.inputGroup}>
          <label htmlFor="username">Username</label>
          <input type="text" name="username" id="user-l" placeholder="Enter your username" />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="password">Password</label>
          <input type="password" name="password" id="password-l" placeholder="Enter your password" />
        </div>
        <button id="submit" onClick={handleSubmit} className={styles.btnLogin}>Login</button>
        <h4 id="statusText-l" className={styles.statusText}></h4>
      </div>
      <h3>Not a user yet? Signup here - <a href="/Register" className={styles.registerLink}>Register</a></h3>
    </div>
    </>
  )
}
export default Login