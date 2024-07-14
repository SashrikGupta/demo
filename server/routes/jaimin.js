const express = require("express");
const {who, getAllBook, addBookToUser, deletebook} = require('../controllers/jaimin')
const router = express.Router();
const {createBook,getBook} = require('../controllers/jaimin');

router.post('/books', createBook);
router.post('/addbook', addBookToUser);
router.post('/getbooks', getBook);
router.get('/getAllBook',getAllBook);
router.post('/deletebook',deletebook);

module.exports = router;