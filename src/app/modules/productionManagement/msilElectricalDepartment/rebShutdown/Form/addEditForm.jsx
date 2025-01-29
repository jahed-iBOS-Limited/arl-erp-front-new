/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useLocation, useParams } from "react-router-dom";
import * as Yup from "yup";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import useAxiosPost from "../../../../_helper/customHooks/useAxiosPost";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import IForm from "../../../../_helper/_form";
import Loading from "../../../../_helper/_loading";
import { _todayDate } from "../../../../_helper/_todayDate";
import RebShutdownForm from "./form";

const initData = {
  date: "",
  shift: "",
  startTime: "",
  endTime: "",
  totalHour: "",
};

const validationSchema = Yup.object().shape({
  date: Yup.string().required("Date is required"),
  startTime: Yup.string().required("Start time is required"),
  totalHour: Yup.string().required("Total hour is required"),
  endTime: Yup.string().required("End time is required"),
  shift: Yup.object()
    .shape({
      label: Yup.string().required("Shift is required"),
      value: Yup.string().required("Shift is required"),
    })
    .typeError("Shift is required"),
});

export default function RebShutdownCreate() {
  const [isDisabled, setDisabled] = useState(false);
  const [objProps, setObjprops] = useState({});
  const [modifyData, setModifyData] = useState("");
  const [productDDL, getProductDDL] = useAxiosGet();
  const [, saveData] = useAxiosPost();
  const params = useParams();
  const location = useLocation();

  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  useEffect(() => {
    getProductDDL(`/mes/MSIL/GetAllMSIL?PartName=MainItemOfRolling&BusinessUnitId=${selectedBusinessUnit.value}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { profileData } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  useEffect(() => {
    if (params?.id) {
      setModifyData({
        date: _dateFormatter(location?.state?.dteDate),
        shift: {
          value: location?.state?.strShift,
          label: location?.state?.strShift,
        },
        startTime: location?.state?.tmStartTime,
        endTime: location?.state?.tmEndTime,
        totalHour: location?.state?.tmTotalHour,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params?.id]);

  const saveHandler = async (values, cb) => {
    saveData(
      `/mes/MSIL/CreateEditElectricalRebshutdownHour`,
      {
        sl: location?.state?.sl || 0,
        intRebshutdownId: location?.state?.intRebshutdownId || 0,
        dteDate: values?.date,
        strShift: values?.shift?.value,
        tmStartTime: params?.id
          ? `${values?.startTime}`
          : `${values?.startTime}:00`,
        tmEndTime: params?.id ? `${values?.endTime}` : `${values?.endTime}:00`,
        tmTotalHour: values?.totalHour,
        intInsertBy: profileData?.userId,
        dteInsertDateTime: _todayDate(),
      },
      !params?.id && cb,
      true
    );
  };

  const disableHandler = (cond) => {
    setDisabled(cond);
  };

  return (
    <IForm
      title={params?.id ? "Edit REB Shutdown" : "Create REB Shutdown"}
      getProps={setObjprops}
      isDisabled={isDisabled}
      isHiddenReset={true}
    >
      {false && <Loading />}
      <RebShutdownForm
        {...objProps}
        initData={params?.id ? modifyData : initData}
        saveHandler={saveHandler}
        disableHandler={disableHandler}
        productDDL={productDDL}
        validationSchema={validationSchema}
        id={params?.id}
      />
    </IForm>
  );
}
