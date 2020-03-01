import React from 'react'
import {Link} from 'react-router-dom'

const Navbar = () => {
    return (
        <div>
            <nav className="navbar bg-dark">
                <h1>
                    <Link to="/">
                        <i className="fas fa-code"></i> SocialDev App
            </Link>
                </h1>
                <ul>
                    <li><Link to="profiles.html">Developerzy</Link></li>
                    <li><Link to="/register">Zarejestruj się!</Link></li>
                    <li><Link to="/login">Logowanie</Link></li>
                </ul>
            </nav>
        </div>
    )
}

export default Navbar;
