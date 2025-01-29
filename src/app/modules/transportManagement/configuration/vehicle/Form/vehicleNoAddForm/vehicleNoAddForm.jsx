/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useRef } from "react";
import {
  ModalProgressBar,
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "../../../../../../../_metronic/_partials/controls";
import { useSelector, shallowEqual } from "react-redux";
import Form from "./form";

const initData = {
  vehicleCity: "",
  vehicleRegistrationLetter: "",
  vehicleRegistrationNumber: "",
  vehicleManualNo: "",
  vehicleManualFinalNo: "",
};

export default function VehicleNoAddForm({
  setIsShowModal,
  setPrevValues,
  prevValues,
  id,
}) {
  const [isDisabled, setDisabled] = useState(true);
  const btnRef = useRef();

  // Get profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);
  // Get Selected Business unit data from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  const saveVehicleNoDDL = async (values) => {
    setDisabled(true);
    if (values && profileData?.accountId && selectedBusinessUnit?.value) {
      let vehicleManualNo = `${values?.vehicleCity?.label} ${values?.vehicleRegistrationLetter?.label} ${values?.vehicleRegistrationNumber?.label}-${values?.vehicleManualNo}`;
      setPrevValues({
        ...prevValues,
        vehicleNo: vehicleManualNo
      })
    }
  };

  const saveBtnClicker = () => {
    if (btnRef && btnRef.current) {
      btnRef.current.click();
    }
  };
  const disableHandler = (cond) => {
    setDisabled(cond);
  };
  return (
    <div>
      <Card>
        {true && <ModalProgressBar />}
        <CardHeader title="Create Vehicle No">
          <CardHeaderToolbar>
            {`  `}
            <button
              type="submit"
              className="btn btn-primary ml-2"
              onClick={saveBtnClicker}
              ref={btnRef}
              disabled={isDisabled}
            >
              Save
            </button>
          </CardHeaderToolbar>
        </CardHeader>
        <CardBody>
          <div className="mt-0">
            <Form
              initData={initData}
              btnRef={btnRef}
              saveBtnClicker={saveBtnClicker}
              disableHandler={disableHandler}
              setIsShowModal={setIsShowModal}
              saveVehicleNoDDL={saveVehicleNoDDL}
              id={id}
            />
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
