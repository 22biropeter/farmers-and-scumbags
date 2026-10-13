import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { registerUser } from "../services/auth"
import styles from "./RegistrationPage.module.css"

const RegistrationPage = () => {
  const navigate = useNavigate()
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password1, setPassword1] = useState("")
  const [password2, setPassword2] = useState("")

  const [error, setError] = useState<string[]>([])

  const sendRegistrationForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError([])
    if(password1 !== password2) {
      setError(prev => [...prev, "Passwords do not match"])
    }
    if(password1.length < 8) {
      setError(prev => [...prev, "Password must be at least 8 characters long"])
    }
    if(!username) {
      setError(prev => [...prev, "Username is required"])
    }
    if(!email) {
      setError(prev => [...prev, "Email is required"])
    }
    if(error.length === 0) {
        registerUser(username, password1, email)
        .then(response => {
            navigate("/login");
            console.log(response);
        }).catch(error => {
            console.error(error);
        })
    }
  }

  return (
    <main className={styles.registrationPage}>
      <section className={styles.registerPanel}>
        <p className={styles.eyebrow}>Farmers &amp; Scumbags</p>
        <h1 className={styles.title}>Register</h1>

        <form className={styles.registerForm} onSubmit={sendRegistrationForm}>
          <label className={styles.field} htmlFor="username">
            Username
            <input
              type="text"
              id="username"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </label>

          <label className={styles.field} htmlFor="email">
            Email address
            <input
              type="email"
              id="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>

          <label className={styles.field} htmlFor="password1">
            Password
            <input
              type="password"
              id="password1"
              autoComplete="new-password"
              value={password1}
              onChange={(e) => setPassword1(e.target.value)}
            />
          </label>

          <label className={styles.field} htmlFor="password2">
            Confirm password
            <input
              type="password"
              id="password2"
              autoComplete="new-password"
              value={password2}
              onChange={(e) => setPassword2(e.target.value)}
            />
          </label>

          <button className={styles.submitButton} type="submit">Create account</button>

          {error.length > 0 && (
            <div className={styles.errors} role="alert">
              {error.map((message, index) => <p key={`${message}-${index}`}>{message}</p>)}
            </div>
          )}
        </form>

        <p className={styles.loginPrompt}>
          Already have an account? <Link className={styles.loginLink} to="/login">Log in</Link>
        </p>
      </section>
    </main>
  )
}

export default RegistrationPage