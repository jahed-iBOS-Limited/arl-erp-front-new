import React from "react";
import { ITableTwo } from "../../../_helper/_tableTwo";
import HeaderForm from "./Landing/form";
import "./index.css";

export default function InvTransactionImport() {
  return (
    <div className="purchase-order">
      <ITableTwo
        renderProps={() => <HeaderForm />}
        title="Inventory Transaction Import"
        viewLink=""
        isHidden={true}
        //createLink="/mngProcurement/purchase-management/purchaseorder/create/po"
      ></ITableTwo>
    </div>
  );
}
