/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useState, useEffect } from "react";
import { useSelector, shallowEqual } from "react-redux";
import Form from "./form";
import IForm from "../../../../_helper/_form";
import Loading from "../../../../_helper/_loading";
import {
  EditShipmentStandardCost_api,
  getChalanInfo,
  getDistanceKm,
  getShippingInfo,
  getSupplierDDL,
  getFormDataByShipmentId,
} from "./helper";

// const initData = {
//   rentAmount: 0,
//   additionalCost: 0,
//   additionalCostReason: "",
//   deductionCost: 0,
//   deductionCostReason: "",
// };

export default function RentalVehicleViewForm({ id }) {
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

  const [supplierDDL, setSupplierDDL] = useState([]);
  const [distanceKM, setDistanceKM] = useState([]);
  const [shippingInfo, setShippingInfo] = useState([]);
  const [chalanInfo, setChalanInfo] = useState([]);
  const [singleData, setSingleData] = useState([]);

  // get initial data
  useEffect(() => {
    getDistanceKm(id, setDistanceKM);
    getShippingInfo(id, setShippingInfo);
    getChalanInfo(id, setChalanInfo);
    getFormDataByShipmentId(
      id,
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setSingleData,
      setDisabled
    );
  }, [id]);

  useEffect(() => {
    const mergeTwoRow = [...distanceKM, ...shippingInfo];
    const invalidInputData = mergeTwoRow.filter((item) => item.oldValue <= 0);
    if (invalidInputData?.length > 0) {
      setDisabled(true);
    } else {
      setDisabled(false);
    }
  }, [distanceKM, shippingInfo]);

  useEffect(() => {
    getSupplierDDL(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setSupplierDDL
    );
  }, [profileData?.accountId, selectedBusinessUnit?.value]);

  const saveHandler = async (values, cb) => {
    // const getZeroKMItems = distanceKM?.filter(item => item?.)

    if (values && profileData?.accountId && selectedBusinessUnit?.value) {
      const payload = [
        {
          tripId: values?.tripId || 0,
          additionalCost: +values?.additionalCost || 0,
          additionalCostReason: values?.additionalCostReason || "",
          deductionCost: +values?.deductionCost || 0,
          deductionCostReason: values?.deductionCostReason || "",
          actionBy: profileData?.userId,
          vehicleSupplierId: values?.supplier?.value || 0,
          vehicleSupplierName: values?.supplier?.label || "",
        },
      ];
      EditShipmentStandardCost_api(payload, () => {}, setDisabled);

      console.log(payload);
    } else {
      setDisabled(false);
    }
  };

  const [objProps, setObjprops] = useState({});

  // rowdto handler for catch data from row's input field in rowTable
  const distanceRowDtoHandler = (name, value, sl) => {
    let data = [...distanceKM];
    let _sl = data[sl];
    _sl[name] = value;
    setDistanceKM(data);
  };

  // rowdto handler for catch data from row's input field in rowTable
  const shippingRowDtoHandler = (name, value, sl) => {
    let data = [...shippingInfo];
    let _sl = data[sl];
    _sl[name] = value;
    setShippingInfo(data);
  };

  return (
    <IForm
      title=" Rental Vehilce Bill Generate"
      getProps={setObjprops}
      isDisabled={isDisabled}
      isHiddenReset
      isHiddenBack
      isHiddenSave
    >
      {isDisabled && <Loading />}
      <Form
        {...objProps}
        initData={singleData}
        saveHandler={saveHandler}
        fuelTypeList={fuelTypeList}
        supplierDDL={supplierDDL}
        fuelStationDDL={fuelStationDDL}
        setFuelStationDDL={setFuelStationDDL}
        isEdit={id ? true : false}
        setFileObjects={setFileObjects}
        fileObjects={fileObjects}
        distanceKM={distanceKM}
        shippingInfo={shippingInfo}
        chalanInfo={chalanInfo}
        distanceRowDtoHandler={distanceRowDtoHandler}
        shippingRowDtoHandler={shippingRowDtoHandler}
        selectedBusinessUnit={selectedBusinessUnit}
      />
    </IForm>
  );
}
