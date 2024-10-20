
import { useEffect, useState } from 'react'
import './ListProduct.css'
import cross_icon from '../../assets/Assets/Admin_Assets/cross_icon.png'
export const ListProduct = () => {

    const [allproducts,setallproducts]=useState([]);
    function fetchinfo()
    {
        fetch('https://e-commmerce-backend43214.onrender.com/allproducts').then((res)=>res.json())
        .then((data)=>{setallproducts(data)});
    }
    useEffect(()=>{
        fetchinfo();
    },[])
    
    const Removeproduct = async (id) => {
        console.log('Removing product with ID:', id); // Log the ID
        try {
            const response = await fetch('https://e-commmerce-backend43214.onrender.com/removeProduct', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id: id }),
            });
            const data = await response.json();
            if (data.success) {
                setallproducts(allproducts.filter(product => product.id !== id));
            } else {
                console.error('Failed to remove product:', data.message);
            }
        } catch (error) {
            console.error('Error removing product:', error);
        }
    };
    
  return (
    <div className='List-product'>
        <h1>All Products List</h1>
        <div className="list-product-format-main">
            <p>Products</p>
            <p>Title</p>
            <p>Old Price</p>
            <p>New price</p>
            <p>Category</p>
            <p>Remove</p>
        </div>
        <div className="listproducts-allproducts">
            <hr />
            {allproducts.map((product,ind)=>{
                return<><div key={ind} className="list-product-format-main listproduct-format">
                 <img src={product.image} alt="" className="list-product-product-icon" />
                 <p>{product.name}</p>
                 <p>${product.old_price}</p>
                 <p>${product.new_price}</p>
                 <p>{product.category}</p>
                 <img src={cross_icon } onClick={()=>{Removeproduct(product.id)}}alt="" className="lsit-product-romve-icon" />
                </div>
                 <hr />
                 </>
            })}
        </div>
       
    </div>
  )
}
