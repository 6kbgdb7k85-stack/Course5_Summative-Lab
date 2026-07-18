import React, { useContext, useEffect, useState } from "react";
import useFetch from "../common/utils/useFetch";
import FormField from "../common/components/FormField";
import {
  useLocation,
  useNavigate,
  useOutletContext,
  useParams,
} from "react-router-dom";

export default function EditProduct() {
  const { id } = useParams();
  const location = useLocation();
  const { product } = location.state;

  const { loading, response, runFetch } = useFetch(
    `http://localhost:6001/products/${id}`,
    "PATCH",
    false,
  );

  const [form, setForm] = useState(product);

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
        runFetch(form);
      }
    }

    useEffect(() => {
      if (response) {
        navigate("/admin");
      }
    }, [response]);

  return (
    <>
      <h2>Edit Product</h2>
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
        {loading ? <h3>Saving Product...</h3> : <></>}
      </form>
    </>
  );
}
