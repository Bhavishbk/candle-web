// import React, { useContext } from 'react'
// import './Cart.css'
// import { StoreContext } from '../../Context/StoreContext'
// import { useNavigate } from 'react-router-dom';

// const Cart = () => {

//   const {cartItems, food_list, removeFromCart,getTotalCartAmount,url,currency,deliveryCharge} = useContext(StoreContext);
//   const navigate = useNavigate();

//   return (
//     <div className='cart'>
//       <div className="cart-items">
//         <div className="cart-items-title">
//           <p>Items</p> <p>Title</p> <p>Price</p> <p>Quantity</p> <p>Total</p> <p>Remove</p>
//         </div>
//         <br />
//         <hr />
//         {food_list.map((item, index) => {
//           if (cartItems[item._id]>0) {
//             return (<div key={index}>
//               <div className="cart-items-title cart-items-item">
//                 <img src={url+"/images/"+item.image} alt="" />
//                 <p>{item.name}</p>
//                 <p>{currency}{item.price}</p>
//                 <div>{cartItems[item._id]}</div>
//                 <p>{currency}{item.price*cartItems[item._id]}</p>
//                 <p className='cart-items-remove-icon' onClick={()=>removeFromCart(item._id)}>x</p>
//               </div>
//               <hr />
//             </div>)
//           }
//         })}
//       </div>
//       <div className="cart-bottom">
//         <div className="cart-total">
//           <h2>Cart Totals</h2>
//           <div>
//             <div className="cart-total-details"><p>Subtotal</p><p>{currency}{getTotalCartAmount()}</p></div>
//             <hr />
//             <div className="cart-total-details"><p>Delivery Fee</p><p>{currency}{getTotalCartAmount()===0?0:deliveryCharge}</p></div>
//             <hr />
//             <div className="cart-total-details"><b>Total</b><b>{currency}{getTotalCartAmount()===0?0:getTotalCartAmount()+deliveryCharge}</b></div>
//           </div>
//           <button onClick={()=>navigate('/order')}>PROCEED TO CHECKOUT</button>
//         </div>
//         <div className="cart-promocode">
//           <div>
//             <p>If you have a promo code, Enter it here</p>
//             <div className='cart-promocode-input'>
//               <input type="text" placeholder='promo code'/>
//               <button>Submit</button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default Cart
// import React, { useContext } from 'react';
// import './Cart.css';
// import { StoreContext } from '../../Context/StoreContext';
// import { useNavigate } from 'react-router-dom';

// const Cart = () => {
//   const {
//     cartItems,
//     food_list,
//     removeFromCart,
//     getTotalCartAmount,
//     url,
//     currency,
//     deliveryCharge
//   } = useContext(StoreContext);

//   const navigate = useNavigate();

//   return (
//     <div className='cart'>
//       <div className="cart-items">
//         <div className="cart-items-title">
//           <p>Items</p> <p>Title</p> <p>Price</p> <p>Quantity</p> <p>Total</p> <p>Remove</p>
//         </div>
//         <br />
//         <hr />
//         {food_list
//           .filter(item => cartItems?.[item._id] > 0)
//           .map((item, index) => (
//             <div key={index}>
//               <div className="cart-items-title cart-items-item">
//                 <img src={`${url}/images/${item.image}`} alt="" />
//                 <p>{item.name}</p>
//                 <p>{currency}{item.price}</p>
//                 <div>{cartItems[item._id]}</div>
//                 <p>{currency}{item.price * cartItems[item._id]}</p>
//                 <p className='cart-items-remove-icon' onClick={() => removeFromCart(item._id)}>x</p>
//               </div>
//               <hr />
//             </div>
//         ))}
//       </div>

//       <div className="cart-bottom">
//         <div className="cart-total">
//           <h2>Cart Totals</h2>
//           <div>
//             <div className="cart-total-details">
//               <p>Subtotal</p>
//               <p>{currency}{getTotalCartAmount()}</p>
//             </div>
//             <hr />
//             <div className="cart-total-details">
//               <p>Delivery Fee</p>
//               <p>{currency}{getTotalCartAmount() === 0 ? 0 : deliveryCharge}</p>
//             </div>
//             <hr />
//             <div className="cart-total-details">
//               <b>Total</b>
//               <b>{currency}{getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + deliveryCharge}</b>
//             </div>
//           </div>
//           <button onClick={() => navigate('/PlaceOrder')}>PROCEED TO CHECKOUT</button>
//         </div>

//         {/* <div className="cart-promocode">
//           <div>
//             <p>If you have a promo code, Enter it here</p>
//             <div className='cart-promocode-input'>
//               <input type="text" placeholder='promo code' />
//               <button>Submit</button>
//             </div>
//           </div>
//         </div> */}
//       </div>
//     </div>
//   );
// };

// export default Cart;
import React, { useContext } from 'react';
import './Cart.css';
import { StoreContext } from '../../Context/StoreContext';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const {
    cartItems,
    food_list,
    removeFromCart,
    getTotalCartAmount,
    url,
    currency,
    deliveryCharge, // default deliveryCharge = 50
    distance // ⬅️ assume this comes from context (or use a fixed value for now)
  } = useContext(StoreContext);

  const navigate = useNavigate();

  // Apply delivery charge only if distance > 50 km
  const appliedDeliveryFee = distance > 50 ? deliveryCharge : 0;
  const cartTotal = getTotalCartAmount();
  const finalTotal = cartTotal === 0 ? 0 : cartTotal + appliedDeliveryFee;

  // Filter items in cart
  const cartItemsWithData = food_list.filter(item => cartItems?.[item._id] > 0);

  return (
    <div className='cart'>
      <div className="cart-items">
        <div className="cart-items-title">
          <p>Items</p> <p>Title</p> <p>Price</p> <p>Quantity</p> <p>Total</p> <p>Remove</p>
        </div>
        <br />
        <hr />
        {cartItemsWithData.map((item, index) => (
          <div key={index}>
            <div className="cart-items-title cart-items-item">
              <img src={`${url}/images/${item.image}`} alt="" />
              <p>{item.name}</p>
              <p>{currency}{item.price}</p>
              <div>{cartItems[item._id]}</div>
              <p>{currency}{item.price * cartItems[item._id]}</p>
              <p className='cart-items-remove-icon' onClick={() => removeFromCart(item._id)}>x</p>
            </div>
            <hr />
          </div>
        ))}
      </div>

      <div className="cart-bottom">
        <div className="cart-total">
          <h2>Cart Totals</h2>
          <div>
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>{currency}{cartTotal}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Delivery Fee (Delivery is free! for distances under 50 km. An additional ₹50 is charged for distances exceeding 50 km)</p>
              <p>{currency}{appliedDeliveryFee} {distance <= 50 && <span style={{ color: 'green' }}>(Free under 50km)</span>}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <b>Total</b>
              <b>{currency}{finalTotal}</b>
            </div>
          </div>
          <button onClick={() => navigate('/order')} disabled={cartTotal === 0}>
            PROCEED TO CHECKOUT
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
