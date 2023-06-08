import React from "react";
import EmpCreateAndUpdate from "./Form/addEditForm";

const Update = () => {
  return (
    <>
      <EmpCreateAndUpdate isUpdate={true} title="Update Employee" />
    </>
  );
};

export default Update;
