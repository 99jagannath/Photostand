const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = mongoose.model("User");
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwt  = require('jsonwebtoken');
const {JWT_SECRET} = require('../server/keys');
const requirelogin = require('../middleware/requirelogin');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport'); 
const sendgrid = "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"; 
const transporter = nodemailer.createTransport(sendgridTransport({
  auth:{
    api_key:"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"     
  }
}))
router.get('/protected',requirelogin,(req,res)=>{
    res.send("hello user");
});

router.post('/signup',(req,res)=>{
  const {name,email,password,pic} = req.body;
  if(!email || !password || !name){
     return res.status(422).json({error: "please add all fields"});
  }
  User.findOne({email:email})
  //saved user==user with this email
  .then((SavedUser)=>{
     if(SavedUser){
       return res.status(422).json({error:  "this email is already exit"});
     }
     bcrypt.hash(password,12)
     .then(hashedpassword=>{
          const user = new User({
            email: email,
            password:hashedpassword,
            name: name,
            pic: pic
          })
          user.save()
          .then(user=>{
            transporter.sendMail({
              to:user.email,
              from: "99jagannath@gmail.com",
              subject:"signup successful",
              html:"<h1> wellcome to photostand</h1>"
            })
            res.json({message: "saved successfully"});
          })
          .catch(err=>{
            console.log(err);
          })
     })

  })
  .catch(err=>{
    console.log(err);
  })
});
router.post('/signin',(req,res)=>{
 const {email,password} = req.body;
 if(!email || !password){
     return res.status(422).jason({error: "please add email or password"});
 }
 User.findOne({email:email})
 .then(saveduser=>{
   if(!saveduser){
     return res.status(422).json({error:"invalid email or password"});
   }
   bcrypt.compare(password,saveduser.password)
   .then(domatch=>{
     if(domatch){
       //res.json({message: "successfully signenin"});
       const token = jwt.sign({_id:saveduser._id},JWT_SECRET);
       const {_id,name,email,followers,followings,pic} = saveduser;
       res.json({token:token,user:{_id:_id,name:name,email:email,followers:followers,followings:followings,pic:pic}});
      
     }else{
       return res.status(422).json({error: "invslid email or password"});
     }
   })
   .catch(err=>{
     console.log(err);
   })

   
 })
 .catch(err=>{
   console.log(err);
 })
});
router.post('/reset-password',(req,res)=>{
  crypto.randomBytes(32,(err,buffer)=>{
    if(err){
        console.log(err)
    }
    const token = buffer.toString("hex")
    User.findOne({email:req.body.email})
    .then(user=>{
      if(!user){
        return res.status(422).json({error:"user dont't exit with that email"});
      }
      user.resetToken = token
      user.expireToken = Date.now() + 3600000
      user.save().then((result)=>{
        transporter.sendMail({
          to:user.email,
          from:"99jagannath@gmail.com",
          subject:"password reset",
          html:`
          <p>You requested for password reset</p>
          <h5>click in this <a href="http://localhost:3000/reset/${token}">link</a> to reset password</h5>
          `
        })
        res.json({message:"check your email"})
      })
    })
  })
})
 router.post('/reset-password',(req,res)=>{
   const newpassword = req.body.password;
   const token = req.body.token;
   User.findOne({resetToken:token,expireToken:{$gt:Date.now()}})
   .then(user=>{
     if(!user){
       return res.status(422).json({error:"Try again your session has expired"})

     }
     bcrypt.hash(newpassword,12)
     .then(hashedpassword=>{
       user.password=hashedpassword
       user.resetToken=undefined
       user.expireToken=undefined
       user.save().then((saveduser)=>{
         res.json({message:"password updated successfuly"});
       })
     })
   })
 })
module.exports = router;
