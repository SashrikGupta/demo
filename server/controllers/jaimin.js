const axios = require('axios');
const Book = require('../models/book');

async function fetchBooks(query, quantity) {
   const url = `https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=${quantity}`;

   try {
      const response = await axios.get(url);
      const books = response.data.items;

      const bookData = books.map(item => {
         const volumeInfo = item.volumeInfo;
         const industryIdentifiers = volumeInfo.industryIdentifiers || [];

         const ISBN = industryIdentifiers.find(identifier => identifier.type === 'ISBN_13')?.identifier || 'N/A';
         const title = volumeInfo.title || 'No title available';
         const author = volumeInfo.authors?.join(', ') || 'No authors available';
         const publisher = volumeInfo.publisher || 'No publisher available';
         const year = volumeInfo.publishedDate ? new Date(volumeInfo.publishedDate).getFullYear() : 'No year available';
         const genre = volumeInfo.categories || ['No genre available'];
         const description = volumeInfo.description || 'No description available';
         const link = volumeInfo.infoLink;
         const picture = volumeInfo.imageLinks?.thumbnail || 'No image available';

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
            photo: picture // Assuming photo is a URL to the thumbnail
         };
      });

      return bookData;
   } catch (error) {
      console.error('Error fetching books:', error);
      return [];
   }
}

// Function to create books in MongoDB from fetched data
const createBook = async (req, res) => {
   const randomQueries = ['javascript', 'python', 'react', 'node.js', 'machine learning'];
   const randomQuery = randomQueries[Math.floor(Math.random() * randomQueries.length)];
   const quantity = 10;

   try {
      const books = await fetchBooks(randomQuery, quantity);

      if (books.length > 0) {
         await Book.insertMany(books);
         console.log('Books data inserted');
         res.status(201).json({ message: 'Books data inserted' });
      } else {
         console.log('No books data to insert');
         res.status(404).json({ message: 'No books data to insert' });
      }
   } catch (error) {
      console.error('Error creating books:', error);
      res.status(500).json({ message: 'Internal server error' });
   }
};
const getBook = async (req, res) => {
   const { bookIds } = req.body;

   try {
      // Validate if bookIds is an array
      console.log(bookIds);
      if (!Array.isArray(bookIds)) {
         return res.status(400).json({ error: 'Book IDs must be provided as an array' });
      }

      // Query books by MongoDB IDs
      const books = await Book.find({ _id: { $in: bookIds } });

      if (books.length === 0) {
         return res.status(404).json({ message: 'No books found with the provided IDs' });
      }

      res.status(200).json(books);
   } catch (error) {
      console.error('Error fetching books by IDs:', error);
      res.status(500).json({ error: 'Internal server error' });
   }
}
const getAllBook=async(req,res)=>{
   try {
      const books = await Book.find();
      res.json(books);
    } catch (error) {
      console.error('Error fetching books:', error);
      res.status(500).json({ error: 'Server error' });
    }
}

module.exports = {
   createBook,
   getBook,
   getAllBook
};