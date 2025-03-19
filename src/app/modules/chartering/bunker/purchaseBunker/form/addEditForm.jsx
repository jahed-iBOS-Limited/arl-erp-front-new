/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useLocation, useParams } from "react-router";
import { toast } from "react-toastify";
import {
  getCharterPartyDDL,
  GetPortDDL,
  getSupplierDDL,
  getVesselDDL,
} from "../../../helper";
import Loading from "../../../_chartinghelper/loading/_loading";
import { _todayDate } from "../../../_chartinghelper/_todayDate";
import {
  editPurchaseBunker,
  getPurchaseBunkerById,
  savePurchaseBunker,
} from "../helper";
import Form from "./form";

const initData = {
  vesselName: "",
  voyageNo: "",
  purchaseFrom: "",
  supplierName: "",
  supplierPort: "",
  charterer: "",
  purchaseDate: _todayDate(),
  currency: "",
  item: "",
  itemQty: "",
  itemRate: "",
  itemValue: "",
};

export default function PurchaseBunkerForm() {
  const { type, id } = useParams();
  const { state } = useLocation();
  const [loading, setLoading] = useState(false);
  const [rowData, setRowData] = useState([]);
  const [vesselDDL, setVesselDDL] = useState([]);
  const [voyageNoDDL, setVoyageNoDDL] = useState([]);
  const [supplierDDL, setSupplierDDL] = useState([]);
  const [portDDL, setPortDDL] = useState([]);

  const [charterPartyDDL, setCharterPartyDDL] = useState([]);
  const [singleData, setSingleData] = useState({});

  // get user profile data from store
  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state?.authData;
  }, shallowEqual);

  useEffect(() => {
    GetPortDDL(setPortDDL);
    getVesselDDL(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setVesselDDL
    );
    getSupplierDDL(setSupplierDDL);
    getCharterPartyDDL(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setCharterPartyDDL
    );
    if (id) {
      getPurchaseBunkerById(id, setSingleData, setRowData, setLoading);
    }
  }, [profileData, selectedBusinessUnit, id]);

  const saveHandler = (values, cb) => {
    if (id) {
      if (rowData?.length > 1) {
        toast.warn("You can't edit multiple item.", { toastId: 1234 });
        return;
      }

      const data = {
        objEditRow: [
          {
            purchaseBunkerRowId: rowData[0]?.purchaseBunkerRowId,
            purchaseBunkerHeaderId: rowData[0]?.purchaseBunkerHeaderId,

            itemId: values?.item?.value || 0,
            itemName: values?.item?.label || "",
            itemQty: +values?.itemQty,
            itemRate: +values?.itemRate,
            itemValue: +values?.itemValue,
            accountId: profileData?.accountId,
            businessUnitId: selectedBusinessUnit?.value,
            insertby: profileData?.userId,

            /* Blank */
            dollarRate: 0,
            remaining: 0,
            consumption: 0,
          },
        ],
      };
      editPurchaseBunker(data, setLoading);
    } else {
      const payload = {
        vesselId: values?.vesselName?.value,
        vesselName: values?.vesselName?.label,
        voyageId: values?.voyageNo?.value,
        voyageNo: values?.voyageNo?.label,
        purchaseFromId: 1,
        purchaseFromName: "Supplier",
        stakeholderId: values?.supplierName?.value,
        companyName: values?.supplierName?.label || "",
        portId: values?.supplierPort?.value || 0,
        portName: values?.supplierPort?.label || "",
        purchaseDate: values?.purchaseDate,
        accountId: profileData?.accountId,
        businessUnitId: selectedBusinessUnit?.value,
        insertby: profileData?.userId,

        /* Blank */
        currencyId: 0,
        currencyName: "",
        itemId: 0,
        itemName: "",
        purchaseBunkerRow: [
          {
            itemId: values?.item?.value,
            itemName: values?.item?.label,
            itemQty: +values?.itemQty,
            itemRate: +values?.itemRate,
            itemValue: +values?.itemValue,
            accountId: profileData?.accountId,
            businessUnitId: selectedBusinessUnit?.value,
            insertby: profileData?.userId,

            /* Blank */
            dollarRate: 0,
            remaining: 0,
            consumption: 0,
          },
        ],
      };
      savePurchaseBunker(payload, setLoading, cb);
    }
  };

  return (
    <>
      {loading && <Loading />}
      <Form
        initData={
          id
            ? singleData
            : {
                ...initData,
                vesselName: state?.vesselName,
                voyageNo: state?.voyageNo,
              }
        }
        saveHandler={saveHandler}
        viewType={type}
        rowData={rowData}
        setRowData={setRowData}
        vesselDDL={vesselDDL}
        voyageNoDDL={voyageNoDDL}
        setVoyageNoDDL={setVoyageNoDDL}
        setLoading={setLoading}
        supplierDDL={supplierDDL}
        charterPartyDDL={charterPartyDDL}
        portDDL={portDDL}
      />
    </>
  );
}
