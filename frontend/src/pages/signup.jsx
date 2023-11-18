// import './index.css';
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useState } from 'react'

function SignUp() {
    const [email, setEmail] = useState()
    const [firstName, setFirst] = useState()
    const [lastName, setLast] = useState()
    const [password, setPassword] = useState()
    const [confirmedPassword, setConfirm] = useState()
    const [error, setError] = useState()
    const navigate = useNavigate()

    const handleSubmit = (e) => {
        e.preventDefault()
        if(password !== confirmedPassword)
        {
            setError("Passwords do not match.");
            return;
        }

        setError(null);

        axios.post('http://localhost:8080/register', {email, firstName, lastName, password, confirmedPassword})
        .then(result => {
            console.log(result)
            navigate('/login')
        })
        .catch(err => {
            console.log(err)
            setError(err.response.data.error || 'An error occurred.');
        })
    }

    return (
        <div className="page-center">
            <img style={{width: 180}} src="../../../src/assets/uc thrift 2.svg" alt="logo" />
            <h2> sign up </h2>
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
                    type="first"
                    placeholder="First Name"
                    autoComplete="off"
                    name="first"
                    className="input"
                    onChange={(e) => setFirst(e.target.value)}
                />
                <input
                    type="last"
                    placeholder="Last Name"
                    autoComplete="off"
                    name="last"
                    className="input"
                    onChange={(e) => setLast(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    autoComplete="off"
                    name="password"
                    className="input"
                    onChange={(e) => setPassword(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Confirm Password"
                    autoComplete="off"
                    name="confirm"
                    className="input"
                    onChange={(e) => setConfirm(e.target.value)}
                />
                {error && <p style={{ color: 'red', top: '505px', position: 'absolute' }}>{error}</p>}
                <button style={{marginTop: 35 + 'px'}} type="submit">
                    join now
                </button>
            </form>
            <p style={{marginTop: 25 + 'px'}}> already have an account? <Link to="/login"> sign in </Link> </p>
        </div>
    )
}

export default SignUp