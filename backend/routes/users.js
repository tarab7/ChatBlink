const router=require('express').Router();
const User=require('../models/User');

//Get user by name
router.get("/:userName",async(req, res)=>{
    try{
        const result=await User.find({name : [req.params.userName]})
        res.send(result);
    }
    catch(err){
        res.send({"error":err.json})
    }
})

//Get user by userId
router.get("/getUserById/:userId",async(req, res)=>{
    try{
        const result=await User.findOne({firebaseId : [req.params.userId]})
        res.send(result);
    }
    catch(err){
        res.send({"error":err.json})
    }
})

module.exports=router;