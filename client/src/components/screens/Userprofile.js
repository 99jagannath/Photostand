import React,{useContext,useState,useEffect} from 'react';
import {Link,useHistory,useParams} from 'react-router-dom';
import {UserContext} from '../../App';

const userProfile = ()=>{
   
    const [user,setUser] = useState(null);
    const {userid} = useParams();
    const {state,dispatch} = useContext(UserContext);
    const [showfollow,setShowFollow] = useState(state?!state.followings.includes(userid):true);
    
    const history = useHistory();
    
   // console.log(userid);
    useEffect(()=>{
        
        fetch(`/user/${userid}`,{
            headers:{
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
        .then(result=>{
            
            setUser(result);
            
        })
     },[])
     const follow = ()=>{
         fetch('/follow',{
            method:"put",
             headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
             },
             body:JSON.stringify({
                followid:userid
             })
         }).then(res=>res.json())
         .then(data=>{
            dispatch({type:"UPDATE",payload:{followings:data.followings,followers:data.followers}})
            localStorage.setItem("user",JSON.stringify(data))
            setUser((prevState)=>{
                return {
                    ...prevState,
                    user:{
                        ...prevState.user,
                        followers:[...prevState.user.followers,data._id]
                       }
                }
            })
            setShowFollow(false)
         })
     }
     const unfollow = ()=>{
        fetch('/unfollow',{
           method:"put",
            headers:{
               "Content-Type":"application/json",
               "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
               unfollowid:userid
            })
        }).then(res=>res.json())
        .then(data=>{
           dispatch({type:"UPDATE",payload:{followings:data.followings,followers:data.followers}})
           localStorage.setItem("user",JSON.stringify(data))
           setUser((prevState)=>{
            const newFollower = prevState.user.followers.filter(item=>item != data._id )
            return {
                ...prevState,
                user:{
                    ...prevState.user,
                    followers:newFollower
                   }
            }
        })
        setShowFollow(true)
        })
    }
     //console.log(user);
    return(
        <div>
      {user ? 
        
        <div style={{maxWidth:"70%", margin:"auto", borderBottom:"1px solid grey" }}>
        <div style={{display: "flex" , justifyContent:"space-around",margin: "10px 0px",borderBottom:"1px solid gray"}}>
             <div>
                 <img style={{width: '160px' , height: '160px' , borderRadius : '80px' }} 
                 src={user.user.pic?user.user.pic:"loading..."}
                 />
             </div>
             <div >
                <h2>{user? user.user.name:"loading"}</h2>
                <div style={{display:"flex", justifyContent:"space-between", width:"108%"}}>
                <h6>{user.posts.length} posts</h6>
                       <h6>{user.user.followers.length} followers</h6>
                       <h6>{user.user.followings.length} following</h6>
                </div>
                {showfollow?
                   <button style={{
                       margin:"10px"
                   }} className="btn waves-effect waves-light #64b5f6 blue darken-1"
                    onClick={()=>follow()}
                    >
                        Follow
                    </button>
                    : 
                    <button
                    style={{
                        margin:"10px"
                    }}
                    className="btn waves-effect waves-light #64b5f6 blue darken-1"
                    onClick={()=>unfollow()}
                    >
                        UnFollow
                    </button>
                    }
            </div>
        </div> 
        <div className="gallary">
        {
            user.posts.map(item=>{
                return(
                    <img className="item" src= {item.photo}/>
                )
                
            })
        }
        
    
        </div>  
    </div>
         : <h2>loading...!</h2>}
       
         </div  >
    )
}

export default userProfile;