import { NavLink } from 'react-router-dom'

const Navbar = () => {
    return (
        <nav>
            <div>
                <img src="../../../src/assets/uc thrift 2.svg" alt="logo" />
            </div>
            <div>
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
        </nav>
    )
}

export default Navbar