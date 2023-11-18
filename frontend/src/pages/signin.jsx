import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useState } from 'react'

function SignIn() {
    const [email, setEmail] = useState()
    const [password, setPassword] = useState()
    const navigate = useNavigate()
    const [error, setError] = useState()

    const handleSubmit = (e) => {
        e.preventDefault()
        axios.post('http://localhost:8080/login', {email, password})
        .then(result => {
            console.log(result)
            if(result.data === "Success")
            {
                navigate('/home')
            }
            else
            {
                setError(result.data.error || 'An error occurred.');
            }
        })
        .catch(err => {
            console.log(err)
            setError('An error occurred.');
        })
    }

    return (
        <div className="page-center">
            <img style={{width: 180}} src="../../../src/assets/uc thrift 2.svg" alt="logo" />
            <h2> sign in </h2>
            <form className="input-list" onSubmit={handleSubmit}>
                <input
                    type="email"
                    placeholder="Email"
                    autoComplete="off"
                    name="email"
                    className="input"
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    autoComplete="off"
                    name="password"
                    className="input"
                    onChange={(e) => setPassword(e.target.value)}
                />
                {error && <p style={{ color: 'red', top: '400px', position: 'absolute' }}>{error}</p>}
                <button style={{marginTop: 35 + 'px'}} type="submit">
                    log in
                </button>
            </form>
            <p style={{marginTop: 25 + 'px'}}> don't have an account? <Link to="/register"> sign up </Link></p>
        </div>
    )
}

export default SignIn