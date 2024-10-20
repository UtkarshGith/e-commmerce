import React from 'react'
import { useState } from 'react'
import './AddProduct.css'
import upload_area from '../../assets/Assets/Admin_Assets/upload_area.svg'
const AddProduct = () => {

    const [image,setimage]=useState(false);
    const [productDetails,setproductdetails]=useState({
        name:"",
        image:"",
        category:"women",
        new_price:"",
        old_price:""
    });
    function imagehandler(event) {
        setimage(event.target.files[0]);
    }
    function changeHandler(e)
    {
        setproductdetails({...productDetails,[e.target.name]:[e.target.value]});
    }
    const Addproducts = () => {
        console.log(productDetails);
        let product = productDetails;
        let formData = new FormData();
        
        // Append the image to FormData for the first request
        formData.append('product', image);
      
        // First request to upload the image
        fetch('https://e-commmerce-backend43214.onrender.com/upload', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
          },
          body: formData,
        })
          .then((resp) => resp.json())
          .then((data) => {
            if (data.success) {
              // Set the product image URL once the image is uploaded successfully
              product.image = data.image_url;
              console.log(product); // Product object with image URL
      
              // Second request to add the complete product details (with image URL)
              return fetch('https://e-commmerce-backend43214.onrender.com/addproduct', {
                method: 'POST',
                headers: {
                  Accept: 'application/json',
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(product), // Convert product object to JSON string
              });
            } else {
              throw new Error('Failed to upload image');
            }
          })
          .then((resp) => resp.json())
          .then((data) => {
            if (data.success) {
              alert('Product Added');
            } else {
              alert('Failed to add product');
            }
          })
          .catch((error) => {
            console.error('Error in product upload:', error);
            alert('An error occurred while adding the product.');
          });
      };
      
      
    
  return (
    <div className='add-product'>
        <div className="add-product-item-fields">
            <p>Product title</p>
            <input  value={productDetails.name}  onChange={changeHandler}type="text" name='name'  placeholder='Type here'/>
        </div>
        <div className="add-product-price">
            <div className="add-product-item-fields">
                <p>Price</p>
                <input  value={productDetails.old_price} onChange={changeHandler} type="text" name="old_price"  placeholder='Type here'/>
            </div>
        
            <div className="add-product-item-fields">
                <p>Offer Price</p>
                <input value={productDetails.new_price} type="text" onChange={changeHandler} name="new_price"  placeholder='Type here'/>
             </div>   
        </div>
            <div className="add-product-item-fields">
                <p>Product Category</p>
                <select  value={productDetails.category}  onChange={changeHandler} name="category" className="add-product-selector">
                    <option value="women">Women</option>
                    <option value="men">Men</option>
                    <option value="kid">Kid</option>
                </select>
            </div>
      
        <div className="add-product-item-fields">
            <label htmlFor="file-input">
                <img src={image ?URL.createObjectURL(image):upload_area}className='addproduct-thumbnailimg' alt="" />
            </label>
            <input  onChange={imagehandler}type="file"  name='image' id='file-input' hidden/>
        </div>
        <button  onClick={()=>{Addproducts()}}className='addproduct-button'>ADD</button>

    </div>
  )
}

export default AddProduct;
