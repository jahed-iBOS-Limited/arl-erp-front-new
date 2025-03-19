/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useState, useEffect, useRef } from "react";
import { useSelector, shallowEqual } from "react-redux";
import { useParams } from "react-router";
import Loading from "../../../../_helper/_loading";
import { _todayDate } from "../../../../_helper/_todayDate";
import {
  CreatePartnerProductAllocationLcInfo,
  EditPartnerProductAllocationLcInfo,
  GetPartnerProductAllocationLcInfoById,
  getBankNameDDL,
  getSupplierCountryDDL,
  getLcDDL,
} from "../helper";
import Form from "./form";

export default function PartnerProductAllocationLcInfoForm() {
  // get user profile data from store
  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  const { id, viewId } = useParams();

  const [loading, setLoading] = useState(false);
  const [objProps] = useState({});
  const [supplierCountryDDL, setsupplierCountryDDL] = useState([]);
  const [bankDDL, setbankDDL] = useState([]);
  const [branchDDL, setbranchDDL] = useState([]);
  const [lcDDL, setLcDDL] = useState([]);

  const [singleData, setSingleData] = useState({});

  const initData = {
    lCno: "",
    lCdate: _todayDate(),
    supplierCountry: "",
    bankName: "",
    branchName: "",
    shipName: "",
    color: "",
    allotmentRefNo: "",
    allotmentRefDate: _todayDate(),
  };

  useEffect(() => {
    // Get By Id
    if (id || viewId) {
      GetPartnerProductAllocationLcInfoById(
        id || viewId,
        setSingleData,
        setLoading
      );
    }
    // DDL called
    getSupplierCountryDDL(setsupplierCountryDDL);
    getBankNameDDL(setbankDDL);
    getLcDDL(profileData?.accountId, selectedBusinessUnit?.value, setLcDDL);
  }, [profileData, selectedBusinessUnit]);

  const saveHandler = async (values, cb) => {
    if (id) {
      const data = {
        autoId: +id,
        accountId: profileData?.accountId,
        businessUnitId: selectedBusinessUnit?.value,
        lCno: values?.lCno?.label,
        // lCno: values?.lCno,
        lCdate: values?.lCdate,
        supplierCountryId: values?.supplierCountry?.value,
        supplierCountry: values?.supplierCountry?.label,
        bankId: values?.bankName?.value,
        bankName: values?.bankName?.label,
        branchId: values?.branchName?.value,
        branchName: values?.branchName?.label,
        shipName: values?.shipName,
        color: values?.color,
        allotmentRefNo: values?.allotmentRefNo,
        allotmentRefDate: values?.allotmentRefDate,
      };
      EditPartnerProductAllocationLcInfo(data, setLoading);
    } else {
      const payload = {
        accountId: profileData?.accountId,
        businessUnitId: selectedBusinessUnit?.value,
        lCno: values?.lCno?.label,
        // lCno: values?.lCno,
        lCdate: values?.lCdate,
        supplierCountryId: values?.supplierCountry?.value,
        supplierCountry: values?.supplierCountry?.label,
        bankId: values?.bankName?.value,
        bankName: values?.bankName?.label,
        branchId: values?.branchName?.value,
        branchName: values?.branchName?.label,
        shipName: values?.shipName,
        color: values?.color,
        allotmentRefNo: values?.allotmentRefNo,
        allotmentRefDate: values?.allotmentRefDate,
      };
      CreatePartnerProductAllocationLcInfo(payload, setLoading, cb);
    }
  };

  return (
    <>
      {loading && <Loading />}
      <div className="mt-0">
        <Form
          {...objProps}
          initData={id || viewId ? singleData : initData}
          saveHandler={saveHandler}
          accountId={profileData?.accountId}
          selectedBusinessUnit={selectedBusinessUnit}
          isView={viewId}
          isEdit={id}
          DDL={{
            supplierCountryDDL,
            setsupplierCountryDDL,
            bankDDL,
            setbankDDL,
            branchDDL,
            setbranchDDL,
            lcDDL,
          }}
        />
      </div>
    </>
  );
}
