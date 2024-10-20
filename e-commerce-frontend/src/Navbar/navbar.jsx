import React, { useContext, useState } from 'react'
import './navbar.css'
import logo from '../Assest/Assets/Frontend_Assets/logo.png'
import cart_icon from '../Assest/Assets/Frontend_Assets/cart_icon.png'
import { Link, useNavigate } from 'react-router-dom';
import { ShopContext } from '../Context/ShopContext'
const Navbar = () => {
    const [menu ,setmenu]=useState("shop");
    const {countAddedProduct}=useContext(ShopContext);
    const navigate = useNavigate(); 
    const authToken = localStorage.getItem('auth-token');
    const handleLogout = () => {
      console.log('Logout triggered');
      localStorage.removeItem('auth-token');
      navigate('/');  // Redirect to homepage after logout
    };
  return (
    <div className="navbar">
    <div className="nav-logo"> 
        <img  src={logo} alt=""/>
        <p>Shopper</p>
        </div>
      <ul className='nav-menu'>
        <li onClick={()=>setmenu("shop")}><Link style={{textDecoration:'none'}}to='/'>Shop</Link>{menu==="shop"?<hr/>:<></>}</li>
        <li onClick={()=>setmenu("men")}> <Link style={{textDecoration:'none'}} to='/mens' >Men</Link>{menu==="men"?<hr/>:<></>}</li>
        <li onClick={()=>setmenu("women")}><Link style={{textDecoration:'none'}} to='/womens'>Women</Link>{menu==="women"?<hr/>:<></>}</li>
        <li onClick={()=>setmenu("kids")}><Link style={{textDecoration:'none'}}to='/kids'>Kids</Link>{menu==="kids"?<hr/>:<></>}</li>
      </ul>
      <div className="nav-login-cart">
      {localStorage.getItem('auth-token') ? (
          <button onClick={handleLogout}>Logout</button>
        ) : (
          <Link to="/login"><button>Login</button></Link>
        )}
        <Link to='/cart'><img src={cart_icon} alt=""/></Link>
        <div className="nav-cart-cnt">{countAddedProduct()}</div>
      </div>

    </div>
  )
}

export default Navbar