import React, { useState, useContext } from 'react';
import axios from 'axios';
import MessagesActions from '../actions/MessagesActions';
import AuthActions from '../actions/AuthActions';
import AuthContext from '../contexts/AuthContext';

const initialCredentials = {username: '', password: ''};

const LoginPage = ({history}) => {

    const {setIsAuthenticated} = useContext(AuthContext);
    const [credentials, setCredentials] = useState(initialCredentials);
    const [error, setError] = useState('');
    
    const handleChange = ({currentTarget}) => {
        const {name, value} = currentTarget;
        setCredentials({...credentials, [name]: value})
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        AuthActions
            .authenticate(credentials)
            .then( response => {
                setError('');
                setCredentials(initialCredentials);
                setIsAuthenticated(true);
                history.replace("/");
            })
            .catch(error => {
                setError("Paramètres de connexion invalides");
            });
    };

    return ( 
        <>
            <h1>Connexion à l'application</h1>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="username">Adresse email</label>
                    <input 
                        className={"form-control" + (error && " is-invalid")}
                        id="username" 
                        name="username" 
                        type="email" 
                        placeholder="Adresse email de connexion"
                        value={credentials.username}
                        onChange={handleChange}
                    />
                    {error && <p className="invalid-feedback">{error}</p>}
                </div>
                <div className="form-group">
                    <label htmlFor="_password">Mot de passe</label>
                    <input 
                        className="form-control" 
                        id="password" 
                        name="password" 
                        type="password" 
                        placeholder="Mot de passe"
                        value={credentials.password}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group">
                    <button type="submit" className="btn btn-success">Valider</button>
                </div>
            </form>
        </>
    );
}
 
export default LoginPage;