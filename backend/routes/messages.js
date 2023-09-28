const router=require('express').Router();
const Message=require('../models/Message');

//add message
router.post("/", async(req, res)=>{
    const newMsg=new Message(req.body);
    try{
        const savedMsg=await newMsg.save();
        res.send(savedMsg);
    }
    catch(err){
        res.send({err: err.message});
    }
})

//get Messages for a conversation
router.get("/:convId", async(req, res)=>{
    try{
        const allMessages=await Message.find({
            conversationId: req.params.convId
        })
        res.send(allMessages);
    }
    catch(err){
        res.send({err: err.message});
    }
})

module.exports=router;