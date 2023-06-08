import React, { useState, useEffect } from "react";
import { useSelector, shallowEqual } from "react-redux";
import IForm from "../../../../_helper/_form";
import Loading from "../../../../_helper/_loading";
import { editTripInformation, GetTripInfoByTripId } from "../helper";
import Form from "./form";

export default function RentalVehicleCostEditForm({
  history,
  match: {
    params: { id },
  },
}) {
  const [isDisabled, setDisabled] = useState(false);

  // redux store data
  const { profileData, selectedBusinessUnit } = useSelector(
    (state) => ({
      profileData: state?.authData?.profileData,
      selectedBusinessUnit: state?.authData?.selectedBusinessUnit,
    }),
    shallowEqual
  );

  // state
  const [fuelTypeList] = useState([]);
  const [fuelStationDDL, setFuelStationDDL] = useState([]);
  const [fileObjects, setFileObjects] = useState([]);
  const [tripInfoData, setTripInfoData] = useState({});
  const [loading, setLoading] = useState(false);

  // get initial data
  useEffect(() => {
    if (profileData?.accountId && selectedBusinessUnit?.value && id) {
      GetTripInfoByTripId(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        id,
        setTripInfoData,
        setLoading
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const saveHandler = async () => {
    const { totalCost, additionalCost, deductionCost } = tripInfoData;
    const payload = {
      tripId: +id,
      totalCost: totalCost,
      additionalCost: additionalCost,
      deductionCost: deductionCost,
      userId: profileData?.userId,
    };
    editTripInformation(payload, setLoading);
  };

  const [objProps, setObjprops] = useState({});

  return (
    <IForm
      isHiddenSave={true}
      isHiddenReset={true}
      title="Trip Info"
      getProps={setObjprops}
      isDisabled={isDisabled}
    >
      {loading && <Loading />}
      <Form
        {...objProps}
        saveHandler={saveHandler}
        fuelTypeList={fuelTypeList}
        fuelStationDDL={fuelStationDDL}
        setFuelStationDDL={setFuelStationDDL}
        isEdit={id ? true : false}
        setFileObjects={setFileObjects}
        fileObjects={fileObjects}
        tripInfoData={tripInfoData}
        setDisabled={setDisabled}
        setTripInfoData={setTripInfoData}
      />
    </IForm>
  );
}
