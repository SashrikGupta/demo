import React, { useState } from 'react';
import axios from 'axios';
import { fetcher } from 'src/hooks/Fetcher';
import {
  Container,
  TextField,
  Card,
  CardContent,
  CardActions,
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Grid,
} from '@mui/material';

const hardcodedBooks = [
  {
    id: 'nodejs',
    title: 'Node.js Design Patterns',
    authors: ['Mario Casciaro', 'Luciano Mammino'],
    thumbnail:
      'https://books.google.com/books/content?id=RyeNDwAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api',
    description:
      'Learn proven patterns, techniques, and tricks to take full advantage of the Node.js platform.',
    price: '1500 INR',
  },
  {
    id: 'tree-theory',
    title: 'Data Structures and Algorithm Analysis in C++',
    authors: ['Mark Allen Weiss'],
    thumbnail:
      'https://books.google.com/books/content?id=O5fsAAAAMAAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api',
    description:
      "Mark Allen Weiss's innovative approach to algorithms and data structures teaches by example and offers clarity and understanding for even the most difficult of topics.",
    price: '2100 INR',
  },
  {
    id: 'data-structures',
    title: 'Data Structures and Algorithms in Python',
    authors: ['Michael T. Goodrich', 'Roberto Tamassia', 'Michael H. Goldwasser'],
    thumbnail:
      'https://books.google.com/books/content?id=69wHEAAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api',
    description:
      "Based on the authors' market leading data structures books in Java and C++, this text retains the same general structure and is designed to provide students with an introduction to data structures and algorithms.",
    price: '2000 INR',
  },
  {
    id: 'algorithms',
    title: 'Introduction to Algorithms',
    authors: ['Thomas H. Cormen', 'Charles E. Leiserson', 'Ronald L. Rivest', 'Clifford Stein'],
    thumbnail:
      'https://books.google.com/books/content?id=NLngYyWFl_YC&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api',
    description:
      'The updated new edition of the classic Introduction to Algorithms is intended primarily for use in undergraduate or graduate courses in algorithms or data structures.',
    price: '2200 INR',
  },
];

const truncateDescription = (description, maxLength) => {
  if (!description) return 'No description available.';
  if (description.length <= maxLength) {
    return description;
  }
  return description.substring(0, maxLength) + '...';
};

const Demo = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [books, setBooks] = useState(hardcodedBooks); // Initialize with hardcoded books
  const [selectedBook, setSelectedBook] = useState(null);

  // State for new book modal
  const [newBookModalOpen, setNewBookModalOpen] = useState(false);
  const [newBook, setNewBook] = useState({
    ISBN: '',
    title: '',
    author: '',
    publisher: '',
    description: '',
    year: '',
    genre: '',
    quantity: '',
    link: '',
    photo: '',
  });

  const handleSearch = async () => {
    const url = `https://www.googleapis.com/books/v1/volumes?q=${searchTerm}`;
    try {
      const response = await axios.get(url);
      const booksData = response.data.items
        .filter((item) => item.volumeInfo.imageLinks && item.volumeInfo.description) // Filter out books without image or description
        .map((item) => {
          const volumeInfo = item.volumeInfo;
          const industryIdentifiers = volumeInfo.industryIdentifiers || [];

          const ISBN =
            industryIdentifiers.find((identifier) => identifier.type === 'ISBN_13')?.identifier ||
            'N/A';
          const title = volumeInfo.title || 'No title available';
          const author = volumeInfo.authors?.join(', ') || 'No authors available';
          const publisher = volumeInfo.publisher || 'No publisher available';
          const year = volumeInfo.publishedDate
            ? new Date(volumeInfo.publishedDate).getFullYear()
            : 'No year available';
          const genre = volumeInfo.categories || ['No genre available'];
          const description = volumeInfo.description || 'No description available';
          const link = volumeInfo.infoLink;
          const picture = volumeInfo.imageLinks?.thumbnail || 'No image available';
          const quantity = 10;
          const price = '800 INR';

          return {
            ISBN,
            title,
            author,
            publisher,
            year,
            genre,
            description,
            quantity,
            link,
            photo: picture,
            price,
          };
        });
      setBooks(booksData);
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  };

  const handleOpen = (book) => {
    setSelectedBook(book);
  };

  const handleClose = () => {
    setSelectedBook(null);
  };

  const handleAdd = async () => {
    if (!selectedBook) return;
    // Implement the logic for adding the book
    const bookData = {
      ISBN: selectedBook.ISBN,
      title: selectedBook.title,
      author: selectedBook.author,
      publisher: selectedBook.publisher,
      description: selectedBook.description,
      year: selectedBook.year,
      genre: selectedBook.genre,
      quantity: selectedBook.quantity,
      link: selectedBook.link,
      photo: selectedBook.photo,
    };
    // console.log(bookData);
    const data = await fetcher('/aagam/add_book', bookData);
    handleClose();
  };

  const handleNewBookChange = (event) => {
    const { name, value } = event.target;
    setNewBook((prev) => ({ ...prev, [name]: value }));
  };

  const handleOpenNewBookModal = () => setNewBookModalOpen(true);
  const handleCloseNewBookModal = () => setNewBookModalOpen(false);

  return (
    <Container style={{ position: 'relative' }}>
      <Typography variant="h4" align="center" margin="normal">
        Librarian
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={handleOpenNewBookModal}
        style={{
          position: 'absolute',
          // marginBottom: '20px',
          top: '0px',
          right: '20px',
          zIndex: 1, // Ensure it is above other content
        }}
      >
        Add Your Book
      </Button>
      <TextField
        fullWidth
        label="Search for books"
        variant="outlined"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
        margin="normal"
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleSearch}
        style={{ marginTop: '10px' }}
      >
        Search
      </Button>
      <Grid container spacing={2} style={{ marginTop: '20px' }}>
        {books.map((book) => (
          <Grid item xs={12} sm={6} md={4} key={book.ISBN}>
            <Card>
              <CardContent>
                <Typography variant="h6" noWrap>
                  {book.title}
                </Typography>
                <Typography variant="subtitle1" noWrap>
                  {book.author}
                </Typography>
                {book.photo && (
                  <img
                    src={book.photo}
                    alt={book.title}
                    style={{
                      width: '100px',
                      height: '150px',
                      objectFit: 'cover',
                      marginTop: '10px',
                    }}
                  />
                )}
                <Typography variant="body2" noWrap>
                  {truncateDescription(book.description, 100)}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {book.price}
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" onClick={() => handleOpen(book)}>
                  Open
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Dialog
        open={!!selectedBook}
        onClose={handleClose}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <DialogTitle id="modal-title">{selectedBook?.title}</DialogTitle>
        <DialogContent>
          {selectedBook && (
            <>
              {selectedBook.photo && (
                <img
                  src={selectedBook.photo}
                  alt={selectedBook.title}
                  style={{ width: '100px', height: '150px', objectFit: 'cover', marginTop: '10px' }}
                />
              )}
              <Typography id="modal-description" variant="body1">
                {truncateDescription(selectedBook.description, 200)}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {selectedBook.author}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {selectedBook.price}
              </Typography>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="primary" onClick={handleAdd}>
            Add
          </Button>
          <Button variant="outlined" onClick={handleClose}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
      {/* New Book Modal */}
      <Dialog
        open={newBookModalOpen}
        onClose={handleCloseNewBookModal}
        aria-labelledby="new-book-modal-title"
        aria-describedby="new-book-modal-description"
      >
        <DialogTitle id="new-book-modal-title">Add New Book</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="ISBN"
            name="ISBN"
            value={newBook.ISBN}
            onChange={handleNewBookChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Title"
            name="title"
            value={newBook.title}
            onChange={handleNewBookChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Author"
            name="author"
            value={newBook.author}
            onChange={handleNewBookChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Publisher"
            name="publisher"
            value={newBook.publisher}
            onChange={handleNewBookChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Description"
            name="description"
            value={newBook.description}
            onChange={handleNewBookChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Year"
            name="year"
            type="number"
            value={newBook.year}
            onChange={handleNewBookChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Genre"
            name="genre"
            value={newBook.genre}
            onChange={handleNewBookChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Quantity"
            name="quantity"
            type="number"
            value={newBook.quantity}
            onChange={handleNewBookChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Link"
            name="link"
            value={newBook.link}
            onChange={handleNewBookChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Photo URL"
            name="photo"
            value={newBook.photo}
            onChange={handleNewBookChange}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="primary" onClick={handleAdd}>
            Submit
          </Button>
          <Button variant="outlined" onClick={handleCloseNewBookModal}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Demo;
