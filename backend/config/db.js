// import mongoose from "mongoose";

// export const  connectDB = async () =>{

//     await mongoose.connect('mongodb+srv://BHAVISH:bhavish12345bhavi@cluster0.jnidxvn.mongodb.net/candle_website').then(()=>console.log("DB Connected"));
   
// }


// // add your mongoDB connection string above.
// // Do not use '@' symbol in your databse user's password else it will show an error.

import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ DB Connected");
  } catch (err) {
    console.error("❌ DB Connection Error:", err);
  }
};
