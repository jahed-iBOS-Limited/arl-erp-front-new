import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import * as Yup from "yup";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import useAxiosPost from "../../../../_helper/customHooks/useAxiosPost";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import IForm from "../../../../_helper/_form";
import Loading from "../../../../_helper/_loading";
import { _todayDate } from "../../../../_helper/_todayDate";
import WastageProductionForm from "./form";

const initData = {
  date: "",
  shift: "",
  productName: "",
  millRunningHour: "",
  millRunningMinute: "",
  actualProductionHour: "",
  actualProductionMinute: "",
  othersProductName: "",
  quantity: "",
  avgWeight: "",
};

const validationSchema = Yup.object().shape({
  date: Yup.string().required("Date is required"),
  millRunningHour: Yup.number().required("Mill running hour is required"),
  millRunningMinute: Yup.number().required("Mill running minute is required"),
  actualProductionHour: Yup.number().required("Production hour is required"),
  actualProductionMinute: Yup.number().required(
    "Production minute is required"
  ),
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

export default function WastageProductionCreate() {
  const [isDisabled, setDisabled] = useState(false);
  const [objProps, setObjprops] = useState({});
  const [productList, setProductList] = useState([]);
  const [productDDL, getProductDDL] = useAxiosGet();
  const [otherProductDDL, getOtherProductDDL] = useAxiosGet();
  const [, saveData] = useAxiosPost();
  const [modifyData, setModifyData] = useState("");
  const [editData, getEditData] = useAxiosGet();
  const params = useParams();

  const { profileData } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  useEffect(() => {
    if (params?.id) {
      getEditData(
        `/mes/MSIL/GetRollingWastageAndProductionHourById?HeaderId=${params?.id}`
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params?.id]);

  useEffect(() => {
    if (editData?.header?.intWastageAndProductionHourHeaderId) {
      setModifyData({
        date: _dateFormatter(editData?.header?.dteDate),
        shift: {
          value: editData?.header?.strShift,
          label: editData?.header?.strShift,
        },
        productName: {
          value: editData?.header?.intMainItemId,
          label: editData?.header?.strMainItemName,
        },
        millRunningHour: Number(
          editData?.header?.tmMillRunningHour?.split(":")[0]
        ),
        millRunningMinute: Number(
          editData?.header?.tmMillRunningHour?.split(":")[1]
        ),
        actualProductionHour: Number(
          editData?.header?.tmActualProductionHour?.split(":")[0]
        ),
        actualProductionMinute: Number(
          editData?.header?.tmActualProductionHour?.split(":")[1]
        ),
      });

      setProductList(
        editData?.rowList?.length &&
          editData?.rowList?.map((item) => ({
            othersProductName: {
              othersItemId: item?.intOtherItemId,
              othersItemName: item?.strOtherItemName,
              value: item?.intOtherItemId,
              label: item?.strOtherItemName,
            },
            quantity: item?.intQtyInPcs,
            avgWeight: item?.numAverageWeightKgsPerBillet,
            intWastageAndProductionHourHeaderId:
              item?.intWastageAndProductionHourHeaderId,
            intWastageAndProductionHourRowId:
              item?.intWastageAndProductionHourRowId,
          }))
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editData?.header?.intWastageAndProductionHourHeaderId]);

  useEffect(() => {
    getProductDDL(`/mes/MSIL/GetAllMSIL?PartName=MainItemOfRolling&BusinessUnitId=${selectedBusinessUnit.value}`);
    getOtherProductDDL(`/mes/MSIL/GetAllMSIL?PartName=OthersItemOfRolling&BusinessUnitId=${selectedBusinessUnit.value}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addHandler = (values, setFieldValue) => {
    if (!values?.othersProductName?.value)
      return toast.warn("Others product name is required");

    if (values?.othersProductName?.value === 91408 && !values?.quantity)
      return toast.warn("Quantity is required");

    if (!values?.avgWeight) return toast.warn("Avg weight is required");
    const isExist = productList.findIndex(
      (item) =>
        item?.othersProductName?.label?.replace(/\s/g, "").toLowerCase() ===
        values?.othersProductName?.label?.replace(/\s/g, "")?.toLowerCase()
    );
    if (isExist !== -1)
      return toast.warn(`${values?.othersProductName?.label} already exist`);

    setProductList([
      {
        othersProductName: values?.othersProductName,
        quantity:
          values?.othersProductName?.value === 91408 ? values.quantity : 0,
        avgWeight: values?.avgWeight,
      },
      ...productList,
    ]);

    setFieldValue("othersProductName", "");
    setFieldValue("quantity", "");
    setFieldValue("avgWeight", "");
  };

  const removeHandler = (index) => {
    const data = productList?.filter((item, i) => i !== index);
    setProductList([...data]);
  };

  const saveHandler = async (values, cb) => {
    if (!productList?.length)
      return toast.warn("Please add at least one product");

    let millRunningHour =
      values?.millRunningHour?.toString()?.length < 2
        ? `0${values?.millRunningHour}`
        : `${values?.millRunningHour}`;

    let actualProductionHour =
      values?.actualProductionHour?.toString()?.length < 2
        ? `0${values?.actualProductionHour}`
        : `${values?.actualProductionHour}`;

    let millRunningMinute =
      values?.millRunningMinute?.toString()?.length < 2
        ? `0${values?.millRunningMinute}`
        : `${values?.millRunningMinute}`;

    let actualProductionMinute =
      values?.actualProductionMinute?.toString()?.length < 2
        ? `0${values?.actualProductionMinute}`
        : `${values?.actualProductionMinute}`;

    saveData(
      `/mes/MSIL/CreateEditRollingWastageAndProductionHour`,
      {
        header: {
          intWastageAndProductionHourHeaderId:
            editData?.header?.intWastageAndProductionHourHeaderId || 0,
          dteDate: values?.date,
          strShift: values?.shift?.label,
          intMainItemId: values?.productName?.value,
          strMainItemName:
            values?.productName?.mainItemName || values?.productName?.label,
          tmMillRunningHour: `${millRunningHour}:${millRunningMinute}:00`,
          tmActualProductionHour: `${actualProductionHour}:${actualProductionMinute}:00`,
          intInsertBy: profileData?.userId,
          dteInsertDateTime: _todayDate(),
          isActive: true,
        },
        rowList: productList?.map((item) => ({
          intWastageAndProductionHourRowId:
            item?.intWastageAndProductionHourRowId || 0,
          intWastageAndProductionHourHeaderId:
            item?.intWastageAndProductionHourHeaderId || 0,
          dteDate: values?.date,
          intOtherItemId: item?.othersProductName?.value,
          strOtherItemName: item?.othersProductName?.othersItemName,
          intQtyInPcs: item?.quantity,
          numAverageWeightKgsPerBillet: item?.avgWeight,
          isActive: true,
        })),
      },

      !editData?.header?.intWastageAndProductionHourHeaderId &&
        (() => {
          cb();
          setProductList([]);
        }),
      true
    );
  };

  const disableHandler = (cond) => {
    setDisabled(cond);
  };

  return (
    <IForm
      title={"Create Wastage Production Hour"}
      getProps={setObjprops}
      isDisabled={isDisabled}
      isHiddenReset={true}
    >
      {false && <Loading />}
      <WastageProductionForm
        {...objProps}
        initData={
          editData?.header?.intWastageAndProductionHourHeaderId
            ? modifyData
            : initData
        }
        saveHandler={saveHandler}
        disableHandler={disableHandler}
        profileData={profileData}
        validationSchema={validationSchema}
        addHandler={addHandler}
        removeHandler={removeHandler}
        productList={productList}
        productDDL={productDDL}
        otherProductDDL={otherProductDDL}
        editData={editData}
        setProductList={setProductList}
      />
    </IForm>
  );
}
