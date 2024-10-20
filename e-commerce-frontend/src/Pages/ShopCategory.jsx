import React, { useContext } from 'react';
import './CSS/ShopCategory.css';
import { ShopContext } from '../Context/ShopContext';
import dropdown_icon from '../Assest/Assets/Frontend_Assets/dropdown_icon.png';
import Item from '../Items/Item';

export function ShopCategory(props) {
  const { all_product } = useContext(ShopContext);

  // Handle loading or undefined state
  if (!all_product || all_product.length === 0) {
    return <div>Loading products...</div>;
  }

  // Filter products based on category (supports array of categories)
  const filteredProducts = all_product.filter((item) => {
    return item.category.includes(props.category); // Check if category array includes the selected category
  });

  return (
    <div className="shop-category">
      <img className="shopcategory-banner" src={props.banner} alt="" />
      
      <div className="shopcategory-indexsort">
        <p>
          <span>Showing 1-12</span> Out of {filteredProducts.length} Products
        </p>

        <div className="shopcategory-sort">
          Sort by <img src={dropdown_icon} alt="Sort icon" />
        </div>
      </div>

      <div className="shopcategory-products">
        {filteredProducts.length > 0 ? (
          filteredProducts.slice(0, 12).map((item, index) => (
            <Item 
              key={index} 
              id={item.id} 
              name={item.name} 
              image={item.image} 
              new_price={item.new_price} 
              old_price={item.old_price}
            />
          ))
        ) : (
          <p>No products found for this category.</p>
        )}
      </div>

      <div className="shopcategoryloadmore">
        Explore More
      </div>
    </div>
  );
}
