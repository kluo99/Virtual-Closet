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