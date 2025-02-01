import { useParams, useNavigate } from 'react-router-dom'
import { AuthContext } from '../Context/AuthContext'
import { ModeContext } from '../Context/ModeContext'
import { useContext, useEffect, useState } from 'react'
import PassList from './PassList'
import styles from "./PMPage.module.css"

const PMPage = () => {
  const baseurl = import.meta.env.VITE_BASE_URL
  const { token, setPasswords, setToken } = useContext(AuthContext)
  const { darkMode, changeMode } = useContext(ModeContext)
  const [load, setLoad] = useState(false)
  const username = useParams().username
  const navigate = useNavigate()
  
  useEffect(() => {
    if (!token) {
      navigate('/login')
      window.location.reload()
    }
  }, [token, navigate])
  
  const checkTokenValidity = async () => {
    try {
      const res = await fetch(`${baseurl}/api/protected`, {
        method: "GET",
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (res.status == 401) {
        alert("Session Expired, Logging out...")
        navigate("/login")
        window.location.reload()
      }
    } catch (err) {
      statText.style.color = 'red'
      statText.innerText = err.message
    }
  }

  const setPassword = async () => {
    const websiteName = document.getElementById('websiteName').value
    const websiteUser = document.getElementById('websiteUser').value
    const websitePassword = document.getElementById('websitePassword').value
    const statText = document.getElementById('statText')
    
    if (websiteName === '' || websiteUser === '' || websitePassword === '') {
      alert("Fill both the fields")
      return
    }
    

    const wsd = {
      websiteName,
      websiteUser,
      websitePassword,
    }

    try{
      const res = await fetch(`${baseurl}/api/setPassword`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(wsd)
      })
      
      const data = await res.json()
      if (!res.ok) {
        statText.style.color = 'red'
        statText.innerText = data.error
        return
      } 

      statText.style.color = 'green'
      statText.innerText = data.message
      
      
      setLoad(false)
    } catch (err) {
      statText.style.color = 'red'
      statText.innerText = err.message
    }
  }
  
  const getPasswords = async () => {
    const statText = document.getElementById('statText')
    if (token == null) {
      alert("Cannot access session token, Logging out...")
      navigate("/login")
    }
    try {
      const res = await fetch(`${baseurl}/api/getPasswords`, {
        method:"GET",
        headers:{
          'Authorization': `Bearer ${token}`,
        },
      })

      const data = await res.json()
      if (!res.ok) {
        statText.style.color = 'red'
        statText.innerText = data.error
        return
      }

      console.log(data.data)
      setPasswords(data.data)
      setLoad(true)

      statText.style.color = 'green'
      statText.innerText = data.message
    
    } catch (err) {
      statText.style.color = 'red'
      statText.innerText = err.message
    }
  }

  const deletePassword = async (idx) => {
    const statText = document.getElementById('statText')
    if (token == null) {
      alert("Cannot access session token, Logging out...")
      navigate("/login")
    }
    console.log(idx)
    try {
      const res = await fetch(`${baseurl}/api/deletePassword`, {
        method: "DELETE",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(idx)
      })

      const data = await res.json()
      if (!res.ok) {
        statText.style.color = 'red'
        statText.innerText = data.error
        return
      }

      
      console.log(data)
      statText.style.color = 'green'
      statText.innerText = data.message
      setLoad(false)
    } catch (error) {
      statText.style.color = 'red'
      statText.innerText = err.message
    }
  }

  // checkTokenValidity()
  setInterval(checkTokenValidity, 60000)
  
  return (
  <div className={styles.container}>
    <div className={styles.header}>
      <h4 className={styles.appTitle}>The Password Manager</h4>
      <div>
        <button onClick={() => changeMode(darkMode)} className={styles.logoutButton}>Toggle Mode</button>
        <button onClick={() => setToken(null)} className={styles.logoutButton}>Log Out</button>
      </div>
      
    </div>
    <h1 className={styles.welcomeMessage}>Welcome {username}!</h1>
  
    <div className={styles.passwordForm}>
      <h4>Add Password</h4>
      <input type="text" id="websiteName" placeholder='Enter the website...' className={styles.inputField} />
      <input type="text" id="websiteUser" placeholder="Website's username or email" className={styles.inputField} />
      <input type="password" id="websitePassword" placeholder='Enter the password...' className={styles.inputField} />
      <button onClick={setPassword} className={styles.addButton}>Add Password</button>
      <button onClick={getPasswords} className={styles.loadButton}>Load Passwords</button>
    </div>
  
    <h3 id='statText' className={styles.statusText}></h3>
    {load ? <PassList deletePassword={deletePassword}/> : <p className={styles.infoText}>Press the above button to load the passwords</p>}
  </div>
  )
}
export default PMPage