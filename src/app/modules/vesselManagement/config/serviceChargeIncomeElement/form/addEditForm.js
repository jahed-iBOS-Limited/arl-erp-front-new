/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { _todayDate } from "../../../../_helper/_todayDate";
import useAxiosPost from "../../../../_helper/customHooks/useAxiosPost";
import { GetShipPointDDL } from "../../../allotment/loadingInformation/helper";
import Form from "./form";

const initData = {
  businessPartner: "",
  port: "",
  motherVessel: "",
  item: "",
  warehouse: "",
  programNo: "",
};

const costElements = [
  "Mother Vessel Freight",
  "Lighter Vessel Freight",
  "Survey",
  "Stevedore",
  "Scot",
  "H. Labour",
  "BIWTA",
  "Bagging Swing  Weight & Unloading",
  "Direct Loading",
  "Dumping",
  "Loading at Godown/Dump",
  "Daily Labour",
  "Ghat Rent",
  "Godown Rent",
  "Transportation",
  "Unloading Labour Cost",
  "HR And Administration cost",
  "Commission on Revenue",
  "Finance Cost",
  "Vat On Revenue",
];

const costList = costElements?.map((item, i) => ({
  elementId: i + 1,
  element: item,
  isSelected: false,
  rate: "",
  typeId: 1,
  typeName: "Cost Element",
}));

const revenueElements = [
  "Prilled Urea AFCCL",
  "Prilled Urea GPFPLC",
  "Prilled Urea MOHIN",
  "Prilled Urea TAPAKHOLA",
];

const revenueList = revenueElements?.map((item, i) => ({
  elementId: i + 21,
  element: item,
  isSelected: false,
  rate: "",
  typeId: 2,
  typeName: "Revenue Element",
}));

const ServiceChargeAndIncomeElementForm = () => {
  const [costs, setCosts] = useState(costList);
  const [revenues, setRevenues] = useState(revenueList);
  const [shipPointDDL, setShipPointDDL] = useState([]);
  const [, postData, saveLoader] = useAxiosPost();

  // get user data from store
  const {
    profileData: { accountId: accId, userId },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state?.authData, shallowEqual);

  useEffect(() => {
    GetShipPointDDL(accId, buId, setShipPointDDL);
  }, [accId, buId]);

  const saveHandler = (values) => {
    const allRows = [...costs, ...revenues];
    const selectedRows = allRows?.filter((item) => item?.isSelected);

    if (selectedRows?.length < 1) {
      return toast.warn("Please select at least one row!");
    }

    const payload = {
      rateId: 0,
      tenderId: 0,
      itemId: values?.item?.value,
      uomid: 0,
      wareHouseId: values?.warehouse?.value,
      businessUnitId: buId,
      date: _todayDate(),
      lastActionBy: userId,
      isActive: true,
      serverDatetime: "2023-07-06T08:41:10.688Z",
      lastActionDatetime: "2023-07-06T08:41:10.688Z",
      serviceRows: selectedRows?.map((item) => ({
        rowId: 0,
        rateId: 0,
        serviceElemenId: item?.elementId,
        serviceElementName: item?.element,
        typeId: item?.typeId,
        typeName: item?.typeName,
        rate: +item?.rate,
        isActive: true,
        serverDatetime: "2023-07-06T08:41:10.688Z",
        lastActionDatetime: "2023-07-06T08:41:10.688Z",
      })),
    };

    postData(
      `/costmgmt/CostElement/CreateServiceChargeAndIncomeElement`,
      payload,
      () => {},
      true
    );
  };

  const rowDataHandler = (name, index, value) => {
    let _data = [...costs];
    _data[index][name] = value;

    setCosts(_data);
  };

  const rowDataHandler2 = (name, index, value) => {
    let _data = [...revenues];
    _data[index][name] = value;

    setRevenues(_data);
  };

  const allSelect = (value) => {
    let _data = [...costs];
    const modify = _data.map((item) => {
      return {
        ...item,
        isSelected: value,
      };
    });

    setCosts(modify);
  };
  const allSelect2 = (value) => {
    let _data = [...revenues];
    const modify = _data.map((item) => {
      return {
        ...item,
        isSelected: value,
      };
    });

    setRevenues(modify);
  };

  const selectedAll = () => {
    return costs?.length > 0 &&
      costs?.filter((item) => item?.isSelected)?.length === costs?.length
      ? true
      : false;
  };
  const selectedAll2 = () => {
    return revenues?.length > 0 &&
      revenues?.filter((item) => item?.isSelected)?.length === revenues?.length
      ? true
      : false;
  };

  const loader = saveLoader;

  return (
    <>
      <Form
        obj={{
          loader,
          buId,
          accId,
          initData,
          allSelect,
          selectedAll,
          rowDataHandler,
          allSelect2,
          selectedAll2,
          rowDataHandler2,
          saveHandler,
          costs,
          revenues,
          shipPointDDL,
        }}
      />
    </>
  );
};

export default ServiceChargeAndIncomeElementForm;
