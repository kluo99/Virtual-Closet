import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Closet.css';
import { useContext } from 'react';
import { ImageContext } from './ImageProvider';

function Closet() {
  const [garments, setGarments] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;
  const { selectedImages, setSelectedImages } = useContext(ImageContext);
  const location = useLocation();

  const handleImageClick = (image) => {
    if (location.pathname === "/image-grid") {
      setSelectedImages([...selectedImages, { ...image, position: { x: 0, y: 0 } }]);
      console.log(image);
    }
  };

  useEffect(() => {
    fetch('http://localhost:5555/api/get-garments')
      .then(response => response.json())
      .then(data => {
        setGarments(data);
      })
      .catch(error => console.error('Error:', error));
  }, []);
  // Wait for garments data to be fetched before rendering the component
  // if (garments.length === 0) {
  //   return <div>Loading...</div>;
  // }

  // Calculate the index of the first and last items on the current page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  // Get the items for the current page
  const currentItems = garments.slice(indexOfFirstItem, indexOfLastItem);

  // Function to handle clicking the 'Next' button
  const handleNextClick = () => {
    setCurrentPage(prevPageNumber => prevPageNumber + 1);
  };

  // Function to handle clicking the 'Previous' button
  const handlePrevClick = () => {
    setCurrentPage(prevPageNumber => prevPageNumber - 1);
  };

  return (
    <div className='clothing-container'>
      <p className='fake-logo'>Closet</p>
        <div className='closet-items'>
          {currentItems.map((garment, index) => (
            // <div key={index}>
            <img className="garment" onClick={() => handleImageClick(garment)} src={garment.garment_image} alt={garment.name}></img>
            // </div>
          ))}
        </div>
          <>
          <div className="button-container">
            <button onClick={handlePrevClick} disabled={currentPage === 1}>
              Previous
            </button>
            <button onClick={handleNextClick} disabled={currentPage === Math.ceil(garments.length / itemsPerPage)}>
              Next
            </button>
            <Link to="/add-item">Add Item</Link>
          </div>
          </>

    </div>
  );
}

export default Closet;
  
