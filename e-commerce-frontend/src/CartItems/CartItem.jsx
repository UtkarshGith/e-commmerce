import React, { useContext } from 'react'
import './CartItems.css'
import { ShopContext } from  '../Context/ShopContext'
import remove_icon from '../Assest/Assets/Frontend_Assets/cart_cross_icon.png'


export const CartItem = () => {
    const {getTotalCartAmount,all_product,cartitems,removefromCart}=useContext(ShopContext);
  return (
    <div className='cartitems'>
        <div className="classitems-format-main">
            <p>Products</p>
            <p>Title</p>
            <p>Price</p>
            <p>Quantity</p>
            <p>Total</p>
            <p>Remove</p>
        </div>
        <hr/>
        {all_product.map((e)=>{
            if(cartitems[e.id]>0)
            {
                return <div>
                            <div className="cart-items-format classitems-format-main">
                                <img src={e.image} alt="" className='cart-icon-product-icon' />
                                <p>{e.name}</p>
                                <p>${e.new_price}</p>
                                <button className='cart-item-quantity'>{cartitems[e.id]}</button>
                                <p>${cartitems[e.id]*e.new_price}</p>
                                <img src={remove_icon} className='cart-tems-remove-icon' alt="" onClick={()=>{removefromCart(e.id)}}/>
                            </div>
                           <hr/>
                       </div>
            }
            
        })}
        <div className="class-items-down">
            <div className="cart-items-total">
                <h1>cart Totals</h1>
                <div>
                    <div className="class-items-total-itms">
                        <p>Subtotal</p>
                        <p>${getTotalCartAmount()}</p>
                    </div>
                    <hr />
                    <div className="class-items-total-itms">
                        <p>Shipping fee</p>
                        <p>free</p>
                    </div>
                    <hr />
                    <div className="class-items-total-itms">
                        <h3>Total</h3>
                        <h3>${getTotalCartAmount()}</h3>
                    </div>
                </div>
                <button>PROCCED TO CHECKOUT</button>
            </div>
            <div className="cartitems-promocode">
                <p>If you have promo code ,Enter it here</p>
                <div className="cartitem-promobox">
                    <input type="text"  placeholder='promo code'/>
                    <button>Submit</button>
                </div>
            </div>
        </div>
    </div>
  );
}
