import React, { useState } from "react";
import HeaderForm from "./form";
import { useSelector, shallowEqual } from "react-redux";
import "../style.css";
import { getInvoiceClearPasignation_api } from "./../helper";

export default function ClearSalesInvoiceLanding() {
  const [girdData, setGirdData] = useState([]);
  const [loading, setLoading] = useState(false);
  //paginationState
  const [pageNo, setPageNo] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(20);
  let clearSalesInvoice = useSelector(
    (state) => {
      return {
        profileData: state.authData.profileData,
        selectedBusinessUnit: state.authData.selectedBusinessUnit,
      };
    },
    { shallowEqual }
  );

  let { profileData, selectedBusinessUnit } = clearSalesInvoice;

  //setPositionHandler
  const setPositionHandler = (pageNo, pageSize, values) => {
    getInvoiceClearPasignation_api(
      profileData?.accountId,
      selectedBusinessUnit.value,
      setGirdData,
      setLoading,
      pageNo,
      pageSize,
      values?.customer?.value
    );
  };

  return (
    <div className="clear_sales_invoice">
      <HeaderForm
        rowDto={girdData}
        girdData={girdData}
        setGirdData={setGirdData}
        loading={loading}
        setLoading={setLoading}
        paginationState={{ pageNo, setPageNo, pageSize, setPageSize }}
        setPositionHandler={setPositionHandler}
        profileData={profileData}
        selectedBusinessUnit={selectedBusinessUnit}
      />
    </div>
  );
}
