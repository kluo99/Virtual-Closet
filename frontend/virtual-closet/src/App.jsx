import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import AddItem from './components/AddItem'
import Calender from './components/Calender';
import Closet from './components/Closet';
import ImageGrid from './components/ImageGrid.jsx';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { ImageProvider } from './components/ImageProvider';

function App() {
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
              <Calender />
              <DndProvider backend={HTML5Backend}>
                <ImageGrid />
              </DndProvider>
            </div>
          } />
          <Route path="/closet" element={
            <div className='main-container'>
              <Closet />
            </div>
          } />
          <Route path="/add-item" element={<AddItem />} />
          <Route path="/image-grid" element={
            <DndProvider backend={HTML5Backend}>
              <div>
                <Closet />
                <ImageGrid />
              </div>
            </DndProvider>} />
        </Routes>
      </ImageProvider>
    </Router>
  );
}

export default App;