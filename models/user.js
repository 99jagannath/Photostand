const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema.Types
const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    resetToken:String,
    expireToken:Date,
    pic:{
        type:String,
        default: "https://res.cloudinary.com/jagacloud/image/upload/v1590167316/download_b3kia2.png"
    },
    followers:[{type:ObjectId,ref:"User"}],
    followings:[{type:ObjectId,ref:"User"}]
})

mongoose.model("User",userSchema);