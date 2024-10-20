import React, { useState } from 'react'
import './CSS/Loginsignup.css'
export const LoginSignUp = () => {
    const [state,setstate]=useState("Sign Up"); 
    const [formdata,setformdata]=useState({
        "username":"",
        "password":"",
        "email":""
    });
    const login=async ()=>{
        let responsedata;
        try {
            const response = await fetch('http://localhost:4000/login', {
                method: 'POST',
                headers: {
                    Accept: 'application/json', // Changed from form-data to json
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formdata),
            });
    
            responsedata = await response.json(); // Properly await and parse the response JSON
    
            if (responsedata.success) {
                localStorage.setItem('auth-token', responsedata.token);
                window.location.replace("/"); // Redirect to the home page or another URL
            } else {
                alert("Signup failed:", responsedata.message); // Handle failure
            }
        } catch (error) {
            alert("Error during signup:", error); // Catch any error during fetch
        }
    };
    const signup = async (req,res) => {
        let responsedata;
        try {
            const response = await fetch('http://localhost:4000/signup', {
                method: 'POST',
                headers: {
                    Accept: 'application/json', // Changed from form-data to json
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formdata),
            });
    
            responsedata = await response.json(); // Properly await and parse the response JSON
    
            if (responsedata.success) {
                localStorage.setItem('auth-token', responsedata.token);
                window.location.replace("/"); // Redirect to the home page or another URL
            } else {
                alert("Signup failed:", responsedata.message); // Handle failure
            }
        } catch (error) {
            alert("Error during signup:", error); // Catch any error during fetch
        }
    };
    
    

    const changehandler=(e)=>{
        setformdata({...formdata,[e.target.name]:e.target.value})
    }
  return (
    <div className='loginSignUp'>
        <div className="loginsignupcontainer">
            <h1>{state}</h1>
            <div className="loginsignupfields">
            {state==='Sign Up'?<input name="username" value={formdata.username} onChange={changehandler}type="text" placeholder='Your Name'/>:<></>}
                <input name="email" value={formdata.email} onChange={changehandler}type="email"  placeholder='Email Address'/>
                <input  name="password" value={formdata.password} onChange={changehandler}type="password" placeholder='Password' />
                </div>
            <button onClick={()=>state==="Login"?login():signup()}>Continue</button>
            
            
            {state==='Sign Up'?<p className="loginsignuplogin">
                Already have an account?
                <span onClick={()=>setstate("Login")}> Login here</span>
            </p>:<p className="loginsignuplogin">
               Create an account?
                <span onClick={()=>setstate("Sign Up")}> Click here</span>
            </p>}
            
            <div className="loginsignupagree">
                <input type="checkbox" name='' id=''/>
                <p>By continuing, i agree to the terms of use & privacy policy</p>
            </div>
        </div>
    </div>
  )
}
