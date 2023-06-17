/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { shallowEqual, useSelector } from "react-redux";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import Form from "./form";

const initData = {
  businessPartner: "",
};

const RateEnrolmentForm = () => {
  const [rowData, getRowData, loading, setRowData] = useAxiosGet([]);

  // get user data from store
  const {
    profileData: { accountId: accId },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state?.authData, shallowEqual);

  const getData = (values, pageNo = 1, pageSize = 10000) => {
    const url = `/tms/LigterLoadUnload/GetShipToPartnerG2GPagination?AccountId=${accId}&BusinessUnitId=${buId}&BusinessPartnerId=${values?.businessPartner?.value}&PageNo=${pageNo}&PageSize=${pageSize}`;

    getRowData(url, (resData) => {
      const modifyData = resData?.data?.map((item) => {
        return {
          ...item,
          descriptionOfRoute: item?.shipToParterName,
          distance: "",
          from0To100: "",
          from101To200: "",
          from201To300: "",
          from301To400: "",
          from401To500: "",
          totalRate: "",
          taxAndVat: "",
          invoice: 10,
          labourBill: "",
          transportCost: "",
          additionalCost: "",
          totalCost: "",
          totalReceived: "",
          quantity: "",
          billAmount: "",
          costAmount: "",
          profitAmount: "",
        };
      });
      setRowData({
        ...resData,
        data: modifyData,
      });
    });
  };

  const saveHandler = (values) => {};

  const rowDataHandler = (name, index, value) => {
    let _data = [...rowData?.data];
    _data[index][name] = value;
    if (name === "distance") {
      let remain = 0;
      if (value > 400) {
        remain = value - 400;
        _data[index].from0To100 = 100 * 10;
        _data[index].from101To200 = 100 * 3;
        _data[index].from201To300 = 100 * 1.5;
        _data[index].from301To400 = 100 * 1.5;
        _data[index].from401To500 = remain * 1.3;
      } else if (value > 300) {
        remain = value - 300;
        _data[index].from0To100 = 100 * 10;
        _data[index].from101To200 = 100 * 3;
        _data[index].from201To300 = 100 * 1.5;
        _data[index].from301To400 = remain * 1.5;
        _data[index].from401To500 = "";
      } else if (value > 200) {
        remain = value - 200;
        _data[index].from0To100 = 100 * 10;
        _data[index].from101To200 = 100 * 3;
        _data[index].from201To300 = remain * 1.5;
        _data[index].from301To400 = "";
        _data[index].from401To500 = "";
      } else if (value > 100) {
        remain = value - 100;
        _data[index].from0To100 = 100 * 10;
        _data[index].from101To200 = remain * 3;
        _data[index].from201To300 = "";
        _data[index].from301To400 = "";
        _data[index].from401To500 = "";
      } else {
        _data[index].from0To100 = value * 10;
        _data[index].from101To200 = "";
        _data[index].from201To300 = "";
        _data[index].from301To400 = "";
        _data[index].from401To500 = "";
      }
    }
    setRowData({ ...rowData, data: _data });
  };

  const allSelect = (value, values) => {
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
          saveHandler,
          loading,
          rowData,
          initData,
          getData,
          rowDataHandler,
          allSelect,
          selectedAll,
        }}
      />
    </>
  );
};

export default RateEnrolmentForm;
