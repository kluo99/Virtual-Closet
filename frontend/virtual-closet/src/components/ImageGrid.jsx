import React, { useState, useContext } from 'react';
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

function ImageGrid() {
  const { selectedImages, setSelectedImages } = useContext(ImageContext);

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
          {location.pathname === "/" && <Link to="/image-grid" className='add-image'>Add an outfit</Link>}
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
        {location.pathname === "/image-grid" && <button>Save Outfit</button>}
      </ErrorBoundary>
    // </div>
  );
}

export default ImageGrid;