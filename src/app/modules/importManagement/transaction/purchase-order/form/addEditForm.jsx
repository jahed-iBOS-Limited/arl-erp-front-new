/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useState, useEffect, useRef } from "react";
import { useSelector, shallowEqual } from "react-redux";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import IForm from "../../../../_helper/_form";
import Loading from "../../../../_helper/_loading";
import Form from "./form";
import { getSingleData, createPurchaseOrder } from "../helper";
import { useParams } from "react-router";
import { _todayDate } from "../../../../_helper/_todayDate";
import { toast } from "react-toastify";
import { initData, setRowAmount, setter, Warning } from "../utils";

export default function AddEditForm({
  proformaInvoiceValue,
  viewStateOfModal,
  getGrid,
  singleDataForPoView,
  rowDto,
  setRowDto,
  setIsShowModal,
}) {
  const params = useParams();
  const [isDisabled, setDisabled] = useState(false);
  const [objProps, setObjprops] = useState({});
  const [purchaseRequestValidity, setPurchaseRequestValidity] = useState(null);

  // get data from store
  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);
  // get singleData
  const [singleData, setSingleData] = useState("");
  const remover = (id) => {
    let data = rowDto.filter((itm, index) => index !== id);
    setRowDto(data);
  };

  useEffect(() => {
    getSingleData(
      proformaInvoiceValue?.proformaInvoiceId,
      setSingleData,
      setDisabled
    );
  }, []);

  const saveHandler = async (values) => {
    console.log("saveHandler", values);
    if (rowDto.length > 0) {
      // data save from modal
      return createPurchaseOrder(
        setDisabled,
        values,
        profileData?.accountId,
        selectedBusinessUnit?.value,
        profileData?.userId,
        proformaInvoiceValue,
        rowDto,
        getGrid
      ).then((message) => {
        message && setIsShowModal(false);
        Warning(message?.data?.message);
      });
    }
    return toast.warn("Please add a row");
  };
  return (
    <IForm
      title="Purchase Order"
      getProps={setObjprops}
      isDisabled={isDisabled}
      isHiddenBack={true}
      isHiddenSave={viewStateOfModal?.view === "view"}
      isHiddenReset={viewStateOfModal?.view === "view"}
    >
      {isDisabled && <Loading />}
      <Form
        {...objProps}
        initData={
          viewStateOfModal?.purchaseOrderId
            ? singleDataForPoView
            : { ...initData, ...singleData }
        }
        saveHandler={saveHandler}
        viewType={params?.type}
        rowDto={rowDto}
        setRowDto={setRowDto}
        remover={remover}
        setter={setter}
        setRowAmount={setRowAmount}
        proformaInvoiceValue={proformaInvoiceValue}
        viewStateOfModal={viewStateOfModal}
        accountId={profileData?.accountId}
        businessUnitId={selectedBusinessUnit?.value}
        purchaseRequestValidity={purchaseRequestValidity}
        // setPurchaseRequestValidity={setPurchaseRequestValidity}
      />
    </IForm>
  );
}
