import React from "react";
import HeaderForm from "./form";
import { useHistory } from "react-router-dom";
export default function PlantLanding() {
  const history = useHistory();
  const createHandler = () => {
    history.push("/inventory-management/configuration/plant/add");
  };
  return (
    <>
      <HeaderForm createHandler={createHandler} />
    </>
  );
}
