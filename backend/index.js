const express=require('express');
const app=express();
const mongoose=require('mongoose');
const dotenv=require('dotenv');
const userRoute=require("./routes/users");
const authRoute=require("./routes/auth");
const convRoute=require("./routes/conversations");
const msgRoute=require("./routes/messages");
var cors = require('cors');

dotenv.config();

mongoose.connect(process.env.MONGO_URL).then(()=>console.log("Connected to MongoDB"));

//MIDDLEWARE
app.use(express.json());
app.use(cors())

//ROUTES
app.use("/api/user", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/conversation", convRoute);
app.use("/api/message", msgRoute);

app.get("/", (req, res)=>{
    res.send("home page backend");
})

const server=app.listen(8800, console.log("Backend Server is running..."));





//-----------------------------SOCKET IO----------------------------------

const io=require("socket.io")(server,{
    cors:{
        origin:"*",
    },
});

let users=[];

//Adding user to array
const sendUser=(userId, socketId)=>{
    !users.some((user)=>user.userId===userId) && users.push({userId, socketId})
}

//Removing user from array
const removeUser=(socketId)=>{
    let user=users.find(user=>user.socketId===socketId);
    users=users.filter(user=>user.socketId!==socketId);
    return user?.userId;
}

//Getting User from Id
const getUser=(userId)=>{
    return users.find(user=>user.userId===userId);
}

io.on("connection", (socket) => {
    //User connected sign
    console.log("A user connected...");

    //Take userId and socket Id to store in our array
    socket.on("sendUser", userId=>{
        userId && sendUser(userId, socket.id);
        socket.emit("getUsers",users);
    });

    //getOnline
    socket.on("getOnline", userId =>{
        const user=getUser(userId);
        io.emit("onlineStatus",{
            online: user?true:false, userId
        })
    })

    //send message
    socket.on("sendMessage",({senderId, receiverId, text, img, conversationId})=>{
        console.log("send Msg")
        const user=getUser(receiverId);
        const me=getUser(senderId);
        
        user && io.to(user.socketId).emit("getMessage",{
            senderId, text, img, conversationId
        });
        io.to(me.socketId).emit("getMyMessage",{
            receiverId, text, img, conversationId
        });
    })

    socket.on("disconnect",()=>{
        //User left
        console.log("A user left...");
        //Remove userId and socket Id from our array
        const userId=removeUser(socket.id);
        io.emit("onlineStatus",{
            online: false, userId
        })
    })
})
