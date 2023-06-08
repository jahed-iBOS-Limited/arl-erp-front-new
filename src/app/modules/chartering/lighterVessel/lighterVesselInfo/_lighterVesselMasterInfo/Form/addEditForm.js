/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { getBankDDL } from "../../../../helper";
import Loading from "../../../../_chartinghelper/loading/_loading";
import {
  changeBankInfoStatus,
  getMasterBankInformation,
  // saveEditedMasterBankInformation,
  saveMasterBankInformation,
} from "../helper";
import Form from "./form";

const initData = {
  strAccountHolderName: "",
  strAccountHolderNumber: "",
  strBankName: "",
  strBankBranchName: "",
  strBankAddress: "",
  strRoutingNumber: "",
};

const headers = [
  { name: "SL" },
  { name: "A/C Holder Name" },
  { name: "A/C Holder Number" },
  { name: "Bank Name" },
  { name: "Branch Name" },
  { name: "Bank Address" },
  { name: "Routing Number" },
  { name: "Status" },
  { name: "Action" },
];

export default function LighterVesselMasterInformation({
  singleData,
  setOpen,
  viewHandler,
}) {
  const [loading, setLoading] = useState(false);
  const [rowData, setRowData] = useState([]);
  const [editMode, setEditMode] = useState({ mode: false });
  const [bankDDL, setBankDDL] = useState([]);
  const [branchDDL, setBranchDDL] = useState([]);

  // get user profile data from store
  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state?.authData;
  }, shallowEqual);

  const getRowData = () => {
    if (singleData?.lighterVesselId) {
      getMasterBankInformation(
        singleData?.lighterVesselId,
        setRowData,
        setLoading
      );
    }
  };

  useEffect(() => {
    getRowData();
    getBankDDL(setBankDDL);
  }, []);

  const addRow = (values, resetForm) => {
    const newRow = {
      intAutoId: 0,
      intLighterVesselId: singleData?.lighterVesselId,
      intAccountId: profileData?.accountId,
      intBusinessUnitId: selectedBusinessUnit?.value,
      strAccountHolderName: values?.strAccountHolderName,
      strAccountHolderNumber: values?.strAccountHolderNumber,
      strBankName: values?.strBankName?.label,
      intBankId: values?.strBankName?.value,
      strBankBranchName: values?.strBankBranchName?.label,
      intBranchId: values?.strBankBranchName?.value,
      strBankAddress: values?.strBankAddress,
      strRoutingNumber: values?.strRoutingNumber,
      isActive: true,
    };
    setRowData([...rowData, newRow]);
    resetForm(initData);
  };

  console.log("rowData", rowData);

  const saveHandler = (values, cb) => {
    if (rowData?.filter((item) => item?.isActive)?.length > 1) {
      return toast.error("You can only keep one account active.");
    }
    saveMasterBankInformation(rowData, setLoading, () => {
      cb();
      viewHandler(0, 15);
      setOpen(false);
    });
  };

  const changeStatus = (item, index, value) => {
    if (item?.intAutoId) {
      changeBankInfoStatus(item?.intAutoId, value, setLoading, () => {
        let _data = [...rowData];
        _data[index]["isActive"] = value;
        setRowData(_data);
      });
    } else {
      let _data = [...rowData];
      _data[index]["isActive"] = value;
      setRowData(_data);
    }
  };

  return (
    <>
      {loading && <Loading />}
      <Form
        title="Master's Bank Information"
        initData={initData}
        saveHandler={saveHandler}
        setLoading={setLoading}
        gridData={rowData}
        headers={headers}
        changeStatus={changeStatus}
        rowData={rowData}
        setRowData={setRowData}
        addRow={addRow}
        editMode={editMode}
        setEditMode={setEditMode}
        bankDDL={bankDDL}
        branchDDL={branchDDL}
        setBranchDDL={setBranchDDL}
      />
    </>
  );
}
