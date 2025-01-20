import { useParams, useNavigate } from 'react-router-dom'
import { AuthContext } from './AuthContext'
import { useContext, useEffect, useState } from 'react'
import PassList from './PassList'

const PMPage = () => {
  const { token, setPasswords, setToken } = useContext(AuthContext)
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
      const res = await fetch(`http://localhost:5000/api/setPassword`, {
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
      const res = await fetch(`http://127.0.0.1:5000/api/getPasswords`, {
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


  // checkTokenValidity()
  setInterval(checkTokenValidity, 60000)
  
  return (
    <div>
      <div>
        <h4>ThePassword Manager</h4>
        <button onClick={() => setToken(null)}>Log Out</button>
      </div>
      <h1>Welcome {username}!</h1>
      <h3 id='statText'></h3>
      <div>
        <h4>Add Password</h4>
        <input type="text" id="websiteName" placeholder='Enter the website...'/>
        <input type="text" id="websiteUser" placeholder="Website's username or email"/>
        <input type="password" id="websitePassword" placeholder='Enter the password...'/>
        <button onClick={setPassword}>Add Password</button>
      </div>
      <button onClick={getPasswords}>Load Passwords</button>
      {load ? <PassList/> : <p>Press the above button to load the passwords</p>}
    </div>
  )
}
export default PMPage