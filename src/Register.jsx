const Register = () => {
  return (
    <div>
      <h2>Register</h2>
      <div>
        <label htmlFor="name">Username</label>
        <input type="text" name="username" id="user" />
        <br/>
        <label htmlFor="password">Password</label>
        <input type="password" name="password" id="pass" />
        <br/>
        <label htmlFor="password">Re-Enter Password</label>
        <input type="password" name="password" id="pass" />
        <br/>
        <button>Register</button>
      </div>
    </div>
  )
}
export default Register