import React, { useId } from "react";

export default function FormField({ name, value, onChange, type, label }) {
  const fieldId = useId();

  return (
    <>
      <label htmlFor={fieldId}>{label}</label>
      <input
        id={fieldId}
        type={type}
        name={name}
        onChange={onChange}
        value={value instanceof Object ? value[name] : value}
      />
    </>
  );
}
