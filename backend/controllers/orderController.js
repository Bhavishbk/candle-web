// import orderModel from "../models/orderModel.js";
// import userModel from "../models/userModel.js"
// import Stripe from "stripe";
// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// //config variables
// const currency = "inr";
// const deliveryCharge = 50;
// const frontend_URL = 'http://localhost:5173';

// // Placing User Order for Frontend using stripe
// const placeOrder = async (req, res) => {

//     try {
//         const newOrder = new orderModel({
//             userId: req.body.userId,
//             items: req.body.items,
//             amount: req.body.amount,
//             address: req.body.address,
//         })
//         await newOrder.save();
//         await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

//         const line_items = req.body.items.map((item) => ({
//             price_data: {
//                 currency: currency,
//                 product_data: {
//                     name: item.name
//                 },
//                 unit_amount: item.price * 100 
//             },
//             quantity: item.quantity
//         }))

//         line_items.push({
//             price_data: {
//                 currency: currency,
//                 product_data: {
//                     name: "Delivery Charge"
//                 },
//                 unit_amount: deliveryCharge * 100
//             },
//             quantity: 1
//         })

//         const session = await stripe.checkout.sessions.create({
//             success_url: `${frontend_URL}/verify?success=true&orderId=${newOrder._id}`,
//             cancel_url: `${frontend_URL}/verify?success=false&orderId=${newOrder._id}`,
//             line_items: line_items,
//             mode: 'payment',
//         });

//         res.json({ success: true, session_url: session.url });

//     } catch (error) {
//         console.log(error);
//         res.json({ success: false, message: "Error" })
//     }
// }

// // Placing User Order for Frontend using stripe
// const placeOrderCod = async (req, res) => {

//     try {
//         const newOrder = new orderModel({
//             userId: req.body.userId,
//             items: req.body.items,
//             amount: req.body.amount,
//             address: req.body.address,
//             payment: true,
//         })
//         await newOrder.save();
//         await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

//         res.json({ success: true, message: "Order Placed" });

//     } catch (error) {
//         console.log(error);
//         res.json({ success: false, message: "Error" })
//     }
// }

// // Listing Order for Admin panel
// const listOrders = async (req, res) => {
//     try {
//         const orders = await orderModel.find({});
//         res.json({ success: true, data: orders })
//     } catch (error) {
//         console.log(error);
//         res.json({ success: false, message: "Error" })
//     }
// }

// // User Orders for Frontend
// const userOrders = async (req, res) => {
//     try {
//         const orders = await orderModel.find({ userId: req.body.userId });
//         res.json({ success: true, data: orders })
//     } catch (error) {
//         console.log(error);
//         res.json({ success: false, message: "Error" })
//     }
// }

// const updateStatus = async (req, res) => {
//     console.log(req.body);
//     try {
//         await orderModel.findByIdAndUpdate(req.body.orderId, { status: req.body.status });
//         res.json({ success: true, message: "Status Updated" })
//     } catch (error) {
//         res.json({ success: false, message: "Error" })
//     }

// }

// const verifyOrder = async (req, res) => {
//     const { orderId, success } = req.body;
//     try {
//         if (success === "true") {
//             await orderModel.findByIdAndUpdate(orderId, { payment: true });
//             res.json({ success: true, message: "Paid" })
//         }
//         else {
//             await orderModel.findByIdAndDelete(orderId)
//             res.json({ success: false, message: "Not Paid" })
//         }
//     } catch (error) {
//         res.json({ success: false, message: "Not  Verified" })
//     }

// }

// export { placeOrder, listOrders, userOrders, updateStatus, verifyOrder, placeOrderCod }


import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";
import twilio from "twilio";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");
const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// config
const currency = "inr";
const deliveryCharge = 50; // change if needed
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

// helper: format address (handles object or string)
const formatAddress = (addr) => {
  if (!addr) return "Not provided";
  if (typeof addr === "string") return addr;
  const parts = [];
  if (addr.name) parts.push(addr.name);
  if (addr.street) parts.push(addr.street);
  if (addr.city) parts.push(addr.city);
  if (addr.state) parts.push(addr.state);
  if (addr.pincode) parts.push(addr.pincode);
  let result = parts.join(", ");
  if (addr.landmark) result += ` (near ${addr.landmark})`;
  if (addr.phone) result += ` | ${addr.phone}`;
  return result;
};

// send WhatsApp message via Twilio to admin and optionally to customer
const sendWhatsAppMessage = async (order, { toAdmin = true, toCustomer = false } = {}) => {
  try {
    // Fetch user data for fallback name
    let userName = "";
    if (order.userId) {
      const user = await userModel.findById(order.userId).lean();
      userName = user?.name || "";
    }

    const customerName = order.address?.name || order.customerName || userName || "—";

    const itemsList = (order.items || []).map(it => {
      const subtotal = (it.price || 0) * (it.quantity || 0);
      return `• ${it.name} x${it.quantity} — ₹${it.price} each (₹${subtotal})`;
    }).join("\n");

    const addressStr = formatAddress(order.address);
    const paymentMethod = order.paymentMethod === "cod" || order.payment ? "Cash on Delivery" : "Cash on delivery (pending)";

    const messageBody = 
`*New Order Received*
Order ID: ${order._id}
──────────────────
👤 Name: ${customerName}
📞 Phone: ${order.address?.phone || "—"}
🏠 Address: ${addressStr}

🛒 Items:
${itemsList}

💳 Payment method: ${paymentMethod}
💰 Total: ₹${order.amount || 0}
Status: "Placed"
──────────────────
`;

    // recipients
    const recipients = [];
    if (toAdmin && process.env.WHATSAPP_TO) {
      let admin = process.env.WHATSAPP_TO;
      if (!admin.startsWith("whatsapp:")) {
        admin = admin.startsWith("+") ? `whatsapp:${admin}` : `whatsapp:+${admin}`;
      }
      recipients.push(admin);
    }
    if (toCustomer && order.address?.phone) {
      let cust = order.address.phone;
      cust = cust.startsWith("+") ? `whatsapp:${cust}` : `whatsapp:+${cust}`;
      recipients.push(cust);
    }

    if (recipients.length === 0) {
      console.log("No WhatsApp recipients set for order", order._id);
      return;
    }

    await Promise.all(
      recipients.map(to => twilioClient.messages.create({
        from: process.env.TWILIO_WHATSAPP_NUMBER,
        to,
        body: messageBody
      }))
    );

    console.log("WhatsApp message sent for order", order._id);
  } catch (err) {
    console.error("Error sending WhatsApp message:", err);
  }
};


// Place order (online payment -> creates Stripe Checkout session)
export const placeOrder = async (req, res) => {
  try {
    const { userId, items, amount, address } = req.body;

    const newOrder = new orderModel({
      userId,
      items,
      amount,
      address,
      payment: false,
      paymentMethod: "offline"
    });
    await newOrder.save();

    // clear user's cart (optional)
    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    // send WhatsApp to admin immediately about new order (payment pending)
    await sendWhatsAppMessage(newOrder, { toAdmin: true, toCustomer: false });

    // build stripe line_items
    const line_items = (items || []).map(item => ({
      price_data: {
        currency,
        product_data: { name: item.name },
        unit_amount: Math.round(item.price * 100)
      },
      quantity: item.quantity
    }));

    // delivery
    line_items.push({
      price_data: {
        currency,
        product_data: { name: "Delivery Charge" },
        unit_amount: Math.round(deliveryCharge * 100)
      },
      quantity: 1
    });

    const session = await stripe.checkout.sessions.create({
      success_url: `${FRONTEND_URL}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${FRONTEND_URL}/verify?success=false&orderId=${newOrder._id}`,
      line_items,
      mode: "payment",
    });

    res.json({ success: true, session_url: session.url });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error creating order" });
  }
};

// Place order - Cash on Delivery
export const placeOrderCod = async (req, res) => {
  try {
    const { userId, items, amount, address } = req.body;

    const newOrder = new orderModel({
      userId,
      items,
      amount,
      address,
      payment: false,           // COD: still consider payment false until delivered/collected
      paymentMethod: "cod"
    });
    await newOrder.save();
    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    // send WhatsApp to admin and optionally to customer
    await sendWhatsAppMessage(newOrder, { toAdmin: true, toCustomer: true });

    res.json({ success: true, message: "Order Placed (COD)", orderId: newOrder._id });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error placing COD order" });
  }
};

// verifyOrder: after redirect from front-end or after Stripe webhook
export const verifyOrder = async (req, res) => {
  // front-end might call with { orderId, success } where success is "true"/"false" or boolean
  try {
    const { orderId, success } = req.body;
    const isSuccess = (success === true || success === "true");

    if (isSuccess) {
      await orderModel.findByIdAndUpdate(orderId, { payment: true, status: "Paid" });
      const order = await orderModel.findById(orderId);

      // notify both admin and customer that payment succeeded
      await sendWhatsAppMessage(order, { toAdmin: true, toCustomer: true });

      res.json({ success: true, message: "Payment recorded" });
    } else {
      // payment failed or canceled -> delete or mark as canceled
      await orderModel.findByIdAndDelete(orderId);
      // notify admin of canceled/unpaid order (optional)
      // we build a simple message:
      try {
        await twilioClient.messages.create({
          from: process.env.TWILIO_WHATSAPP_NUMBER,
          to: process.env.WHATSAPP_TO.startsWith("whatsapp:") ? process.env.WHATSAPP_TO : `whatsapp:${process.env.WHATSAPP_TO}`,
          body: `Order ${orderId} payment was not completed / was cancelled.`
        });
      } catch (e) {
        console.log("Could not send cancellation WhatsApp to admin:", e);
      }

      res.json({ success: false, message: "Payment not completed; order removed" });
    }
  } catch (error) {
    console.error("verifyOrder error:", error);
    res.json({ success: false, message: "Verification failed" });
  }
};

// listOrders / userOrders / updateStatus as before
export const listOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({});
    res.json({ success: true, data: orders });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error listing orders" });
  }
};

export const userOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({ userId: req.body.userId });
    res.json({ success: true, data: orders });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error fetching user orders" });
  }
};

export const updateStatus = async (req, res) => {
  try {
    await orderModel.findByIdAndUpdate(req.body.orderId, { status: req.body.status });
    const order = await orderModel.findById(req.body.orderId);
    // notify customer on status update (optional)
    if (order && order.address?.phone) {
      await sendWhatsAppMessage(order, { toAdmin: false, toCustomer: true });
    }
    res.json({ success: true, message: "Status Updated" });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error updating status" });
  }
};
