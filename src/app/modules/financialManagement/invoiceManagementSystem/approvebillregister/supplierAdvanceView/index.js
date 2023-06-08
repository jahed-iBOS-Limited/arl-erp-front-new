import React from "react";
import From from "./form";

function SupplierAdvanceView({
  gridItem,
  laingValues,
  girdDataFunc,
  setModalShow,
  bilRegister
}) {
  return (
    <From
      gridItem={gridItem}
      laingValues={laingValues}
      girdDataFunc={girdDataFunc}
      setModalShow={setModalShow}
      bilRegister={bilRegister}
    />
  );
}

export default SupplierAdvanceView;
