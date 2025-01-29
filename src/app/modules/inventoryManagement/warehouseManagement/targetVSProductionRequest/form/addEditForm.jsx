/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { getDistributionChannelDDL_api } from "../../../../salesManagement/report/customerSalesTargetReport/helper";
import IForm from "../../../../_helper/_form";
import Loading from "../../../../_helper/_loading";
import { _todayDate } from "../../../../_helper/_todayDate";
import { getCustomerSalesTarget, productRequisitionEntry } from "../helper";
import Form from "./form";

const initData = {
  fromDate: _todayDate(),
  toDate: _todayDate(),
  distributionChannel: "",
  area: "",
  region: "",
  reportType: { value: 1, label: "Details" },
};

export default function TargetVSProductionRequestForm() {
  const { profileData, selectedBusinessUnit } = useSelector(
    (state) => state?.authData,
    shallowEqual
  );

  const [isDisabled, setIsDisabled] = useState(false);
  const [distributionChannelDDL, setDistributionChannelDDL] = useState([]);
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(15);
  const [rowData, setRowData] = useState([]);

  useEffect(() => {
    getDistributionChannelDDL_api(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setDistributionChannelDDL
    );
  }, [profileData, selectedBusinessUnit]);

  const commonGridFunc = (values, _pageNo = pageNo, _pageSize = pageSize) => {
    getCustomerSalesTarget(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      values?.distributionChannel?.value,
      values?.fromDate,
      values?.toDate,
      _pageNo,
      _pageSize,
      setRowData,
      setIsDisabled
    );
  };

  const saveHandler = async (values) => {
    const payload = rowData?.objdata?.map((e) => {
      return {
        intId: 0,
        businessUnitId: selectedBusinessUnit?.value,
        intItemId: e?.itemId,
        strItemCode: "",
        strItemName: e?.itemName,
        intUomid: e?.intUmoId,
        strUomcode: e?.strUmoCode,
        strUomname: e?.strUmoName,
        intItemTypeId: e?.intItemTypeId,
        numTargetQuantity: e?.targetQuantity,
        numItemSalesRate: e?.numItemSalesRate,
        numTargetAmount: e?.targetQuantity * e?.numItemSalesRate,
        numApproveQuantity: 0,
        numApproveAmount: e?.requisitionQty * e?.numItemSalesRate,
        numRequisitionQuantity: +e?.requisitionQty,
        intRegionId: e?.l5,
        fromDate: values?.fromDate,
        toDate: values?.toDate,
        targetYearId: e?.targetYear,
        targetMonthId: e?.targetMonth,
      };
    });
    productRequisitionEntry(payload, setIsDisabled);
  };

  const [objProps, setObjProps] = useState({});

  const dataChangeHandler = (index, key, value) => {
    let _data = [...rowData?.objdata];
    _data[index][key] = value;
    setRowData({ ...rowData, objdata: _data });
  };

  return (
    <IForm
      isHiddenReset={true}
      title={"Product Requisition"}
      getProps={setObjProps}
      isDisabled={isDisabled}
    >
      {isDisabled && <Loading />}
      <Form
        {...objProps}
        initData={initData}
        saveHandler={saveHandler}
        distributionChannelDDL={distributionChannelDDL}
        pageNo={pageNo}
        pageSize={pageSize}
        setPageNo={setPageNo}
        setPageSize={setPageSize}
        rowData={rowData}
        commonGridFunc={commonGridFunc}
        loading={isDisabled}
        dataChangeHandler={dataChangeHandler}
      />
    </IForm>
  );
}
