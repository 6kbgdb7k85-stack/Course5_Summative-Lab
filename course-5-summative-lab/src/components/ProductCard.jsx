import React from "react";

export default function ProductCard({product}){

    return(
        <div>
            <h4>{product.name}</h4>
            <h6>{product.category}</h6>
            <p>{product.description}</p>
            <p>${product.price}</p>
        </div>
    )
}