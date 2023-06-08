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
import ProductionBreakdownForm from "./form";
import PreRawMaterialReceiveForm from "./form";

const initData = {
  date: "",
  shift: "",
  startTime: "",
  endTime: "",
  totalTime: "",
  breakdownType: "",
  machineName: "",
  subMachineName: "",
  partsName: "",
  details: "",
  shopFloor: "",
};

const validationSchema = Yup.object().shape({
  date: Yup.string().required("Date is required"),
  startTime: Yup.string().required("Start time is required"),
  endTime: Yup.string().required("End time is required"),
  shift: Yup.object()
    .shape({
      label: Yup.string().required("Shift is required"),
      value: Yup.string().required("Shift is required"),
    })
    .typeError("Shift is required"),
  breakdownType: Yup.object()
    .shape({
      label: Yup.string().required("Breakdown type is required"),
      value: Yup.string().required("Breakdown type is required"),
    })
    .typeError("Breakdown type is required"),
  machineName: Yup.object()
    .shape({
      label: Yup.string().required("Machine name is required"),
      value: Yup.string().required("Machine name is required"),
    })
    .typeError("Machine name type is required"),

  shopFloor: Yup.object()
    .shape({
      label: Yup.string().required("Shop floor is required"),
      value: Yup.string().required("Shop floor is required"),
    })
    .typeError("Shop floor is required"),
});

export default function ProductionBreakdownCreate() {
  const [isDisabled, setDisabled] = useState(false);
  const [objProps, setObjprops] = useState({});
  const [modifyData, setModifyData] = useState("");
  const [shopFloorDDL, getShopFloorDDL] = useAxiosGet();
  const [breakdownTypeDDL, getBreakdownTypeDDL] = useAxiosGet();
  const [machineDDL, getMachineDDL] = useAxiosGet();
  const [subMachineNameDDL, getSubMachineNameDDL] = useAxiosGet();
  const [partsNameDDL, getPartsNameDDL] = useAxiosGet();
  const [, saveData] = useAxiosPost();
  const { id } = useParams();
  const location = useLocation();

  useEffect(() => {}, []);

  const { profileData } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  useEffect(() => {
    if (id) {
      setModifyData({
        date: _dateFormatter(location?.state?.dteBreakDownDate),
        shift: {
          value: location?.state?.strShift,
          label: location?.state?.strShift,
        },
        startTime: location?.state?.tmStartTime,
        endTime: location?.state?.tmEndTime,
        totalTime: location?.state?.tmTotalTime,
        breakdownType: {
          value: location?.state?.intBreakDownTypeId,
          label: location?.state?.strBreakDownType,
        },
        machineName: {
          value: location?.state?.intMachineId,
          label: location?.state?.strMachineName,
        },
        subMachineName: {
          value: location?.state?.intBreakDownMachinePartsId,
          label: location?.state?.strBreakDownMachineParts,
        },
        partsName: {
          value: location?.state?.intPartsId,
          label: location?.state?.strPartsName,
        },
        details: location?.state?.strRemarks,
        shopFloor: {
          value: location?.state?.intShopFloorId,
          label: location?.state?.strShopFloorName,
        },
      });

      getBreakdownTypeDDL(
        `/mes/MSIL/GetAllMSIL?PartName=BreakDownTypeDDL&AutoId=${location?.state?.intShopFloorId}`
      );
      getMachineDDL(
        `/mes/MSIL/GetAllMSIL?PartName=BreakDownMachineDDL&AutoId=${location?.state?.intShopFloorId}`
      );
      getSubMachineNameDDL(
        `/mes/MSIL/GetAllMSIL?PartName=BreakDownMachinePartsDDL&AutoId=${location?.state?.intMachineId}`
      );
      getPartsNameDDL(
        `/mes/MSIL/GetAllMSIL?PartName=BreakDownPartsDDL&AutoId=${location?.state?.intBreakDownMachinePartsId}`
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const saveHandler = async (values, cb) => {
    saveData(
      `/mes/MSIL/CreateEditTblProductionBreakDown`,
      {
        sl: location?.state?.sl || 0,
        intProductionBreakDownId:
          location?.state?.intProductionBreakDownId || 0,
        intBusinessUnitId: selectedBusinessUnit?.value,
        intShopFloorId: values?.shopFloor?.value,
        strShopFloorName: values?.shopFloor?.label,
        intBreakDownTypeId: values?.breakdownType?.value,
        strBreakDownType: values?.breakdownType?.label,
        dteBreakDownDate: values?.date,
        intBreakDownMachinePartsId: values?.subMachineName?.value,
        strBreakDownMachineParts: values?.subMachineName?.label,
        intPartsId: values?.partsName?.value,
        strPartsName: values?.partsName?.label,
        strShift: values?.shift?.label,
        tmStartTime: id ? `${values?.startTime}` : `${values?.startTime}:00`,
        tmEndTime: id ? `${values?.endTime}` : `${values?.endTime}:00`,
        tmTotalTime: values?.totalTime,
        intMachineId: values?.machineName?.value,
        strMachineName: values?.machineName?.label,
        strRemarks: values?.details,
        intActionBy: profileData?.userId,
        dteInsertDate: _todayDate(),
        isActive: true,
      },
      !id && cb,
      true
    );
  };

  const disableHandler = (cond) => {
    setDisabled(cond);
  };

  return (
    <IForm
      title={id ? "Edit Production Breakdown" : "Create Production Breakdown"}
      getProps={setObjprops}
      isDisabled={isDisabled}
      isHiddenReset={true}
    >
      {false && <Loading />}
      <ProductionBreakdownForm
        {...objProps}
        initData={id ? modifyData : initData}
        saveHandler={saveHandler}
        disableHandler={disableHandler}
        validationSchema={validationSchema}
        id={id}
        shopFloorDDL={shopFloorDDL}
        getShopFloorDDL={getShopFloorDDL}
        breakdownTypeDDL={breakdownTypeDDL}
        getBreakdownTypeDDL={getBreakdownTypeDDL}
        machineDDL={machineDDL}
        getMachineDDL={getMachineDDL}
        subMachineNameDDL={subMachineNameDDL}
        getSubMachineNameDDL={getSubMachineNameDDL}
        partsNameDDL={partsNameDDL}
        getPartsNameDDL={getPartsNameDDL}
      />
    </IForm>
  );
}
