import React, { useState } from "react";
import useFetch from "../common/utils/useFetch";
import ProductCard from "./ProductCard";
import FormField from "../common/components/FormField";

export default function Shop() {
  const { loading: shopLoading, response: products } = useFetch(
    "http://localhost:6001/products",
  );

  const [search,setSearch]=useState('')

  const filteredProducts = products?.filter(product=>product.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <>
      <h2>Shop</h2>
      {shopLoading ? (
        <h4>Loading...</h4>
      ) : (
        <>
        <input type="text" placeholder="Search by product name..." onChange={(e)=>setSearch(e.target.value)} value={search}/>
          {filteredProducts?.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </>
      )}
    </>
  );
}
