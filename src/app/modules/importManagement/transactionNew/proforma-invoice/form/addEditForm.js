/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useState, useEffect, useRef } from "react";
import { useSelector, shallowEqual } from "react-redux";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import IForm from "../../../../_helper/_form";
import Loading from "../../../../_helper/_loading";
import Form from "./form";
import { addDaysToDate, createPI, getSingleData, updatePi } from "../helper";
import { useParams } from "react-router";
import { _todayDate } from "../../../../_helper/_todayDate";
import { toast } from "react-toastify";
// import { setter } from "../utils";
const initData = {
  plantDDL: "",
  purchaseOrganizationDDL: "",
  pinumber: "",
  beneficiaryNameDDL: "",
  // expireDate: _dateFormatter(addDaysToDate(new Date(), 180)),
  expireDate: _todayDate(),
  lcTypeDDL: "",
  // lastShipDate: _dateFormatter(addDaysToDate(new Date(), 180)),
  lastShipDate: _todayDate(),
  incoTermsDDL: "",
  materialTypeDDL: "",
  bankNameDDL: "",
  countryOriginDDL: "",
  loadingPort: "",
  finalDestinationDDL: "",
  currencyDDL: "",
  tolerance: "",
  usance: "",
  presentation: "",
  otherTerms: "",
  itemDDL: "",
  uomDDL: "",
  quantity: "",
  rate: "",
  sbuDDL: "",
  purchaseRequestNo: "",
  isAllItem: false,
};

export default function AddEditForm() {
  const params = useParams();
  const [isDisabled, setDisabled] = useState(false);
  const [objProps, setObjprops] = useState({});
  // get singleData
  const [singleData, setSingleData] = useState("");
  const [rowDto, setRowDto] = useState([]);
  const [purchaseRequestValidity, setPurchaseRequestValidity] = useState(null);

  // get data from store
  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  useEffect(() => {
    if (params?.pid) {
      getSingleData(params?.pid, setSingleData, setRowDto, setDisabled);
    }
  }, []);
  // console.log("params", params);

  const setDataToGrid = (values, cb) => {
    let data = [...rowDto];
    if (data.find((item) => item.itemId === values?.itemDDL.value)) {
      return toast.error("Item is already added");
    } else {
      const obj = {
        itemId: values?.itemDDL.value,
        label: values?.itemDDL.label,
        itemName: values?.itemDDL.label,
        uom: { value: values?.itemDDL?.uomId, label: values?.itemDDL?.uomName },
        uomId: values?.itemDDL?.uomId,
        uomName: values?.itemDDL?.uomName,
        quantity: values?.quantity,
        rate: values?.rate,
        totalAmount: Number(values?.quantity) * Number(values?.rate),
        hscode: values?.itemDDL.hscode,
      };
      setRowDto([...rowDto, obj]);
    }
  };

  const remover = (id) => {
    let data = rowDto.filter((itm, index) => index !== id);
    setRowDto(data);
  };

  const saveHandler = async (values, cb) => {
    if (rowDto.length === 0) {
      toast.warn("Please add at least one Item");
      return;
    }
    if (params?.pid) {
      return updatePi(setDisabled, values, rowDto);
    }
    if (!purchaseRequestValidity) {
      toast.warn("Purchase Request No is not valid");
      return;
    }
    if(rowDto.find(item=>!item?.hscode)){
      return   toast.warn("HS code not found");
    }
    return createPI(
      setDisabled,
      profileData,
      selectedBusinessUnit,
      values,
      rowDto,
      cb
    );
  };

  return (
    <IForm
      title={
        params?.type === "edit"
          ? "Edit Proforma Invoice"
          : params?.type === "view"
          ? "View Proforma Invoice"
          : "Proforma Invoice"
      }
      getProps={setObjprops}
      isDisabled={params?.type === "view" ? true : isDisabled}
    >
      {isDisabled && <Loading />}
      <Form
        {...objProps}
        initData={params?.pid ? singleData : initData}
        saveHandler={saveHandler}
        viewType={params?.type}
        rowDto={rowDto}
        setRowDto={setRowDto}
        profileData={profileData}
        selectedBusinessUnit={selectedBusinessUnit}
        setDataToGrid={setDataToGrid}
        remover={remover}
        purchaseRequestValidity={purchaseRequestValidity}
        setPurchaseRequestValidity={setPurchaseRequestValidity}
        // setter={setter}
      />
    </IForm>
  );
}
