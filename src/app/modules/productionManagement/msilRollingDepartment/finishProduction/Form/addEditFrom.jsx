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
import FinishProductionForm from "./form";

const initData = {
  date: "",
  shift: "",
  productName: "",
  productionKgs: "",
  rodQuantityKgs: "",
};

const validationSchema = Yup.object().shape({
  date: Yup.string().required("Date is required"),
  productionKgs: Yup.number().required("Production is required"),
  rodQuantityKgs: Yup.number().required("Quantity is required"),
  shift: Yup.object()
    .shape({
      label: Yup.string().required("Shift is required"),
      value: Yup.string().required("Shift is required"),
    })
    .typeError("Shift is required"),

  productName: Yup.object()
    .shape({
      label: Yup.string().required("Product name is required"),
      value: Yup.string().required("Product name is required"),
    })
    .typeError("Product name is required"),
});

export default function FinishProductionCreate() {
  const [isDisabled, setDisabled] = useState(false);
  const [objProps, setObjprops] = useState({});
  const [, saveData] = useAxiosPost();
  const [productDDL, getProductDDL] = useAxiosGet();
  const [modifyData, setModifyData] = useState("");
  const params = useParams();
  const location = useLocation();

  const { profileData } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  useEffect(() => {
    getProductDDL(`/mes/MSIL/GetAllMSIL?PartName=MainItemOfRolling&BusinessUnitId=${selectedBusinessUnit.value}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (params?.id) {
      setModifyData({
        date: _dateFormatter(location?.state?.dteDate),
        shift: {
          value: location?.state?.strShift,
          label: location?.state?.strShift,
        },
        productName: {
          value: location?.state?.intMainItemId,
          label: location?.state?.strMainItemName,
        },
        productionKgs: location?.state?.numProductionQtyKgs,
        rodQuantityKgs: location?.state?.numOddCutRodQtyKgs,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params?.id]);

  const saveHandler = async (values, cb) => {
    saveData(
      `/mes/MSIL/CreateEditRollingFinishProduct`,
      {
        intFinishProductionId: params?.id
          ? location?.state?.intFinishProductionId
          : 0,
        dteDate: values?.date,
        strShift: values?.shift?.label,
        intMainItemId: values?.productName?.value,
        strMainItemName: values?.productName?.mainItemName,
        numProductionQtyKgs: values?.productionKgs,
        numOddCutRodQtyKgs: values?.rodQuantityKgs,
        intInsertBy: profileData?.userId,
        dteInsertDateTime: _todayDate(),
        isActive: true,
      },
      params?.id ? null : cb,
      true
    );
  };

  const disableHandler = (cond) => {
    setDisabled(cond);
  };

  return (
    <IForm
      title={params?.id ? "Edit Finish Production" : "Create Finish Production"}
      getProps={setObjprops}
      isDisabled={isDisabled}
      isHiddenReset={true}
    >
      {isDisabled && <Loading />}
      <FinishProductionForm
        {...objProps}
        initData={params?.id ? modifyData : initData}
        saveHandler={saveHandler}
        disableHandler={disableHandler}
        profileData={profileData}
        validationSchema={validationSchema}
        productDDL={productDDL}
        id={params?.id}
      />
    </IForm>
  );
}
