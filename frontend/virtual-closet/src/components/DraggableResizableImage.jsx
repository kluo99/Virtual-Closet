import React, { useState } from 'react';
import { Rnd } from 'react-rnd';

function DraggableResizableImage({ src, alt }) {
  const [dimensions, setDimensions] = useState({ width: 200, height: 200 });

  const handleResize = (e, direction, ref, delta, position) => {
    setDimensions({
      width: ref.offsetWidth,
      height: ref.offsetHeight,
    });
  };

  return (
    <Rnd
      size={dimensions}
      onResizeStop={handleResize}
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