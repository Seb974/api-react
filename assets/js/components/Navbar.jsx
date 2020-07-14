import React, { useContext } from 'react';
import AuthActions from '../actions/AuthActions';
import { NavLink } from 'react-router-dom';
import AuthContext from '../contexts/AuthContext';

const Navbar = ({history}) => {

    const {isAuthenticated, setIsAuthenticated } = useContext(AuthContext);
    
    const handleLogout = () => {
        AuthActions.logout();
        setIsAuthenticated(false);
        history.push("/login");
    }

    return ( 
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <NavLink className="navbar-brand" to="/">My Name</NavLink>
            <button 
                className="navbar-toggler" 
                type="button" 
                data-toggle="collapse" 
                data-target="#navbarColor03" 
                aria-controls="navbarColor03" 
                aria-expanded="false" 
                aria-label="Toggle navigation"
            >
                <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse" id="navbarColor03">
                <ul className="navbar-nav mr-auto">
                <li className="nav-item active">
                    <NavLink className="nav-link" to="/messages">Messages </NavLink>       {/* <span className="sr-only">(current)</span> */}
                </li>
                <li className="nav-item">
                    <NavLink className="nav-link" to="/bookings">Réservations</NavLink>
                </li>
                </ul>
                <ul className="navbar-nav ml-auto">
                    {!isAuthenticated ? 
                        <>
                            <li className="nav-item">
                                <NavLink className="nav-link" to="#">Inscription</NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink className="btn btn-success" to="/login">Connexion</NavLink>
                            </li>
                        </>
                    :
                        <li className="nav-item">
                            <button className="btn btn-danger" onClick={handleLogout}>
                                Déconnexion
                            </button>
                        </li>
                    }
                </ul>
            </div>
        </nav>
     );
}
 
export default Navbar;