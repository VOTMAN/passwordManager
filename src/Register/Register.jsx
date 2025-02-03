import { useState } from "react"
import { Link } from "react-router-dom"
import styles from './Register.module.css'
import Navbar from "../Nav/Navbar"

const Register = () => {
  const baseurl = import.meta.env.VITE_BASE_URL
  const handleSubmit = async (e) => {
    e.preventDefault()
    const username = String(document.getElementById('user-r').value).trim()
    const password = (document.getElementById('pass-r').value).trim()
    const repass = (document.getElementById('repass-r').value).trim()
    const statText = document.getElementById('statusText-r')
    
    if (!username || !password || !repass) {
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
      const res = await fetch(`${baseurl}/api/reg`, {
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
            
    } catch (error) {
      statText.style.color = "blue"
      statText.innerText = "Server Down, Try Again Later" 
    }  
  }

  return (
  <>
  <Navbar/>    
  <div class={styles.registerContainer}>
    <h2>Register</h2>
    <div class={styles.formContainer}>
      <div class={styles.inputGroup}>
        <label htmlFor="user-r">Username</label>
        <input type="text" name="username" id="user-r" placeholder="Enter your username" />
      </div>
      <div class={styles.inputGroup}>
        <label htmlFor="pass-r">Password</label>
        <input type="password" name="password" id="pass-r" placeholder="Enter your password" />
      </div>
      <div class={styles.inputGroup}>
        <label htmlFor="repass-r">Re-Enter Password</label>
        <input type="password" name="repassword" id="repass-r" placeholder="Re-enter your password" />
      </div>
      <button onClick={handleSubmit} class={styles.btnRegister}>Register</button>
      <h4 id="statusText-r" class={styles.statusText}></h4>
    </div>
  <h3>Already a user? Go to the <a href="/Login" class={styles.loginLink}>Login Page</a></h3>
  </div>
  </>

  )
}
export default Register
