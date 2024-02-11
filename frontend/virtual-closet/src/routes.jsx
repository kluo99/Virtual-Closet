import React from "react";
import Closet from "./components/Closet.jsx";
import ImageGrid from "./components/ImageGrid.jsx";
import AddItem from "./components/AddItem";
import Calender from './components/Calender';

const routes = [
    { path: "/", element: <div className='main-container'><Closet /><Calender /></div> },
    { path: "/closet", element: <Closet /> },
    { path: "/image-grid", element: <ImageGrid /> },
    { path: "/add-item", element: <AddItem /> },
  ];

export default routes;