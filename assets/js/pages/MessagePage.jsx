import React, { useState, useEffect } from 'react';
import Field from '../components/Forms/Field';
import { Link } from 'react-router-dom';
import MessagesActions from '../actions/MessagesActions';

const initialMessage = {
    name: '',
    email: '',
    content: ''
};

const MessagePage = ({match, history}) => {

    const {id = "new"} = match.params;

    const [editing, setEditing] = useState(false);
    const [message, setMessage] = useState(initialMessage);
    const [errors, setErrors] = useState(initialMessage);

    const fetchMessage = async id => {
        try {
            const { name, email, content } = await MessagesActions.find(id);
            setMessage({name, email, content});
        } catch (error) {
            history.replace("/messages");
        }
    }

    useEffect(()=>{
        if (id !== "new"){
            setEditing(true);
            fetchMessage(id);
        }
    }, [id]);

    const handleChange = ({currentTarget}) => {
        const {name, value} = currentTarget;
        setMessage({...message, [name]: value});
    };

    const handleSubmit = async event => {
        event.preventDefault();
        try {
            if (editing) {
                await MessagesActions.update(id, message);
                setErrors(initialMessage);
            } else {
                await MessagesActions.create(message)
                setErrors(initialMessage);
                history.replace("/messages");
            }
        } catch ({response}) {
            const {violations} = response.data;
            if (violations) {
                const submittedErrors = {};
                violations.map(({propertyPath, message}) => {
                    submittedErrors[propertyPath] = message
                });
                setErrors(submittedErrors);
            }
        }
    };

    return ( 
        <>
            <h2>{(!editing && "Création d'un") || ("Modification du")} message</h2>
            <form onSubmit={handleSubmit}>
                <Field
                    name="name"
                    label="Prénom"
                    value={message.name}
                    onChange={handleChange}
                    error={errors.name}
                />
                <Field
                    type="email"
                    name="email"
                    label="Adresse email"
                    value={message.email}
                    onChange={handleChange}
                    error={errors.email}
                />
                <Field
                    type="textarea"
                    name="content"
                    label="Votre message"
                    value={message.content}
                    onChange={handleChange}
                    error={errors.content}
                />
                <div className="form-group">
                    <button type="submit" className="btn btn-success">Enregistrer</button>
                    <Link to="/messages" className="btn btn-link">Retour à la liste</Link>
                </div>
            </form>
        </> 
    );
}
 
export default MessagePage;