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

const PORT=process.env.PORT || 8800;
app.listen(PORT, ()=>{
    console.log("Backend Server is running...")
})