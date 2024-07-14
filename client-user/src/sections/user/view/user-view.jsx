import React, { useContext, useEffect, useState, useRef } from 'react';
import { fetcher } from 'src/hooks/Fetcher';
import { curr_context } from 'src/contexts/Central';
import { Link } from 'react-router-dom';
import './style.css';

export default function UserView() {
  const [newArrivalsPage, setNewArrivalsPage] = useState(1);
  const [trendingBooksPage, setTrendingBooksPage] = useState(1);
  const [newArrivals, setNewArrivals] = useState([]);
  const [trendingBooks, setTrendingBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editAddress, setEditAddress] = useState('');
  const [canvasImage, setCanvasImage] = useState(''); // New state for canvas image source
  const canvasRef = useRef(null);
  const { user, set_user } = useContext(curr_context);

  useEffect(() => {
    if (!user || !user.books) return;

    const fetchBooksData = async () => {
      try {
        const bookIds = user.books.map(book => book.bookId);

        if (bookIds.length > 0) {
          const response = await fetcher('/jaimin/getbooks/', { bookIds });

          if (response && Array.isArray(response)) {
            const bookMap = user.books.reduce((acc, book) => {
              acc[book.bookId] = book.issueDate;
              return acc;
            }, {});

            const booksWithIssueDates = response.map(book => ({
              ...book,
              issueDate: bookMap[book._id] || null
            }));

            const newBooks = booksWithIssueDates.slice().sort((a, b) => new Date(b.year) - new Date(a.year));
            setNewArrivals(newBooks);

            const trending = booksWithIssueDates.slice().sort((a, b) => a.quantity - b.quantity);
            setTrendingBooks(trending);
          } else {
            console.error('Invalid response format:', response);
          }
        } else {
          console.log('No books to fetch.');
        }
      } catch (error) {
        console.error('Error fetching books:', error);
      }
    };

    fetchBooksData();
  }, [user]);

  const calculateRemainingDays = (issueDate) => {
    try {
      const currentDate = new Date();
      const issue = new Date(issueDate);
      console.log(issueDate,currentDate);
      if (isNaN(issue.getTime())) {
        console.error(`Invalid issue date: ${issueDate}`);
        return NaN;
      }
      
      const difference = Math.floor(30-(currentDate - issue) / (1000 * 60 * 60 * 24)); // Difference in days
      console.log(difference);
      return difference;
    } catch (error) {
      console.error(`Error calculating remaining days: ${error}`);
      return NaN;
    }
  };
  

  const getRemainingDaysMessage = (remainingDays) => {
    if(remainingDays>30){
      return `Overdue by ${remainingDays-30} Days`;
    }
    if (remainingDays > 0) {
      return `${remainingDays} Days Remaining`;
    }
  };

  const getFeeAmount = (issueDate) => {
    const currentDate = new Date();
    const issue = new Date(issueDate);
    const months = (currentDate.getFullYear() - issue.getFullYear()) * 12 + (currentDate.getMonth() - issue.getMonth());
    return months * 200;
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

  const handleEditClick = () => {
    setEditName(user.name);
    setEditPhone(user.phone || '');
    setEditAddress(user.address || '');
    setEditMode(true);
  };

  const handleSaveClick = () => {
    set_user({ ...user, name: editName, phone: editPhone, address: editAddress });
    setEditMode(false);
  };

  const handleCancelClick = () => {
    setEditMode(false);
  };

  const handleBookTitleClick = (photoUrl) => {
    setCanvasImage(photoUrl); // Set the image URL to be displayed on the canvas
  };

  const handleReturnBook = async(bookId,amount) => {
    console.log(bookId);
    // const updatedBooks = newArrivals.filter(book => book._id !== bookId);
    // console.log(updatedBooks);
    // setNewArrivals(updatedBooks);
    const data=await fetcher('/jaimin/deletebook',{userId:user._id,bookId:bookId});
    alert(`Book has been successfully returned. Your fine is ${amount}.`);
    // Implement the logic to return the book
    console.log(`Returning book with ID: ${bookId}`); 
  };

  const newArrivalsTotalPages = Math.ceil(newArrivals.length / 3);
  const trendingBooksTotalPages = Math.ceil(trendingBooks.length / 3);

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

  const filteredNewArrivals = newArrivals.filter((book) =>
    book.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredTrendingBooks = trendingBooks.filter((book) =>
    book.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const newArrivalsStartIndex = (newArrivalsPage - 1) * 3;
  const newArrivalsToShow = filteredNewArrivals.slice(
    newArrivalsStartIndex,
    newArrivalsStartIndex + 3
  );

  const trendingBooksStartIndex = (trendingBooksPage - 1) * 3;
  const trendingBooksToShow = filteredTrendingBooks.slice(
    trendingBooksStartIndex,
    trendingBooksStartIndex + 3
  );

  return (
    <>
      <div className="app-container w-full flex flex-col lg:flex-row">
        <div className="flex flex-col gap-5 w-full lg:w-2/3">
          <div className="search-books w-[80%] flex flex-col justify-center gap-2">
            <h1 className="text-3xl font-semibold">Search Books</h1>
            <hr className="w-[36vw] h-1" color="black" size="10" />
            <div className="inbtn flex mt-2">
              <input
                type="text"
                className="border-gray-500 rounded-md w-[30vw]"
                placeholder="Odoo Development"
                value={searchQuery}
                onChange={handleSearchInputChange}
              />
              <button className="px-4 py-1 rounded-md bg-[#A5D8FF]">Search</button>
            </div>
          </div>
          <div className="my-books w-[90%]">
            <h1 className="text-3xl font-semibold">My Books</h1>
            <hr className="w-[36vw] h-1" color="black" />
            <div className="inbtn flex mt-2 flex-col">
              {newArrivalsToShow.map((book) => (
                <div key={book._id} className="book-item flex gap-4 mb-4">
                  <div className="book-image">
                    <img
                      src={book.photo}
                      alt={book.title}
                      style={{ width: '250px', height: '150px' }}
                    />
                  </div>
                  <div className="book-details">
                    <Link to={book.link}>
                      <h2
                        style={{
                          color: 'blue',
                          fontSize: '1rem',
                          marginBottom: '1.3rem',
                          cursor: 'pointer',
                        }}
                        onClick={() => handleBookTitleClick(book.photo)} // Set the image URL
                      >
                        {book.title}
                      </h2>
                    </Link>
                    <p>{truncateDescription(book.description, 200)}</p>
                    <div
                      id="countdown"
                      style={{
                        color: calculateRemainingDays(book.issueDate) > 30 ? 'red' : 'black',
                        fontWeight:calculateRemainingDays(book.issueDate) > 30 ? "900":'500',
                      }}
                    >
                      {getRemainingDaysMessage(calculateRemainingDays(book.issueDate))}
                    </div>
                    <div id="fee-amount">
                      Fee Amount: {-1*getFeeAmount(book.issueDate)} 
                    </div>
                    <button
                      onClick={() => handleReturnBook(book._id,-1*getFeeAmount(book.issueDate))}
                      className="return-button px-4 py-1 rounded-md bg-[#FFA5A5] mt-2"
                    >
                      Return Book
                    </button>
                  </div>
                </div>
              ))}
              <div className="pagination flex gap-2 mt-4">
                {newArrivalsPage > 1 && (
                  <button onClick={() => handleNewArrivalsPageChange(newArrivalsPage - 1)}>
                    Previous
                  </button>
                )}
                {getPageNumbers(
                  newArrivalsTotalPages,
                  newArrivalsPage,
                  handleNewArrivalsPageChange
                )}
                {newArrivalsPage < newArrivalsTotalPages && (
                  <button onClick={() => handleNewArrivalsPageChange(newArrivalsPage + 1)}>
                    Next
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="user-profile-container w-full lg:w-1/3 p-4">
          <h2 className="user-profile-title text-2xl font-semibold mb-4">User Profile</h2>
          <hr className="divider mb-4" />
          <div className="user-profile-card bg-white p-4 rounded-lg shadow-md">
            {user ? (
              <>
                <img
                  className="user-profile-avatar w-20 h-20 rounded-full mb-4"
                  src={user.picture}
                  alt="User Avatar"
                />
                {editMode ? (
                  <div className="user-profile-edit-form">
                    <div className="form-group mb-4">
                      <label htmlFor="editName" className="block font-semibold">
                        Name:
                      </label>
                      <input
                        type="text"
                        id="editName"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="border-gray-500 rounded-md w-full p-2"
                        disabled // Disable editing of name
                      />
                    </div>
                    <div className="form-group mb-4">
                      <label htmlFor="editPhone" className="block font-semibold">
                        Phone:
                      </label>
                      <input
                        type="text"
                        id="editPhone"
                        value={editPhone}
                        onChange={(e) => setEditPhone(e.target.value)}
                        className="border-gray-500 rounded-md w-full p-2"
                      />
                    </div>
                    <div className="form-group mb-4">
                      <label htmlFor="editAddress" className="block font-semibold">
                        Address:
                      </label>
                      <input
                        type="text"
                        id="editAddress"
                        value={editAddress}
                        onChange={(e) => setEditAddress(e.target.value)}
                        className="border-gray-500 rounded-md w-full p-2"
                      />
                    </div>
                    <div className="flex gap-4">
                      <button
                        onClick={handleSaveClick}
                        className="px-4 py-2 bg-blue-500 text-white rounded-md"
                      >
                        Save
                      </button>
                      <button
                        onClick={handleCancelClick}
                        className="px-4 py-2 bg-gray-500 text-white rounded-md"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="user-profile-details text-center">
                    <h3 className="user-profile-name text-xl font-semibold">{user.name}</h3>
                    <p className="user-profile-company text-gray-600">Odoo</p>
                    <address className="user-profile-address mt-4 not-italic">
                      {user.address || '215 Vine St, Scranton PA 18503, United States'}
                    </address>
                    <p className="user-profile-phone mt-2">{user.phone || '+1 555-555-5555'}</p>
                    <p className="user-profile-email text-blue-600">{user.email}</p>
                    <button
                      onClick={handleEditClick}
                      className="user-profile-edit text-blue-600 font-semibold mt-4 block"
                    >
                      Edit information
                    </button>
                  </div>
                )}
              </>
            ) : (
              <p className="text-center">Loading user information...</p>
            )}
          </div>
          <div className="user-contact mt-6">
            <h3 className="user-contact-title text-xl font-semibold mb-4">Your contact</h3>
            <p className="user-contact-name">Mitchell Admin</p>
            <p className="user-contact-email text-gray-600">admin@yourcompany.example.com</p>
            <p className="user-contact-phone text-gray-600">+1 555-555-5555</p>
            <p className="user-contact-location text-gray-600">Scranton</p>
          </div>
        </div>
      </div>
      {canvasImage && (
        <div className="book-preview w-full mt-4">
          <h2 className="text-2xl font-semibold mb-4">Book Preview</h2>
          <canvas
            ref={canvasRef}
            width="600"
            height="400"
            style={{ border: '1px solid black' }}
          ></canvas>
        </div>
      )}
    </>
  );
}