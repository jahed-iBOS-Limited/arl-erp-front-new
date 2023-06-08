import React, { useEffect, useState } from "react";
import { useSelector, shallowEqual } from "react-redux";
import IForm from "../../../../_helper/_form";
import Loading from "../../../../_helper/_loading";
import MeltingProductionForm from "./From";
import * as Yup from "yup";
import useAxiosPost from "../../../../_helper/customHooks/useAxiosPost";
import { _todayDate } from "../../../../_helper/_todayDate";
import { useLocation, useParams } from "react-router-dom";
import { _dateFormatter } from "../../../../_helper/_dateFormate";

const initData = {
  date: "",
  heatNo: "",
  shift: "",
  heatStartTime: "",
  heatEndTime: "",
  totalHeatTime: "",
  siliconManganese: "",
  ferroSilicon: "",
  numFerroManganese:"",
  productionQty: "",
  perBilletWeight: 287,
  wastage: 7,
  rebConsumption: 0,
  hours: "",
  minutes: "",
  mpanelNo: "",
  crucibleNo: "",
  crucibleLiningHeatNo: "",
};

const validationSchema = Yup.object().shape({
  date: Yup.string().required("Date is required"),
  heatNo: Yup.string().required("Heat no is required"),
  mpanelNo: Yup.number().required("M.Panel no is required"),
  crucibleNo: Yup.number().required("Crucible no is required"),
  crucibleLiningHeatNo: Yup.number().required(
    "Crucible lining heat no is required"
  ),
  shift: Yup.object()
    .shape({
      label: Yup.string().required("Shift is required"),
      value: Yup.string().required("Shift is required"),
    })
    .typeError("Shift is required"),

  heatStartTime: Yup.string().required("Start Time is required"),
  heatEndTime: Yup.string().required("End Time is required"),
  productionQty: Yup.number().required("Production Qty is required"),
  perBilletWeight: Yup.number().required("Billet Weight is required"),
  wastage: Yup.number().required("Wastage is required"),
});

export default function MeltingProductionCreate() {
  const [isDisabled, setDisabled] = useState(false);
  const [objProps, setObjprops] = useState({});
  const [modifyData, setModifyData] = useState("");
  const [, saveData] = useAxiosPost();
  const params = useParams();
  const location = useLocation();

  const { profileData } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  useEffect(() => {
    setModifyData({
      date: _dateFormatter(location?.state?.dteDate),
      heatNo: location?.state?.strHeatNo,
      shift: {
        value: location?.state?.strShift,
        label: location?.state?.strShift,
      },
      heatStartTime: location?.state?.tmHeatStartTime,
      heatEndTime: location?.state?.tmHeatEndTime,
      totalHeatTime: location?.state?.tmTotalHeatTime,
      siliconManganese: location?.state?.numSiliconManganese,
      ferroSilicon: location?.state?.numFerroSilicon,
      numFerroManganese:location?.state?.numFerroManganese,
      productionQty: location?.state?.intProductionQtyPcs,
      perBilletWeight: location?.state?.numPerBilletWeight,
      wastage: location?.state?.numWastagePercentage,
      rebConsumption: location?.state?.numRebconsumption,
      hours: location?.state?.tmPowerCutHours?.split(":")[0],
      minutes: location?.state?.tmPowerCutMitutes?.split(":")[1],
      mpanelNo: location?.state?.intMpanelNo,
      crucibleNo: location?.state?.intCrucibleNo,
      crucibleLiningHeatNo: location?.state?.intCrucibleLiningHeatNo,
    });
  }, [location]);

  const saveHandler = async (values, cb) => {
    saveData(
      `/mes/MSIL/CreateEditMSIL`,
      {
        meltingProduction: {
          intAutoId: params?.id ? +params?.id : 0,
          dteDate: values?.date,
          strShift: values?.shift?.label,
          strHeatNo: values?.heatNo,
          numTotalScrapCal: 0,
          numFerroManganese: values?.numFerroManganese,
          numSiliconManganese: values?.siliconManganese,
          numFerroSilicon: values?.ferroSilicon,
          numTotalChemicalCal: 0,
          intProductionQtyPcs: values?.productionQty,
          numProductionQtyKgsCal: 0,
          numChemicalPerMtcal: 0,
          tmHeatStartTime: params?.id
            ? `${values?.heatStartTime}`
            : `${values?.heatStartTime}:00`,
          tmHeatEndTime: params?.id
            ? `${values?.heatEndTime}`
            : `${values?.heatEndTime}:00`,
          tmTotalHeatTime: values?.totalHeatTime,
          numPerBilletWeight: values?.perBilletWeight,
          numWastagePercentage: values?.wastage,
          numWastageKgsCal: 0,
          numRebconsumption: values?.rebConsumption || 0,
          numPerMtrebusedCal: 0,
          tmPowerCutHours: `${
            values?.hours?.toString()?.length < 2 ? "0" : ""
          }${values?.hours}:00:00`,
          tmPowerCutMitutes: `00:${
            values?.minutes?.toString()?.length < 2 ? "0" : ""
          }${values?.minutes}:00`,
          intMpanelNo: values?.mpanelNo,
          intCrucibleNo: values?.crucibleNo,
          intCrucibleLiningHeatNo: values?.crucibleLiningHeatNo,
          intInsertBy: profileData?.userId,
          dteInsertDateTime: _todayDate(),
          isActive: true,
        },
      },
      params?.id ? "" : cb,
      true
    );
  };

  const disableHandler = (cond) => {
    setDisabled(cond);
  };

  return (
    <IForm
      title={
        params?.id
          ? "Edit Production Entry From (Melting)"
          : "Production Entry From (Melting)"
      }
      getProps={setObjprops}
      isDisabled={isDisabled}
      isHiddenReset={true}
    >
      {isDisabled && <Loading />}
      <MeltingProductionForm
        {...objProps}
        initData={params?.id ? modifyData : initData}
        saveHandler={saveHandler}
        disableHandler={disableHandler}
        profileData={profileData}
        validationSchema={validationSchema}
        id={params?.id}
      />
    </IForm>
  );
}
