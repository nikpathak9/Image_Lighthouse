import React, { useState, useEffect, useCallback, useMemo } from "react";
import { throttle } from "lodash";
import "./App.css";

const ImageContainer = React.memo(
  ({ item, index, currentIndex, openModal }) => (
    <div
      className='image-container'
      style={{
        border: currentIndex === index ? "5px solid white" : "none",
      }}
      onClick={() => openModal(index)}
    >
      <img src={item.thumbnail} alt={`Gallery ${item.id}`} loading='lazy' />
      <div className='image-overlay'>Click for lightbox view</div>
    </div>
  )
);

ImageContainer.displayName = "ImageContainer";

const App = () => {
  const [currentIndex, setCurrentIndex] = useState(null);
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  const images = useMemo(
    () => [
      {
        id: "img1",
        thumbnail:
          "https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?w=300",
        full: "https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?w=800",
      },
      {
        id: "img2",
        thumbnail:
          "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=300",
        full: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800",
      },
      {
        id: "img3",
        thumbnail:
          "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=300",
        full: "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=800",
      },
      {
        id: "img4",
        thumbnail:
          "https://images.unsplash.com/photo-1495567720989-cebdbdd97913?w=300",
        full: "https://images.unsplash.com/photo-1495567720989-cebdbdd97913?w=800",
      },
      {
        id: "img5",
        thumbnail:
          "https://images.unsplash.com/photo-1516117172878-fd2c41f4a759?w=300",
        full: "https://images.unsplash.com/photo-1516117172878-fd2c41f4a759?w=800",
      },
      {
        id: "img6",
        thumbnail:
          "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=300",
        full: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800",
      },
      {
        id: "img7",
        thumbnail:
          "https://images.unsplash.com/photo-1709917241494-48fdf74f2640?w=300",
        full: "https://images.unsplash.com/photo-1709917241494-48fdf74f2640?w=800",
      },
      {
        id: "img8",
        thumbnail:
          "https://images.unsplash.com/photo-1494526585095-c41746248156?w=300",
        full: "https://images.unsplash.com/photo-1494526585095-c41746248156?w=800",
      },
      {
        id: "img9",
        thumbnail:
          "https://images.unsplash.com/photo-1500534623283-312aade485b7?w=300",
        full: "https://images.unsplash.com/photo-1500534623283-312aade485b7?w=800",
      },
      {
        id: "img10",
        thumbnail:
          "https://images.unsplash.com/photo-1482192596544-9eb780fc7f66?w=300",
        full: "https://images.unsplash.com/photo-1482192596544-9eb780fc7f66?w=800",
      },
      {
        id: "img11",
        thumbnail:
          "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=300",
        full: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800",
      },
      {
        id: "img12",
        thumbnail:
          "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=300",
        full: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800",
      },
      {
        id: "img13",
        thumbnail:
          "https://images.unsplash.com/photo-1534081333815-ae5019106622?w=300",
        full: "https://images.unsplash.com/photo-1534081333815-ae5019106622?w=800",
      },
      {
        id: "img14",
        thumbnail:
          "https://images.unsplash.com/photo-1586810724476-c294fb7ac01b?w=300",
        full: "https://images.unsplash.com/photo-1586810724476-c294fb7ac01b?w=800",
      },
      {
        id: "img15",
        thumbnail:
          "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=300",
        full: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=800",
      },
    ],
    []
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 695px)");
    setIsSmallScreen(mediaQuery.matches);

    let timeoutId;
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setIsSmallScreen(mediaQuery.matches);
      }, 100);
    };

    mediaQuery.addEventListener("change", handleResize);
    return () => {
      mediaQuery.removeEventListener("change", handleResize);
      clearTimeout(timeoutId);
    };
  }, []);

  useEffect(() => {
    if (currentIndex !== null) {
      const preloadImages = [
        images[currentIndex].full,
        images[(currentIndex + 1) % images.length].full,
        images[(currentIndex - 1 + images.length) % images.length].full,
      ];
      preloadImages.forEach((src) => {
        const img = new Image();
        img.src = src;
      });
    }
  }, [currentIndex, images]);

  const openModal = useCallback((index) => {
    setCurrentIndex(index);
  }, []);

  const closeModal = useCallback(() => {
    setCurrentIndex(null);
  }, []);

  const handlePrev = useCallback(() => {
    throttle(() => {
      setCurrentIndex(
        (prevIndex) => (prevIndex - 1 + images.length) % images.length
      );
    }, 300)();
  }, [images.length]);

  const throttledNext = useMemo(
    () =>
      throttle(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
      }, 300),
    [images.length]
  );

  const handleNext = useCallback(() => {
    throttledNext();
  }, [throttledNext]);

  return (
    <div className='App'>
      <h1>Image Lightbox</h1>
      <div className='image-gallery'>
        {images.map((item, index) => (
          <ImageContainer
            key={item.id}
            item={item}
            index={index}
            currentIndex={currentIndex}
            openModal={openModal}
          />
        ))}
      </div>

      {currentIndex !== null && (
        <div className='modal'>
          <div className='modal-content'>
            {isSmallScreen ? (
              <>
                <div className='image-wrapper'>
                  <img
                    src={images[currentIndex].full}
                    alt={`Modal ${images[currentIndex].id}`}
                    loading='lazy'
                  />
                </div>
                <div className='nav-buttons'>
                  <button className='navBtn' onClick={handlePrev}>
                    Prev
                  </button>
                  <button className='navBtn' onClick={handleNext}>
                    Next
                  </button>
                  <button className='navBtn closeX' onClick={closeModal}>
                    Close
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className='close'>
                  <button className='closeBtn' onClick={closeModal}>
                    X
                  </button>
                </div>
                <button className='navBtn' onClick={handlePrev}>
                  Prev
                </button>
                <div className='image-wrapper'>
                  <img
                    src={images[currentIndex].full}
                    alt={`Modal ${images[currentIndex].id}`}
                    loading='lazy'
                  />
                </div>
                <button className='navBtn' onClick={handleNext}>
                  Next
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
