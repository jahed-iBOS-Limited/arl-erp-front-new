/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useSelector, shallowEqual } from "react-redux";
import { useParams, useLocation } from "react-router";
import { getEmployeeList } from "../../../../financialManagement/invoiceManagementSystem/salesInvoice/helper";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import useAxiosPost from "../../../../_helper/customHooks/useAxiosPost";
import Loading from "../../../../_helper/_loading";
import {
  editORDeletePartnerChequeSubmit,
  getPartnerCheckSubmitById,
} from "../helper";
import Form from "./form";

const initData = {
  customer: "",
  channel: "",
  chequeDate: "",
  amount: "",
  advance: "",
  previous: "",
  bankName: "",
  branchName: "",
  remarks: "",

  chequeBearer: "",
  chequeNo: "",

  companyBankName: "",
};

export default function PartnerCheckSubmitForm() {
  // get user data from store
  const {
    profileData: { accountId: accId, userId },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state?.authData, shallowEqual);

  const { id, type } = useParams();
  const { state } = useLocation();
  const [objProps] = useState({});
  const [channelList, getChannelList] = useAxiosGet();
  const [bankList, getBankList] = useAxiosGet();
  const [branchList, getBranchList] = useAxiosGet();
  const [rowData, setRowData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [, postData, isLoading] = useAxiosPost();
  const [singleData, setSingleData] = useState({});
  const [empList, setEmpList] = useState([]);

  useEffect(() => {
    if (!type || type === "edit") {
      getBankList(`/partner/BusinessPartnerBankInfo/GetBankInfo`);
    }
    if (!type) {
      getChannelList(
        `/oms/DistributionChannel/GetDistributionChannelDDL?AccountId=${accId}&BUnitId=${buId}`
      );
    }
    if (id) {
      getPartnerCheckSubmitById(accId, buId, 0, id, setSingleData, setLoading);
    }
    getEmployeeList(accId, buId, setEmpList, setLoading);
  }, [accId, buId, type]);

  const bankDDL = bankList?.map((item) => ({
    ...item,
    value: item?.bankId,
    label: item?.bankName,
  }));

  const branchDDL = branchList?.map((item) => ({
    ...item,
    value: item?.bankBranchId,
    label: item?.bankBranchName,
  }));

  const addRow = (values, callBack) => {
    try {
      const newRow = {
        accountId: accId,
        businessUnitId: buId,
        businessPartnerId: values?.customer?.value,
        businessPartnerName: values?.customer?.label,
        mrramount: values?.amount || 0,
        advanceAmount70P: (values?.amount / 100) * 70 || 0,
        previousAmount30P: (values?.amount / 100) * 30 || 0,
        chequeDate: values?.chequeDate,
        actionBy: userId,
        bankId: values?.bankName?.value,
        bankName: values?.bankName?.label,
        branchId: values?.branchName?.value,
        branchName: values?.branchName?.label,
        comments: values?.remarks,
        submitDate: new Date(),
        chequeNo: values?.chequeNo,
        chequeBearerId: values?.chequeBearer?.value,
        chequeBearerName: values?.chequeBearer?.label,
        companyAccountBankId: values?.companyBankName?.value,
        companyAccountBankName: values?.companyBankName?.label,
      };
      setRowData([...rowData, newRow]);
      callBack();
    } catch (e) {
      console.log(e);
    }
  };

  const deleteRow = (index) => {
    const newRow = [...rowData];
    newRow.splice(index, 1);
    setRowData(newRow);
  };

  const saveHandler = (values, cb) => {
    if (!id) {
      postData(
        `/partner/PartnerOverDue/CreateBusinessPartnerCheckForMRR`,
        rowData,
        () => {
          cb();
        },
        true
      );
    } else {
      const payload = {
        create: [],
        edit: [
          {
            configId: +id,
            mrramount: values?.amount || 0,
            advanceAmount70P: (values?.amount / 100) * 70 || 0,
            previousAmount30P: (values?.amount / 100) * 30 || 0,
            chequeDate: values?.chequeDate,
            actionBy: userId,
            bankId: values?.bankName?.value,
            bankName: values?.bankName?.label,
            branchId: values?.branchName?.value,
            branchName: values?.branchName?.label,
            comments: values?.remarks,
            isEdit: true,
            chequeNo: values?.chequeNo,
            chequeBearerId: values?.chequeBearer?.value,
            chequeBearerName: values?.chequeBearer?.label,
            companyAccountBankId: values?.companyBankName?.value,
            companyAccountBankName: values?.companyBankName?.label,
          },
        ],
        delete: [],
      };
      editORDeletePartnerChequeSubmit(payload, setLoading);
    }
  };

  return (
    <>
      {(loading || isLoading) && <Loading />}
      <div className="mt-0">
        <Form
          {...objProps}
          id={id}
          buId={buId}
          accId={accId}
          state={state}
          viewType={type}
          addRow={addRow}
          rowData={rowData}
          empList={empList}
          bankList={bankDDL}
          deleteRow={deleteRow}
          branchList={branchDDL}
          setRowData={setRowData}
          saveHandler={saveHandler}
          channelList={channelList}
          getBranchList={getBranchList}
          initData={id ? singleData : initData}
        />
      </div>
    </>
  );
}
