import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import AddItem from './components/AddItem'
import Calender from './components/Calender';
import Closet from './components/Closet';
import ImageGrid from './components/ImageGrid.jsx';

function App() {
  return (
    <Router>
      <div>
        <p>Virtual Closet</p>
      </div>
      <Routes>
        <Route path="/" element={
          <div className='main-container'>
            {/* <ImageGrid /> */}
            <Closet />
            <Calender />
          </div>
        } />
        <Route path="/closet" element={
          <div className='main-container'>
            <Closet />
          </div>
        } />
        <Route path="/add-item" element={<AddItem />} />
      </Routes>
    </Router>
  );
}

export default App;