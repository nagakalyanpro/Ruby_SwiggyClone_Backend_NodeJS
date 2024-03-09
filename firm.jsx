import React, { useEffect, useState } from 'react';
import { API_URL } from '../utils/api';

const ChainItems = () => {
  const [firmData, setFirmData] = useState([]);
  const [scrollPosition, setScrollPosition] = useState(0);

  const firmDetails = async () => {
    try {
      const response = await fetch(`${API_URL}/firm/all-firms`);
      const data = await response.json();
      if (data && Array.isArray(data.firms)) {
        setFirmData(data.firms);
      } else {
        console.error('Invalid data structure:', data);
        alert('Error in fetching data');
      }
    } catch (error) {
      console.log(error);
      alert('Error in fetching data');
    }
  };

  useEffect(() => {
    firmDetails();
  }, []);

  const handleScroll = (direction) => {
    const gallery = document.getElementById('chainGallery');
    const scrollAmount = 300; // You can adjust the scroll amount

    if (direction === 'left') {
      gallery.scrollTo({
        left: gallery.scrollLeft - scrollAmount,
        behavior: 'smooth',
      });
    } else if (direction === 'right') {
      gallery.scrollTo({
        left: gallery.scrollLeft + scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section className='chainSection'>
      <div className="chainBox">
        <h2>Top restaurant chains in Hyderabad</h2>
        <div className="scrollButtons">
          <button onClick={() => handleScroll('left')} disabled={scrollPosition === 0}>
            &lt; Scroll Left
          </button>
          <button onClick={() => handleScroll('right')}>
            Scroll Right &gt;
          </button>
        </div>
        <div
          id="chainGallery"
          className="chainGallery"
          onScroll={(e) => setScrollPosition(e.target.scrollLeft)}
        >
          {firmData.map((item) => (
            <>
            <div key={item._id} className='chainImgBox'>
              {item.image && <img src={`${API_URL}/uploads/${item.image}`} alt="" />}
             <div className='chainOffer'> {item.offer}</div>
            </div>
           
            </>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ChainItems;


