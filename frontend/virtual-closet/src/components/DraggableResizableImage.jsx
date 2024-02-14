import React, { useState } from 'react';
import { Rnd } from 'react-rnd';
import './DraggableResizableImage.css'; 

function DraggableResizableImage({ src, alt, initialPosition, initialSize, onResize, onDragStop }) {
  const [dimensions, setDimensions] = useState(initialSize || { width: 200, height: 200 });
  const [position, setPosition] = useState(initialPosition);

  const handleResize = (e, direction, ref, delta, position) => {
    const newDimensions = {
      width: ref.offsetWidth,
      height: ref.offsetHeight,
    };
    setDimensions(newDimensions);
    console.log(`New size:`, newDimensions);

    // Call the onResize callback with the new dimensions
    onResize(newDimensions);
  };

  const handleDragStop = (e, d) => {
    const newPosition = { x: d.x, y: d.y };
    setPosition(newPosition);
    console.log(`New position:`, newPosition);

    // Call the onDragStop callback with the new position
    onDragStop(newPosition);
  };


  return (
    <Rnd
      size={dimensions}
      className="resizable-container"
      position={position}
      onResizeStop={handleResize}
      onDragStop={handleDragStop}
      bounds="parent"
      enableResizing={{
        top:true, right:true, bottom:true, left:true,
        topRight:true, bottomRight:true, bottomLeft:true, topLeft:true
      }}
    >
      <button className="close-button">X</button>
      <img className="resizable-image" src={src} alt={alt} />
    </Rnd>
  );
}

export default DraggableResizableImage;