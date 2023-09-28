const router=require('express').Router();

const User=require('../models/User');

//Register
router.post("/register",  async(req, res)=>{
    const { name, email, picURL, firebaseID} = req.body;
    try{
      const newUser=new User({name:name, email:email, profilePic:picURL, firebaseId: firebaseID});
      await newUser.save();
      res.send({success:"Account created successfully!!"})
    }
    catch(err){
      res.send({error:err});
    }
})

//Login
router.get("/getUser", async (req, res) => {
    res.status(200).json(req.user);
  });


module.exports=router;