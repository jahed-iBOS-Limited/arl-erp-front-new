import React, { useEffect, useState } from "react";
import { useSelector, shallowEqual } from "react-redux";
import IForm from "../../../../_helper/_form";
import Loading from "../../../../_helper/_loading";
import * as Yup from "yup";
import useAxiosPost from "../../../../_helper/customHooks/useAxiosPost";
import { _todayDate } from "../../../../_helper/_todayDate";
import ChemicalCompositionForm from "./From";
import { useParams, useLocation } from "react-router";
import useAxiosGet from "./../../../../_helper/customHooks/useAxiosGet";

const initData = {
  date: "",
  shift: "",
  heatNo: "",
  sampleType: "",
  carbone: "",
  silicon: "",
  manganese: "",
  phosphorus: "",
  shulfer: "",
  chromium: "",
  copper: "",
  nickel: "",
  carbonEquivalent: 0,
};

// Required: date, shift(A,B,C), Heat no, sample type (Bath Sample, Final Sample),

const validationSchema = Yup.object().shape({
  date: Yup.string().required("Date is required"),
  shift: Yup.object()
    .shape({
      label: Yup.string().required("Shift is required"),
      value: Yup.string().required("Shift is required"),
    })
    .typeError("Shift is required"),
  heatNo: Yup.string().required("Heat no is required"),
  sampleType: Yup.object()
    .shape({
      label: Yup.string().required("Sample type is required"),
      value: Yup.string().required("Sample type is required"),
    })
    .typeError("Sample type is required"),
});

export default function ChemicalCompositionCreate() {
  const { id } = useParams();
  const { state } = useLocation();
  const [isDisabled, setDisabled] = useState(false);
  const [objProps, setObjprops] = useState({});
  const [, saveData, loading] = useAxiosPost();
  const [singleData, getSingleData, isLoading] = useAxiosGet();

  const {
    profileData,
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  const saveHandler = async (values, cb) => {
    const payload = {
      meltingQc: {
        intAutoId: state?.intAutoId || 0,
        dteDate: values?.date,
        strShift: values?.shift?.label,
        strHeatNo: values?.heatNo,
        strSampleType: values?.sampleType?.label,
        numC: values?.carbone || 0,
        numSi: values?.silicon || 0,
        numMn: values?.manganese || 0,
        numP: values?.phosphorus || 0,
        numS: values?.shulfer || 0,
        numCr: values?.chromium || 0,
        numCu: values?.copper || 0,
        numNi: values?.nickel || 0,
        numCe: values?.carbonEquivalent || 0,
        intInsertBy: profileData?.userId,
        dteInsertDate: _todayDate(),
        isActive: true,
      },
    };
    saveData(`/mes/MSIL/CreateEditMSIL`, payload, cb, true);
  };

  const disableHandler = (cond) => {
    setDisabled(cond);
  };

  useEffect(() => {
    if (id) {
      getSingleData(
        `/mes/MSIL/GetAllMSIL?PartName=MeltingQC&FromDate=${state?.dteDate}&ToDate=${state?.dteDate}&BusinessUnitId=${buId}&AutoId=${state?.intAutoId}`
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state?.intAutoId, buId, id]);

  return (
    <IForm
      title={"Chemical Composition Entry"}
      getProps={setObjprops}
      isDisabled={isDisabled}
      isHiddenReset={true}
    >
      {(loading || isLoading) && <Loading />}
      <ChemicalCompositionForm
        {...objProps}
        initData={initData}
        saveHandler={saveHandler}
        disableHandler={disableHandler}
        profileData={profileData}
        validationSchema={validationSchema}
        id={id}
        state={state}
        singleData={singleData}
        getSingleData={getSingleData}
        buId={buId}
      />
    </IForm>
  );
}
