const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Post = mongoose.model('Post');
const User = mongoose.model('User');
const requirelogin = require('../middleware/requirelogin');


router.get('/user/:id',requirelogin,(req,res)=>{
  User.findOne({_id:req.params.id})
  .select("-password")
  .then(user=>{
      Post.find({postedBy:user._id})
      .populate("postedBy","_id name")
      .then(posts=>{
          console.log(posts);
          console.log(user);
          res.json({user,posts})
      })
      .catch(err=>{
          return res.status(404).json({err});
      })
  })
  .catch(err=>{
      return res.status(404).json({err});
  })
})
router.put('/follow',requirelogin,(req,res)=>{
    User.findByIdAndUpdate({_id:req.body.followid},{
        $push:{followers:req.user._id}
    },{new:true},(err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }
    User.findByIdAndUpdate({_id:req.user._id},{
        $push:{followings:req.body.followid}
    },{new:true}).select("-password").then(result=>{
        res.json(result)
    }).catch(err=>{
        return res.status(422).json({error:err})
    })
    }
   )
})
router.put('/unfollow',requirelogin,(req,res)=>{
    User.findByIdAndUpdate({_id:req.body.unfollowid},{
        $pull:{followers:req.user._id}
    },{ new:true },(err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }
    User.findByIdAndUpdate({_id:req.user._id},{
        $pull:{followings:req.body.unfollowid}
    },{new:true}).select("-password").then(result=>{
        res.json(result)
    }).catch(err=>{
        return res.status(422).json({error:err})
    })
    }
   ) 
})

router.put('/updatepic',requirelogin,(req,res)=>{
    User.findByIdAndUpdate({_id:req.user._id},{
        $set:{
            pic:req.body.pic
        },
        
    },{new:true})
    .then(result=>{
        res.json(result);
    })
    .catch(err=>{
        return res.status(422).json({error:err});
    })
})

router.post('/search-users',(req,res)=>{
    let userPattern = new RegExp("^"+req.body.query)
    User.find({email:{$regex:userPattern}})
    .select("_id name pic")
    .then(user=>{
        res.json({user})
    }).catch(err=>{
        console.log(err)
    })

})




module.exports = router;