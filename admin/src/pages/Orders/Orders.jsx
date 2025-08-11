// import React, { useEffect, useState } from 'react'
// import './Orders.css'
// import { toast } from 'react-toastify';
// import axios from 'axios';
// import { assets, url, currency } from '../../assets/assets';

// const Order = () => {

//   const [orders, setOrders] = useState([]);

//   const fetchAllOrders = async () => {
//     const response = await axios.get(`${url}/api/order/list`)
//     if (response.data.success) {
//       setOrders(response.data.data.reverse());
//     }
//     else {
//       toast.error("Error")
//     }
//   }

//   const statusHandler = async (event, orderId) => {
//     console.log(event, orderId);
//     const response = await axios.post(`${url}/api/order/status`, {
//       orderId,
//       status: event.target.value
//     })
//     if (response.data.success) {
//       await fetchAllOrders();
//     }
//   }


//   useEffect(() => {
//     fetchAllOrders();
//   }, [])

//   return (
//     <div className='order add'>
//       <h3>Order Page</h3>
//       <div className="order-list">
//         {orders.map((order, index) => (
//           <div key={index} className='order-item'>
//             <img src={assets.parcel_icon} alt="" />
//             <div>
//               <p className='order-item-food'>
//                 {order.items.map((item, index) => {
//                   if (index === order.items.length - 1) {
//                     return item.name + " x " + item.quantity
//                   }
//                   else {
//                     return item.name + " x " + item.quantity + ", "
//                   }
//                 })}
//               </p>
//               <p className='order-item-name'>{order.address.firstName + " " + order.address.lastName}</p>
//               <div className='order-item-address'>
//                 <p>{order.address.street + ","}</p>
//                 <p>{order.address.city + ", " + order.address.state + ", " + order.address.country + ", " + order.address.zipcode}</p>
//               </div>
//               <p className='order-item-phone'>{order.address.phone}</p>
//             </div>
//             <p>Items : {order.items.length}</p>
//             <p>{currency}{order.amount}</p>
//             <select onChange={(e) => statusHandler(e, order._id)} value={order.status} name="" id="">
//               <option value="Food Processing"> Processing</option>
//               <option value="Out for delivery">Out for delivery</option>
//               <option value="Delivered">Delivered</option>
//             </select>
//           </div>
//         ))}
//       </div>
//     </div>
//   )
// }

// export default Order
import React, { useEffect, useState } from 'react';
import './Orders.css';
import { toast } from 'react-toastify';
import axios from 'axios';
import { assets, url, currency } from '../../assets/assets';

const Order = () => {
  const [orders, setOrders] = useState([]);

  const fetchAllOrders = async () => {
    try {
      const response = await axios.get(`${url}/api/order/list`);
      if (response.data.success) {
        setOrders(response.data.data.reverse());
      } else {
        toast.error('Failed to fetch orders');
      }
    } catch (err) {
      toast.error('Server Error');
    }
  };

  const statusHandler = async (event, orderId) => {
    try {
      const response = await axios.post(`${url}/api/order/status`, {
        orderId,
        status: event.target.value,
      });
      if (response.data.success) {
        fetchAllOrders();
      }
    } catch (err) {
      toast.error('Status update failed');
    }
  };

  const handleRemove = async (orderId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this order?');
    if (!confirmDelete) return;

    try {
      const res = await axios.delete(`${url}/api/order/${orderId}`);
      if (res.data.success) {
        toast.success('Order deleted');
        fetchAllOrders();
      } else {
        toast.error('Delete failed');
      }
    } catch (err) {
      toast.error('Error deleting order');
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, []);

  return (
    <div className="order add">
      <h3>Order Page</h3>
      <div className="order-list">
        {orders.map((order, index) => (
          <div key={index} className="order-item">
            <img src={assets.parcel_icon} alt="" />
            <div>
              <p className="order-item-food">
                {order.items.map((item, i) => `${item.name} x ${item.quantity}${i < order.items.length - 1 ? ', ' : ''}`)}
              </p>
              <p className="order-item-name">{order.address.firstName} {order.address.lastName}</p>
              <div className="order-item-address">
                <p>{order.address.street},</p>
                <p>{order.address.city}, {order.address.state}, {order.address.country}, {order.address.zipcode}</p>
              </div>
              <p className="order-item-phone">{order.address.phone}</p>
            </div>
            <p>Items: {order.items.length}</p>
            <p>{currency}{order.amount}</p>
            <select onChange={(e) => statusHandler(e, order._id)} value={order.status}>
              <option value="Processing">Processing</option>
              <option value="Out for delivery">Out for delivery</option>
              <option value="Delivered">Delivered</option>
            </select>
            {/* <button className="remove-button" onClick={() => handleRemove(order._id)}>Remove</button> */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Order;
