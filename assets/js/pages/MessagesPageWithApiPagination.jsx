import React, { useEffect, useState } from 'react';
import axios from "axios";
import Pagination from '../components/Pagination';

const MessagesPageWithApiPagination = (props) => {

    const itemsPerPage = 2;
    const [messages, setMessages] = useState([]);
    const [totalItems, setTotalItems] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get(`http://localhost:8000/api/messages?pagination=true&count=${itemsPerPage}&page=${currentPage}`)
             .then(response => {
                setMessages(response.data['hydra:member']);
                setTotalItems(response.data['hydra:totalItems']);
                setLoading(false);
             })
    }, [currentPage]);

    const handleDelete = id => {
        const originalMessages = [...messages];
        setMessages(messages.filter(message => message.id !== id));
        axios.delete("http://localhost:8000/api/messages/" + id)
             .catch( error => {
                 setMessages(originalMessages);
                 console.log(error.response);
             })
    };

    const paginatedMessages = Pagination.getData(messages, currentPage, itemsPerPage);

    const handlePageChange = (page) => {
        setCurrentPage(page);
        setLoading(true);
    }

    return (
        <>
            <h2>Liste des messages avec Api Pagination</h2>
            <table className="table table-hover">
                <thead>
                    <tr>
                        <th>Nom</th>
                        <th>Email</th>
                        <th className="text-center">Date</th>
                        <th className="text-center">Statut</th>
                        {/* <th>Contenu</th> */}
                        <th></th>
                    </tr>
                </thead>

                <tbody>
                    { loading && <tr><td>Chargement...</td></tr>}
                    { !loading && messages.map(message => {
                        return(
                            <tr key={message.id}>
                                <td>{message.name}</td>
                                <td>{message.email}</td>
                                <td className="text-center">{message.sentAt.toLocaleString()}</td>
                                <td className="text-center">
                                    <span className={"badge badge-" + message.isRead ? "light" : "success"}>
                                        {message.isRead ? "Lu" : "Non lu"}
                                    </span>
                                </td>
                                
                                <td>
                                    <button className="btn btn-sm btn-info mr-2">Voir</button>
                                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(message.id)}>Supprimer</button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
            
            <Pagination currentPage={currentPage} itemsPerPage={itemsPerPage} length={totalItems} onPageChanged={handlePageChange}/>
        </>
    );
}
 
export default MessagesPageWithApiPagination;