import React from "react";
import useFetch from "../common/utils/useFetch";
import ProductCard from "./ProductCard";

export default function Shop() {
  const { loading: shopLoading, response: products } = useFetch(
    "http://localhost:6001/products",
  );

  return (
    <>
      <h2>Shop</h2>
      {shopLoading ? (
        <h4>Loading...</h4>
      ) : (
        <>
          {products?.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </>
      )}
    </>
  );
}
