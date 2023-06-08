import React, { useState, useEffect } from "react";
import { useSelector, shallowEqual } from "react-redux";
import Form from "./form";
import IForm from "../../../../_helper/_form";
import { GetTripInfoByTripCode } from "../helper";

const initData = {
  rentAmount: 0,
  additionalCost: 0,
  additionalCostReason: "",
  deductionCost: 0,
  deductionCostReason: "",
};

export default function RentalVehicleEditForm({
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
  const [tripInfoData, setTripInfoData] = useState([]);


  
  // get initial data
  useEffect(() => {
    if (profileData?.accountId && selectedBusinessUnit?.value && id) {
      GetTripInfoByTripCode(
        profileData?.accountId, 
        selectedBusinessUnit?.value, 
        id, 
        setTripInfoData
      );
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  
  
  const saveHandler = async () => {

  };

  const [objProps, setObjprops] = useState({});

  // rowdto handler for catch data from row's input field in rowTable
  const updateRowDto = (index, value) => {
    let data = [...tripInfoData];
    data[index].totalCost = parseInt(value);
    setTripInfoData(data);
  };

 
  return (
    <IForm
      title=" Trip Info"
      getProps={setObjprops}
      isDisabled={isDisabled}
    >
      <Form
        {...objProps}
        initData={ initData }
        saveHandler={saveHandler}
        fuelTypeList={fuelTypeList}
        fuelStationDDL={fuelStationDDL}
        setFuelStationDDL={setFuelStationDDL}
        isEdit={id ? true : false}
        setFileObjects={setFileObjects}
        fileObjects={fileObjects}
        updateRowDto={updateRowDto}
        tripInfoData={tripInfoData}
        setDisabled={setDisabled}
      />
    </IForm>
  );
}
