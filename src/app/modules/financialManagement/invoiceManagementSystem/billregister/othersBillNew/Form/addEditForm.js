import React, { useState } from "react";
import { useSelector, shallowEqual } from "react-redux";
import Form from "./form";
// import {
//   saveFairPriceShopInvoice,
//   getWarehouseDDL,
//   uploadAttachment,
//   getPurchaseOrganizationDDL
// } from "../helper";
import { toast } from "react-toastify";
import "./purchaseInvoice.css";
import IForm from "../../../../../_helper/_form";
import { _todayDate } from "../../../../../_helper/_todayDate";
import Loading from "../../../../../_helper/_loading";
import { useLocation } from "react-router-dom";
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css
import { compressfile } from "../../../../../_helper/compressfile";
import { othersBillEntries, uploadAtt } from "../helper";

const initData = {
  payeeName: "",
  bankName: "",
  branchName: "",
  bankAccountingNo: "",
  remarks: "",
  amount: "",
  billRegisterDate: _todayDate(),
  businessTransaction: "",
  profitCenter:"",
};

export default function OthersBillCreateForm() {
  const [objProps, setObjprops] = useState({});
  const [isDisabled, setDisabled] = useState(false);
  const [fileObjects, setFileObjects] = useState([]);
  const [isModalOpen, setModalOpenState] = useState(false);
  const [purchaseOrg] = useState([]);
  const [rowData, setRowData] = useState([]);
  const location = useLocation();
  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  const saveHandler = async (values, cb) => {
    if (rowData?.length === 0) return toast.warn("At least one bill add");
    if (fileObjects.length < 1) return toast.warn("Please upload attachment");
    const payload = {
      head: rowData,
    };
    try {
      setDisabled(true);
      if (fileObjects.length > 0) {
        const compressedFile = await compressfile(
          fileObjects?.map((f) => f.file)
        );
        const uploadedImage = await uploadAtt(compressedFile);
        payload["image"] = uploadedImage?.data?.map((item) => ({
          imageId: item?.id,
        }));
      }
      setDisabled(false);
      othersBillEntries(payload, setDisabled, cb);
    } catch (error) {
      console.log(error);
      setDisabled(false);
    }
  };

  const setDataToRow = (values, cb) => {
    const rows = [...rowData];
    rows.push({
      accountID: profileData?.accountId,
      businessUnitID: selectedBusinessUnit?.value,
      plantID: location?.state?.plant?.value,
      sbuid: location?.state?.sbu?.value,
      payeeName: values?.payeeName,
      billName: "",
      bankID: values?.bankName?.value,
      bankName: values?.bankName?.label,
      bankAccountNumber: values?.bankAccountingNo,
      branchID: values?.branchName?.value,
      branchName: values?.branchName?.label,
      routingNumber: values?.branchName?.strRoutingNo,
      remarks: values?.remarks,
      insertBy: profileData?.userId,
      billID: 0,
      amount: values?.amount,
      billRegisterDate: values?.billRegisterDate,
      glId: +values?.businessTransaction?.generalLedgerId,
      glName: values?.businessTransaction?.generalLedgerName,
      glCode: values?.businessTransaction?.generalLedgerCode,
      subGlId: values?.businessTransaction?.businessTransactionId,
      subGlName: values?.businessTransaction?.businessTransactionName,
      subGlCode: values?.businessTransaction?.businessTransactionCode,
      profitCenterId : values?.profitCenter?.value,
    });
    setRowData(rows);
    cb();
  };
  const setExcelDataToRowDto = (data, values, setDisabled) => {
    const rows = [...rowData];
    data
      .filter(
        (item) =>
          item?.name &&
          item?.accountNo &&
          item?.bankName &&
          item?.branch &&
          item?.routing &&
          item?.tk
      )
      .forEach((item) => {
        rows.push({
          accountID: profileData?.accountId,
          businessUnitID: selectedBusinessUnit?.value,
          plantID: location?.state?.plant?.value,
          sbuid: location?.state?.sbu?.value,
          payeeName: item?.name?.toString(),
          billName: "",
          bankID: 0,
          bankName: item?.bankName?.toString(),
          bankAccountNumber: item?.accountNo?.toString(),
          branchID: 0,
          branchName: item?.branch?.toString(),
          routingNumber: item?.routing?.toString(),
          remarks: item?.remarks?.toString() || "",
          insertBy: profileData?.userId,
          billID: 0,
          amount: +item?.tk?.toFixed(2),
          billRegisterDate: new Date(),
          glId: +values?.businessTransaction?.generalLedgerId,
          glName: values?.businessTransaction?.generalLedgerName,
          glCode: values?.businessTransaction?.generalLedgerCode,
          subGlId: values?.businessTransaction?.businessTransactionId,
          subGlName: values?.businessTransaction?.businessTransactionName,
          subGlCode: values?.businessTransaction?.businessTransactionCode,
        });
      });
    setRowData(rows.slice(0, rows.length));
    setDisabled(false);
  };

  const removeDataFromRow = (index) => {
    const rows = [...rowData];
    rows.splice(index, 1);
    setRowData(rows);
  };
  return (
    <div>
      <IForm
        title="Create Others Bill"
        getProps={setObjprops}
        isDisabled={isDisabled}
      >
        {isDisabled && <Loading />}
        <Form
          {...objProps}
          initData={initData}
          saveHandler={saveHandler}
          profileData={profileData}
          selectedBusinessUnit={selectedBusinessUnit}
          setFileObjects={setFileObjects}
          fileObjects={fileObjects}
          purchaseOrg={purchaseOrg}
          isModalOpen={isModalOpen}
          setModalOpenState={setModalOpenState}
          rowData={rowData}
          setDataToRow={setDataToRow}
          removeDataFromRow={removeDataFromRow}
          setExcelDataToRowDto={setExcelDataToRowDto}
          setDisabled={setDisabled}
          setRowData={setRowData}
        />
      </IForm>
    </div>
  );
}
