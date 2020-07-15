import React, { useEffect, useState } from 'react';
import Pagination from '../components/Pagination';
import MessagesActions from '../actions/MessagesActions';
import moment from "moment";
import SearchBar from '../components/SearchBar';
import { Link } from 'react-router-dom';
import {ITEMS_PER_PAGE} from '../config/config';

const MessagesPage = (props) => {
    
    const itemsPerPage = ITEMS_PER_PAGE;
    const [messages, setMessages] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");

    useEffect(() => {
        fetchMessages()
    }, []);

    const fetchMessages = () => {
        MessagesActions
            .findAll()
            .then(data => setMessages(data))
            .catch(error => console.log(error.response));
    };

    const formatDate = (str) => moment(str).locale('fr').format('lll').toLocaleString();

    const handleDelete = id => {
        const originalMessages = [...messages];
        setMessages(messages.filter(message => message.id !== id));
        MessagesActions
            .delete(id)
            .catch( error => {
                setMessages(originalMessages);
                console.log(error.response);
            })
    };

    const handleSearch = ({currentTarget}) => {
        setSearch(currentTarget.value);
        setCurrentPage(1);
    };
    
    const handlePageChange = (page) => setCurrentPage(page);
    
    const filteredMessages = search.length <= 0 ? messages : messages.filter(message => 
        message.name.toLowerCase().includes(search.toLowerCase()) ||
        message.email.toLowerCase().includes(search.toLowerCase())
    );

    const paginatedMessages = Pagination.getData(filteredMessages, currentPage, itemsPerPage);

    return (
        <>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2>Liste des messages</h2>
                <Link to="/messages/new" className="btn btn-light">Créer un message</Link>
            </div>

            <SearchBar value={search} onSearch={handleSearch} />

            <table className="table table-hover mt-5">
                <thead>
                    <tr>
                        <th>Nom</th>
                        <th>Email</th>
                        <th className="text-center">Date</th>
                        <th className="text-center">Statut</th>
                        <th></th>
                    </tr>
                </thead>

                <tbody>
                    { paginatedMessages.map(message => {
                        return(
                            <tr key={message.id}>
                                <td>{message.name}</td>
                                <td>{message.email}</td>
                                <td className="text-center">{formatDate(message.sentAt)}</td>
                                <td className="text-center">
                                    <span className={"badge badge-" + message.isRead ? "light" : "success"}>
                                        {message.isRead ? "Lu" : "Non lu"}
                                    </span>
                                </td>
                                
                                <td>
                                    <Link to={"/messages/" + message.id} className="btn btn-sm btn-info mr-2">Voir</Link>
                                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(message.id)}>Supprimer</button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
            
            {itemsPerPage < filteredMessages.length &&
                <Pagination currentPage={currentPage} itemsPerPage={itemsPerPage} length={filteredMessages.length} onPageChanged={handlePageChange}/>
            }
        </>
    );
}
 
export default MessagesPage;