import { useState } from 'react';
import './Closet.css';

function Closet() {
    const [files, setFiles] = useState([]);
    const [formData, setFormData] = useState({
      itemName: '',
      brand: '',
      color: '',
      size: '',
      price: '',
      file: null
    });

    async function handleChange(e) {
      const uploadedFiles = e.target.files;
    
      if (uploadedFiles.length > 0) {
        const newFiles = Array.from(uploadedFiles).map(async (file) => {
          // Create a FormData object and append the file
          const formData = new FormData();
          formData.append('file', file);
    
          // Send a POST request to the backend
          const response = await fetch('http://127.0.0.1:5555/api/remove-background', {
            method: 'POST',
            body: formData,
          });
    
          // Get the response as a blob
          const blob = await response.blob();
    
          // Create an object URL for the blob and return it
          const url = URL.createObjectURL(blob);
    
          // Create a new FormData object and append the blob
          const newFormData = new FormData();
          newFormData.append('file', blob);
    
          // Update the formData state with the new FormData object
          setFormData(prevFormData => ({
            ...prevFormData,
            file: newFormData
          }));
    
          return url;
        });
    
        // Wait for all POST requests to complete and update the state
        const urls = await Promise.all(newFiles);
        setFiles(prevFiles => [...prevFiles, ...urls]);
      }
    }

  function handleInputChange(e) {
    setFormData(prevFormData => ({
      ...prevFormData,
      [e.target.name]: e.target.value
    }));
      console.log(formData)
  }

  async function handleSubmit(e) {
    e.preventDefault();

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
        <form>
          <label htmlFor="item-name">Item Name:</label><br />
          <input type="text" id="item-name" name="item-name" onChange={handleInputChange} /><br />
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

export default Closet