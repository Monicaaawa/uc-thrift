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
    const validEmailDomains = ['berkeley.edu', 'ucdavis.edu', 'uci.edu', 'ucla.edu', 'ucmerced.edu', 'ucr.edu', 'ucsd.edu', 'ucsf.edu', 'ucsb.edu', 'ucsc.edu'];

    const handleSubmit = (e) => {
        e.preventDefault()
        if (!isPasswordValid(password)) {
            setError("Password must be at least 8 characters long and have at least one uppercase letter and special character.");
            return;
        }

        if(password !== confirmedPassword)
        {
            setError("Passwords do not match.");
            return;
        }

        if (!isValidEmailDomain(email)) {
            setError("Please use a valid UC campus email address.");
            return;
        }

        setError(null);

        const campus = getCampus(email);
        console.log(campus)

        axios.post('http://localhost:8080/register', {email, firstName, lastName, campus, password})
        .then(result => {
            console.log(result)
            navigate('/login')
        })
        .catch(err => {
            console.log(err)
            setError(err.response.data.error || 'An error occurred.');
        })
    };

    const isPasswordValid = (password) => {
        // At least 8 characters long, at least one uppercase letter, and at least one special character
        const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]).{8,}$/;
        return passwordRegex.test(password);
    }

    const isValidEmailDomain = (email) => {
        const domain = email.split('@')[1];
        return validEmailDomains.some(validDomain => domain.endsWith(`${validDomain}`));
    };

    const getCampus = (email) => {
        const domain = email.split('@')[1];
        const campusMap = {
            'berkeley.edu': 'UC Berkeley',
            'ucdavis.edu': 'UC Davis',
            'uci.edu': 'UC Irvine',
            'ucla.edu': 'UCLA',
            'ucmerced.edu': 'UC Merced',
            'ucr.edu': 'UC Riverside',
            'ucsd.edu': 'UC San Diego',
            'ucsf.edu': 'UC San Francisco',
            'ucsb.edu': 'UC Santa Barbara',
            'ucsc.edu': 'UC Santa Cruz',
        };
    
        for (const key in campusMap) {
            if (domain.endsWith(`${key}`)) {
                return campusMap[key];
            }
        }
    
        return '';
    };

    return (
        <div className="page-center">
            <img style={{width: 180}} src="../../../src/assets/ucthrift.svg" alt="logo" />
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
                {error && <p className = "error" style={{ top: '525px' }}>{error}</p>}
                <button style={{marginTop: 40 + 'px'}} type="submit">
                    join now
                </button>
            </form>
            <p style={{marginTop: 25 + 'px'}}> already have an account? <Link to="/login"> sign in </Link> </p>
        </div>
    )
}

export default SignUp