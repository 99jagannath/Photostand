import React, {useState, useContext} from 'react';
import {Link,useHistory} from 'react-router-dom';
import M from 'materialize-css';
import {UserContext} from '../../App';
const Reset=()=>{
    const history = useHistory();
    const {state,dispatch} = useContext(UserContext);
    const [email,setEmail] = useState("");
    const PostData=()=>{
        if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)){
            M.toast({html: "invalid email",classes:"#c62828 red darken-3"});
            return;
        }
        fetch("/reset-password",{
            method:"post",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                email
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
              <h2 className="authtitle">Login</h2>
              <input type="text" placeholder="email" value={email} onChange={(e)=>setEmail(e.target.value)} />
          <button    type="submit" name="action" onClick={()=>PostData()}>reset</button>
            </div>
        </div>
    </div>
)
}

export default Reset;