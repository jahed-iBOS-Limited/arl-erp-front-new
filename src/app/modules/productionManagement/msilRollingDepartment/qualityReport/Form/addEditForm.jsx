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
import QualityReportForm from "./From";

const initData = {
  heatNo: "",
  physicalTestDate: "",
  physicalTestTime: "",
  grade: "",
  numActualArea: "",
  strNominalDia: "",
  numActualDia: "",
  numActualUnitWtKg: "",
  numElongationAfterFracture: "",
  numEmfpercentage: "",
  numYieldLoad: "",
  numYieldStrengthCal: "",
  numMaximumForce: "",
  numTensileStrengthCal: "",
  numRuptureLoad: "",
  numTsYsratioCal: "",
  strBendTest: "",
  strNatureOfBillet: "",
  numBilletTempreture: "",
  numFurnaceTempreture: "",
  numTmtwaterTempreture: "",
  numBarEntryTempreture: "",
  numBarExitTempreture: "",
  numWaterFlow: "",
  numWaterPressure: "",
  strRemarks: "",
};

const validationSchema = Yup.object().shape({
  physicalTestDate: Yup.string().required("Physical Test Date is required"),
  physicalTestTime: Yup.string().required("Physical Test Time is required"),
  grade: Yup.object()
    .shape({
      label: Yup.string().required("Grade is required"),
      value: Yup.string().required("Grade is required"),
    })
    .typeError("Grade is required"),
  numActualArea: Yup.number().min(0, "Actual Area must be positive number"),
  strNominalDia: Yup.object()
    .shape({
      label: Yup.string().required("Nominal Dia is required"),
      value: Yup.string().required("Nominal Dia is required"),
    })
    .typeError("Nominal Dia is required"),
  // numActualDia: Yup.number().min(0, "Actual Dia must be positive number"),
  numActualUnitWtKg: Yup.number().min(
    0,
    "Actual unit weight must be positive number"
  ),
  numElongationAfterFracture: Yup.number().min(
    0,
    "Elongation after fracture must be positive number"
  ),
  numEmfpercentage: Yup.number().min(0, "Provide must be positive number"),
  numYieldLoad: Yup.number().min(0, "Provide must be positive number"),
  numYieldStrengthCal: Yup.number().min(0, "Provide must be positive number"),
  numMaximumForce: Yup.number().min(0, "Provide must be positive number"),
  numTensileStrengthCal: Yup.number().min(0, "Provide must be positive number"),
  numRuptureLoad: Yup.number().min(0, "Provide must be positive number"),
  numTsYsratioCal: Yup.number().min(0, "Provide must be positive number"),
  strBendTest: Yup.object()
    .shape({
      label: Yup.string().required("Bend Test is required"),
      value: Yup.string().required("Bend Test is required"),
    })
    .typeError("Bend Test is required"),
  strNatureOfBillet: Yup.object()
    .shape({
      label: Yup.string().required("Nature of billet is required"),
      value: Yup.string().required("Nature of billet is required"),
    })
    .typeError("Nature of billet is required"),
  numBilletTempreture: Yup.number().min(0, "Provide must be positive number"),
  numFurnaceTempreture: Yup.number().min(0, "Provide must be positive number"),
  numTmtwaterTempreture: Yup.number().min(0, "Provide must be positive number"),
  numBarEntryTempreture: Yup.number().min(0, "Provide must be positive number"),
  numBarExitTempreture: Yup.number().min(0, "Provide must be positive number"),
  numWaterFlow: Yup.number().min(0, "Provide must be positive number"),
  numWaterPressure: Yup.number().min(0, "Provide must be positive number"),
  strRemarks: Yup.string().required("Remarks is required"),
});

export default function QualityControlCreate() {
  const { id } = useParams();
  const location = useLocation();
  const [isDisabled, setDisabled] = useState(false);
  const [objProps, setObjprops] = useState({});
  const [modifyData, setModifyData] = useState("");
  const [productDDL, getProductDDL] = useAxiosGet();
  const [nominalDiaDDL, getNominalDiaDDL] = useAxiosGet();
  const [, saveData] = useAxiosPost();

  // ddl

  const { profileData } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  useEffect(() => {
    getNominalDiaDDL(`/mes/MSIL/GetAllMSIL?PartName=ItemSKUName&BusinessUnitId=${selectedBusinessUnit.value}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (id) {
      setModifyData({
        heatNo: location?.state?.strHeatNo,
        physicalTestDate: _dateFormatter(location?.state?.dteTestDate),
        physicalTestTime: location?.state?.tmTestTime,
        grade: {
          value: location?.state?.strGrade,
          label: location?.state?.strGrade,
        },
        numActualArea: location?.state?.numActualArea,
        strNominalDia: {
          value: location?.state?.strNominalDia,
          label: location?.state?.strNominalDia,
        },
        numActualDia: +location?.state?.numActualDia,
        numActualUnitWtKg: location?.state?.numActualUnitWtKg,
        numElongationAfterFracture: location?.state?.numElongationAfterFracture,
        numEmfpercentage: location?.state?.numEmfpercentage,
        numYieldLoad: location?.state?.numYieldLoad,
        numYieldStrengthCal: location?.state?.numYieldStrengthCal,
        numMaximumForce: location?.state?.numMaximumForce,
        numTensileStrengthCal: location?.state?.numTensileStrengthCal,
        numRuptureLoad: location?.state?.numRuptureLoad,
        numTsYsratioCal: location?.state?.numTsYsratioCal,
        strBendTest: {
          value: location?.state?.strBendTest,
          label: location?.state?.strBendTest,
        },
        strNatureOfBillet: {
          value: location?.state?.strNatureOfBillet,
          label: location?.state?.strNatureOfBillet,
        },
        numBilletTempreture: location?.state?.numBilletTempreture,
        numFurnaceTempreture: location?.state?.numFurnaceTempreture,
        numTmtwaterTempreture: location?.state?.numTmtwaterTempreture,
        numBarEntryTempreture: location?.state?.numBarEntryTempreture,
        numBarExitTempreture: location?.state?.numBarExitTempreture,
        numWaterFlow: location?.state?.numWaterFlow,
        numWaterPressure: location?.state?.numWaterPressure,
        strRemarks: location?.state?.strRemarks,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const saveHandler = async (values, cb) => {
    saveData(
      `/mes/MSIL/QualityReportCRUD`,
      {
        intRollingQualityDataId: location?.state?.intRollingQualityDataId || 0,
        strHeatNo: values?.heatNo,
        dteTestDate: values?.physicalTestDate,
        tmTestTime: values?.physicalTestTime,
        strGrade: values?.grade?.label,
        numActualArea: values?.numActualArea,
        strNominalDia: values?.strNominalDia?.label,
        numActualDia: values?.numActualDia,
        numActualUnitWtKg: values?.numActualUnitWtKg,
        numElongationAfterFracture: values?.numElongationAfterFracture,
        numEmfpercentage: values?.numEmfpercentage,
        numYieldLoad: values?.numYieldLoad,
        numYieldStrengthCal: values?.numYieldStrengthCal,
        numMaximumForce: values?.numMaximumForce,
        numTensileStrengthCal: values?.numTensileStrengthCal,
        numRuptureLoad: values?.numRuptureLoad,
        numTsYsratioCal: values?.numTsYsratioCal,
        strBendTest: values?.strBendTest?.label,
        strNatureOfBillet: values?.strNatureOfBillet?.label,
        numBilletTempreture: values?.numBilletTempreture,
        numFurnaceTempreture: values?.numFurnaceTempreture,
        numTmtwaterTempreture: values?.numTmtwaterTempreture,
        numBarEntryTempreture: values?.numBarEntryTempreture,
        numBarExitTempreture: values?.numBarExitTempreture,
        numWaterFlow: values?.numWaterFlow,
        numWaterPressure: values?.numWaterPressure,
        strRemarks: values?.strRemarks,
        intActionBy: profileData?.userId,
        dteInsertDate: _todayDate(),
        isActive: true,
      },
      id ? "" : cb,
      true
    );
  };

  const disableHandler = (cond) => {
    setDisabled(cond);
  };

  return (
    <IForm
      title={
        id ? "Edit Quality Report Entry Form" : "Quality Report Entry Form"
      }
      getProps={setObjprops}
      isDisabled={isDisabled}
      isHiddenReset={true}
    >
      {isDisabled && <Loading />}
      <QualityReportForm
        {...objProps}
        initData={id ? modifyData : initData}
        saveHandler={saveHandler}
        disableHandler={disableHandler}
        nominalDiaDDL={nominalDiaDDL}
        validationSchema={validationSchema}
      />
    </IForm>
  );
}
