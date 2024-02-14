import React, { useState, useContext, useEffect, useRef } from 'react';
import { useDrop } from 'react-dnd';
import DraggableResizableImage from './DraggableResizableImage';
import "./ImageGrid.css";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ImageContext } from './ImageProvider';
import StaticImage from './StaticImage';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error(error);
  }

  render() {
    if (this.state.hasError) {
      return <div>Something went wrong.</div>;
    }

    return this.props.children;
  }
}



function ImageGrid( {selectedDate} ) {
  const { selectedImages, setSelectedImages } = useContext(ImageContext);
  console.log('Selected date in ImageGrid:', selectedDate);
  const selectedImagesRef = useRef(selectedImages);

  useEffect(() => {
    const handleResize = () => {
      // Adjust the positions of the outfits based on the new size of the image grid
      const imageGrid = document.querySelector('.image-grid-container');
      const newWidth = imageGrid.offsetWidth;
      const newHeight = imageGrid.offsetHeight;
  
      setSelectedImages(prevImages => prevImages.map((image) => {
        const newPosition = {
          x: (image.position.x / oldWidth) * newWidth,
          y: (image.position.y / oldHeight) * newHeight,
        };
        return { ...image, position: newPosition };
      }));
  
      oldWidth = newWidth;
      oldHeight = newHeight;
    };
  
    let oldWidth = window.innerWidth;
    let oldHeight = window.innerHeight;
  
    window.addEventListener('resize', handleResize);
  
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // useEffect(() => {
  //   console.log(selectedImages.map(image => image.position));
  // }, [selectedImages]);

  useEffect(() => {
    const preventContextMenu = (event) => {
      event.preventDefault();
    };
  
    document.addEventListener('contextmenu', preventContextMenu);
  
    return () => {
      document.removeEventListener('contextmenu', preventContextMenu);
    };
  }, []);

  useEffect(() => {
    selectedImagesRef.current = selectedImages; // Update the reference whenever selectedImages changes
  }, [selectedImages]);

  console.log(selectedImages.map(image => image.position));

  const convertDateForDB = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // JavaScript months are 0-indexed.
    const day = date.getDate();
  
    // Pad month and day with leading zeros if necessary.
    const paddedMonth = month < 10 ? `0${month}` : month;
    const paddedDay = day < 10 ? `0${day}` : day;
  
    return `${year}-${paddedMonth}-${paddedDay}`;
  };

  useEffect(() => {
    if (!selectedDate) {
      return;
    }
  
    const dbDate = convertDateForDB(selectedDate);
  
    fetch(`http://localhost:5555/api/get-outfit?date=${dbDate}`)
      .then(response => response.json())
      .then(data => {
        if (!Array.isArray(data) || data.length === 0) {
          setSelectedImages([]);
        } else {
          const images = data.map(garment => ({
            id: garment.id,
            garment_image: garment.garment_image,
            alt: garment.name,
            position: { 
              x: garment.x_position !== undefined ? garment.x_position : 0, 
              y: garment.y_position !== undefined ? garment.y_position : 0 
            },
            size: {
              width: garment.width !== undefined ? garment.width : 200,
              height: garment.height !== undefined ? garment.height : 200
            }
          }));
          setSelectedImages(images);
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        setSelectedImages([]);
      });
  }, [selectedDate]);

  const navigate = useNavigate();

  const saveOutfit = () => {
    console.log("SAVED")
  
    if (!selectedDate) {
      console.log('No date selected');
      return;
    }
    console.log('Type of selectedDate:', typeof selectedDate);
    const dbDate = convertDateForDB(selectedDate);
    console.log('Converted date:', dbDate);
    const garmentIds = selectedImagesRef.current.map(image => image.id); // Use the reference here
  
    const garments = selectedImagesRef.current.map(image => ({ // And here
      id: image.id,
      x_position: image.position.x,
      y_position: image.position.y,
      width: image.size.width,
      height: image.size.height
    }));
  
    console.log(JSON.stringify({ garments, date: dbDate }));
  
    // Check if the outfit already exists
    fetch(`http://localhost:5555/api/get-outfit?date=${dbDate}`)
      .then(response => response.json())
      .then(data => {
        let method = 'POST'; // Default to creating a new outfit
        if (Array.isArray(data) && data.length > 0) {
          method = 'PATCH'; // If an outfit already exists, update it
        }
  
        // Send the request to save the outfit
        fetch('http://localhost:5555/api/save-outfit', {
          method: method,
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ garments, date: dbDate }),
        })
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then(data => {
          console.log('Success:', data);
          navigate("/");
        })
        .catch((error) => {
          console.error('Error:', error);
        });
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

const handleDragStop = (id, newPosition) => {
  setSelectedImages(prevImages => prevImages.map((image) => {
    if (image.id === id) {
      return { ...image, position: { x: newPosition.x, y: newPosition.y } };
    }
    return image;
  }));
};

const handleResize = (id, newSize) => {
  setSelectedImages(prevImages => prevImages.map((image) => {
    if (image.id === id) {
      return { ...image, size: { width: newSize.width, height: newSize.height } };
    }
    return image;
  }));
};

  const handleDrop = (item, monitor) => {
    // Check if the drop target is valid
    if (!monitor.didDrop()) {
      return;
    }
  
    const delta = monitor.getDifferenceFromInitialOffset();
    const { x, y } = item.position;
    const newPosition = {
      x: x + delta.x,
      y: y + delta.y,
    };
  
    setSelectedImages(prevImages => prevImages.map((image) => {
      if (image.id === item.id) {
        console.log('New position:', newPosition);
        return { ...image, position: newPosition };
      }
      return image;
    }));
    // Save the updatedImages to the backend here
    console.log(selectedImages.map(image => image.position));
  };

  const [, drop] = useDrop({
    accept: 'image',
    drop: handleDrop,
  });

  const location = useLocation();

  return (
    // <div className='image-grid-container'>
    <ErrorBoundary>
      <div ref={drop} className='image-grid-container'>
        {location.pathname === "/" && selectedImages.length === 0 && <Link to="/image-grid" className='add-image'>Add an outfit</Link>}
        {selectedImages.map((image) => {
  if (location.pathname === "/image-grid") {
    return (
      <DraggableResizableImage
        src={image.garment_image}
        alt={image.alt}
        initialPosition={image.position}
        initialSize={image.size}
        onResize={(newDimensions) => handleResize(image.id, newDimensions)}
        onDragStop={(newPosition) => handleDragStop(image.id, newPosition)}
      />
    );
  } else {
    return (
      <StaticImage
        key={image.id}
        src={image.garment_image}
        alt={image.alt}
        position={image.position}
        size={image.size}
      />
    );
  }
})}
      </div>
      {location.pathname === "/image-grid" && <button onClick={saveOutfit}>Save Outfit</button>}
    </ErrorBoundary>
    // </div>
  );
}

export default ImageGrid;