import React from 'react'
import './Footer.css'
import footer_logo from '../Assest/Assets/Frontend_Assets/logo_big.png'
import instagram_icon from '../Assest/Assets/Frontend_Assets/instagram_icon.png'
import pintester_icon from '../Assest/Assets/Frontend_Assets/pintester_icon.png'
import whatspp_icon from '../Assest/Assets/Frontend_Assets/whatsapp_icon.png'

export const Footer = () => {
  return (
    <div className='footer'>
        <div className="footer_logo">
            <img src={footer_logo} alt="" />
            <p>SHOPPER</p>
        </div>
        <ul className="footer_links">
            <li>Company</li>
            <li>Products</li>
            <li>Offices</li>
            <li>About</li>
            <li>Contacts</li>
        </ul>
        <div className="footer_social_icons">
            <div className="footer_icons_container">
                <img src={instagram_icon} alt="" />
            </div>
            <div className="footer_icons_container">
                <img src={ pintester_icon} alt="" />
            </div>
            <div className="footer_icons_container">
                <img src={whatspp_icon} alt="" />
            </div>

        </div>
        <div className="footer_copyright">
            <hr/>
          <p>Copyright @ 2023 - All Right Reserved.</p>
        </div>
    </div>
  )
}
