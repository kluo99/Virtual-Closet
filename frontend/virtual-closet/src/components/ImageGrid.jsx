import React, { useState } from 'react';
import { useDrop } from 'react-dnd';
import DraggableResizableImage from './DraggableResizableImage';
import "./ImageGrid.css";
import { Link, useLocation } from 'react-router-dom';

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
  const [images, setImages] = useState([
    { id: 1, src: './acne.JPG', alt: 'Image 1', position: { x: 0, y: 0 } },
    { id: 2, src: 'image2.png', alt: 'Image 2', position: { x: 0, y: 0 } },
    // Add more images as needed
  ]);

  const handleDrop = (item, monitor) => {
    const delta = monitor.getDifferenceFromInitialOffset();
    const { x, y } = item.position;
    const newPosition = {
      x: x + delta.x,
      y: y + delta.y,
    };
    const updatedImages = images.map((image) => {
      if (image.id === item.id) {
        return { ...image, position: newPosition };
      }
      return image;
    });
    setImages(updatedImages);
    // Save the updatedImages to the backend here
  };

  const [, drop] = useDrop({
    accept: 'image',
    drop: handleDrop,
  });

  const location = useLocation();

  return (
    <div className='image-grid-container'>
      <ErrorBoundary>
        <div ref={drop} style={{ width: '100%', height: '100%', position: 'relative' }}>
          {location.pathname === "/" && <Link to="/image-grid" className='add-image'>Add an outfit</Link>}
          {images.map((image) => (
            <DraggableResizableImage
              key={image.id}
              id={image.id}
              src={image.src}
              alt={image.alt}
              position={image.position}
            />
          ))}
        </div>
      </ErrorBoundary>
    </div>
  );
}

export default ImageGrid;