import { NavLink } from 'react-router-dom'
import './Navbar.css'

const Navbar = () => {
    return (
        <nav className="navbar">
            <div className="container">
                <div>
                    <img style={{width: 180 + 'px'}} src="../../../src/assets/ucthrift.svg" alt="logo" />
                </div>
                <div className="nav-elements">
                    <ul>
                        <li>
                            <NavLink to="/">Home</NavLink>
                        </li>
                        <li>
                            <NavLink to="/textbooks">Textbooks</NavLink>
                        </li>
                        <li>
                            <NavLink to="/clothes">Clothes</NavLink>
                        </li>
                        <li>
                            <NavLink to="/utility">Utility</NavLink>
                        </li>
                        <li>
                            <NavLink to="/misc">Misc</NavLink>
                        </li>
                        <li>
                            <NavLink to="/profile">Profile</NavLink>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    )
}

export default Navbar
