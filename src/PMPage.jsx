import { useParams } from 'react-router-dom'
import { AuthContext } from './AuthContext'
import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'

const PMPage = () => {
  const { token } = useContext(AuthContext)
  const username = useParams().username
  const navigate = useNavigate()

  const checkTokenValidity = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/protected", {
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
      console.error(err)
    }
  }

  const getPasswords = async () => {
    if (token == null) {
      alert("Cannot access session token, Logging out...")
      navigate("/login")
    }

    try {
      console.log(token)
      const res = await fetch(`http://localhost:5000/api/${username}/getPasswords`, {
        method:"GET",
        headers:{
          'Authorization': `Bearer ${token}`,
        },
      })

      if (!res.ok) {
        console.error(data)
      }
      
    } catch (err) {
      console.log(err)
    }
  }

  checkTokenValidity()
  setInterval(checkTokenValidity, 30000)
  
  return (
    <div>
      <div>PMPage {username}</div>
      <button onClick={getPasswords}>hel</button>
    </div>
  )
}
export default PMPage