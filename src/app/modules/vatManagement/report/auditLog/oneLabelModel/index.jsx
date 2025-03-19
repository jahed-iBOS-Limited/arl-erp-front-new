import React, { useState, useEffect } from "react";

import PurchaseModel from "./purchaseModel";
import DebitNoteModel from "./debitNoteModel";
import {
  GetPurchaseLog_api,
  GetDebitNoteLog_api, 
  GetSalesLog_api,
  GetCreditNoteLog_api,
  GetTreasuryDepositLog_api
} from "../helper";
import { useSelector, shallowEqual } from "react-redux";
import SalesModel from "./salesModel";
import CrediteNoteModel from "./crediteNoteModel";
import TreasuryDepositModel from "./treasuryDepositModel";
import IViewModal from './../../../../_helper/_viewModal';
function OneLabelModel({ onHide, show, values, parentRowClickData }) {
  const [oneLabelModelLoding, setOneLabelModelLoding] = useState(false);
  const [rowDto, setRowDto] = useState([]);

  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  useEffect(() => {
    if (parentRowClickData?.taxPurchaseId && values?.viewType?.value === 1) {
      GetPurchaseLog_api(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        parentRowClickData?.taxPurchaseId,
        setRowDto,
        setOneLabelModelLoding
      );
    } else if (
      parentRowClickData?.taxPurchaseId &&
      values?.viewType?.value === 3
    ) {
      GetDebitNoteLog_api(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        parentRowClickData?.taxPurchaseId,
        setRowDto,
        setOneLabelModelLoding
      );
    } else if (parentRowClickData?.salesId && values?.viewType?.value === 2) {
      GetSalesLog_api(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        parentRowClickData?.salesId,
        setRowDto,
        setOneLabelModelLoding
      );
    } else if (parentRowClickData?.salesId && values?.viewType?.value === 4) {
      GetCreditNoteLog_api(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        parentRowClickData?.salesId,
        setRowDto,
        setOneLabelModelLoding
      );
    }else if(parentRowClickData?.treasuryId && values?.viewType?.value === 5){
      GetTreasuryDepositLog_api(
        parentRowClickData?.treasuryId,
        setRowDto,
        setOneLabelModelLoding
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parentRowClickData]);

  return (
    <IViewModal
      show={show}
      onHide={onHide}
      title={`${values?.viewType?.label} Log`}
      isShow={oneLabelModelLoding}
    >
      {values?.viewType?.value === 1 ? (
        <PurchaseModel
          rowDto={rowDto}
          parentRowClickData={parentRowClickData}
        />
      ) : values?.viewType?.value === 3 ? (
        <DebitNoteModel
          rowDto={rowDto}
          parentRowClickData={parentRowClickData}
        />
      ) : values?.viewType?.value === 2 ? (
        <SalesModel rowDto={rowDto} parentRowClickData={parentRowClickData} />
      ) : values?.viewType?.value === 4 ? (
        <CrediteNoteModel
          rowDto={rowDto}
          parentRowClickData={parentRowClickData}
        />
      ) : values?.viewType?.value === 5 ? (
        <TreasuryDepositModel
          rowDto={rowDto}
          parentRowClickData={parentRowClickData}
        />
      ) : null}
    </IViewModal>
  );
}

export default OneLabelModel;
