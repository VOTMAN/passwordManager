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
  const [isLoading, setIsLoading] = useState(false)
  const [statusMessage, setStatusMessage] = useState('')
  const [statusType, setStatusType] = useState('') // 'success', 'error', or ''

  const username = useParams().username
  const navigate = useNavigate()

  useEffect(() => {
    if (!token) {
      setPasswords([])
      navigate('/login')
    }
  }, [token, navigate])

  const updateStatus = (message, type) => {
    setStatusMessage(message)
    setStatusType(type)
    // Clear status after 5 seconds
    setTimeout(() => {
      setStatusMessage('')
      setStatusType('')
    }, 5000)
  }

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
    e.preventDefault()
    setIsLoading(true)

    await checkTokenValidity()

    const websiteName = document.getElementById('websiteName').value
    const websiteUser = document.getElementById('websiteUser').value
    const websitePassword = document.getElementById('websitePassword').value

    if (websiteName === '' || websiteUser === '' || websitePassword === '') {
      updateStatus("Please fill in all fields", "error")
      setIsLoading(false)
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
        updateStatus(data.error, "error")
        setIsLoading(false)
        return
      }

      updateStatus(data.message, "success")

      // Clear form
      document.getElementById('websiteName').value = ''
      document.getElementById('websiteUser').value = ''
      document.getElementById('websitePassword').value = ''

      setLoad(false)
      await getPasswords()

    } catch (err) {
      updateStatus(err.message, "error")
    }

    setIsLoading(false)
  }

  const getPasswords = async () => {
    setIsLoading(true)
    await checkTokenValidity()

    try {
      const res = await fetch(`${baseurl}/api/getPasswords`, {
        method:"GET",
        headers:{
          'Authorization': `Bearer ${token}`,
        },
      })

      const data = await res.json()
      if (!res.ok) {
        updateStatus(data.error, "error")
        setIsLoading(false)
        return
      }

      setPasswords(data.data)
      setLoad(true)
      updateStatus(data.message, "success")

    } catch (err) {
      updateStatus(err.message, "error")
    }

    setIsLoading(false)
  }

  const deletePassword = async (idx) => {
    await checkTokenValidity()

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
        updateStatus(data.error, "error")
        return
      }

      updateStatus(data.message, "success")
      getPasswords()

    } catch (err) {
      updateStatus(err.message, "error")
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.mainContent}>
        <div className={styles.header}>
          <h1 className={styles.appTitle}>The Password Manager</h1>
          <div className={styles.buttonGroup}>
            <button
              onClick={() => changeMode(darkMode)}
              className={`${styles.headerButton} ${styles.toggleButton}`}
            >
              {darkMode ? '☀️ Light' : '🌙 Dark'}
            </button>
            <button
              onClick={() => setToken(null)}
              className={`${styles.headerButton} ${styles.logoutButton}`}
            >
              Log Out
            </button>
          </div>
        </div>

        <h2 className={styles.welcomeMessage}>Welcome, {username}!</h2>

        <div className={styles.formSection}>
          <h3 className={styles.formTitle}>Add New Password</h3>
          <form onSubmit={setPassword}>
            <div className={styles.inputGroup}>
              <input
                type="text"
                id="websiteName"
                placeholder='Website name (e.g., Google, Facebook)'
                className={styles.inputField}
                disabled={isLoading}
              />
            </div>
            <div className={styles.inputGroup}>
              <input
                type="text"
                id="websiteUser"
                placeholder="Username or email address"
                className={styles.inputField}
                disabled={isLoading}
              />
            </div>
            <div className={styles.inputGroup}>
              <input
                type="password"
                id="websitePassword"
                placeholder='Enter the password'
                className={styles.inputField}
                disabled={isLoading}
              />
            </div>
            <button
              type="submit"
              className={`${styles.primaryButton} ${styles.addButton}`}
              disabled={isLoading}
            >
              {isLoading ? 'Adding...' : 'Add Password'}
            </button>
          </form>
        </div>

        <div className={styles.loadSection}>
          <button
            onClick={getPasswords}
            className={styles.loadButton}
            disabled={isLoading}
          >
            {isLoading ? 'Loading...' : 'Load Passwords'}
          </button>
        </div>

        {statusMessage && (
          <div
            className={styles.statusText}
            style={{
              color: statusType === 'success' ? '#4caf50' : '#f44336',
              borderColor: statusType === 'success' ? '#4caf50' : '#f44336'
            }}
          >
            {statusMessage}
          </div>
        )}

        {load ? (
          <PassList deletePassword={deletePassword}/>
        ) : (
          <p className={styles.infoText}>
            Click "Load Passwords" to view your saved passwords
          </p>
        )}
      </div>
    </div>
  )
}

export default PMPage