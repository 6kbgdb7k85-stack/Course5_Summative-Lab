import React from "react";
import { Outlet } from "react-router-dom";
import NavBar from "../common/components/NavBar";
import useFetch from "../common/utils/useFetch";

export default function MainLayout() {
    const {loading:addItemLoading,response:addItemResponse,runFetch:postItem}=useFetch("http://localhost:6001/products","POST",false)
    function addItem(item){
        postItem(item)
    }
  return (
    <>
      <header>
        <NavBar/>
      </header>
      <Outlet context={{addItem, addItemLoading, addItemResponse}} />
    </>
  );
}
