import React, { useEffect, useState } from "react";
import FormField from "../common/components/FormField";
import { Outlet, useOutletContext, useParams } from "react-router-dom";
import Shop from "./Shop";
import useFetch from "../common/utils/useFetch";

export default function AdminPortal() {
  const { id } = useParams();
  const {
    loading: addProductLoading,
    response: addProductResponse,
    runFetch: runAddProduct,
    setResponse: setAddProductResponse
  } = useFetch("http://localhost:6001/products", "POST", false);
  const {
    loading: editProductLoading,
    response: editProductResponse,
    runFetch: runEditProduct,
    setResponse: setEditProductResponse
  } = useFetch(`http://localhost:6001/products/${id}`, "PATCH", false);

  const loading = addProductLoading || editProductLoading;

  //run fetch for add or edit product based on whether user is editing or adding a product
  function addEditItem(item) {
    if (id) {
      runEditProduct(item);
    } else {
      runAddProduct(item);
    }
  }

  return (
    <>
      <Outlet context={{ addProductResponse, addEditItem, loading, editProductResponse, setAddProductResponse, setEditProductResponse }} />
    </>
  );
}
