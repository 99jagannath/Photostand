import React, {useState, useContext} from 'react';
import {Link,useHistory,useParams} from 'react-router-dom';
import M from 'materialize-css';
import {UserContext} from '../../App';
const Newpassword=()=>{
    const history = useHistory();
    const {state,dispatch} = useContext(UserContext);
    const [password,setPassword] = useState("");
    const {token} = useParams();
    console.log(token);
    const PostData=()=>{
      
     
        fetch("/reset-password:token",{
            method:"post",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                password,
                token
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
return(
    <div className="mycard">
        <div className="card authcard input-field">
            <div className="card-content">
              <h2 className="authtitle">New password</h2>
          <input type="password" placeholder="password" value={password} onChange={(e)=>setPassword(e.target.value)}/>
          <button    type="submit" name="action" onClick={()=>PostData()}>Newpassword</button>
            </div>
        </div>
    </div>
)
}

export default Newpassword;