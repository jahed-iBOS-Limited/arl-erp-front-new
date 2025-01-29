import React, { useState, useEffect } from "react";
import HeaderForm from "./Landing/form";

import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { saveCustomerSalesInvoice, getGridData } from "./_redux/Actions";

export default function CustomerSalesInvoice() {
  const [loading, setLoading] = useState(false);
  const [ReportType, setReportType] = useState("");
  //paginationState
  const [pageNo, setPageNo] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(20);
  const dispatch = useDispatch();
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  const [rowDto, setRowDto] = useState([]);
  const gridData = useSelector((state) => {
    return state.customerSalesInvoice.gridData;
  }, shallowEqual);

  useEffect(() => {
    if (gridData?.data?.length > 0) {
      const newrowdata = gridData?.data?.map((itm) => ({
        ...itm,
        itemcheck: false,
      }));
      setRowDto([...newrowdata]);
    } else {
      setRowDto([]);
    }
  }, [gridData]);

  const itemData = (idx) => {
    const cloneArray = [...rowDto];
    cloneArray[idx].itemcheck = !cloneArray[idx].itemcheck;

    setRowDto([...cloneArray]);
  };
  const allGridCheck = (value) => {
    if (rowDto.length) {
      const newrowdata = rowDto.map((itm) => ({
        ...itm,
        itemcheck: value,
      }));
      setRowDto(newrowdata);
    }
  };

  const createinvoice = (
    typesid,
    areaid,
    ReportType,
    fromDate,
    toDate,
    gridRefresh
  ) => {
    const finalrowDto = rowDto.filter((item) => item.itemcheck === true);
    const data = finalrowDto.map((itm) => {
      return {
        accountId: profileData.accountId,
        businessUnitId: selectedBusinessUnit.value,
        businessAreaId: areaid,
        businessPartnerId: itm.billToPartnerid,
        businessPartnerName: itm.billToPartnerName,
        deliveryId: itm.deliveryId,
        deliveryCode: itm.deliveryCode,
        customerId: itm.billToPartnerid,
        customerName: itm.billToPartnerName,
        amount: itm.totalNetValue,
        actionBy: profileData.userId,
      };
    });

    dispatch(
      saveCustomerSalesInvoice({
        data: data,
        typeId: typesid,
        gridRefresh,
      })
    );
  };
  const gridDataFunc = (values, pageNo, pageSize, search) => {
    dispatch(
      getGridData(
        profileData.accountId,
        selectedBusinessUnit.value,
        values?.sbu?.value,
        values?.ReportType?.value,
        values?.fromDate,
        values?.toDate,
        setLoading,
        // values?.customer?.value,
        pageNo,
        pageSize,
        search
      )
    );
  };

  return (
    <>
      <HeaderForm
        createinvoice={createinvoice}
        rowDto={rowDto}
        setRowDto={setRowDto}
        setLoading={setLoading}
        setReportType={setReportType}
        gridDataFunc={gridDataFunc}
        pageNo={pageNo}
        pageSize={pageSize}
        itemData={itemData}
        allGridCheck={allGridCheck}
        loading={loading}
        ReportType={ReportType}
        gridData={gridData}
        paginationState={{ pageNo, setPageNo, pageSize, setPageSize }}
      />
    </>
  );
}
