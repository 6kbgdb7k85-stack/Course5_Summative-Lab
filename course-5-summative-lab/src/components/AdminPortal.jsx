import React, { useState } from "react";
import FormField from "../common/components/FormField";
import { useOutletContext } from "react-router-dom";

export default function AdminPortal() {
  const { addItem, addItemLoading } = useOutletContext();
  const [form, setForm] = useState({
    name: "",
    description: "",
    category: "",
    price: 0,
  });

  function handleChange({ target: { name, value } }) {
    setForm((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const isValid = true;
    Object.keys(form).forEach((key) => {
      if (!form[key]) {
        isValid = false;
      }
    });
    if (isValid) {
      addItem(form);
    }
  }

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
    </>
  );
}
