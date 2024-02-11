import React, { createContext, useState } from 'react';

export const ImageContext = createContext();

export function ImageProvider({ children }) {
  const [selectedImages, setSelectedImages] = useState([]);

  return (
    <ImageContext.Provider value={{ selectedImages, setSelectedImages }}>
      {children}
    </ImageContext.Provider>
  );
}