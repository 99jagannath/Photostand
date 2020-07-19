import React, {useState,useEffect} from 'react';
import {Link,useHistory} from 'react-router-dom';
import M from 'materialize-css';
const Signup=()=>{
    const history = useHistory();
    const [name,setName]=useState("");
    const [password,setPassword] = useState("");
    const [email,setEmail] = useState("");
    const [image,setImage] = useState("");
    const [url,setUrl] = useState(undefined);
    useEffect(()=>{

        if(url){
            uploadfield();
        }
    },[url])
    const uploadpic=()=>{
        const data = new FormData()
        data.append("file",image)
        data.append("upload_preset","photostand")
        data.append("cloud_name","jagacloud")
        fetch("	https://api.cloudinary.com/v1_1/jagacloud/image/upload",{
            method:"post",
            body:data
        })
        .then(res=>res.json())
        .then(data=>{
            setUrl(data.url);
        }).catch(err=>{
            console.log(err);
        })

    }
    const uploadfield=()=>{
        if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)){
            M.toast({html: "invalid email",classes:"#c62828 red darken-3"});
            return;
        }
        // alert(name);
        // alert(email);
        // alert(password);
        fetch("/signup",{
            method:"post",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                name,
                password,
                email,
                pic:url
            })
        }).then(res=>res.json())
        .then(data=>{
           if(data.error){
              M.toast({html: data.error,classes:"#c62828 red darken-3"});
           }
           else{
               M.toast({html:data.message,classes:"#43a047 green darken-1"});
               history.push('/login');
           }
        }).catch(err=>{
            console.log(err);
        })
    }
    const PostData=()=>{
      if(image){
          uploadpic();
      }else{
          uploadfield();
      }
    }
    
return(
    <div className="mycard">
    <div className="card authcard input-field">
        <div className="card-content">
          <h2 className="authtitle">Signup</h2>
          <input type="text" placeholder="name" value={name} onChange={(e)=>setName(e.target.value)}/>
          <input type="text" placeholder="email" value={email} onChange={(e)=>setEmail(e.target.value)} />
          <input type="password" placeholder="password" value={password} onChange={(e)=>setPassword(e.target.value)}/>
          <div className="file-field input-field">
                <div className="btn waves-effect waves-light #64b5f6 blue darken-1">
                    <span>Upload pic</span>
                    <input type="file" onChange={(e)=>setImage(e.target.files[0])}/>
                </div>
                <div className="file-path-wrapper">
                    <input className="file-path validate" type="text" />
                </div>
                
            </div>
          <button className="btn waves-effect waves-light #64b5f6 blue lighten-2" type="submit" name="action" onClick={()=>PostData()}>Signup</button>
        </div>

        <div className="card-action">
       
        <h6><Link to="/login">Already have an account?</Link></h6>
        </div>
    </div>
</div>
)
}

export default Signup;