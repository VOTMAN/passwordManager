import { useContext, useEffect, useState } from "react"
import { AuthContext } from "../Context/AuthContext"
import { useLocation } from "react-router-dom"
import styles from "./PassList.module.css"

const PassList = (props) => {
  const { passwords, setPasswords, deletePasswords } = useContext(AuthContext)
  const [visiblePasswords, setVisiblePasswords] = useState(passwords.map(() => false))

  const dp = props.deletePassword
  const location = useLocation()
  useEffect(() => {
        return () => {
            setPasswords([]);
        };
  }, [setPasswords, location]);

  const togglePassword = (index) => {
    setVisiblePasswords(prevState => 
    prevState.map((isVisible, i) => (i === index ? (!isVisible) : isVisible)))
  }
  return (
    <div className={styles.passwordContainer}>
    <ol className={styles.passwordList}>
      {passwords.length ? 
        passwords.map((password, index) => (
          <li key={password[0]} className={styles.passwordItem}>
            <div className={styles.passwordHeader}>
              <h3>{password[1]}:</h3>
              <h4>{password[2]}</h4>
            </div>
            <p className={styles.passwordText} id="websitePassword">
              {visiblePasswords[index] ? password[3] : '*'.repeat(password[3].length)}
            </p>
            <div className={styles.passwordActions}>
              <button className={styles.toggleButton} onClick={() => togglePassword(index)}>
                {visiblePasswords[index] ? "Hide" : "Reveal"}
              </button>
              <button className={styles.copyButton} onClick={() => {navigator.clipboard.writeText(password[3]); alert('Copied')}}>
                Copy to Clipboard
              </button>
              <button className={styles.deleteButton} onClick={() => dp(password[0])}>Delete</button>
            </div>
          </li>
        )) 
        : <p className={styles.noPasswordsMessage}>No passwords stored yet!</p>
      }
    </ol>
  </div>
  
    )
}

export default PassList