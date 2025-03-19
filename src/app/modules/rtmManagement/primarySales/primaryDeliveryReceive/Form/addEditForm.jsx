/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useState, useEffect } from "react";
import { useSelector, shallowEqual } from "react-redux";
import Form from "./form";
import {
  createDeliveryReceive,
  editDeliveryReceive,
  getDeliveryReceiveById,
  getChalanDDL,
} from "../helper";
import { useParams } from "react-router-dom";
import { _todayDate } from "./../../../../_helper/_todayDate";
import { toast } from "react-toastify";

const initData = {
  chalan: "",
  inventoryTransactionId: "",
  inventoryTransactionName: "",
};

export default function PrimaryDeliveryReceiveForm() {
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [singleData, setSingleData] = useState("");
  const [rowData, setRowData] = useState([]);
  const [chalanDDL, setChalanDDL] = useState([]);

  // get user profile data from store
  const storeData = useSelector((state) => {
    return {
      profileData: state?.auth?.profileData,
      selectedBusinessUnit: state?.auth?.selectedBusinessUnit,
    };
  }, shallowEqual);

  const { profileData, selectedBusinessUnit } = storeData;

  // These are sum of receive qty and receive amount
  let totalQTY = rowData?.reduce((total, obj) => +obj?.receiveQTY + +total, 0);
  let receiveAmount = rowData?.reduce(
    (total, obj) => +obj?.receiveAmount + +total,
    0
  );

  // Get DDL
  useEffect(() => {
    getChalanDDL(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setIsLoading,
      setChalanDDL
    );
  }, [profileData?.accountId, selectedBusinessUnit?.value]);

  // Fetch Signle Data by Id
  useEffect(() => {
    if (id) {
      getDeliveryReceiveById(id, setIsLoading, setSingleData, setRowData);
    }
  }, [id]);

  // Save & Edit Handler
  const saveHandler = (values, cb) => {
    if (rowData?.length > 0) {
      if (!id) {
        let payload = {
          objheader: {
            transactionTypeId: 0,
            transactionTypeName: "",
            strInventoryTransactionCode: "",
            referenceId: values?.chalan?.value,
            referenceCode: values?.chalan?.label,
            accountId: profileData?.accountId,
            businessUnitId: selectedBusinessUnit?.value,
            businessUnitName: selectedBusinessUnit?.label,
            businessPartnerId: 0,
            businessPartnerName: "",
            transactionDate: _todayDate(),
            actionBy: profileData?.userId,
          },
          objRow: rowData?.map((item) => {
            return {
              itemId: item?.itemId,
              itemName: item?.itemName,
              uoMid: item?.uomId,
              uoMname: item?.uomName,
              transactionQuantity: item?.receiveQTY,
              monTransactionValue: item?.receiveAmount,
              isFree: false,
              actionBy: profileData?.userId,
            };
          }),
        };
        createDeliveryReceive(payload, setIsLoading, cb);
      } else {
        
        let payload = {
          objheader: {
            inventoryTransactionId: values?.inventoryTransactionId,
            inventoryTransactionCode: values?.inventoryTransactionCode,
          },
          objrow: rowData?.map((item) => {
            return {
              rowId: item?.rowId,
              itemId: item?.itemId,
              itemName: item?.itemName,
              uoMid: item?.uomId,
              uoMname: item?.uomName,
              transactionQuantity: item?.receiveQTY,
              monTransactionValue: item?.receiveAmount,
              isFree: false,
              actionBy: profileData?.userId,
            };
          }),
        };
        editDeliveryReceive(payload, setIsLoading);
      }
    } else {
      toast.warning("Please add atleast one item", { toastId: 333 });
    }
  };

  return (
    <>
      <Form
        initData={singleData || initData}
        saveHandler={saveHandler}
        isLoading={isLoading}
        isEdit={id}
        rowData={rowData}
        setRowData={setRowData}
        setIsLoading={setIsLoading}
        chalanDDL={chalanDDL}
        totalQTY={totalQTY}
        receiveAmount={receiveAmount}
      />
    </>
  );
}
