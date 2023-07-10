/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { _todayDate } from "../../../../_helper/_todayDate";
import useAxiosPost from "../../../../_helper/customHooks/useAxiosPost";
import { GetShipPointDDL } from "../../../allotment/loadingInformation/helper";
import Form from "./form";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";

const initData = {
  businessPartner: "",
  port: "",
  motherVessel: "",
  item: "",
  warehouse: "",
  programNo: "",
};

const ServiceChargeAndIncomeElementForm = () => {
  const [costs, getCosts, costLoader, setCosts] = useAxiosGet();
  const [revenues, getRevenues, revenueLoader, setRevenues] = useAxiosGet();
  const [shipPointDDL, setShipPointDDL] = useState([]);
  const [, postData, saveLoader] = useAxiosPost();

  // get user data from store
  const {
    profileData: { accountId: accId, userId },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state?.authData, shallowEqual);

  useEffect(() => {
    GetShipPointDDL(accId, buId, setShipPointDDL);
    getCosts(
      `/costmgmt/CostElement/GetG2GServiceElement?typeId=1`,
      (resData) => {
        const modify = resData?.map((item) => ({
          elementId: item?.serviceElemenId,
          element: item?.serviceElementName,
          isSelected: false,
          rate: "",
          typeId: 1,
          typeName: "Cost",
        }));
        setCosts(modify);
      }
    );
    getRevenues(
      `/costmgmt/CostElement/GetG2GServiceElement?typeId=2`,
      (resData) => {
        const modify = resData?.map((item) => ({
          elementId: item?.serviceElemenId,
          element: item?.serviceElementName,
          isSelected: false,
          rate: "",
          typeId: 2,
          typeName: "Revenue",
        }));
        setRevenues(modify);
      }
    );
  }, [accId, buId]);

  const saveHandler = (values) => {
    const allRows = [...costs, ...revenues];
    const selectedRows = allRows?.filter((item) => item?.isSelected);

    if (selectedRows?.length < 1) {
      return toast.warn("Please select at least one row!");
    }

    const payload = {
      rateId: 0,
      programNumber: values?.programNo,
      itemId: values?.item?.value,
      uomid: 0,
      wareHouseId: values?.warehouse?.value,
      businessUnitId: buId,
      date: _todayDate(),
      lastActionBy: userId,
      isActive: true,
      serviceRows: selectedRows?.map((item) => ({
        rowId: 0,
        rateId: 0,
        serviceElemenId: item?.elementId,
        serviceElementName: item?.element,
        typeId: item?.typeId,
        typeName: item?.typeName,
        rate: +item?.rate,
        isActive: true,
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

  const loader = saveLoader || costLoader || revenueLoader;

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
