import React, { useState, useContext, useEffect } from 'react';
import { useDrop } from 'react-dnd';
import DraggableResizableImage from './DraggableResizableImage';
import "./ImageGrid.css";
import { Link, useLocation } from 'react-router-dom';
import { ImageContext } from './ImageProvider';

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
          // If no outfit data is returned, clear the selected images
          setSelectedImages([]);
        } else {
          // Convert the garments to the format expected by setSelectedImages
          const images = data.map(garment => ({
            id: garment.id,
            garment_image: garment.garment_image, // replace with the actual image url property
            alt: garment.name, // replace with the actual alt text property
            position: { x: 0, y: 0 } // replace with actual position if available
          }));
          setSelectedImages(images);
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        // Clear the selected images in case of an error
        setSelectedImages([]);
      });
  }, [selectedDate]);

  const saveOutfit = () => {
    console.log('selectedDate in saveOutfit:', selectedDate);
  
    if (!selectedDate) {
      console.log('No date selected');
      return;
    }
    console.log('Type of selectedDate:', typeof selectedDate);
    const dbDate = convertDateForDB(selectedDate);
    console.log('Converted date:', dbDate);
    const garmentIds = selectedImages.map(image => image.id);

    fetch('http://localhost:5555/api/save-outfit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ garments: garmentIds, date: dbDate }),
    })
    .then(response => response.json())
    .then(data => {
      console.log('Success:', data);
    })
    .catch((error) => {
      console.error('Error:', error);
    });
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
      return { ...image, position: newPosition };
    }
    return image;
  }));
  // Save the updatedImages to the backend here
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
        {selectedImages.map((image) => (
          <DraggableResizableImage
            key={image.id}
            id={image.id}
            src={image.garment_image}
            alt={image.alt}
            position={image.position}
          />
        ))}
      </div>
      {location.pathname === "/image-grid" && <button onClick={saveOutfit}>Save Outfit</button>}
    </ErrorBoundary>
    // </div>
  );
}

export default ImageGrid;