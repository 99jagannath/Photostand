import React, {useState, useContext} from 'react';
import {Link,useHistory} from 'react-router-dom';
import M from 'materialize-css';
import {UserContext} from '../../App';
const Login=()=>{
    const history = useHistory();
    const {state,dispatch} = useContext(UserContext);
    const [password,setPassword] = useState("");
    const [email,setEmail] = useState("");
    const PostData=()=>{
        if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)){
            M.toast({html: "invalid email",classes:"#c62828 red darken-3"});
            return;
        }
     
        alert(email);
        alert(password);
        fetch("/signin",{
            method:"post",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                password,
                email
            })
        }).then(res=>res.json())
        .then(data=>{
            console.log(data);
           if(data.error){
              M.toast({html: data.error,classes:"#c62828 red darken-3"});
           }
           else{
               localStorage.setItem('jwt',data.token);
               localStorage.setItem("user",JSON.stringify(data.user));
               dispatch({type:"USER" ,payload:data.user});
               M.toast({html:"successfully signed in",classes:"#43a047 green darken-1"});
               history.push('/');
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
          <input type="password" placeholder="password" value={password} onChange={(e)=>setPassword(e.target.value)}/>
          <button    type="submit" name="action" onClick={()=>PostData()}>Signup</button>
            </div>

            <div className="card-action">
           
            <Link to="/signup">Don't have an account ?</Link>
            </div>
        </div>
    </div>
)
}

export default Login;