const express = require("express");
const {who} = require('../controllers/priyang')
const router = express.Router();

router.route("/").get(who);

module.exports = router;