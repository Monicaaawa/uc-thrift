import { NavLink } from 'react-router-dom'
import { ReactComponent as Brand } from '../../assets/uc thrift 2.svg'

const Navbar = () => {
    return (
        <nav>
            <div>
                <Brand /> 
            </div>
            <div>
                <ul>
                    <li>
                        <NavLink to="/">Textbooks</NavLink>
                    </li>
                    <li>
                        <NavLink to href="/Clothes"></NavLink>
                    </li>
                    <li>
                        <NavLink to="Utility"></NavLink>
                    </li>
                    <li>
                        <NavLink to="Misc"></NavLink>
                    </li>
                    <li>
                        <NavLink to="Profile"></NavLink>
                    </li>
                </ul>
            </div>
        </nav>
    )
}

export default Navbar