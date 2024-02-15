import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import './App.css';
import AddItem from './components/AddItem'
import Calender from './components/Calender';
import Closet from './components/Closet';
import ImageGrid from './components/ImageGrid.jsx';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { ImageProvider } from './components/ImageProvider';
import { useState } from 'react';
import ImageGridWithEdit from './components/ImageGridWithEdit.jsx';

function App() {

  const [selectedDate, setSelectedDate] = useState(new Date());
  
  return (
    <Router>
      <div className="fake-logo">
        <p>Virtual Closet</p>
      </div>
      <ImageProvider>
        <Routes>
        <Route path="/" element={
          <div className='main-container'>
            <Closet />
            <ImageGridWithEdit className="ImageGridWithEdit" selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
            {/* <div className='image-grid-calender'> */}
              {/* <Calender selectedDate={selectedDate} setSelectedDate={setSelectedDate}/> */}
            {/* </div> */}
          </div>
        } />
          <Route path="/closet" element={
            <div className='main-container'>
              <Closet />
            </div>
          } />
          <Route path="/add-item" element={<AddItem />} />
          <Route path="/image-grid" element={
            <div className='flex-container'>
              <Closet />
              <DndProvider backend={HTML5Backend}>
                <ImageGrid selectedDate={selectedDate}/>
              </DndProvider>
            </div>
          } />
        </Routes>
      </ImageProvider>
    </Router>
  );
}

export default App;