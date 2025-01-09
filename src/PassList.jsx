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
            {passwords.map((password, index) => {
                return(
                    <div key={password[0]}>
                        <li>{password[1]} : <p id="websitePassword">{visiblePasswords[index] ? password[2] : '*'.repeat(password[2].length)}</p></li>
                        <button onClick={() => togglePassword(index)}>
                            {visiblePasswords[index] ? "Hide" : "Reveal"}
                        </button>
                    </div>
                )
            })}
        </ol>
    </div>
    )
}

export default PassList