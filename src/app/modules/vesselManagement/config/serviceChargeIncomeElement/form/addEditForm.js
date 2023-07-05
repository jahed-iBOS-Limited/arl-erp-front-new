/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { shallowEqual, useSelector } from "react-redux";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import Form from "./form";

const initData = {
  businessPartner: "",
  port: "",
  motherVessel: "",
  item: "",
};

const ServiceChargeAndIncomeElementForm = () => {
  const [rowData, , loading, setRowData] = useAxiosGet([]);

  // get user data from store
  const {
    profileData: { accountId: accId },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state?.authData, shallowEqual);

  const getData = (values, pageNo = 1, pageSize = 10000) => {};

  const saveHandler = (values) => {};

  const rowDataHandler = (name, index, value) => {
    let _data = [...rowData?.data];
    _data[index][name] = value;

    setRowData({ ...rowData, data: _data });
  };

  const allSelect = (value) => {
    let _data = [...rowData?.data];
    const modify = {
      ...rowData,
      data: _data.map((item) => {
        return {
          ...item,
          isSelected: value,
        };
      }),
    };
    setRowData(modify);
  };

  const selectedAll = () => {
    return rowData?.data?.length > 0 &&
      rowData?.data?.filter((item) => item?.isSelected)?.length ===
        rowData?.data?.length
      ? true
      : false;
  };

  return (
    <>
      <Form
        obj={{
          buId,
          accId,
          loading,
          rowData,
          getData,
          initData,
          allSelect,
          selectedAll,
          saveHandler,
          rowDataHandler,
        }}
      />
    </>
  );
};

export default ServiceChargeAndIncomeElementForm;
