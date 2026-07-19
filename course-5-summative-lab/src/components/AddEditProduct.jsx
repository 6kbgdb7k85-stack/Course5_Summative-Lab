import React, { useContext, useEffect, useState } from "react";
import useFetch from "../common/utils/useFetch";
import FormField from "../common/components/FormField";
import {
  useLocation,
  useNavigate,
  useOutletContext,
  useParams,
} from "react-router-dom";

const initForm = {
  name: "",
  description: "",
  category: "",
  price: 0,
};

export default function AddEditProduct() {
  const { id } = useParams();
  const location = useLocation();
  const { product } = location?.state || { product: null };

  const { loading, editProductResponse, addEditItem, addProductResponse, setAddProductResponse, setEditProductResponse } =
    useOutletContext();

  const [form, setForm] = useState(product||initForm);

  const navigate = useNavigate();

  function handleChange({ target: { name, value } }) {
    setForm((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    let isValid = true;
    Object.keys(form).forEach((key) => {
      if (!form[key]) {
        isValid = false;
      }
    });
    if (isValid) {
      addEditItem(form);
    }
  }

  //addProductResponse and editProductResponse set to null in their respective useEffect blocks to prevent them overriding each other's effects
  useEffect(() => {
    if (addProductResponse) {
      setForm(initForm);
      setAddProductResponse(null)
    }
  }, [addProductResponse]);

  useEffect(() => {
    if (editProductResponse) {
      setEditProductResponse(null)
      navigate("/admin");
    }
  }, [editProductResponse]);

  return (
    <>
      {/*change header to reflect add or edit*/}
      {id ? <h2>Edit Product</h2> : <h2>Add Product</h2>}
      <form onSubmit={handleSubmit}>
        <FormField
          label="Name"
          name="name"
          value={form}
          type="text"
          onChange={handleChange}
        />
        <FormField
          label="Description"
          name="description"
          value={form}
          type="text"
          onChange={handleChange}
        />
        <FormField
          label="Category"
          name="category"
          value={form}
          type="text"
          onChange={handleChange}
        />
        <FormField
          label="Price"
          name="price"
          value={form}
          type="number"
          onChange={handleChange}
        />
        <button disabled={loading} type="submit">
          Submit
        </button>
        {/*if edit mode allow user to return to list without making changes*/}
        {id?<button onClick={()=>navigate('/admin')}>Cancel</button>:<></>}
        {loading ? <h3>Saving Product...</h3> : <></>}
      </form>
    </>
  );
}
