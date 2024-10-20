import React from 'react'
import './Descriptionbox.css'

export const Descriptionbox = () => {
  return (
    <div className='descriptionbox'>
        <div className="descriptionbox-navigator">
            <div className="descriptionbox-navbox">
                Description
            </div>
            <div className="descriptionbox-navbox fade">
                Reviews (122)
            </div>
        </div>
        <div className="descriptionbox-description">
             <p>An  e-commerce website is an online platform that facilitate buying and selling of products or services over the internet serves as a virtual marketplace where businesses and individual showcase their products,interact with customers and conduct transactions without the need for a physical presence. E-commerce website have gained immense popularity due to their convenint accessibilty and the global reach they offer.</p>
             <p> E-coommerce website typically display products or services along with detailed descriptions images prices and any variations(e.g.,sizes,colors).Each product usually has its own dedicated page with relevant information</p>
        </div>
    </div>
  )
}
