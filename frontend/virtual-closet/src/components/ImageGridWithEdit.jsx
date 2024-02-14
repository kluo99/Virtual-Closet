import { useNavigate } from 'react-router-dom';
import ImageGrid from './ImageGrid.jsx';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

function ImageGridWithEdit({ selectedDate }) {
  const navigate = useNavigate();

  const handleEdit = () => {
    navigate("/image-grid");
  };

  return (
    <div>
      <DndProvider backend={HTML5Backend}>
        <ImageGrid selectedDate={selectedDate}/>
      </DndProvider>
      <button onClick={handleEdit}>Edit</button>
    </div>
  );
}

export default ImageGridWithEdit;