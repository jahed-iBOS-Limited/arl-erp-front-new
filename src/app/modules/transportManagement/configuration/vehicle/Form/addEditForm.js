/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useState, useEffect } from "react";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import Form from "./form";
import {
  getVehicleTypeDDLAction,
  getEmployeeListDDLAction,
  GetVehicleUsePurposeDDLAction,
  saveVehicle,
  saveEditedVehicleUnit,
  getSingleById,
  setVehicleUnitSingleEmpty,
  GetTransportModeDDLAction,
  getVehicleFuelTypeDDLAction,
  getVehicleCapacityDDLAction,
} from "../_redux/Actions";
import IForm from "../../../../_helper/_form";
import Loading from "../../../../_helper/_loading";
import { toast } from "react-toastify";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";

const initData = {
  id: undefined,
  vehicleNo: "",
  weight: "",
  volume: "",
  vehicleType: "",
  ownerType: "",
  employeeName: "",
  contact: "",
  driverName: "",
  transportmode: "",
  vehicleUsePurpose: "",
  fuelType: "",
  costPerKM: "",
  vehicleCapacity: "",
  fuelAllowanceLocalKM: "",
  fuelAllowanceOuterKM: "",
  capacityInBag: "",
  shipPoint: "",
};

export default function VehicleForm({
  history,
  match: {
    params: { id },
  },
}) {
  const [isDisabled, setDisabled] = useState(false);
  const [shipPointDDL, getShipPointDDL] = useAxiosGet();

  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  // get vehiclelist ddl from store
  const vehicleTypeDDL = useSelector((state) => {
    return state?.vehicleUnit?.vehicleTypeDDL;
  }, shallowEqual);

  // get vehiclelist ddl from store
  const employeeListDDL = useSelector((state) => {
    return state?.vehicleUnit?.employeeListDDL;
  }, shallowEqual);

  // get vehicle Use Purpose from store
  const vehicleUsePurposeDDL = useSelector((state) => {
    return state?.vehicleUnit?.vehicleUsePurposeDDL;
  }, shallowEqual);
  // getvehicleFuelTypeDDL from store
  const vehicleFuelTypeDDL = useSelector((state) => {
    return state?.vehicleUnit?.fuelTypeDDL;
  }, shallowEqual);
  //vehicleCapacityDDL from store
  const vehicleCapacityDDL = useSelector((state) => {
    return state?.vehicleUnit?.vehicleCapacityDDL;
  }, shallowEqual);

  //Dispatch Get vehiclelist action for get vehiclelist ddl
  useEffect(() => {
    if (selectedBusinessUnit?.value && profileData?.accountId) {
      dispatch(
        getVehicleTypeDDLAction(
          profileData.accountId,
          selectedBusinessUnit.value
        )
      );
      dispatch(
        getEmployeeListDDLAction(
          profileData.accountId,
          selectedBusinessUnit.value
        )
      );
      dispatch(GetTransportModeDDLAction());
      dispatch(GetVehicleUsePurposeDDLAction());
      dispatch(getVehicleFuelTypeDDLAction());
      dispatch(getVehicleCapacityDDLAction());
      getShipPointDDL(
        `/wms/ShipPoint/GetShipPointDDL?accountId=${profileData.accountId}&businessUnitId=${selectedBusinessUnit?.value}`
      );
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBusinessUnit, profileData]);

  // get single vehicleUnit from store
  const singleData = useSelector((state) => {
    return state.vehicleUnit?.singleData;
  }, shallowEqual);
  const TransportModeDDL = useSelector((state) => {
    return state?.vehicleUnit?.transportModeDDL;
  }, shallowEqual);
  const dispatch = useDispatch();

  //Dispatch single data action and empty single data for create
  useEffect(() => {
    if (id) {
      dispatch(getSingleById(id));
    } else {
      dispatch(setVehicleUnitSingleEmpty());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const saveHandler = async (values, cb) => {
    if (selectedBusinessUnit?.value === 4 && !values?.capacityInBag) {
      return toast.warn("Capacity In Bag is required!");
    }
    setDisabled(true);
    if (values && profileData?.accountId && selectedBusinessUnit?.value) {
      if (id) {
        const payload = {
          vehicleId: +id,
          vehicleNo: values.vehicleNo,
          weight: values.weight,
          volume: values.volume,
          ownerTypeId: values?.ownerType?.value,
          ownerType: values?.ownerType?.label,
          vehicleTypeId: values?.vehicleType?.value,
          driverId:
            values.ownerType.label === "Company"
              ? values?.employeeName.value
              : 2,
          driverName:
            values.ownerType.label === "Company"
              ? values?.employeeName.label
              : values.driverName,
          driverContact: values?.contact,
          actionBy: profileData.userId,
          transportMoodId: values?.transportmode.value,
          transportMoodName: values?.transportmode.label,
          vehicleUsePurposeTypeId: values?.vehicleUsePurpose?.value,
          fuelTypeId: values?.fuelType?.value,
          costPerKM: +values?.costPerKM,
          vehicleCapacityId: values?.vehicleCapacity?.value,
          localStationKmpl:
            values?.ownerType?.value === 1 ? +values?.fuelAllowanceLocalKM : 0,
          outStationKmpl:
            values?.ownerType?.value === 1 ? +values?.fuelAllowanceOuterKM : 0,
          capacityInBag: values?.capacityInBag
            ? values?.capacityInBag + " Bag"
            : "",
          shipPointId: values?.shipPoint?.value,
        };
        dispatch(saveEditedVehicleUnit(payload, setDisabled));
      } else {
        const payload = {
          vehicleNo: values?.vehicleNo,
          businessUnitId: selectedBusinessUnit?.value,
          accountId: profileData?.accountId,
          ownerTypeId: values?.ownerType?.value,
          ownerType: values?.ownerType?.label,
          vehicleTypeId: values?.vehicleType?.value,
          driverId:
            values?.ownerType?.label === "Company"
              ? values?.employeeName?.value
              : 2,
          driverName:
            values?.ownerType?.label === "Company"
              ? values?.employeeName?.label
              : values?.driverName,
          driverContact: values?.contact,
          weight: values?.weight,
          volume: values?.volume,
          actionBy: profileData?.userId,
          transportMoodId: values?.transportmode?.value,
          vehicleUsePurposeTypeId: values?.vehicleUsePurpose?.value,
          transportMoodName: values?.transportmode?.label,
          fuelTypeId: values?.fuelType?.value,
          costPerKM: +values?.costPerKM,
          vehicleCapacityId: values?.vehicleCapacity?.value,
          localStationKmpl:
            values?.ownerType?.value === 1 ? +values?.fuelAllowanceLocalKM : 0,
          outStationKmpl:
            values?.ownerType?.value === 1 ? +values?.fuelAllowanceOuterKM : 0,
          capacityInBag: values?.capacityInBag
            ? values?.capacityInBag + " Bag"
            : "",
          shipPointId: values?.shipPoint?.value,
        };
        window.payload = payload;
        dispatch(saveVehicle(payload, cb, setDisabled));
      }
    } else {
      setDisabled(false);
    }
  };

  // const disableHandler = (cond) => {
  //   setDisabled(cond);
  // };

  const [objProps, setObjprops] = useState({});

  return (
    <IForm
      title="Create Vehicle"
      getProps={setObjprops}
      isDisabled={isDisabled}
    >
      {isDisabled && <Loading />}
      <Form
        {...objProps}
        initData={singleData || initData}
        saveHandler={saveHandler}
        // disableHandler={disableHandler}
        accountId={profileData?.accountId}
        profileData={profileData}
        selectedBusinessUnit={selectedBusinessUnit}
        vehicleTypeDDL={vehicleTypeDDL}
        employeeListDDL={employeeListDDL}
        TransportModeDDL={TransportModeDDL}
        vehicleUsePurposeDDL={vehicleUsePurposeDDL}
        vehicleFuelTypeDDL={vehicleFuelTypeDDL}
        vehicleCapacityDDL={vehicleCapacityDDL}
        isEdit={id || false}
        id={id}
        shipPointDDL={shipPointDDL}
      />
    </IForm>
  );
}
