/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useState, useEffect } from "react";
import { useSelector, shallowEqual } from "react-redux";
import Form from "./form";
import { getSingleData } from "../helper";
import ICustomCard from "../../../../_helper/_customCard";

const initData = {
  travelDate: "",
  fromAddress: "",
  fromTime: "",
  toAddress: "",
  toTime: "",
  startMileage: "",
  endMileage: "",
  consumedMileage: "",
  usageType: "",
  fuelPurchased: false,
  fuelType: "",
  quantity: "",
  totalAmount: "",
  paymentMethod: "",
  supplier: "",
  fuelStation: "",
  referenceNo: "",
  comments: "",
};

export default function VehicleLogBook({ id }) {
  const [isDisabled, setDisabled] = useState(true);
  const [fuelCost,setFuelCost] = useState([])

  // redux store data
  const { profileData, selectedBusinessUnit } = useSelector(
    (state) => ({
      profileData: state?.authData?.profileData,
      selectedBusinessUnit: state?.authData?.selectedBusinessUnit,
    }),
    shallowEqual
  );

  const [singleData, setSingleData] = useState("");

  // get initial data
  useEffect(() => {
    if (!id) {
    } else {
      getSingleData(id, setSingleData,(data)=>{
        setFuelCost(data)
      });
    }
  }, [profileData?.accountId, selectedBusinessUnit?.value]);




  const disableHandler = (cond) => {
    setDisabled(cond);
  };
  const [objProps, setObjprops] = useState({});

  return (
    <ICustomCard
      title="View Vehicle Log Book"
      getProps={setObjprops}
      isDisabled={isDisabled}
    >
      <Form
        {...objProps}
        isEdit={id}
        initData={id ? singleData.objHeader : initData}
        disableHandler={disableHandler}
        fuelCost={fuelCost}
      />
    </ICustomCard>
  );
}
