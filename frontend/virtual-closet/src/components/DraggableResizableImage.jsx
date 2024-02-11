import React, { useState } from 'react';
import { Rnd } from 'react-rnd';

function DraggableResizableImage({ src, alt, initialPosition }) {
  const [dimensions, setDimensions] = useState({ width: 200, height: 200 });
  const [position, setPosition] = useState(initialPosition);

  const handleResize = (e, direction, ref, delta, position) => {
    setDimensions({
      width: ref.offsetWidth,
      height: ref.offsetHeight,
    });
  };

  const handleDragStop = (e, d) => {
    setPosition({ x: d.x, y: d.y });
  };

  return (
    <Rnd
      size={dimensions}
      position={position}
      onResizeStop={handleResize}
      onDragStop={handleDragStop}
      bounds="parent"
      enableResizing={{
        top:true, right:true, bottom:true, left:true,
        topRight:true, bottomRight:true, bottomLeft:true, topLeft:true
      }}
    >
      <img src={src} alt={alt} style={dimensions} />
    </Rnd>
  );
}

export default DraggableResizableImage;