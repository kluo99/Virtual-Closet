// import React from 'react';

// function GarmentInformation({ garment }) {

//     console.log(garment.id)
//     const deleteGarment = async () => {
//         console.log(`Attempting to delete garment with id ${garment.id}`);
//         try {
//             const response = await fetch('http://localhost:5555/api/delete-garment/${garment.id}', { method: 'DELETE' });
    
//             if (!response.ok) {
//                 console.log('Response:', response);
//                 throw new Error(`HTTP error! status: ${response.status}`);
//             }
    
//             console.log('Garment deleted successfully');
//         } catch (error) {
//             console.error('Error:', error);
//         }
//     };

//     return (
//         <div>
//             <img src={garment.garment_image} alt={garment.name} />
//             <h2>{garment.name}</h2>
//             <p>Brand: {garment.brand}</p>
//             <p>Color: {garment.color}</p>
//             <p>Size: {garment.size}</p>
//             <p>Price: ${garment.price}</p>
//             <button onClick={deleteGarment}>Delete Garment</button>
//         </div>
//     );
// }

// export default GarmentInformation;