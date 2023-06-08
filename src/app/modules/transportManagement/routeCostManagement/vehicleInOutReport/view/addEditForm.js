/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useState, useEffect } from "react";
import { useSelector, shallowEqual } from "react-redux";
import Form from "./form";
import { getShipmentByID } from "../helper";
import { toast } from "react-toastify";

const initData = {
  vehicleNo: "",
  driverName: "",
  routeName: "",
  distanceKm: "",
  shipmentDate: "",
  startMillage: "",
  endMillage: "",
  totalStandardCost: "",
  advanceAmount: "",
  totalActualCost: "",
  costComponent: "",
};

export default function ShipmentCostViewForm({ id }) {
  const [reset, setReset] = useState({ func: "" });
  const [isDisabled, setDisabled] = useState(true);
  const [objProps, setObjprops] = useState({});
  const [rowDto, setRowDto] = useState([]);
  const [singleData, setSingleData] = useState("");

  // get user profile data from store
  const storeData = useSelector((state) => {
    return {
      profileData: state?.authData?.profileData,
      selectedBusinessUnit: state?.authData?.selectedBusinessUnit,
    };
  }, shallowEqual);

  const { profileData, selectedBusinessUnit } = storeData;

  useEffect(() => {
    if (id) {
      getShipmentByID(id, setSingleData, setRowDto);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const saveHandler = async (values, cb) => {
    setDisabled(true);

    if (values && profileData?.accountId && selectedBusinessUnit?.value) {
      if (id) {
        const row = rowDto.map((item) => {
          return {
            actualCost: +item.actualCost,
            standardCost: +item.standardCost,
            transportRouteCostComponent: item.transportRouteCostComponent,
            transportRouteCostComponentId: item.transportRouteCostComponentId,
          };
        });
        const payload = {
          objHeader: {
            shipmentCostId: +id,
            startMillage: +values.startMillage,
            endMillage: +values.endMillage,
            advanceAmount: +values.advanceAmount,
            inOutStatus: values.handleType,
            isClose: true,
          },
          objRowList: row,
        };
        window.payload = payload;
        // editShipment(payload);
      }
    }
  };

  const setter = (values, cb) => {
    const arr = rowDto?.filter((item) => item?.value === values?.value);

    if (arr?.length > 0) {
      toast.warn("Not allowed to duplicate items");
    } else {
      console.log(values);

      const item = {
        transportRouteCostComponentId: values.value,
        transportRouteCostComponent: values?.label,
        standardCost: 0,
        actualCost: 0,
      };
      setRowDto([...rowDto, item]);
      cb();
    }
  };

  const remover = (index) => {
    const filterArr = rowDto.filter((itm, idx) => idx !== index);
    setRowDto(filterArr);
  };

  const dataHandler = (name, value, sl) => {
    const xData = [...rowDto];
    xData[sl][name] = value;
    setRowDto([...xData]);
  };

  const disableHandler = (cond) => {
    setDisabled(cond);
  };

  return (
    <Form
      {...objProps}
      initData={id ? singleData : initData}
      saveHandler={saveHandler}
      disableHandler={disableHandler}
      profileData={profileData}
      selectedBusinessUnit={selectedBusinessUnit}
      isEdit={id || false}
      setter={setter}
      remover={remover}
      setRowDto={setRowDto}
      rowDto={rowDto}
      dataHandler={dataHandler}
      reset={reset}
      setReset={setReset}
    />
  );
}
