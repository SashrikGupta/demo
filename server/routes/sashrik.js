const express = require("express");
const {who , add} = require('../controllers/sashrik')
const router = express.Router();

router.route("/").get(who);
router.route("/add").post(add) ; 

module.exports = router;