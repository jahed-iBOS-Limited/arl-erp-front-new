/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */

import React, { useEffect, useState } from "react";
import { useSelector, shallowEqual } from "react-redux";
import { useParams } from "react-router";
import { toast } from "react-toastify";
import {
  createAdditionalCost,
  deleteAdditionalCost,
  editOrCashReceive,
  getAdditionalCostById,
  getCostTypeDDL,
} from "../helper";
import Form from "./form";
import { useLocation } from "react-router-dom";
import { _todayDate } from "../../../_chartinghelper/_todayDate";
import { getVesselDDL } from "../../../helper";
import IConfirmModal from "../../../_chartinghelper/_confirmModal";
import Loading from "../../../_chartinghelper/loading/_loading";

const initData = {
  vesselName: "",
  voyageNo: "",
  voyageType: "",
  costType: "",
  cost: "",
  costAmount: "",
  totalAmount: "",
  advanceAmount: "",
  dueAmount: "",
  businessPartner: "",
  transactionDate: _todayDate(),
};

export default function ExpenseForm() {
  const { state } = useLocation();
  const { type, id } = useParams();
  const [loading, setLoading] = useState(false);
  const [vesselDDL, setVesselDDL] = useState([]);
  const [chartererDDL, setChartererDDL] = React.useState([]);
  const [rowData, setRowData] = useState([]);
  const [costTypeDDL, setCostTypeDDL] = useState([]);
  const [businessPartnerDDL, setBusinessPartnerDDL] = useState([]);

  // get user profile data from store
  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state?.authData;
  }, shallowEqual);

  useEffect(() => {
    getVesselDDL(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setVesselDDL
    );
    if (id) {
      getAdditionalCostById(
        state?.vesselId,
        state?.voyageId,
        setRowData,
        setLoading,
        (data) => {
          getCostTypeDDL(data?.voyageTypeId, setCostTypeDDL, setLoading);
        }
      );
    }
  }, [profileData, selectedBusinessUnit, id, state]);

  const addRow = (values, setFieldValue) => {
    // if (Number(values?.advanceAmount) > Number(values?.totalAmount)) {
    //   return toast.error("Advance amount should be less than total amount");
    // }
    // if (rowData?.find((item) => item?.costId === values?.costType?.value)) {
    //   return toast.warn("Cost already added");
    // }
    if (!values?.voyageNo?.voyageTypeID) {
      return toast.warn("Voyage type is required");
    }
    const newRow = {
      additionalCost: 0,
      voyageId: values?.voyageNo?.value,
      voyageName: values?.voyageNo?.label,
      vesselId: values?.vesselName?.value,
      vesselName: values?.vesselName?.label,
      voyageTypeId: values?.voyageNo?.voyageTypeID,
      voyageTypeName: values?.voyageNo?.voyageTypeName,
      costId: values?.costType?.value,
      costName: values?.costType?.label,
      costAmount: values?.costAmount || 0,
      totalAmount: values?.totalAmount,
      advanceAmount: values?.advanceAmount,
      paidAmount: values?.advanceAmount,
      dueAmount: values?.dueAmount,
      partnerId: values?.businessPartner?.value,
      partnerName: values?.businessPartner?.label,
      entryDate: values?.transactionDate,
      lastTransactionDate: _todayDate(),
    };
    setRowData([...rowData, newRow]);
    setFieldValue("businessPartner", "");
    setFieldValue("costType", "");
    setFieldValue("totalAmount", "");
    setFieldValue("advanceAmount", "");
    setFieldValue("dueAmount", "");
    setFieldValue("costAmount", "");
  };

  const removeRow = (index) => {
    if (rowData[index]?.additionalCost) {
      IConfirmModal({
        title: "Delete Cost",
        message: "Are you sure you want to delete this cost?",
        yesAlertFunc: () => {
          deleteAdditionalCost(
            rowData[index]?.additionalCost,
            setLoading,
            () => {
              setRowData(rowData?.filter((_, i) => i !== index));
            }
          );
        },
        noAlertFunc: () => {},
      });
    } else {
      setRowData(rowData?.filter((_, i) => i !== index));
    }
  };

  const saveHandler = (values, cb) => {
    if (!type) {
      createAdditionalCost(
        rowData?.filter((e) => e?.additionalCost === 0),
        setLoading,
        () => {
          cb();
          setRowData([]);
        }
      );
    } else {
      editOrCashReceive(
        rowData?.filter((e) => e?.additionalCost === 0),
        setLoading,
        () => {}
      );
    }
  };

  const { vesselId, vesselName, voyageTypeName, voyageName, voyageId } =
    rowData?.[0] || {};

  return (
    <>
      {loading && <Loading />}
      <Form
        title={
          type === "view"
            ? "View Expense"
            : type === "edit"
            ? "Edit Expense"
            : "Create Expense"
        }
        initData={
          id
            ? {
                vesselName: { value: vesselId, label: vesselName },
                voyageNo: { value: voyageId, label: voyageName },
                voyageType: voyageTypeName,
              }
            : initData
        }
        saveHandler={saveHandler}
        viewType={type}
        vesselDDL={vesselDDL}
        setLoading={setLoading}
        setChartererDDL={setChartererDDL}
        chartererDDL={chartererDDL}
        rowData={rowData}
        removeRow={removeRow}
        addRow={addRow}
        costTypeDDL={costTypeDDL}
        setCostTypeDDL={setCostTypeDDL}
        businessPartnerDDL={businessPartnerDDL}
        setBusinessPartnerDDL={setBusinessPartnerDDL}
        selectedBusinessUnit={selectedBusinessUnit}
        profileData={profileData}
        setRowData={setRowData}
      />
    </>
  );
}
