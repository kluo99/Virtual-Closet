import { useState } from 'react';

function Closet() {
    const [files, setFiles] = useState([]);
    function handleChange(e) {
        const uploadedFiles = e.target.files;
    
        if (uploadedFiles.length > 0) {
          const newFiles = Array.from(uploadedFiles).map(file =>
            URL.createObjectURL(file)
          );
          setFiles(prevFiles => [...prevFiles, ...newFiles]);
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
        <form>
          <label htmlFor="item-name">Item Name:</label><br />
          <input type="text" id="item-name" name="item-name" /><br />
          <label htmlFor="brand">Brand:</label><br />
          <input type="text" id="brand" name="brand" /><br />
          <label htmlFor="color">Color:</label><br />
          <input type="text" id="color" name="color" /><br />
          <label htmlFor="size">Size:</label><br />
          <input type="text" id="size" name="size" /><br />
          <label htmlFor="price">Price:</label><br />
          <input type="text" id="price" name="price" /><br />
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