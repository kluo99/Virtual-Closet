import { useState } from 'react';
import './App.css';
import Closet from './components/Closet'
import Calender from './components/Calender';
import DraggableResizableImage from './components/DraggableResizableImage.jsx';
import acneImage from './assets/acne.JPG';

function App() {

  return (
    <>
      <div>
        <p>Virtual Closet</p>
      </div>
      <Calender />
      <DraggableResizableImage src={acneImage} alt="Example image"/>
      <Closet />
    </>
  );
}

export default App;
