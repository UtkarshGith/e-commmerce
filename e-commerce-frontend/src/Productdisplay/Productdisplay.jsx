import React, { useContext } from 'react'
import './Productdisplay.css'
import star_icon from '../Assest/Assets/Frontend_Assets/star_icon.png'
import star_dull_icon from '../Assest/Assets/Frontend_Assets/star_dull_icon.png'
import { ShopContext } from '../Context/ShopContext'

export const Productdisplay = (props) => {
    const {product}=props;
    const {addtocart}=useContext(ShopContext);
    function handleAddToCart() {
      addtocart(product.id);
    }
  return (
    <div className='productdisplay'>
         <div className="productdisplay-left">
            <div className="productdisplayimagelist">
                <img src={product.image} alt="" />
                <img src={product.image} alt="" />
                <img src={product.image} alt="" />
                <img src={product.image} alt="" />
            </div>

            <div className="productdisplayimage">
              <img className="productdisplaymain-img" src={product.image} alt="" />

            </div>
         </div>
         <div className="productdisplay-right">
            <h1>{product.name}</h1>
            <div className="productdisplay-right-star">
                <img src={star_icon} alt="" />
                <img src={star_icon} alt="" />
                <img src={star_icon} alt="" />
                <img src={star_icon} alt="" />
                <img src={star_dull_icon} alt="" />
                <p>(122)</p>
            </div>
            <div className="productdisplay-right-prices">
                <div className="productdisplay-right-prices-old">${product.old_price}</div>
                <div className="productdisplay-right-prices-new">${product.new_price}</div>
            </div>
            <div className="productdisplay-right-description">
                A lightweight,usually knitted,pullover shirt,close fitting and with a round neckline and short sleeves worn as an undershirt or outer garment
            </div>
            <div className="productdisplay-right-size">
                <h1> Select size</h1>
                <div className="productdisplay-right-sizes">
                   <div>S</div>
                   <div>M</div>
                   <div>L</div>
                   <div>XL</div>
                   <div>XXL</div>
                </div>
            </div>


<button onClick={handleAddToCart}>ADD TO CART</button>
            <p className="product-display-right-category"><span>Category :</span>Women ,T-shirt,Crop Top</p>
            <p className="product-display-right-category"><span>Tags :</span>Modern ,Latest</p>
         </div>
    </div>
  )
}
