import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Closet.css';

function Closet() {
  const [garments, setGarments] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetch('http://localhost:5555/api/get-garments')
      .then(response => response.json())
      .then(data => setGarments(data))
      .catch(error => console.error('Error:', error));
  }, []);

  // Wait for garments data to be fetched before rendering the component
  if (garments.length === 0) {
    return <div>Loading...</div>;
  }

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

  // Get the current route
  const location = useLocation();

  return (
    <div>
      <p>Closet</p>
      <div className='clothing-container'>
        <div className='closet-items'>
          {currentItems.map((garment, index) => (
            <div key={index}>
              <img className="garment" src={garment.garment_image} alt={garment.name}></img>
            </div>
          ))}
        </div>
          <>
            <button onClick={handlePrevClick} disabled={currentPage === 1}>
              Previous
            </button>
            <button onClick={handleNextClick} disabled={currentPage === Math.ceil(garments.length / itemsPerPage)}>
              Next
            </button>
            <Link to="/add-item">Add Item</Link>
          </>
      </div>
    </div>
  );
}

export default Closet;
  
