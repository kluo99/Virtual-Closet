import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AddItem.css';

function AddItem() {
    const [files, setFiles] = useState([]);
    const [formData, setFormData] = useState({
      itemName: '',
      brand: '',
      color: '',
      size: '',
      price: '',
      file: null
    });

    const navigate = useNavigate();

    // when user uploads a file, the handleChange function is called
    async function handleChange(e) {
      const uploadedFiles = e.target.files;
    
      if (uploadedFiles.length > 0) {
        const newFiles = Array.from(uploadedFiles).map(async (file) => {
          const formData = new FormData();
          formData.append('file', file);
    
          const response = await fetch('http://127.0.0.1:5555/api/remove-background', {
            method: 'POST',
            body: formData,
          });
    
          // Get the response as JSON
          const data = await response.json();
    
          // Get the Base64 string from the "url" key
          const base64String = data.url;
    
          const url = 'data:image/png;base64,' + base64String;
    
          return url;
        });
        
        const urls = await Promise.all(newFiles);
        setFiles(prevFiles => [...prevFiles, ...urls]);

        if (urls.length > 0) {
          setFormData(prevFormData => ({
            ...prevFormData,
            file: urls[0]
          }));
        }
      }
    }

  //saves the info that the user types in into states
  function handleInputChange(e) {
    setFormData(prevFormData => ({
      ...prevFormData,
      [e.target.name]: e.target.value
    }));
      console.log(formData)
  }

  //sends the data to the backend while also redirecting user back to main page
  async function handleSubmit(e) {
    e.preventDefault();
  
    try {
      const response = await fetch('http://127.0.0.1:5555/api/save-item', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
  
      if (response.ok) {
        const responseData = await response.json();
        console.log(responseData.message); // Log the success message
        navigate('/');
      } else {
        console.log('Failed to save item');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }

    return(
    <div className="App">
        <h2>Add Items:</h2>
        {/* Hidden file input triggered by label click */}
        <label htmlFor="fileInput" className="uploadArea">
        +
        </label>
        <input
          id="fileInput"
          type="file"
          onChange={handleChange}
          multiple
          style={{ display: 'none' }}
        />
        <form onSubmit={handleSubmit}>
          <label htmlFor="item-name">Item Name:</label><br />
          <input type="text" id="item-name" name="itemName" onChange={handleInputChange} /><br />
          <label htmlFor="brand">Brand:</label><br />
          <input type="text" id="brand" name="brand" onChange={handleInputChange} /><br />
          <label htmlFor="color">Color:</label><br />
          <input type="text" id="color" name="color" onChange={handleInputChange} /><br />
          <label htmlFor="size">Size:</label><br />
          <input type="text" id="size" name="size" onChange={handleInputChange} /><br />
          <label htmlFor="price">Price:</label><br />
          <input type="text" id="price" name="price" onChange={handleInputChange} /><br />
          <input type="submit" value="Submit" />
        </form> 
        <div className="closet-area">
            {files.length > 0 &&
            files.map((file, index) => (
                <img key={index} src={file} alt={`Uploaded ${index + 1}`} />
            ))}

        </div>
      </div>
    )
}

export default AddItem