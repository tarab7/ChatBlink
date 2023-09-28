const mongoose=require('mongoose');

const UserSchema=new mongoose.Schema({
    name:{
        type:String,
        require:true,
        min:3,
        max:15
    }
    ,
    email:{
        type:String,
        require:true,
        max:50,
        unique:true
    },
    profilePic:{
        type:String,
        default:""
    },
    firebaseId:{
        type: String,
        require:true
    }
})

module.exports=mongoose.model('User', UserSchema);