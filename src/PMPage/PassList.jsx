import { useContext, useEffect, useState, useRef } from "react"
import { AuthContext } from "../Context/AuthContext"
import { useLocation } from "react-router-dom"
import styles from "./PassList.module.css"

const PassList = (props) => {
  const { passwords, setPasswords } = useContext(AuthContext)
  const [visiblePasswords, setVisiblePasswords] = useState(passwords.map(() => false))
  const [copiedIndex, setCopiedIndex] = useState(null)
  const [deletingIndex, setDeletingIndex] = useState(null)
  const hideTimersRef = useRef({})

  const dp = props.deletePassword
  const location = useLocation()

  useEffect(() => {
    setVisiblePasswords(passwords.map(() => false))
  }, [passwords])

  useEffect(() => {
    return () => {
      setPasswords([]);
    };
  }, [setPasswords, location]);

  useEffect(() => {
    return () => {
      Object.values(hideTimersRef.current).forEach(clearTimeout)
    }
  }, [])

  const togglePassword = (index) => {
    const willBeVisible = !visiblePasswords[index]

    setVisiblePasswords(prevState =>
      prevState.map((isVisible, i) => (i === index ? !isVisible : isVisible))
    )

    if (willBeVisible) {
      if (hideTimersRef.current[index]) {
        clearTimeout(hideTimersRef.current[index])
      }
      hideTimersRef.current[index] = setTimeout(() => {
        setVisiblePasswords(prev => prev.map((v, i) => i === index ? false : v))
        delete hideTimersRef.current[index]
      }, 2000)
    } else {
      if (hideTimersRef.current[index]) {
        clearTimeout(hideTimersRef.current[index])
        delete hideTimersRef.current[index]
      }
    }
  }

  const copyToClipboard = async (password, index) => {
    try {
      await navigator.clipboard.writeText(password)
      setCopiedIndex(index)

      setTimeout(() => setCopiedIndex(null), 2000)
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = password
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)

      setCopiedIndex(index)
      setTimeout(() => setCopiedIndex(null), 2000)
    }
  }

  const handleDelete = async (passwordId, index) => {
    if (window.confirm('Are you sure you want to delete this password?')) {
      setDeletingIndex(index)
      try {
        await dp(passwordId)
      } catch (error) {
        console.error('Error deleting password:', error)
      } finally {
        setDeletingIndex(null)
      }
    }
  }

  if (!passwords.length) {
    return (
      <div className={styles.passwordContainer}>
        <div className={styles.noPasswordsMessage}>
          <h3>🔐 No passwords stored yet!</h3>
          <p>Add your first password using the form above to get started.</p>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.passwordContainer}>
      <h2 className={styles.sectionTitle}>Your Saved Passwords</h2>

      <div className={styles.statsBar}>
        <div className={styles.statItem}>
          <span className={styles.statNumber}>{passwords.length}</span>
          <span className={styles.statLabel}>Total Passwords</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statNumber}>{visiblePasswords.filter(Boolean).length}</span>
          <span className={styles.statLabel}>Currently Visible</span>
        </div>
      </div>

      <ul className={styles.passwordList}>
        {passwords.map((password, index) => (
          <li
            key={password[0]}
            className={`${styles.passwordItem} ${deletingIndex === index ? styles.loading : ''}`}
          >
            <div className={styles.passwordHeader}>
              <h3 className={styles.websiteName}>{password[1]}</h3>
              <span className={styles.username}>{password[2]}</span>
            </div>

            <div className={styles.passwordSection}>
              <div className={styles.passwordLabel}>Password</div>
              <div
                className={`${styles.passwordText} ${
                  visiblePasswords[index]
                    ? styles.visible
                    : styles.hidden
                }`}
              >
                {visiblePasswords[index]
                  ? password[3]
                  : '•'.repeat(Math.min(password[3].length, 20))
                }
              </div>
            </div>

            <div className={styles.passwordActions}>
              <button
                className={`${styles.actionButton} ${styles.toggleButton}`}
                onClick={() => togglePassword(index)}
                disabled={deletingIndex === index}
              >
                {visiblePasswords[index] ? '👁️ Hide' : '👁️ Show'}
              </button>

              <button
                className={`${styles.actionButton} ${styles.copyButton} ${
                  copiedIndex === index ? styles.copied : ''
                }`}
                onClick={() => copyToClipboard(password[3], index)}
                disabled={deletingIndex === index}
              >
                {copiedIndex === index ? '✓ Copied!' : '📋 Copy'}
              </button>

              <button
                className={`${styles.actionButton} ${styles.deleteButton}`}
                onClick={() => handleDelete(password[0], index)}
                disabled={deletingIndex === index}
              >
                {deletingIndex === index ? '⏳ Deleting...' : '🗑️ Delete'}
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default PassList