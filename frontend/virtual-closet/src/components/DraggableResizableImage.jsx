import React, { useState } from 'react';
import { Rnd } from 'react-rnd';
import './DraggableResizableImage.css'; // Import the CSS file

function DraggableResizableImage({ src, alt, position }) {
  const [dimensions, setDimensions] = useState({ width: 200, height: 200 });

  const handleResize = (e, direction, ref, delta, position) => {
    setDimensions({
      width: ref.offsetWidth,
      height: ref.offsetHeight,
    });
  };

  return (
    <Rnd
      className="resizable-container"
      size={dimensions}
      position={position}
      onResizeStop={handleResize}
      bounds="parent"
      enableResizing={{
        top:true, right:true, bottom:true, left:true,
        topRight:true, bottomRight:true, bottomLeft:true, topLeft:true
      }}
    >
      <button className="close-button">X</button>
      <img className="resizable-image" src={src} alt={alt} style={dimensions} />
    </Rnd>
  );
}

export default DraggableResizableImage;