/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import IForm from "../../../../_helper/_form";
import Loading from "../../../../_helper/_loading";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import useAxiosPost from "../../../../_helper/customHooks/useAxiosPost";
import Form from "./form";
import { _todayDate } from "../../../../_helper/_todayDate";
import { toast } from "react-toastify";

const initData = {
  year: "",
  month: "",
  shipPoint: "",
  vehicleCategory: "",
};

export default function TripTargetEntryForm() {
  // get user data from store
  const {
    profileData: { accountId: accId, userId },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state.authData, shallowEqual);

  const { shippointDDL: ShipPointDDL } = useSelector((state) => {
    return state?.commonDDL;
  }, shallowEqual);

  const [objProps, setObjProps] = useState({});
  const [rowData, getVehicleList, loader, setRowData] = useAxiosGet();
  const [vehicleCategories, getCategories, categoryLoader] = useAxiosGet();
  const [, vehicleTripTargetEntry, entryLoader] = useAxiosPost();

  const getAndSetRows = (values) => {
    getVehicleList(
      `/tms/TransportMgtDDL/GetVehicleByCapacityId?Accountid=${accId}&BusinessUnitid=${buId}&VehicleTypeID=${values?.vehicleCategory?.value}`,
      (resData) => {
        const modifyData = resData?.map((element) => ({
          ...element,
          vehicleId: 107,
          vehicleName: element?.label,
          tripTarget: "",
          vehicleCategory: values?.vehicleCategory?.label,
        }));
        setRowData(modifyData);
      }
    );
  };

  useEffect(() => {
    getCategories(`/tms/TransportMgtDDL/GetVehicleCapacityDDL`);
  }, [buId]);

  const saveHandler = (values, cb) => {
    const selectedItems = rowData?.filter((item) => item?.isSelected);
    if (selectedItems?.length < 1) {
      return toast.warn("Please select at least one row!");
    }
    const payload = selectedItems?.map((item) => ({
      ...item,
      shipPointId: values?.shipPoint?.value,
      vehicleId: item?.value,
      vehicleName: item?.label,
      unitId: buId,
      insertBy: userId,
      tripTarget: +item?.tripTarget,
      targetDate: _todayDate(),
      monthId: values?.month?.value,
      yearId: values?.year?.value,
    }));

    vehicleTripTargetEntry(
      `/tms/Vehicle/SaveVehicleTripTarget`,
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
  const allSelect = (value) => {
    let _data = [...rowData];
    const modify = _data.map((item) => {
      return {
        ...item,
        isSelected: value,
      };
    });
    setRowData(modify);
  };

  const selectedAll = () => {
    return rowData?.length > 0 &&
      rowData?.filter((item) => item?.isSelected)?.length === rowData?.length
      ? true
      : false;
  };

  const isLoader = loader || entryLoader || categoryLoader;
  return (
    <IForm
      title="Vehicle Trip Target Entry"
      getProps={setObjProps}
      isDisabled={isLoader}
    >
      {isLoader && <Loading />}
      <Form
        {...objProps}
        initData={initData}
        saveHandler={saveHandler}
        rowData={rowData}
        rowDataHandler={rowDataHandler}
        ShipPointDDL={ShipPointDDL}
        vehicleCategories={vehicleCategories}
        getAndSetRows={getAndSetRows}
        setRowData={setRowData}
        allSelect={allSelect}
        selectedAll={selectedAll}
      />
    </IForm>
  );
}
