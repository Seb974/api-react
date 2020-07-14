import React, { useState, useContext } from 'react';
import axios from 'axios';
import MessagesActions from '../actions/MessagesActions';
import AuthActions from '../actions/AuthActions';
import AuthContext from '../contexts/AuthContext';
import Field from '../components/Forms/Field';

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
                <Field 
                    name="username"
                    label="Adresse email"
                    placeholder="Adresse email de connexion"
                    type="email"
                    error={error}
                    value={credentials.username}
                    onChange={handleChange}
                />
                <Field 
                    name="password"
                    label="Mot de passe"
                    placeholder="Mot de passe"
                    type="password"
                    error={error}
                    value={credentials.password}
                    onChange={handleChange}
                />
                <div className="form-group">
                    <button type="submit" className="btn btn-success">Valider</button>
                </div>
            </form>
        </>
    );
}
 
export default LoginPage;