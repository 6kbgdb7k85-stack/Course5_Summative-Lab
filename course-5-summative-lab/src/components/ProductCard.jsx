import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function ProductCard({ product, onDelete, loading }) {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div>
      <h4>{product.name}</h4>
      <h6>{product.category}</h6>
      <p>{product.description}</p>
      <p>${product.price}</p>
      {/*show edit and delete buttons for admin*/}
      {location.pathname.includes("admin") ? (
        <>
          <button
            onClick={() =>
              navigate(`/admin/${product.id}`, { state: { product } })
            }
          >
            Edit
          </button>
          |
          <button disabled={loading} onClick={() => onDelete(product.id)}>
            Delete
          </button>
        </>
      ) : (
        <></>
      )}
    </div>
  );
}
