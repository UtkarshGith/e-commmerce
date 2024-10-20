
import React, { createContext, useEffect, useState } from "react";

export  const ShopContext=createContext(null);

function getDefaultCard(){
    let cart={};
    for(let i=0;i<300+1;i++)
    {
        cart[i]=0; 
    }
    return cart;
}

export function Shopcontextprovider(props){
    const [cartitems,setcartitems]=useState(getDefaultCard());
    console.log(cartitems);
    const [all_product,setallproduct]=useState([]);
    useEffect(() => {
        fetch('https://e-commmerce-backend-fv5o.onrender.com/allproducts')
          .then((response) => response.json()) // Parse the JSON from the response
          .then((data) => {
            setallproduct(data); // Set the received data to allproduct state
          })
          .catch((error) => {
            console.error("Error fetching products:", error); // Add error handling
          });
           
          if(localStorage.getItem('auth-token'))
          {
            
            fetch('https://e-commmerce-backend-fv5o.onrender.com/getcart', {
                method: 'POST',
                headers: {
                  Accept: 'application/form-data',
                  'auth-token': `${localStorage.getItem('auth-token')}`,
                  'Content-Type': 'application/json',
                },
                body: ""
              })
              .then(response => response.json())  // Return the parsed JSON
              .then(data => {
                setcartitems(data);  // Update the cart items with the fetched data
            
              })
              .catch(error => {
                console.error('Error fetching cart data:', error);
              });
              
          }
    }, []);
    
     function addtocart(itemid)
     {
        
        const updatedCartItems = Object.assign({}, cartitems);
        updatedCartItems[itemid]=updatedCartItems[itemid]+1;
        setcartitems(updatedCartItems); 
        if(localStorage.getItem('auth-token'))
        {
            fetch('https://e-commmerce-backend-fv5o.onrender.com/addtocart',{
                method:'POST',
                headers:{
                 Accept :'application/form-data',
                'auth-token':`${localStorage.getItem('auth-token')}`,
                'Content-Type':'application/json',
                
                },
                body:JSON.stringify({"ItemId":itemid}),

            }).then((response)=>response.json())
            .then((data)=>{console.log(data)})
        }
        
     }

     function removefromCart(itemid)
     {
        const updatedCartItems = Object.assign({}, cartitems);
        updatedCartItems[itemid]=updatedCartItems[itemid]-1;
        setcartitems(updatedCartItems); 
        if(localStorage.getItem('auth-token'))
        {
            fetch('https://e-commmerce-backend-fv5o.onrender.com/removefromcart',{
                method:'POST',
                headers:{
                 Accept :'application/form-data',
                'auth-token':`${localStorage.getItem('auth-token')}`,
                'Content-Type':'application/json',
                 
                },
                body:JSON.stringify({"ItemId":itemid}),

            }).then((response)=>response.json())
            .then((data)=>{console.log(data)}) 
        }
      
     }

        function getTotalCartAmount()
        {
            let totalAmount=0;
            for(let i=0;i<all_product.length+1;i++)
            {
                
                if(cartitems[i]>0)
                {
                   for(let j=0;j<all_product.length;j++)
                   {
                       if(all_product[j].id===Number(i))
                       {
                      
                        totalAmount=totalAmount+(all_product[j].new_price*cartitems[i]);
                        
                        break;
                       }
                   }
                }
            }
            return totalAmount;
        }

        function countAddedProduct()
        {
            console.log(cartitems);
            let cnt=0;
            for(let i=0;i<all_product.length;i++)
            {
              cnt=cnt+cartitems[i];
            }
            return cnt;
        }

        
     const Contextvalue={countAddedProduct,getTotalCartAmount,all_product,cartitems,addtocart,removefromCart};
    
    return (
        <ShopContext.Provider value={Contextvalue}>
            {props.children}
        </ShopContext.Provider>
    );
}

