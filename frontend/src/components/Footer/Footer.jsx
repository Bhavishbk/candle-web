// import React from 'react'
// import './Footer.css'
// import { assets } from '../../assets/assets'

// const Footer = () => {
//   return (
//     <div className='footer' id='footer'>
//       <div className="footer-content">
//         <div className="footer-content-left">
//             {/* <img src={assets.logo} alt="" /> */}
//             <p>Illuminate your moments with handcrafted candles made to inspire calm, warmth, and beauty.
// Crafted with care, designed to elevate every space.</p>
// <div className="footer-social-icons">
//   <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer">
//     <img src={assets.whatsapp_icon} alt="WhatsApp" />
//   </a>
//   <a href="https://www.instagram.com/the_creative_crafter_000?igsh=bnB4bGwwODI5a3p2" target="_blank" rel="noopener noreferrer">
//     <img src={assets.instagram_icon} alt="Instagram" />
//   </a>
//   <a href="+tel:7348974194">
//     <img src={assets.call_icon} alt="Call" />
//   </a>
// </div>

//         </div>
//         <div className="footer-content-center">
//             <h2>COMPANY</h2>
//             <ul>
//                 <li>Home</li>
//                 <li>About us</li>
//                 <li>Delivery</li>
//                 <li>Privacy policy</li>
//             </ul>
//         </div>
//         <div className="footer-content-right">
//             <h2>GET IN TOUCH</h2>
//             <ul>
//                 <li> 7348974194, 7353439058</li>
//                 <li>manalifernandes521.com</li>
//             </ul>
//         </div>
//       </div>
//       <hr />
//       <p className="footer-copyright">Copyright 2024 © creativecrafter.com - All Right Reserved.</p>
//     </div>
//   )
// }

// export default Footer
import React from 'react';
import './Footer.css';
import { FaWhatsapp, FaInstagram, FaPhone } from 'react-icons/fa';

const Footer = () => {
  return (
    <div className='footer' id='footer'>
      <div className="footer-content">
        <div className="footer-content-left">
          <p>
            Illuminate your moments with handcrafted candles made to inspire calm, warmth, and beauty.
            Crafted with care, designed to elevate every space.
          </p>

          <div className="footer-social-icons">
            {/* WhatsApp */}
            <a
              href="https://wa.me/919876543210"
              target="_blank"
              rel="noopener noreferrer"
              className="icon-link"
            >
              <FaWhatsapp size={28} color="#25D366" />
            </a>

            {/* Instagram */}
            <a
              href="https://www.instagram.com/the_creative_crafter_000?igsh=bnB4bGwwODI5a3p2"
              target="_blank"
              rel="noopener noreferrer"
              className="icon-link"
            >
              <FaInstagram size={28} color="#E4405F" />
            </a>

            {/* Call */}
            <a href="tel:7348974194" className="icon-link">
              <FaPhone size={28} color="#007BFF" />
            </a>
          </div>
        </div>

        <div className="footer-content-center">
          <h2>COMPANY</h2>
          <ul>
            <li>Home</li>
            <li>About us</li>
            <li>Delivery</li>
            <li>Privacy policy</li>
          </ul>
        </div>

        <div className="footer-content-right">
          <h2>GET IN TOUCH</h2>
          <ul>
            <li><a href="tel:7348974194">7348974194</a>, <a href="tel:7353439058">7353439058</a></li>
            <li><a href="mailto:manalifernandes521.com">manalifernandes521.com</a></li>
          </ul>
        </div>
      </div>
      <hr />
      <p className="footer-copyright">
        Copyright 2024 © creativecrafter.com - All Right Reserved.
      </p>
    </div>
  );
};

export default Footer;
