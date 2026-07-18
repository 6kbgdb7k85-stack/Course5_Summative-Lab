import React from "react";
import { NavLink } from "react-router-dom";

export default function NavBar(){
    return(
        <nav data-testid="navbar">
            <NavLink to={"/"}>Home</NavLink>
            <NavLink to={"/shop"}>Shop</NavLink>
            <NavLink to={"/admin"}>Admin Portal</NavLink>
        </nav>
    )
}