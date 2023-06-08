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
import FuelConsumptionForm from "./form";

const initData = {
  date: "",
  shift: "",
  generatorName: "",
  quantity: "",
};

const validationSchema = Yup.object().shape({
  date: Yup.string().required("Date is required"),
  quantity: Yup.number().required("Quantity is required"),
  shift: Yup.object()
    .shape({
      label: Yup.string().required("Shift is required"),
      value: Yup.string().required("Shift is required"),
    })
    .typeError("Shift is required"),
  generatorName: Yup.object()
    .shape({
      label: Yup.string().required("Generator Name is required"),
      value: Yup.string().required("Generator Name is required"),
    })
    .typeError("Generator Name is required"),
});

export default function FuelConsumptionCreate() {
  const [isDisabled, setDisabled] = useState(false);
  const [objProps, setObjprops] = useState({});
  const [modifyData, setModifyData] = useState("");
  const [productDDL, getProductDDL] = useAxiosGet();
  const [, saveData] = useAxiosPost();
  const params = useParams();
  const location = useLocation();

  useEffect(() => {
    getProductDDL(`/mes/MSIL/GetAllMSIL?PartName=MainItemOfRolling&BusinessUnitId=${selectedBusinessUnit.value}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
}, shallowEqual);

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
        generatorName: {
          value: location?.state?.strGeneratorName,
          label: location?.state?.strGeneratorName,
        },
        quantity: location?.state?.numQuantityLtr,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params?.id]);

  const saveHandler = async (values, cb) => {
    saveData(
      `/mes/MSIL/CreateEditElectricalGeneratorFuelConsumption`,
      {
        sl: location?.state?.sl || 0,
        intGeneratorFuelConsumptionId:
          location.state?.intGeneratorFuelConsumptionId || 0,
        dteDate: _dateFormatter(values?.date),
        strShift: values?.shift?.value,
        strGeneratorName: values?.generatorName?.label,
        numQuantityLtr: values?.quantity,
        intInsertBy: profileData?.userId,
        dteInsertDateTime: _todayDate(),
        intBusinessUnitId: selectedBusinessUnit?.value,
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
      title={
        params?.id
          ? "Edit Fuel Consumption Entry Form"
          : "Fuel Consumption Entry Form"
      }
      getProps={setObjprops}
      isDisabled={isDisabled}
      isHiddenReset={true}
    >
      {isDisabled && <Loading />}
      <FuelConsumptionForm
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
