const express = require("express");
const {who} = require('../controllers/jaimin')
const router = express.Router();

router.route("/").get(who);

module.exports = router;