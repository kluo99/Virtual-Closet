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
      <div>
        <p>Virtual Closet</p>
      </div>
      <ImageProvider>
        <Routes>
        <Route path="/" element={
          <div className='main-container'>
            <Closet />
            <Calender selectedDate={selectedDate} setSelectedDate={setSelectedDate}/>
            <ImageGridWithEdit selectedDate={selectedDate} />
          </div>
        } />
          <Route path="/closet" element={
            <div className='main-container'>
              <Closet />
            </div>
          } />
          <Route path="/add-item" element={<AddItem />} />
          <Route path="/image-grid" element={
            <div>
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