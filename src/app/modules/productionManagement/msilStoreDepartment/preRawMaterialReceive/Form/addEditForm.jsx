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
import PreRawMaterialReceiveForm from "./form";

const initData = {
  receiveDate: "",
  supplierName: "",
  numberOfTruck: "",
  itemName: "",
  receiveQty: "",
  numLessQty: "",
  numOverSizeQty: "",
};

const validationSchema = Yup.object().shape({
  receiveDate: Yup.string().required("Date is required"),
  numberOfTruck: Yup.string().required("Truck number is required"),
  supplierName: Yup.object()
    .shape({
      label: Yup.string().required("Supplier name is required"),
      value: Yup.string().required("Supplier name is required"),
    })
    .typeError("Supplier name is required"),
});

export default function PreRawMaterialReceiveCreate() {
  const [isDisabled, setDisabled] = useState(false);
  const [objProps, setObjprops] = useState({});
  const [modifyData, setModifyData] = useState("");
  const [itemDDL, getItemDDL] = useAxiosGet();
  const [itemList, setItemList] = useState([]);
  const [supplierDDL, getSupplierDDLDDL] = useAxiosGet();
  const [, saveData] = useAxiosPost();
  const [editData, getEditData] = useAxiosGet();
  const { id } = useParams();
  const location = useLocation();

  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  useEffect(() => {
    getItemDDL(`/mes/MSIL/GetAllMSIL?PartName=PreRawMaterialItemDDL&BusinessUnitId=${selectedBusinessUnit.value}`);
    getSupplierDDLDDL(
      `/mes/MSIL/GetAllMSIL?PartName=PreRawMaterialSupplierDDL&BusinessUnitId=${selectedBusinessUnit?.value}`
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (id) {
      getEditData(
        `/mes/MSIL/GetPreRawMaterialReceiveById?IntPreRawMaterialReceiveId=${id}`
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const { profileData } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  useEffect(() => {
    if (editData) {
      setModifyData({
        receiveDate: _dateFormatter(editData?.header?.dteReceiveDate),
        supplierName: {
          value: editData?.header?.intSupplierId,
          label: editData?.header?.strSupplierName,
        },
        numberOfTruck: editData?.header?.strTruckNumber,
      });

      const data =
        editData?.rowList?.length > 0 &&
        editData?.rowList.map((item) => ({
          intRowId: item?.intRowId,
          intPreRawMaterialReceiveId: item?.intPreRawMaterialReceiveId,
          intItemId: item?.intItemId,
          strItemName: item?.strItemName,
          intUoMid: item?.intUoMid,
          strUoMname: item?.strUoMname,
          numReceiveQty: item?.numReceiveQty,
          numLessQty: item?.numLessQty,
          numOverSizeQty: item?.numOverSizeQty,
          isActive: true,
        }));

      setItemList(data || []);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editData]);

  const saveHandler = async (values, cb) => {
    if (!itemList?.length) return toast.warn("Please add at least one item");
    saveData(
      `/mes/MSIL/CreateEditPreRawMaterialReceive`,
      {
        header: {
          sl: editData?.header?.sl || 0,
          intPreRawMaterialReceiveId:
            editData?.header?.intPreRawMaterialReceiveId || 0,
          dteReceiveDate: values?.receiveDate,
          intSupplierId: values?.supplierName?.value,
          strSupplierName: values?.supplierName?.label,
          strTruckNumber: values?.numberOfTruck,
          strRemarks: "",
          intActionBy: profileData?.userId,
          dteInsertDate: _todayDate(),
          isActive: true,
        },
        rowList: itemList.map((item) => ({
          intRowId: item?.intRowId || 0,
          intPreRawMaterialReceiveId: item?.intPreRawMaterialReceiveId || 0,
          intItemId: item?.intItemId,
          strItemName: item?.strItemName,
          intUoMid: item?.intUoMid,
          strUoMname: item?.strUoMname,
          numReceiveQty: +item?.numReceiveQty,
          numLessQty: +item?.numLessQty,
          numOverSizeQty: +item?.numOverSizeQty,
          isActive: true,
        })),
      },
      !id &&
        (() => {
          cb();
          setItemList([]);
        }),
      true
    );
  };

  const disableHandler = (cond) => {
    setDisabled(cond);
  };

  return (
    <IForm
      title={
        id ? "Edit Pre Raw Material Receive" : "Create Pre Raw Material Receive"
      }
      getProps={setObjprops}
      isDisabled={isDisabled}
      isHiddenReset={true}
    >
      {false && <Loading />}
      <PreRawMaterialReceiveForm
        {...objProps}
        initData={id ? modifyData : initData}
        saveHandler={saveHandler}
        disableHandler={disableHandler}
        itemDDL={itemDDL}
        supplierDDL={supplierDDL}
        validationSchema={validationSchema}
        id={id}
        itemList={itemList}
        setItemList={setItemList}
      />
    </IForm>
  );
}
