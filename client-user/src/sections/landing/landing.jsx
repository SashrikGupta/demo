
import React, { useEffect, useState } from 'react';
import { fetcher } from 'src/hooks/Fetcher';
import { useAuth0 } from "@auth0/auth0-react";
import book from "../../../public/assets/books.png";

const Landing = () => {
  const { loginWithRedirect } = useAuth0();
  const [newArrivals, setNewArrivals] = useState([]);
  const [newArrivalsPage, setNewArrivalsPage] = useState(1);
  const [trendingBooks, setTrendingBooks] = useState([]);
  const [trendingBooksPage, setTrendingBooksPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

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

  // Function to truncate description text
  const truncateDescription = (description, maxLength) => {
    if (!description) return '';
    if (description.length <= maxLength) return description;
    return `${description.slice(0, maxLength)}...`;
  };

  // Function to handle page change for new arrivals
  const handleNewArrivalsPageChange = (page) => {
    setNewArrivalsPage(page);
  };

  // Function to handle page change for trending books
  const handleTrendingBooksPageChange = (page) => {
    setTrendingBooksPage(page);
  };

  // Function to handle search input change
  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  // Filter books based on search query
  const filteredNewArrivals = newArrivals.filter(book =>
    book.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredTrendingBooks = trendingBooks.filter(book =>
    book.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate total number of pages
  const newArrivalsTotalPages = Math.ceil(filteredNewArrivals.length / 3);
  const trendingBooksTotalPages = Math.ceil(filteredTrendingBooks.length / 3);

  // Function to generate page numbers
  const getPageNumbers = (totalPages, currentPage) => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <button
          key={i}
          className={currentPage === i ? 'active' : ''}
          onClick={() => currentPage !== i && handleNewArrivalsPageChange(i)}
        >
          {i}
        </button>
      );
    }
    return pages;
  };

  // Calculate books to display based on current page
  const newArrivalsStartIndex = (newArrivalsPage - 1) * 3;
  const newArrivalsToShow = filteredNewArrivals.slice(newArrivalsStartIndex, newArrivalsStartIndex + 3);

  const trendingBooksStartIndex = (trendingBooksPage - 1) * 3;
  const trendingBooksToShow = filteredTrendingBooks.slice(trendingBooksStartIndex, trendingBooksStartIndex + 3);

  return (
    <>
      <div className="books-container">
        <div className="nav-heading">
          <div style={{ display: "flex", gap: "1rem" }}>
            <img src={book} height={"50px"} width={"50px"} alt="Library Logo" />
            <div style={{ fontSize: "2rem", fontWeight: "700" }}>Public Library</div>
          </div>
          <button className='btn btn-success' onClick={() => loginWithRedirect()}>Login</button>
        </div>
        <div className="heading" style={{ textAlign: "center", color: "#F08C00", fontSize: "1.2rem", fontFamily: "Roboto, Helvetica, Arial, sans-serif" }}>
          Search the books available in Library
        </div>
        <br />
        <div className="search-bar">
          <input
            type="text"
            placeholder='Search for the books'
            style={{ border: "1px solid black", padding: '0.5rem' }}
            value={searchQuery}
            onChange={handleSearchInputChange}
          />
          <button className='btn btn-primary' onClick={fetchBooksData}>Search</button>
        </div>
        <div className="display">
          <div className="new-arrival">
            <h1 className='text-2xl font-bold mb-2'>New Arrivals</h1>
            {newArrivalsToShow.map(book => (
              <div key={book._id} className="book-item">
                <div className="book-image">
                  <img src={book.photo} alt={book.title} style={{ width: '120px', height: '110px' }} />
                </div>
                <div className="book-details">
                  <h2 style={{ color: "blue", fontSize: "1rem", marginBottom: "1.3rem" }}>{book.title}</h2>
                  <p><span style={{ color: "blue" }}>{book.author}</span> - {book.year}</p>
                  <p>{truncateDescription(book.description, 100)}</p> {/* Adjust the length as needed */}
                </div>
              </div>
            ))}
            {/* Pagination controls */}
            <div className="pagination">
              {newArrivalsPage > 1 && (
                <button onClick={() => handleNewArrivalsPageChange(newArrivalsPage - 1)}>Previous</button>
              )}
              {getPageNumbers(newArrivalsTotalPages, newArrivalsPage)}
              {newArrivalsPage < newArrivalsTotalPages && (
                <button onClick={() => handleNewArrivalsPageChange(newArrivalsPage + 1)}>Next</button>
              )}
            </div>
          </div>
          <div className="trending">
            <h1 className='text-2xl font-bold mb-2'>Trending</h1>
            {trendingBooksToShow.map(book => (
              <div key={book._id} className="book-item">
                <div className="book-image">
                  <img src={book.photo} alt={book.title} style={{ width: '120px', height: '110px' }} />
                </div>
                <div className="book-details">
                  <h2 style={{ color: "blue", fontSize: "1rem", marginBottom: "1.3rem" }}>{book.title}</h2>
                  <p><span style={{ color: "blue" }}>{book.author}</span> - {book.year}</p>
                  <p>{truncateDescription(book.description, 100)}</p> {/* Adjust the length as needed */}
                </div>
              </div>
            ))}
            {/* Pagination controls */}
            <div className="pagination">
              {trendingBooksPage > 1 && (
                <button onClick={() => handleTrendingBooksPageChange(trendingBooksPage - 1)}>Previous</button>
              )}
              {getPageNumbers(trendingBooksTotalPages, trendingBooksPage)}
              {trendingBooksPage < trendingBooksTotalPages && (
                <button onClick={() => handleTrendingBooksPageChange(trendingBooksPage + 1)}>Next</button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default Landing;









