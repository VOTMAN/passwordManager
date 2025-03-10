import { useParams, useNavigate } from 'react-router-dom'
import { AuthContext } from '../Context/AuthContext'
import { ModeContext } from '../Context/ModeContext'
import { ServerContext } from '../Context/ServerContext'
import { useContext, useEffect, useState } from 'react'
import PassList from './PassList'
import styles from "./PMPage.module.css"

const PMPage = () => {
  const {server} = useContext(ServerContext)
  const baseurl = server  

  const { token, setPasswords, setToken } = useContext(AuthContext)
  const { darkMode, changeMode } = useContext(ModeContext)
  const [load, setLoad] = useState(false)
  const username = useParams().username
  const navigate = useNavigate()
  
  useEffect(() => {
    if (!token) {
      setPasswords([])
      navigate('/login')
    }
  }, [token, navigate])
  
  const checkTokenValidity = async () => {
    const res = await fetch(`${baseurl}/api/protected`, {
      method: "GET",
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    
    if (res.status == 401) {
      alert("Session Expired, Logging out...")
      setPasswords([])
      navigate("/login")
    }    
  }

  const setPassword = async (e) => {
    checkTokenValidity()
    e.preventDefault()
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
      getPasswords()
      
    } catch (err) {
      statText.style.color = 'red'
      statText.innerText = err.message
    }
  }
  
  const getPasswords = async () => {
    checkTokenValidity()
    
    const statText = document.getElementById('statText')
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
    checkTokenValidity()    
    
    const statText = document.getElementById('statText')
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

      
      statText.style.color = 'green'
      statText.innerText = data.message

      getPasswords()

    } catch (err) {
      statText.style.color = 'red'
      statText.innerText = err.message
    }
  }
  
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
  
    <form className={styles.passwordForm}>
      <h4>Add Password</h4>
      <input type="text" id="websiteName" placeholder='Enter the website...' className={styles.inputField} />
      <input type="text" id="websiteUser" placeholder="Website's username or email" className={styles.inputField} />
      <input type="password" id="websitePassword" placeholder='Enter the password...' className={styles.inputField} />
      <button onClick={setPassword} className={styles.addButton}>Add Password</button>
    </form>
    <div className={styles.passwordForm}>
      <button onClick={getPasswords} className={styles.loadButton}>Load Passwords</button>
    </div>
  
    <h3 id='statText' className={styles.statusText}></h3>
    {load ? <PassList deletePassword={deletePassword}/> : <p className={styles.infoText}>Press the above button to load the passwords</p>}
  </div>
  )
}
export default PMPage