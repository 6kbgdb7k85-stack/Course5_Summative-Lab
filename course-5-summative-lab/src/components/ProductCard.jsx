import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function ProductCard({product}){

    const location = useLocation()
    const navigate = useNavigate()

    return(
        <div>
            <h4>{product.name}</h4>
            <h6>{product.category}</h6>
            <p>{product.description}</p>
            <p>${product.price}</p>
            {location.pathname.includes('admin')?(<><button onClick={()=>navigate(`/admin/${product.id}`,{state:{product}})}>Edit</button>|<button>Delete</button></>):<></>}
        </div>
    )
}