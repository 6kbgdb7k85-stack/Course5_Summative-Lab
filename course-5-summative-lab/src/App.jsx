import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "./assets/vite.svg";
import heroImg from "./assets/hero.png";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import MainLayout from "./components/MainLayout";
import AdminPortal from "./components/AdminPortal";
import Shop from "./components/Shop";
import Home from "./components/Home";
import AddEditProduct from "./components/AddEditProduct";

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route path="" element={<Home/>}/>
          <Route path="/shop" element={<Shop/>}/>
          <Route path="/admin" element={<AdminPortal/>}>
            <Route path="" element={<Shop/>}/>
            <Route path=":id" element={<AddEditProduct/>}/>
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
