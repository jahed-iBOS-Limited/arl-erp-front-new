/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useLocation, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import * as Yup from "yup";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import useAxiosPost from "../../../../_helper/customHooks/useAxiosPost";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import IForm from "../../../../_helper/_form";
import Loading from "../../../../_helper/_loading";
import { _todayDate } from "../../../../_helper/_todayDate";
import REBConsumptionForm from "./From";

const initData = {
  date: _todayDate(),
  shift: "",
  rebConsumptionDDL: "",
  previousPressure: "",
  previousPressureTwo: "",
  previousPressureThree: "",
  previousPressureFour: "",
  presentPressure: "",
  presentPressureTwo: "",
  presentPressureThree: "",
  presentPressureFour: "",
  totalConsumption: "",
  totalConsumptionUnit: "",
  tmReadingTime: "",
};

const validationSchema = Yup.object().shape({
  date: Yup.string().required("Date is required"),
  shift: Yup.object()
    .shape({
      label: Yup.string().required("Shift is required"),
      value: Yup.string().required("Shift is required"),
    })
    .typeError("Shift is required"),
  rebConsumptionDDL: Yup.object()
    .shape({
      label: Yup.string().required("REB Consumption Type Name is required"),
      value: Yup.string().required("REB Consumption Type Name is required"),
    })
    .typeError("Shift is required"),
  presentPressure: Yup.string().required(
    "Present KWH (Meter Reading) is required"
  ),
});

export default function REBConsumptionCreate() {
  const [isDisabled, setDisabled] = useState(false);
  const [objProps, setObjprops] = useState({});
  const [modifyData, setModifyData] = useState("");
  const [previousPressureData, getPreviousPressureData] = useAxiosGet();
  const [, saveData] = useAxiosPost();
  const params = useParams();
  const location = useLocation();

  const { profileData } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  useEffect(() => {
    setModifyData({
      date: _dateFormatter(location?.state?.dteDate),
      shift: {
        value: location?.state?.strShift,
        label: location?.state?.strShift,
      },
      rebConsumptionDDL: {
        value: location?.state?.intRebconsumptionTypeId,
        label: location?.state?.stRebconsumptionTypeName,
      },
      presentPressure: location?.state?.intEndKwh,
      previousPressure: location?.state?.intStartKwh,
      presentPressureTwo: location?.state?.intEndKwhm2 || "",
      previousPressureTwo: location?.state?.intStartKwhm2 || "",
      presentPressureThree: location?.state?.intEndKwhm3 || "",
      presentPressureFour: location?.state?.intEndKwhm4 || "",
      previousPressureThree: location?.state?.intStartKwhm3 || "",
      previousPressureFour: location?.state?.intStartKwhm4 || "",
      totalConsumption: location?.state?.intTotalRebconsumedUnitCal,
      totalConsumptionUnit: location?.state?.intMultiplyBy,
      tmReadingTime: location?.state?.tmReadingTime,
    });
  }, [location]);

  const getMultipleBy = (id) => {
    if ([4].includes(selectedBusinessUnit?.value) && (+id === 5 || +id === 6)) {
      return 30000;
    }

    if (
      [171, 244].includes(selectedBusinessUnit?.value) &&
      (+id === 3 || +id === 4)
    ) {
      return 13750;
    }

    return 1;
  };

  const saveHandler = async (values, cb) => {
    if (values?.presentPressure < values?.previousPressure) {
      return toast.warn("Present KWH can not less than Previous KWH");
    }
    if (values) {
      saveData(
        `/mes/MSIL/CreateEditElectricalRebconsumption`,
        {
          sl: 0,
          intRebconsumptionId: +params?.id || 0,
          dteDate: values?.date,
          strShift: values?.shift?.label,
          intRebconsumptionTypeId: values?.rebConsumptionDDL?.value,
          intStartKwhautoId:
            previousPressureData?.intPreviousAutoId ||
            (location?.state?.intStartKwhautoId
              ? location?.state?.intStartKwhautoId
              : 0),
          stRebconsumptionTypeName: values?.rebConsumptionDDL?.label,
          intStartKwh: +values?.previousPressure,
          intStartKwhm2: +values?.previousPressureTwo || null,
          intStartKwhm3: +values?.previousPressureThree || null,
          intStartKwhm4: +values?.previousPressureFour || null,
          intBusinessUnitId: selectedBusinessUnit?.value,
          tmReadingTime:
            selectedBusinessUnit?.value === 171 ||
            selectedBusinessUnit?.value === 224
              ? ""
              : values?.tmReadingTime || "",
          intEndKwh: +values?.presentPressure,
          intEndKwhm2: +values?.presentPressureTwo || null,
          intEndKwhm3: +values?.presentPressureThree || null,
          intEndKwhm4: +values?.presentPressureFour || null,
          intTotalRebconsumedUnitCal: values?.totalConsumption,
          intMultiplyBy: getMultipleBy(values?.rebConsumptionDDL?.value),
          intInsertBy: profileData?.userId,
          dteInsertDateTime: _todayDate(),
        },
        params?.id ? "" : cb,
        true
      );
    }
  };

  const disableHandler = (cond) => {
    setDisabled(cond);
  };

  return (
    <IForm
      title={
        params?.id
          ? "Edit REB Consumption Entry Form"
          : "REB Consumption Entry Form"
      }
      getProps={setObjprops}
      isDisabled={isDisabled}
      isHiddenReset={true}
    >
      {isDisabled && <Loading />}
      <REBConsumptionForm
        {...objProps}
        initData={params?.id ? modifyData : initData}
        location={location}
        saveHandler={saveHandler}
        disableHandler={disableHandler}
        validationSchema={validationSchema}
        getPreviousPressureData={getPreviousPressureData}
        selectedBusinessUnit={selectedBusinessUnit}
      />
    </IForm>
  );
}
