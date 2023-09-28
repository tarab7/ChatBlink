const router=require('express').Router();
const Conversation=require('../models/Conversation');

//new conv
router.post("/", async(req, res)=>{
    const newConversation=new Conversation({
        members: [req.body.senderId, req.body.receiverId]
    });
    try{
        await newConversation.save();
        res.send(newConversation)
    }
    catch(err){
        res.send({"error":err.json})
    }
})

//get Conv by User Id (User Id means Firebase Id)
router.get("/:userid", async(req, res)=>{
    try{
        const conversation=await Conversation.find({
            members: {$in : [req.params.userid]}
        });
        res.send(conversation);
    }
    catch(err){
        res.send({"error":err.json})
    }
})

//Update lastText
router.put("/updateText/:convId", async(req, res)=>{
    try{
        // const conversation=await Conversation.update({_id:[req.params.convId]},{
        //     $set:{lastText:[req.body.text]}
        // })
        const conversation=await Conversation.updateOne({
            _id:[req.params.convId]
        },{
            $set:{lastText:req.body.text}
        })
        res.send(conversation)
    }
    catch(err){
        res.send({"error":err.json})
    }
})

router.get("/:userId1/:userId2", async(req, res)=>{
    try{
        const conversation=await Conversation.find({
            members: {$all : [req.params.userId1, req.params.userId2]}
        })
        res.send(conversation);
    }
    catch(err){
        res.send({"error":err.json})
    }
})

module.exports=router;