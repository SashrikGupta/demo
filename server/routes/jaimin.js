const express = require("express");
const {who, getAllBook} = require('../controllers/jaimin')
const router = express.Router();
const {createBook,getBook} = require('../controllers/jaimin');

router.post('/books', createBook);
router.post('/getbooks', getBook);
router.get('/getAllBook',getAllBook);

module.exports = router;