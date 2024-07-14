const Admin = require('../models/admin')
const User = require('../models/user')
const Book = require("../models/book")
const nodemailer = require('nodemailer')
exports.who =  async (req , res)=>{
 
   res.status(200).json({message : "hi sashrik"})
}


exports.add = async (req, res) => {
   console.log(req.body)
   setTimeout(() => {
       res.status(200).json({ sum: req.body.a + req.body.b });
   }, 2000);
};

exports.add_user_if_not_registered = async (req , res)=>{

   const user = await Admin.findOne({email : req.body.email})
 
   if(!user){
     const new_user = new Admin({
       name : req.body.name , 
       email : req.body.email , 
       password : req.body.password,
       picture : req.body.picture
     })
     new_user.save()
   }
   res.status(200).json({message : "User added successfully"})
 
 
 }
 
 exports.give_id_from_email = async (req , res)=>{
     const user = await Admin.findOne({email : req.body.email})
     if(user){
       res.status(200).json(user)
     }else{
       res.status(404).json({message : "User not found"})
     }
 }

 exports.send_details_of_all_users = async(req , res)=>{
   const users = await User.find({})
   res.status(200).json(users)
 }

 exports.send_details_of_all_Book = async(req , res)=>{
  const users = await Book.find({})
  res.status(200).json(users)
}

const transporter = nodemailer.createTransport({
  service: "gmail",
  port: 465,
  secure: true,
  auth: {
    user: "intellihome.official@gmail.com",
    pass: "nsas mawn svva txwn", // Replace with your email password or use environment variables
  },
});

exports.send_mail = async (req , res)=>{

  const mailOptions = {
    from: "intellihome.official@gmail.com",
    to: req.body.email,
    subject: `Hello ${req.body.user}`,
    text: `
     this is to notify you that your bill of your 
     book over due please pay the bill with extra charges on return  
    `,
  }

  await  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  })
}