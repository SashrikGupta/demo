import React, { useContext, useEffect, useState } from 'react';
import { fetcher } from 'src/hooks/Fetcher';
import { useAuth0 } from "@auth0/auth0-react";
import book from "../../../public/assets/books.png";
import Modal from 'react-modal';
import { curr_context } from 'src/contexts/Central';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    width: '70%',
    maxWidth: '800px',
    padding: '20px',
    display: 'flex',
    flexDirection: 'row',
    gap: '20px',
  },
};

export default function Buy() {
  const { loginWithRedirect } = useAuth0();
  const [newArrivals, setNewArrivals] = useState([]);
  const [newArrivalsPage, setNewArrivalsPage] = useState(1);
  const [trendingBooks, setTrendingBooks] = useState([]);
  const [trendingBooksPage, setTrendingBooksPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchParam, setSearchParam] = useState('title'); // State for the search parameter
  const [selectedBook, setSelectedBook] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const { user } = useContext(curr_context);

  useEffect(() => {
    fetchBooksData();
  }, []);

  const fetchBooksData = async () => {
    try {
      const response = await fetcher('/jaimin/getAllBook/');

      if (response && Array.isArray(response)) {
        const books = response;

        // Sorting books for new arrivals by date (descending)
        const newBooks = books.slice().sort((a, b) => new Date(b.year) - new Date(a.year));
        setNewArrivals(newBooks);

        // Sorting books for trending by quantity (ascending)
        const trending = books.slice().sort((a, b) => a.quantity - b.quantity);
        setTrendingBooks(trending);
      } else {
        console.error('Invalid response format:', response);
      }
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  };

  const truncateDescription = (description, maxLength) => {
    if (!description) return '';
    if (description.length <= maxLength) return description;
    return `${description.slice(0, maxLength)}...`;
  };

  const handleNewArrivalsPageChange = (page) => {
    setNewArrivalsPage(page);
  };

  const handleTrendingBooksPageChange = (page) => {
    setTrendingBooksPage(page);
  };

  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchParamChange = (event) => {
    setSearchParam(event.target.value);
  };

  const openModal = (book) => {
    setSelectedBook(book);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setSelectedBook(null);
    setModalIsOpen(false);
  };

  const handleBorrow = (bookId) => {
    console.log("Borrowing book with ID:", bookId);
    // Add your borrowing logic here
    closeModal();
  };

  const handleClick = async (id) => {
    const data = await fetcher("/jaimin/addbook", { userId: user._id, bookId: id });
    console.log(data.message);
    handleBorrow(id);
  }

  // Filter books based on search query and parameter
  const filteredNewArrivals = newArrivals.filter(book =>
    book[searchParam].toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredTrendingBooks = trendingBooks.filter(book =>
    book[searchParam].toLowerCase().includes(searchQuery.toLowerCase())
  );

  const newArrivalsTotalPages = Math.ceil(filteredNewArrivals.length / 3);
  const trendingBooksTotalPages = Math.ceil(filteredTrendingBooks.length / 3);

  const getPageNumbers = (totalPages, currentPage, handlePageChange) => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <button
          key={i}
          className={currentPage === i ? 'active' : ''}
          onClick={() => currentPage !== i && handlePageChange(i)}
        >
          {i}
        </button>
      );
    }
    return pages;
  };

  const newArrivalsStartIndex = (newArrivalsPage - 1) * 3;
  const newArrivalsToShow = filteredNewArrivals.slice(newArrivalsStartIndex, newArrivalsStartIndex + 3);

  const trendingBooksStartIndex = (trendingBooksPage - 1) * 3;
  const trendingBooksToShow = filteredTrendingBooks.slice(trendingBooksStartIndex, trendingBooksStartIndex + 3);

  return (
    <>
      <div className="books-container">
        <div className="heading" style={{ textAlign: "center", color: "#F08C00", fontSize: "1.2rem", fontFamily: "Roboto, Helvetica, Arial, sans-serif" }}>
          Search the books available in Library
        </div>
        <br />
        <div className="search-bar">
          <select value={searchParam} onChange={handleSearchParamChange}>
            <option value="title">Title</option>
            <option value="author">Author</option>
            <option value="genre">Genre</option>
          </select>
          <input
            type="text"
            placeholder={`Search by ${searchParam}`}
            style={{ border: "1px solid black", padding: '0.5rem' }}
            value={searchQuery}
            onChange={handleSearchInputChange}
          />
          <button className='btn btn-primary' onClick={fetchBooksData}>Search</button>
        </div>
        <div className="display">
          <div className="new-arrival" style={{ width: "80%" }}>
            {newArrivalsToShow.map(book => (
              <div key={book._id} className="book-item" style={{ gap: "15px" }}>
                <div className="book-image">
                  <img src={book.photo} alt={book.title} style={{ width: '200px', height: '150px' }} />
                </div>
                <div className="book-details">
                  <h2 style={{ color: "blue", fontSize: "1rem", marginBottom: "1.3rem" }}>{book.title}</h2>
                  <p><span style={{ color: "blue" }}>{book.author}</span> - {book.year}</p>
                  <p>{truncateDescription(book.description, 250)}</p>
                  <button className='btn btn-warning mt-2' onClick={() => openModal(book)}>Borrow</button>
                </div>
              </div>
            ))}
            <div className="pagination">
              {newArrivalsPage > 1 && (
                <button onClick={() => handleNewArrivalsPageChange(newArrivalsPage - 1)}>Previous</button>
              )}
              {getPageNumbers(newArrivalsTotalPages, newArrivalsPage, handleNewArrivalsPageChange)}
              {newArrivalsPage < newArrivalsTotalPages && (
                <button onClick={() => handleNewArrivalsPageChange(newArrivalsPage + 1)}>Next</button>
              )}
            </div>
          </div>
        </div>
      </div>
      {selectedBook && (
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          style={customStyles}
          contentLabel="Book Details"
        >
          <div>
            <img src={selectedBook.photo} alt={selectedBook.title} style={{ width: '150px', height: '200px' }} />
            <div style={{ marginTop: '10px' }}>
              <p><strong>Quantity Available:</strong> {selectedBook.quantity}</p>
              <p><strong>Genre:</strong> {selectedBook.genre.join(', ')}</p>
            </div>
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ color: "blue", fontSize: "1.3rem" }}> {selectedBook.title}</p>
            <p><strong>Author:</strong> {selectedBook.author}</p>
            <p><strong>Publish Date:</strong> {selectedBook.year}</p>
            <p><strong>ISBN No:</strong> {selectedBook.ISBN}</p>
            <p><strong>Description:</strong> {truncateDescription(selectedBook.description, 250)}</p>
            <button className='btn btn-success mt-2' onClick={() => handleClick(selectedBook._id)}>Borrow Now</button>
          </div>
        </Modal>
      )}
    </>
  );
}