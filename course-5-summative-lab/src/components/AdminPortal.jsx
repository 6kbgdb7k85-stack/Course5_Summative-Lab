import React, { useEffect, useState } from "react";
import FormField from "../common/components/FormField";
import { Outlet, useOutletContext } from "react-router-dom";
import Shop from "./Shop";

const initForm = {
    name: "",
    description: "",
    category: "",
    price: 0,
  }

export default function AdminPortal() {
  const { addItem, addItemLoading, addItemResponse } = useOutletContext();

  const [form, setForm] = useState(initForm);

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
      addItem(form);
    }
  }

  useEffect(()=>{
    if(addItemResponse){
      setForm(initForm)
    }
  },[addItemResponse])

  return (
    <>
      <h2>Add Product</h2>
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
        <button disabled={addItemLoading} type="submit">
          Submit
        </button>
        {addItemLoading ? <h3>Adding Product...</h3> : <></>}
      </form>
      <Outlet context={{addItemResponse}} />
    </>
  );
}
