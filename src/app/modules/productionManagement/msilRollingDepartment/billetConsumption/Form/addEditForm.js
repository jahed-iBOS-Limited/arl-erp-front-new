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
import BilletConsumptionForm from "./From";

const initData = {
  date: "",
  shift: "",
  mainProductName: "",
  billetWtKgs: "",
  billetInPcs: "",
  billetInKgs: "",
  directBilletWtKgs: "",
  directBilletConsumedInPcs: "",
  directBilletConsumedInKgs: "",
  totalBilletConsumedInPcs: "",
  totalBilletConsumedInKgs: "",
};

const validationSchema = Yup.object().shape({
  date: Yup.string().required("Date is required"),
  shift: Yup.object()
    .shape({
      label: Yup.string().required("Shift is required"),
      value: Yup.string().required("Shift is required"),
    })
    .typeError("Shift is required"),
  mainProductName: Yup.object()
    .shape({
      label: Yup.string().required("Main product is required"),
      value: Yup.string().required("Main product is required"),
    })
    .typeError("Shift is required"),
  billetWtKgs: Yup.string().required(
    "Re-Heating billet consumed Wt Kgs per billet is required"
  ),
  billetInPcs: Yup.string().required(
    "Re-Heating Billet Consumed in pcs required"
  ),
  directBilletWtKgs: Yup.string().required(
    "Direct charging billet consumed Wt Kgs per billet is required"
  ),
});

export default function BilletConsumptionCreate() {
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
    setModifyData({
      date: _dateFormatter(location?.state?.dteDate),
      shift: {
        value: location?.state?.strShift,
        label: location?.state?.strShift,
      },
      mainProductName: {
        value: location?.state?.intMainItemId,
        label: location?.state?.strMainItemName,
        mainItemId: location?.state?.intMainItemId,
        mainItemName: location?.state?.strMainItemName,
      },
      billetWtKgs: location?.state?.numReHeatingBilletConsumedWtKgsPerBillet,
      billetInPcs: location?.state?.intReHeatingBilletConsumedInPcs,
      billetInKgs: location?.state?.numReHeatingBilletConsumedInKgsCal,
      directBilletWtKgs:
        location?.state?.numDirectChargingBilletConsumedWtKgsPerBillet,
      directBilletConsumedInPcs:
        location?.state?.intDirectChargingBilletConsumedInPcs,
      directBilletConsumedInKgs:
        location?.state?.numDirectChargingBilletConsumedInKgsCal,
      totalBilletConsumedInPcs:
        location?.state?.intTotalBilletConsumptionInPcsCal,
      totalBilletConsumedInKgs:
        location?.state?.numTotalBilletConsumptionInKgsCal,
    });
  }, [location]);

  const saveHandler = async (values, cb) => {
    saveData(
      `/mes/MSIL/CreateEditRollingBilletConsumption`,
      {
        intBilletConsumptionId: !params?.id ? 0 : params?.id,
        dteDate: values?.date,
        strShift: values?.shift?.value,
        intMainItemId: values?.mainProductName?.mainItemId,
        strMainItemName: values?.mainProductName?.mainItemName,
        numReHeatingBilletConsumedWtKgsPerBillet: +values?.billetWtKgs,
        intReHeatingBilletConsumedInPcs: +values?.billetInPcs,
        numReHeatingBilletConsumedInKgsCal: values?.billetInKgs,
        numDirectChargingBilletConsumedWtKgsPerBillet: +values?.directBilletWtKgs,
        intDirectChargingBilletConsumedInPcs: +values?.directBilletConsumedInPcs,
        numDirectChargingBilletConsumedInKgsCal:
          values?.directBilletConsumedInKgs,
        intTotalBilletConsumptionInPcsCal: values?.totalBilletConsumedInPcs,
        numTotalBilletConsumptionInKgsCal:
          values?.billetInKgs + values?.directBilletConsumedInKgs,
        intInsertBy: profileData?.userId,
        dteInsertDateTime: _todayDate(),
        isActive: true,
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
          ? "Edit Billet Consumption Entry Form"
          : "Billet Consumption Entry Form"
      }
      getProps={setObjprops}
      isDisabled={isDisabled}
      isHiddenReset={true}
    >
      {isDisabled && <Loading />}
      <BilletConsumptionForm
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
