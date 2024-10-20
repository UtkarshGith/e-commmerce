import React, { useEffect, useState } from 'react'
import './NewCollections.css'
import { Item } from '../Items/Item.jsx'
export const NewCollections = () => {

  const [new_colletions,setnewcollection]=useState([]);
  useEffect(() => {
    fetch('https://e-commmerce-backend-fv5o.onrender.com/newcollections')
      .then((response) => response.json())
      .then((data) => setnewcollection(data))
      .catch((error) => console.error('Error fetching new collections:', error));
  }, []);
  return (
    <div className='newcollections'>
        <h1>NEW COLLECTIONS</h1>
        <hr/>
        <div className="collections">
          {new_colletions.map((item,i)=>{
            return <Item key={i} id={item.id} name={item.name} image={item.image} new_price={item.new_price} old_price={item.old_price}/>
          })}
        </div>
    </div>
  )
}
