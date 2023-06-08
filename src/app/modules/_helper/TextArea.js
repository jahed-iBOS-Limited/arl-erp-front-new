import { useField } from "formik";
import React from "react";

const TextArea = ({ label, ...props }) => {
  const [field, meta] = useField(props);
  return (
    <>
      <textarea className="text-area" {...field} {...props} />
      {meta.touched && meta.error ? (
        <div
          className="text-danger"
          style={{
            fontSize: "0.9rem",
            fontWeight: 400,
            width: "100%",
            marginTop: "0",
            marginBottom: "0",
          }}
        >
          {meta.error}
        </div>
      ) : null}
    </>
  );
};

export default TextArea;
