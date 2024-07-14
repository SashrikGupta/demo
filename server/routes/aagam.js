const {
   who,
   add_user_if_not_registered,
   give_id_from_email,
   add_book,
   send_mail
 } = require("../controllers/aagam");
 
 const express = require("express");
 const router = express.Router();
 
 router.route("/add_if_not").post(add_user_if_not_registered);
 router.route("/userid").post(give_id_from_email);
 router.route("/add_book").post(add_book);
 router.route("/sendmail").post(send_mail)
 router.route("/").get(who);
 
 module.exports = router;