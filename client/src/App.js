import React,{useEffect,createContext,useReducer,useContext} from 'react';
import logo from './logo.svg';
import './App.css';
import Navbar from './components/Navbar';
import Home from './components/screens/Home';
import Profile from './components/screens/Profile';
import Login from './components/screens/Login';
import Signup from './components/screens/Signup';
import Createpost from './components/screens/Createpost';
import Userprofile from './components/screens/Userprofile';
import Newpassword from './components/screens/Newpassword';
import Reset from './components/screens/Reset';
import {BrowserRouter,Route,Switch,useHistory} from 'react-router-dom';
import {reducer,intitalState} from './reducers/userReducer';

export const UserContext = createContext();

const Routing = () =>{
  const history = useHistory();
  const {state,dispatch} = useContext(UserContext);
  useEffect(()=>{
    const user = JSON.parse(localStorage.getItem("user")) ;
    
    if(user){
      dispatch({type:"USER",payload:user});
      
    }else{
      if(!history.location.pathname.startsWith('/reset'))
          history.push('/login');
    }
  },[])
  return(
    <Switch>
        <Route exact path="/">
        <Home/>
        </Route>
        <Route path="/login">
        <Login/>
        </Route>
        <Route path="/signup">
        <Signup/>
        </Route>
        <Route exact path="/profile">
        <Profile/>
        </Route>
        <Route path="/profile/:userid">
        <Userprofile/>
        </Route>
        <Route path="/post">
        <Createpost/>
        </Route>
        <Route exact path="/reset">
        <Reset/>
      </Route>
        <Route path="/reset/:token">
        <Newpassword/>
      </Route>
    </Switch>
  )
}


function App() {
  const [state,dispatch] =useReducer(reducer,intitalState);

  return (
     <UserContext.Provider value={{state,dispatch}}>
     <BrowserRouter>
       <Navbar/>
        <Routing />
     </BrowserRouter>
     </UserContext.Provider>
  );
}

export default App;
