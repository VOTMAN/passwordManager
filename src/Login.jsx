const Login = () => {
  const handleSubmit = async (e) => {
    e.preventDefault()
    const username = document.getElementById("user-l").value
    const password = document.getElementById("password-l").value
    const statText = document.getElementById("statusText-l")
    
    const userData = {
      username,
      password
    }

    try {
      const res = await fetch("http://localhost:5000/api/login", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData)
      })

      if (!res.ok) {
        statText.style.color = "red"
        const err = await res.json()
        statText.innerText = err.error
      }

      const data = await res.json()
      statText.style.color = 'black'
      statText.innerText = data.message + ", Please wait..."
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div>
      <h2>Login</h2>
      <div>
        <div>
          <label htmlFor="username">Username</label>
          <input type="text" name="username" id="user-l" />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input type="password" name="username" id="password-l" />
        </div>
        <button id="submit" onClick={handleSubmit}>Login</button>
        <p id="statusText-l"></p>
      </div>
    </div>
  )
}
export default Login