import React from "react";
import From from "./form";

function ExpenseView({
  gridItem,
  laingValues,
  girdDataFunc,
  setModalShow,
}) {
  return (
    <From
      gridItem={gridItem}
      laingValues={laingValues}
      girdDataFunc={girdDataFunc}
      setModalShow={setModalShow}
    />
  );
}

export default ExpenseView;
