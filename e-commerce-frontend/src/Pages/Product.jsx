import React, { useContext } from 'react'
import { ShopContext } from '../Context/ShopContext';
import { useParams } from 'react-router-dom';
import { Breadcrums } from '../Breadcrums/Breadcrums';
import { Productdisplay } from '../Productdisplay/Productdisplay';
import { Descriptionbox } from '../Descriptionbox/Descriptionbox';
import { RelatedProducts } from '../RelatedProducts/RelatedProducts';

export const Product = () => {
  const {all_product}=useContext(ShopContext);
  const {productId}=useParams();
  const product =all_product.find((e)=>e.id===Number(productId));
  return (
    <div>
      <Breadcrums product={product}/>
      <Productdisplay product={product}/>
      <Descriptionbox/>
      <RelatedProducts/>
    </div>
  )
}
