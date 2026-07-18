import React, { useEffect, useState } from "react";
import useFetch from "../common/utils/useFetch";
import ProductCard from "./ProductCard";
import FormField from "../common/components/FormField";
import { useLocation, useOutletContext } from "react-router-dom";

export default function Shop() {
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState(null);
  const [products, setProducts] = useState([]);

  const { loading: shopLoading, response: productsResponse } = useFetch(
    "http://localhost:6001/products",
  );

  const { addItemResponse } = useOutletContext() ?? { addItemResponse: null };

  const {
    loading: deleteLoading,
    response: deleteResponse,
    runFetch: deleteProduct,
    setResponse: setDeleteResponse,
  } = useFetch(`http://localhost:6001/products/${deleteId}`, "DELETE", false);

  const filteredProducts = products?.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase()),
  );

  useEffect(() => {
    if (deleteId) {
      deleteProduct();
    }
  }, [deleteId]);

  useEffect(() => {
    if (productsResponse) {
      setProducts(productsResponse);
    }
  }, [productsResponse]);

  useEffect(() => {
    if (addItemResponse) {
      setProducts((prevState) => [...prevState, addItemResponse]);
    }
  }, [addItemResponse]);

  useEffect(() => {
    if (deleteResponse && deleteId) {
      setProducts(products.filter((product) => product.id !== deleteId));
      setDeleteId(null);
      setDeleteResponse(null);
    }
  }, [deleteResponse, deleteId]);

  return (
    <>
      {!location.pathname.includes("admin") ? <h2>Shop</h2> : <></>}
      {shopLoading ? (
        <h4>Loading...</h4>
      ) : (
        <>
          <input
            type="text"
            placeholder="Search by product name..."
            onChange={(e) => setSearch(e.target.value)}
            value={search}
          />
          {filteredProducts?.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onDelete={setDeleteId}
              loading={deleteLoading}
            />
          ))}
        </>
      )}
    </>
  );
}
