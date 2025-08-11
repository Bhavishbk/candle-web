// import React from 'react'
// import './AppDownload.css'
// import { assets } from '../../assets/assets'

// const AppDownload = () => {
//     return (
//         <div className='app-download' id='app-download'>
//             <p>For Better Experience Download <br />Tomato App</p>
//             <div className="app-download-platforms">
//                 <img src={assets.play_store} alt="" />
//                 <img src={assets.app_store} alt="" />
//             </div>
//         </div>
//     )
// }

// export default AppDownload
import React from 'react';
import './AppDownload.css';
import { Sparkles, Leaf, Star, RefreshCcw } from 'lucide-react';

const highlights = [
  {
    icon: <Sparkles className="icon yellow" />,
    title: 'Variety of Styles',
    desc: 'Choose from jars, tins, pillars, and more in multiple colors like red, white, and blue.',
  },
  {
    icon: <Leaf className="icon green" />,
    title: 'Natural Ingredients',
    desc: 'Made from soy wax and essential oils for a clean, long-lasting burn.',
  },
  {
    icon: <Star className="icon orange" />,
    title: 'Rated by Users',
    desc: 'Our candles are rated and reviewed by our happy customers.',
  },
  {
    icon: <RefreshCcw className="icon purple" />,
    title: 'Recently Viewed',
    desc: 'Easily find what you’ve loved before.',
  },
];

const reviews = [
  {
    name: "Vivian D'costa",
    rating: 5,
    comment: 'Absolutely love the fragrance and design! Will order again.',
  },
  {
    name: 'Ankit S.',
    rating: 4,
    comment: 'The lavender scent is so calming and lasts long!',
  },
];

const AppDownload = () => {
  return (
    <section className="app-section">
      <h2 className="app-title">Why You'll Love Our Candles 🕯️</h2>

      <div className="highlight-grid">
        {highlights.map((item, index) => (
          <div className="highlight-card" key={index}>
            <div className="icon-container">{item.icon}</div>
            <h3>{item.title}</h3>
            <p>{item.desc}</p>
          </div>
        ))}
      </div>

      <h3 className="review-title">What Our Customers Say ⭐</h3>
      <div className="review-grid">
        {reviews.map((review, index) => (
          <div className="review-card" key={index}>
            <p className="comment">"{review.comment}"</p>
            <div className="review-footer">
              <span className="review-name">- {review.name}</span>
              <span className="stars">
                {'⭐'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default AppDownload;
