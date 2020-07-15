import React, { useEffect, useState } from 'react';
import Pagination from '../components/Pagination';
import BookingsActions from '../actions/BookingsActions';
import moment from "moment";
import SearchBar from '../components/SearchBar';
import { Link } from 'react-router-dom';

const BookingsPage = (props) => {
    
    const itemsPerPage = 10;
    const [bookings, setBookings] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");

    useEffect(() => {
        fetchBookings()
    }, []);

    const fetchBookings = () => {
        BookingsActions
            .findAll()
            .then(data => setBookings(data))
            .catch(error => console.log(error.response));
    };

    const formatDate = (str) => moment(str).format('DD[/]MM[/]YYYY');

    const handleDelete = id => {
        const originalBookings = [...bookings];
        setBookings(bookings.filter(booking => booking.id !== id));
        BookingsActions
            .delete(id)
            .catch( error => {
                setBookings(originalBookings);
                console.log(error.response);
            })
    };

    const handleSearch = ({currentTarget}) => {
        setSearch(currentTarget.value);
        setCurrentPage(1);
    };
    
    const handlePageChange = (page) => setCurrentPage(page);
    
    const filteredBookings = search.length <= 0 ? bookings : bookings.filter(booking => 
        booking.email.toLowerCase().includes(search.toLowerCase()) ||
        moment(booking.checkIn).format('DD[/]MM[/]YYYY').includes(search.toLowerCase()) ||
        moment(booking.checkOut).format('DD[/]MM[/]YYYY').includes(search.toLowerCase()) 
    );

    const paginatedBookings = Pagination.getData(filteredBookings, currentPage, itemsPerPage);

    return (
        <>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2>Liste des réservations</h2>
                <Link to="/bookings/new" className="btn btn-light">Créer une réservation</Link>
            </div>

            <SearchBar value={search} onSearch={handleSearch} />

            <table className="table table-hover mt-5">
                <thead>
                    <tr>
                        <th>Email</th>
                        <th className="text-center">Date d'arrivée</th>
                        <th className="text-center">Date de départ</th>
                        <th></th>
                    </tr>
                </thead>

                <tbody>
                    { paginatedBookings.map(booking => {
                        return(
                            <tr key={booking.id}>
                                <td>{booking.email}</td>
                                <td className="text-center">{formatDate(booking.checkIn)}</td>
                                <td className="text-center">{formatDate(booking.checkOut)}</td>
                                <td>
                                    <Link to={"/bookings/" + booking.id} className="btn btn-sm btn-info mr-2">Voir</Link>
                                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(booking.id)}>Supprimer</button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
            
            {itemsPerPage < filteredBookings.length &&
                <Pagination currentPage={currentPage} itemsPerPage={itemsPerPage} length={filteredBookings.length} onPageChanged={handlePageChange}/>
            }
            <div className="d-flex justify-content-left mb-2">
                <Link to="/bookings" className="btn btn-warning">Voir le calendrier</Link>
            </div>
        </>
    );
}
 
export default BookingsPage;