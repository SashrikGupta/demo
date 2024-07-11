
exports.who =  async (req , res)=>{
 
   res.status(200).json({message : "hi sashrik"})
}


exports.add = async (req, res) => {
   console.log(req.body)
   setTimeout(() => {
       res.status(200).json({ sum: req.body.a + req.body.b });
   }, 2000);
};