import { useContext, useEffect, useState } from "react"
import { AuthContext } from "./AuthContext"
import { useLocation } from "react-router-dom"

const PassList = () => {
  const { passwords, setPasswords } = useContext(AuthContext)
  const [visiblePasswords, setVisiblePasswords] = useState(passwords.map(() => false))

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
    <div>
        <ol>
            {passwords.length ? 
            passwords.map((password, index) => {
                return(
                    <div key={password[0]}>
                        <li><h3>{password[1]} :</h3><h4>{password[2]}</h4><p id="websitePassword">{visiblePasswords[index] ? password[3] : '*'.repeat(password[3].length)}</p></li>
                        <button onClick={() => togglePassword(index)}>
                            {visiblePasswords[index] ? "Hide" : "Reveal"}
                        </button>
                        <button onClick={() => {navigator.clipboard.writeText(password[3]); alert('Copied')}}>Copy to Clipboard</button>
                    </div>
                )
            }) : <p>No passwords stored yet!</p>}
            
        </ol>
    </div>
    )
}

export default PassList