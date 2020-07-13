import React from 'react';

const SearchBar = ({search, onSearch}) => {
    return ( 
        <div className="form-group">
            <input className="form-control" placeholder="Rechercher..." onChange={ onSearch } value={search}/>
        </div>
    );
}
 
export default SearchBar;