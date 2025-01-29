import React from "react";
import From from "./form";

function SupplerInvoiceView({gridItem, laingValues, girdDataFunc,setModalShow}) {
  return <From  gridItem={gridItem} laingValues={laingValues} girdDataFunc={girdDataFunc} setModalShow={setModalShow}/>;
}

export default SupplerInvoiceView;
