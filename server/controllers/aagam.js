const Book = require("../models/book");
const User = require("../models/user");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  port: 465,
  secure: true,
  auth: {
    user: "codeconnect.mail@gmail.com",
    pass: "edka lhlw sque qmgc"// Replace with your email password or use environment variables
  },
  tls: {
    rejectUnauthorized: false
  }
});

exports.who = async (req, res) => {
  res.status(200).json({ message: "hi aagam" });
};

exports.add_book = async (req, res) => {
  try {
    const {
      ISBN,
      title,
      author,
      publisher,
      description,
      year,
      genre,
      quantity,
      link,
      photo,
    } = req.body;

    console.log(req.body);

    // Create and save the new book
    const newBook = new Book({
      ISBN,
      title,
      author,
      publisher,
      description,
      year,
      genre,
      quantity,
      link,
      photo,
    });

    await newBook.save();

    console.log("Book saved");

    // Fetch all users
    const users = await User.find({}); // Adjust query as needed

    // Create a nodemailer transporter


    // Email options
    const mailOptions = {
      from: "intellihome.official@gmail.com",
      subject: "New Book Added",
      text: `A new book title ${title} has been added to the catalog.`,
    };

    // Send email to each user
    for (const user of users) {
      mailOptions.to = user.email;
      await transporter.sendMail(mailOptions);
    }

    console.log("Emails sent");

    res.status(201).json({ message: "Book added successfully" });
  } catch (error) {
    // Handle errors
    console.error("Error adding book:", error);
    res
      .status(500)
      .json({ message: "An error occurred while adding the book" });
  }
};

// exports.add_book = async (req, res) => {
//   try {
//     const {
//       ISBN,
//       title,
//       author,
//       publisher,
//       description,
//       year,
//       genre,
//       quantity,
//       link,
//       photo,
//     } = req.body;

//     console.log(req.body);

//     const newBook = new Book({
//       ISBN,
//       title,
//       author,
//       publisher,
//       description,
//       year,
//       genre,
//       quantity,
//       link,
//       photo,
//     });

//     await newBook.save();

//     console.log("book saved");

//     res.status(201).json({ message: "Book added successfully" });
//   } catch (error) {
//     // Handle errors
//     console.error("Error adding book:", error);
//     res
//       .status(500)
//       .json({ message: "An error occurred while adding the book" });
//   }
// };

exports.give_id_from_email = async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (user) {
    res.status(200).json(user);
  } else {
    res.status(404).json({ message: "User not found" });
  }
};

exports.add_user_if_not_registered = async (req, res) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    const new_user = new User({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      picture: req.body.picture,
    });
    new_user.save();
  }
  res.status(200).json({ message: "User added successfully" });
};


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