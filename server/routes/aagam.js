const { 
   who ,
   add_user_if_not_registered , 
   give_id_from_email , 
} = require('../controllers/aagam')

const express = require("express");
const router = express.Router();

router.route("/add_if_not").post(add_user_if_not_registered);
router.route("/userid").post(give_id_from_email);
router.route("/").get(who);

module.exports = router;