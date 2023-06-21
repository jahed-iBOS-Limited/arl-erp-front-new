/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { shallowEqual, useSelector } from "react-redux";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import Form from "./form";
import { toast } from "react-toastify";
import useAxiosPost from "../../../../_helper/customHooks/useAxiosPost";

const initData = {
  businessPartner: "",
};

const RateEnrolmentForm = () => {
  const [rowData, getRowData, loading, setRowData] = useAxiosGet([]);
  const [, postData, loader] = useAxiosPost();

  // get user data from store
  const {
    profileData: { accountId: accId, userId },
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

  function splitNumber(number) {
    const numSplits = Math.ceil(number / 100);

    const splits = [];
    let splitStart = 1;

    for (let i = 0; i < numSplits; i++) {
      const splitEnd = Math.min(splitStart + 99, number);
      splits.push(splitEnd + 1 - splitStart);
      splitStart = splitEnd + 1;
    }

    return splits;
  }

  const saveHandler = (values) => {
    const selectedItems = rowData?.data?.filter((item) => item?.isSelected);
    if (selectedItems?.length < 1) {
      return toast.warn("Please select at least one item");
    }
    const payload = selectedItems?.map((item) => {
      const totalRate =
        item?.from0To100 +
        item?.from101To200 +
        item?.from201To300 +
        item?.from301To400 +
        item?.from401To500;
      const taxAndVat = totalRate * 0.175;
      const totalCost =
        taxAndVat + +item?.invoice + +item?.labourBill + +item?.transportCost;
      // +item?.additionalCost;

      const billAmount = totalRate * +item?.quantity;
      const totalReceived = totalRate - totalCost;
      const costAmount = totalCost * +item?.quantity;
      const profitAmount = billAmount - costAmount;

      const distanceSlabs = splitNumber(item?.distance);

      return {
        id: 0,
        businessUnitId: buId,
        vehicleId: 0,
        routeDescription: item?.descriptionOfRoute,
        distance: item?.distance,
        distance1to100: distanceSlabs[0],
        costDistance1to100: item?.from0To100,
        distance101to200: distanceSlabs[1],
        costDistance101to200: item?.from101To200,
        distance201to300: distanceSlabs[2],
        costDistance201to300: item?.from201To300,
        distance301to400: distanceSlabs[3],
        costDistance301to400: item?.from301To400,
        distance401to500: distanceSlabs[4],
        costDistance401to500: item?.from401To500,
        totalDistanceCost: totalRate,
        taxVatpercentage: 17.5,
        taxVat: taxAndVat,
        invoice: item?.invoice,
        labourBill: item?.labourBill,
        transportationCost: item?.transportCost,
        additionalCost: item?.additionalCost,
        totalCost: totalCost,
        totalReceived: totalReceived,
        quantity: item?.quantity,
        billAmount: billAmount,
        costAmonut: costAmount,
        profitAmont: profitAmount,
        isActive: true,
        insertBy: userId,
        insertDateTime: new Date(),
        updateBy: userId,
        updateDateTime: new Date(),
      };
    });
    postData(
      `/tms/VehicleExpenseRegister/CreateMOPCosting`,
      payload,
      () => {},
      true
    );
  };

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
          loader,
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

export default RateEnrolmentForm;
