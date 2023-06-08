import React from "react";
import From from "./form";

function ShippingInvoiceView({gridItem, laingValues, girdDataFunc,setModalShow}) {
  return <From  gridItem={gridItem} laingValues={laingValues} girdDataFunc={girdDataFunc} setModalShow={setModalShow}/>;
}

export default ShippingInvoiceView;
