/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import IForm from "../../../../_helper/_form";
import Loading from "../../../../_helper/_loading";
import Form from "./form";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import { _todayDate } from "../../../../_helper/_todayDate";
import useAxiosPost from "../../../../_helper/customHooks/useAxiosPost";

const initData = {};

export default function VehicleProblemEntryForm() {
  // get user data from store
  const {
    profileData: { accountId: accId, userId },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state.authData, shallowEqual);

  const { shippointDDL: ShipPointDDL } = useSelector((state) => {
    return state?.commonDDL;
  }, shallowEqual);

  const [objProps, setObjProps] = useState({});
  const [rowData, getProblemTypes, loader, setRowData] = useAxiosGet();
  const [vehicleList, getVehicleList, vehicleLoader] = useAxiosGet();
  const [, vehicleProblemEntry, entryLoader] = useAxiosPost();

  const getAndSetRows = () => {
    getProblemTypes(
      `/tms/Vehicle/GetVehicleProblemType?businessUnitId=${buId}`,
      (resData) => {
        const modifyData = resData?.data?.map((element) => ({
          Id: 0,
          shipPoint: "",
          vehicle: "",
          shipPointId: 0,
          vehicleId: 0,
          vehicleName: "",
          problemTypeId: element?.problemTypeId,
          problemTypeName: element?.problemTypeName,
          date: _todayDate(),
          unitId: buId,
          isActive: true,
          insertBy: userId,
          insertionDate: _todayDate(),
        }));
        setRowData(modifyData);
      }
    );
  };

  useEffect(() => {
    getAndSetRows();
    getVehicleList(
      `/tms/TransportMgtDDL/GetVehicleByCapacityId?Accountid=${accId}&BusinessUnitid=${buId}&VehicleTypeID=1`
    );
  }, [buId]);

  const saveHandler = (cb) => {
    const payload = rowData?.map((item) => ({
      ...item,
      shipPointId: item?.shipPoint?.value,
      vehicleId: item?.vehicle?.value,
      vehicleName: item?.vehicle?.label,
    }));

    vehicleProblemEntry(
      `/tms/Vehicle/CreateNUpdateVechicleProblemInfo`,
      payload,
      () => {
        cb();
      },
      true
    );
  };

  const rowDataHandler = (name, index, value) => {
    let _data = [...rowData];
    _data[index][name] = value;
    setRowData(_data);
  };

  const isLoader = loader || vehicleLoader || entryLoader;
  return (
    <IForm
      title="Vehicle Problem Entry"
      getProps={setObjProps}
      isDisabled={isLoader}
      isHiddenReset
    >
      {isLoader && <Loading />}
      <Form
        {...objProps}
        initData={initData}
        saveHandler={saveHandler}
        rowData={rowData}
        vehicleList={vehicleList}
        rowDataHandler={rowDataHandler}
        ShipPointDDL={ShipPointDDL}
      />
    </IForm>
  );
}
