const { 
   who ,
   add_user_if_not_registered , 
   give_id_from_email ,
   send_details_of_all_users  , 
   send_details_of_all_Book,
   send_mail
} = require('../controllers/sashrik')

const express = require("express");
const router = express.Router();

router.route("/add_if_not").post(add_user_if_not_registered);
router.route("/users").get(send_details_of_all_users);
router.route("/books").get(send_details_of_all_Book);
router.route("/userid").post(give_id_from_email);
router.route("/sendmail").post(send_mail)
router.route("/").get(who);

module.exports = router;