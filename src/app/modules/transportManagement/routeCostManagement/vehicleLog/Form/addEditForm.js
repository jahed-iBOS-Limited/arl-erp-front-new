/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useState, useEffect } from "react";
import { useSelector, shallowEqual } from "react-redux";
import Form from "./form";
import IForm from "../../../../_helper/_form";
import {
  getFuelTypeDDL,
  getSupplierDDL,
  saveVehicleLogBook,
  empAttachment_action,
  getMailageInformation,
  getSingleData,
  EditVehicleLogBook,
} from "../helper";
import { useLocation } from "react-router-dom";
import Loading from "../../../../_helper/_loading";
import { _todayDate } from "./../../../../_helper/_todayDate";
import { _currentTime } from "../../../../_helper/_currentTime";
import { toast } from "react-toastify";

const initData = {
  travelDate: _todayDate(),
  fromAddress: "",
  fromTime: _currentTime(),
  toAddress: "",
  toTime: _currentTime(),
  startMileage: 10,
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
  purchaseType: "credit",
  rate: "",
  referenceDate: "",
  cashAmount: "",
  creditAmount: "",
};

export default function VehicleLogBookForm({
  history,
  match: {
    params: { id },
  },
}) {
  const [isDisabled, setDisabled] = useState(false);
  const { state } = useLocation();

  // redux store data
  const { profileData, selectedBusinessUnit } = useSelector(
    (state) => ({
      profileData: state?.authData?.profileData,
      selectedBusinessUnit: state?.authData?.selectedBusinessUnit,
    }),
    shallowEqual
  );

  // state
  const [fuelTypeList, setFuelTypeList] = useState([]);
  const [supplierDDL, setSupplierDDL] = useState([]);
  const [fuelStationDDL, setFuelStationDDL] = useState([]);
  const [fileObjects, setFileObjects] = useState([]);
  const [Mileage, setMileage] = useState([]);
  const [fuelCost, setFuelCost] = useState([]);
  const [singleData, setSingleData] = useState("");

  // get initial data
  useEffect(() => {
    if (profileData?.accountId && selectedBusinessUnit?.value) {
      getSupplierDDL(
        profileData.accountId,
        selectedBusinessUnit.value,
        setSupplierDDL
      );
    }
    getFuelTypeDDL(setFuelTypeList);
    if (!id) {
      getMailageInformation(state.values.vehicleNo.value, setMileage);
    } else {
      getSingleData(id, setSingleData);
    }
  }, [profileData?.accountId, selectedBusinessUnit?.value]);

  const saveHandler = async (values, cb) => {
    if (values && profileData?.accountId && selectedBusinessUnit?.value) {
      if (id) {
        let payload;
        // if (values.fuelPurchased === true) {
        payload = {
          objHeader: {
            vehicleLogId: +id,
            endMilage: values.endMileage,
            comments: values.comments,
            isFuelPurchased: values.fuelPurchased,
            actionBy: profileData?.userId,
          },
          objFuel: fuelCost,
        };
        // } else {
        //   payload = {
        //     objHeader: {
        //       vehicleLogId: +id,
        //       endMilage: values.endMileage,
        //       comments: values.comments,
        //       isFuelPurchased: values.fuelPurchased,
        //       actionBy: profileData?.userId,
        //     },
        //     objFuel: {},
        //   };
        // }
        EditVehicleLogBook(payload, setDisabled);
      } else {
        let payload;
        // if (values.fuelPurchased === true) {
        payload = {
          objVehicleLog: {
            travelCode: "string",
            accountId: profileData?.accountId,
            businessUnitId: selectedBusinessUnit?.value,
            businessUnitName: selectedBusinessUnit?.label,
            vehicleId: state.values.vehicleNo.value,
            vehicleNumber: state.values.vehicleNo.label,
            driverId: state.values.vehicleNo.driverId,
            driverName: state.values.vehicleNo.driverName,
            travelDate: values.travelDate,
            fromAddress: values.fromAddress,
            startTime: values.fromTime,
            toAddress: values.toAddress,
            endTime: values.toTime,
            vehicleStartMileage: +values.startMileage,
            vehicleEndMileage: +values.endMileage,
            vehicleConsumedMileage: +values.consumedMileage,
            isPersonalUsage:
              values.usageType.label === "Personal" ? true : false,
            isFuelPurchased: values.fuelPurchased,
            comments: values.comments || "",
            attachmentLink: "",
            actionBy: profileData?.userId,
          },
          objFuelLog: fuelCost,
        };
        // } else {
        //   payload = {
        //     objVehicleLog: {
        //       travelCode: "string",
        //       accountId: profileData?.accountId,
        //       businessUnitId: selectedBusinessUnit?.value,
        //       businessUnitName: selectedBusinessUnit?.label,
        //       vehicleId: state.values.vehicleNo.value,
        //       vehicleNumber: state.values.vehicleNo.label,
        //       driverId: state.values.vehicleNo.driverId,
        //       driverName: state.values.vehicleNo.driverName,
        //       travelDate: values.travelDate,
        //       fromAddress: values.fromAddress,
        //       startTime: values.fromTime,
        //       toAddress: values.toAddress,
        //       endTime: values.toTime,
        //       vehicleStartMileage: +values.startMileage,
        //       vehicleEndMileage: +values.endMileage,
        //       vehicleConsumedMileage: +values.consumedMileage,
        //       isPersonalUsage:
        //         values.usageType.label === "Personal" ? true : false,
        //       isFuelPurchased: values.fuelPurchased,
        //       comments: values.comments,
        //       attachmentLink: "",
        //       actionBy: profileData?.userId,
        //     },
        //     objFuelLog: {},
        //   };
        // }
        if (fileObjects.length > 0) {
          empAttachment_action(fileObjects).then((data) => {
            const modifyPlyload = {
              objVehicleLog: {
                ...payload.objVehicleLog,
                attachmentLink: data[0]?.id || "",
              },
              objFuelLog: fuelCost,
            };
            saveVehicleLogBook(modifyPlyload, cb, setDisabled);
          });
        } else {
          saveVehicleLogBook(payload, cb, setDisabled);
        }
      }
    } else {
      setDisabled(false);
    }
  };

  const addToFuelCost = (values, cb) => {
    if (values?.purchaseType === "cash") {
      if (
        fuelCost?.find(
          (item) =>
            values?.fuelType?.value === item?.fuelTypeId &&
            values?.referenceNo === item?.referenceNo &&
            values?.referenceDate === item?.referenceDate
        )
      )
        return toast.warn("can't add duplicate item");
    } else {
      if (
        fuelCost?.find(
          (item) =>
            values?.fuelType?.value === item?.fuelTypeId &&
            values?.supplier?.value === item?.supplierId &&
            values?.referenceNo === item?.referenceNo &&
            values?.referenceDate === item?.referenceDate
        )
      )
        return toast.warn("can't add duplicate item");
    }

    const obj = {
      fuelTypeId: values?.fuelType?.value,
      fuelTypeName: values?.fuelType?.label,
      fuelStationName: values?.fuelStation?.label || "",
      fuelStationId: values?.fuelStation?.value || 0,
      quantity: Number(values?.quantity),
      referenceDate: values?.referenceDate,
      referenceNo: values?.referenceNo,
      totalAmount: Number(values?.totalAmount),
      cashAmount: Number(values?.cashAmount) || 0,
      creditAmount: Number(values?.creditAmount) || 0,
      actionBy: profileData?.userId,
      paymentMethodId:
        values?.purchaseType === "cash"
          ? 1
          : values?.purchaseType === "credit"
          ? 2
          : 3,
      rate: Number(values?.rate),
      amount: Number(values?.totalAmount),
      paymentMethod: values?.purchaseType,
      businessPartnerId: values?.supplier?.value || 0,
      businessPartnerName: values?.supplier?.label || "",
      applicantEnroll:
        state?.values?.entryBy === "own"
          ? profileData?.employeeId
          : state?.values?.vehicleNo?.vehicelUserEnroll,
    };
    setFuelCost([...fuelCost, obj]);
    cb();
  };

  const remveFromFuelCost = (index) => {
    fuelCost.splice(index, 1);
    setFuelCost([...fuelCost]);
  };

  const [objProps, setObjprops] = useState({});

  return (
    <IForm
      title="Create Vehicle Log Book for (Credit)"
      getProps={setObjprops}
      isDisabled={isDisabled}
    >
      {isDisabled && <Loading />}
      <Form
        {...objProps}
        initData={
          id
            ? singleData.objHeader
            : { ...initData, startMileage: Mileage.vehicleEndMileage }
        }
        saveHandler={saveHandler}
        fuelTypeList={fuelTypeList}
        supplierDDL={supplierDDL}
        fuelStationDDL={fuelStationDDL}
        setFuelStationDDL={setFuelStationDDL}
        isEdit={id ? true : false}
        setFileObjects={setFileObjects}
        fileObjects={fileObjects}
        fuelCost={fuelCost}
        addToFuelCost={addToFuelCost}
        remveFromFuelCost={remveFromFuelCost}
        setFuelCost={setFuelCost}
      />
    </IForm>
  );
}
