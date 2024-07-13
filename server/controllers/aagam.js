const User = require("../models/user")
exports.who =  async (req , res)=>{
   res.status(200).json({message : "hi aagam"})
}

exports.add_user_if_not_registered = async (req , res)=>{

  const user = await User.findOne({email : req.body.email})

  if(!user){
    const new_user = new User({
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
    const user = await User.findOne({email : req.body.email})
    if(user){
      res.status(200).json(user)
    }else{
      res.status(404).json({message : "User not found"})
    }
}