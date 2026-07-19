import React from "react";
import { Outlet } from "react-router-dom";
import NavBar from "../common/components/NavBar";
import useFetch from "../common/utils/useFetch";

export default function MainLayout() {
    
  return (
    <>
      <header>
        <NavBar/>
      </header>
      <Outlet />
    </>
  );
}
