import React, { useState } from 'react';
import { useDrop } from 'react-dnd';
import DraggableResizableImage from './DraggableResizableImage';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can log the error or send it to an error reporting service
    console.error(error);
  }

  render() {
    if (this.state.hasError) {
      // You can render a fallback UI when an error occurs
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

  return (
    <ErrorBoundary>
      <div ref={drop} style={{ width: '100%', height: '100%', position: 'relative' }}>
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
  );
}

export default ImageGrid;