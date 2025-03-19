import React, { useState } from "react";
import { useSelector, shallowEqual } from "react-redux";
import Form from "./form";
import IForm from "../../../../_helper/_form";
import { toast } from "react-toastify";
import { createPartnerWiseRentSetup } from "../helper";

const initData = {
  id: undefined,
  shipPoint: "",
  vehicle: "",
  rent: "",
  additionalRent: "",
  reason: "",
};

export default function PartnerWiseRentSetupForm({
  history,
  match: {
    params: { id, type },
  },
}) {
  const [isDisabled, setDisabled] = useState(false);
  const [rowDto, setRowDto] = useState([]);
  const [singleData, ] = useState("");

  const addItemToTheGrid = (values) => {
    if (values.quantity < 0) {
      return toast.warn("Quantity must be greater than 0");
    }

    let data = rowDto.find(
      (data) => data.intshippointId === values?.shipPoint.value
    );
    if (data) {
      toast.error("Item already added");
    } else {
      let itemRow = {
        intAccountId: profileData?.accountId,
        intBusinessUnitid: selectedBusinessUnit?.value,
        intPartnerId: 1,
        intshippointId: values?.shipPoint.value,
        shippointName: values?.shipPoint.label,
        intVehicleId: values?.vehicle.value,
        vehicleName: values?.vehicle.label,
        numRentAmount: +values?.rent,
        numAdditionalRentAmount: +values?.additionalRent,
        strReason: values?.reason,
        dteLastActionDateTime: "2021-04-25T09:38:01.874Z",
        dteServerDateTime: "2021-04-25T09:38:01.874Z",
        isActive: true,
      };
      setRowDto([...rowDto, itemRow]);
    }
  };

  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  const saveHandler = async (values, cb) => {
    if (values && profileData?.accountId && selectedBusinessUnit?.value) {
      const payload = {
        intRowId: 0,
        intAccountId: profileData?.accountId,
        intBusinessUnitid: selectedBusinessUnit?.value,
        intPartnerId: 1,
        intshippointId: values?.shipPoint.value,
        intVehicleId: values?.vehicle.value,
        numRentAmount: +values?.rent,
        numAditionalRentAmount: +values?.additionalRent,
        strReason: values?.reason,
        dteLastActionDateTime: "2021-04-26T04:46:00.991Z",
        dteServerDateTime: "2021-04-26T04:46:00.991Z",
        isActive: true,
      };
      createPartnerWiseRentSetup(payload, cb, setDisabled);
    } else {
      setDisabled(false);
    }
  };
  const [objProps, setObjprops] = useState({});

  return (
    <IForm
      title="Create Partner Wise Rent Setup"
      getProps={setObjprops}
      isDisabled={isDisabled}
      isHiddenSave={type === "view"}
      isHiddenReset={type === "view"}
    >
      <Form
        {...objProps}
        initData={id ? singleData : initData}
        saveHandler={saveHandler}
        // disableHandler={disableHandler}
        profileData={profileData}
        selectedBusinessUnit={selectedBusinessUnit}
        isEdit={id || false}
        rowDto={rowDto}
        setRowDto={setRowDto}
        addItemToTheGrid={addItemToTheGrid}
      />
    </IForm>
  );
}
