import { useState } from "react"
import { Link } from "react-router-dom"
import { loginUser } from "../services/auth"
import styles from "./RegistrationPage.module.css"


const LoginPage = () => {
    const [error, setError] = useState<string[]>([])

    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")

    const sendLoginForm = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setError([])
        if (!username) {
            setError(prev => [...prev, "Username is required"])
        }
        if (!password) {
            setError(prev => [...prev, "Password is required"])
        }
        if (error.length === 0) {
            loginUser(username, password)
                .then(response => {
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
                <h1 className={styles.title}>Log in</h1>

                <form className={styles.registerForm} onSubmit={sendLoginForm}>
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

                    <label className={styles.field} htmlFor="password">
                        Password
                        <input
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </label>

                    <button className={styles.submitButton} type="submit">Log in</button>

                    {error.length > 0 && (
                        <div className={styles.errors} role="alert">
                            {error.map((message, index) => <p key={`${message}-${index}`}>{message}</p>)}
                        </div>
                    )}
                </form>

                <p className={styles.loginPrompt}>
                    New to the farm? <Link className={styles.loginLink} to="/register">Create an account</Link>
                </p>
            </section>
        </main>
    )
}

export default LoginPage