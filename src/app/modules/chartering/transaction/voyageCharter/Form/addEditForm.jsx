/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useParams } from "react-router";
import { useLocation } from "react-router-dom";
import { getSBUListDDL } from "../../../../assetManagement/assetRentManagement/assetRent/helper";
import { getOwnerInfoDDL, getVesselDDL } from "../../../helper";
import Loading from "../../../_chartinghelper/loading/_loading";
import { _dateFormatter } from "../../../_chartinghelper/_dateFormatter";
import { _todayDate } from "../../../_chartinghelper/_todayDate";
import {
  saveVoyageCharterTransaction,
  saveVoyageCharterTransactionIntermidiate,
} from "../helper";
import { totalNetPayableInitialInvoice } from "../invoice/initialInvoice/initialInvoice";
import Form from "./form";

const initData = {
  vesselName: "",
  voyageNo: "",
  statement: "",
  invoiceDate: _todayDate(),
  invoiceRef: "",
  charterer: "",
  beneficiary: "",
  journalDate: _todayDate(),
  cargo: "",
  receivedDate: '',
  bankAccNo: '',
  receiveAmount: '',
};

export default function VoyageCharterForm() {
  const { type, id } = useParams();
  const [loading, setLoading] = useState(false);
  const [vesselDDL, setVesselDDL] = useState([]);
  const [beneficiaryDDL, setBeneficiaryDDL] = useState([]);
  const [sbuList, setSBUList] = useState([]);
  const { state } = useLocation();

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
    getOwnerInfoDDL({ setter: setBeneficiaryDDL });
    getSBUListDDL(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setSBUList
    );
  }, [profileData, selectedBusinessUnit, id]);

  const saveHandler = (values, cb) => {
    if (!id) {
      let total = 0;
      let totalNetPayble = 0;

      if (values?.statement?.value === 1) {
        /* Initial Statement */
        total = values?.rowData?.reduce(
          (acc, obj) => acc + (obj?.freightRate * obj?.cargoQty + obj?.debit),
          0
        );

        totalNetPayble = totalNetPayableInitialInvoice(values?.rowData, total);
      } else {
        /* Final Statement */

        // Total Debit
        total = values?.rowData?.reduce((acc, obj) => acc + obj?.debit, 0);

        let brokerCom =
          (values?.rowData?.filter((item) => item?.isBrokerCom)[0]
            ?.parcentageValue *
            total) /
            100 || 0;
        let addCom =
          (values?.rowData?.filter((item) => item?.isAddCom)[0]
            ?.parcentageValue *
            total) /
            100 || 0;

        // Total Credit
        let totalCredit =
          values?.rowData?.reduce((acc, obj) => acc + obj?.credit, 0) +
          addCom +
          brokerCom;

        totalNetPayble = total - totalCredit || 0;
      }

      const payload = {
        objHeader: {
          accountId: profileData?.accountId,
          businessUnitId: selectedBusinessUnit?.value,
          vesselId: values?.vesselName?.value,
          voyageId: values?.voyageNo?.value,
          vesselname: values?.vesselName?.label,
          voyageNo: values?.voyageNo?.label,
          statementNo: values?.statement?.value,
          fromName:
            values?.statement?.value === 1
              ? values?.invoiceHireData?.fromName || ""
              : values?.invoiceHireData?.toName || "",
          fromAddress:
            values?.statement?.value === 1
              ? values?.invoiceHireData?.fromAddress || ""
              : values?.invoiceHireData?.toAdress || "",
          toName:
            values?.statement?.value === 1
              ? values?.invoiceHireData?.toName || ""
              : values?.invoiceHireData?.fromName || "",
          toAdress:
            values?.statement?.value === 1
              ? values?.invoiceHireData?.toAdress || ""
              : values?.invoiceHireData?.fromAddress,
          reference: `${values?.vesselName?.label} CP Date ${_dateFormatter(
            values?.invoiceHireData?.cpDate
          )}`,
          dteInvoiceDate: values?.invoiceDate,
          cpDate:
            _dateFormatter(values?.invoiceHireData?.cpDate) || _todayDate(),
          quantity: values?.invoiceHireData?.cargoQty,
          loadPort: values?.invoiceHireData?.loadPort || "",
          dischPort: values?.invoiceHireData?.dischPort || "",
          invoiceRef: values?.invoiceHireData?.invoiceRef || "",
          totalNetPayble: +totalNetPayble.toFixed(2) || 0,
          /* Last added */
          charterId: values?.charterer?.value,
          charterName: values?.charterer?.label,

          bankInd: values?.beneficiary?.bankId,
          bankName: values?.beneficiary?.bankName,
          bankAccountNo:
            values?.beneficiary?.ownerBankAccount ||
            values?.beneficiary?.bankAccountNo,
          bankAddress: values?.beneficiary?.bankAddress,
          swiftCode: values?.beneficiary?.swiftCode,
          beneficiaryId: values?.beneficiary?.value,
          beneficiaryName: values?.beneficiary?.label,
          ownerId: values?.beneficiary?.ownerId,

          cargoId: values?.invoiceHireData?.cargoId,
          cargoName: values?.cargo?.label,
          cargoRowId: values?.cargo?.value,
        },
        objRow: values?.rowData
          ?.map((item, index) => {
            /* Ininital Statement | value = 1 */
            if (values?.statement?.value === 1) {
              return initialStateMentRowMaker(item, index, total);
            } else {
              /* Final Statement | Intermidiate Statement | value = 2  */
              return finalStateMentRowMaker(item, index, total);
            }
          })
          .filter((i) => i?.debit !== 0 || i?.credit !== 0),
      };

      if (values?.statement?.value === 3) {
        saveVoyageCharterTransactionIntermidiate(payload, setLoading, cb);
      } else {
        saveVoyageCharterTransaction(payload, setLoading, cb);
      }
    }
  };

  return (
    <>
      {loading && <Loading />}
      <Form
        title={
          type === "edit"
            ? "Edit Voyage Charter Transaction"
            : type === "view"
            ? "View Voyage Charter Transaction"
            : "Create Voyage Charter Transaction"
        }
        initData={
          id
            ? {
                ...state,
                vesselName: {
                  value: state?.vesselId,
                  label: state?.vesselname,
                },
                voyageNo: { value: state?.voyageNoId, label: state?.voyageNo },
                transactionType: {
                  value: state?.transactionTypeId,
                  label: state?.transactionTypeName,
                },
                statement: {
                  value: state?.statementNo,
                  label:
                    state?.statementNo === 2
                      ? "Final Statement"
                      : state?.statementNo === 3
                      ? "Intermediate Invoice"
                      : "Initial Statement",
                },
                hireTypeName: {
                  value: state?.hireTypeId,
                  label: state?.hireTypeName,
                },
                invoiceDate: _dateFormatter(state?.invoiceDate),
                charterer: {
                  value: state?.charterId,
                  label: state?.charterName,
                },
                cargo: {
                  value: state?.cargoId || 0,
                  label: state?.cargoName,
                },
              }
            : {
                ...initData,
                ...state,
                hireTypeName: state?.shipType,
                beneficiary: {
                  value: state?.vesselName?.ownerId,
                  label: state?.vesselName?.ownerName,
                },
              }
        }
        saveHandler={saveHandler}
        viewType={type}
        vesselDDL={vesselDDL}
        setLoading={setLoading}
        beneficiaryDDL={beneficiaryDDL}
        sbuList={sbuList}
      />
    </>
  );
}

const initialStateMentRowMaker = (item, index, total) => {
  if (item?.is95Parcentage) {
    return {
      freightInvoiceId: 0,
      sl: index + 1,
      particulars: `${item?.parcentageValue || 0}% FREIGHT` || "",
      cargoQty: 0,
      freightRate: item?.parcentageValue, // For Percentage Value
      debit: 0,
      credit: (total * parseFloat(item?.parcentageValue) || 0) / 100,
    };
  }

  /* Brokerage Com */
  if (item?.isBrokerCom) {
    return {
      freightInvoiceId: 0,
      sl: index + 1,
      particulars:
        `${item?.parcentageValue || 0}% Broker COMMISSION ON 100% FREIGHT` ||
        "",
      cargoQty: 0,
      freightRate: item?.parcentageValue, // For Percentage Value
      debit: 0,
      credit: (total * parseFloat(item?.parcentageValue) || 0) / 100,
    };
  }

  /* Add Com */
  if (item?.isAddCom) {
    return {
      freightInvoiceId: 0,
      sl: index + 1,
      particulars:
        `${item?.parcentageValue || 0}% Address COMMISSION ON 100% FREIGHT` ||
        "",
      cargoQty: 0,
      freightRate: item?.parcentageValue, // For Percentage Value
      debit: 0,
      credit: (total * parseFloat(item?.parcentageValue) || 0) / 100,
    };
  }
  if (item?.isNew) {
    return {
      freightInvoiceId: 0,
      sl: index + 1,
      particulars: item?.particulars || "",
      cargoQty: 0,
      freightRate: 0,
      debit: 0,
      credit: item?.credit,
    };
  } else {
    /* Other's */
    return {
      freightInvoiceId: 0,
      sl: index + 1,
      particulars: item?.particulars || "",
      cargoQty: item?.cargoQty,
      freightRate: item?.freightRate,
      debit: 0,
      credit: item?.cargoQty * item?.freightRate,
    };
  }
};

const finalStateMentRowMaker = (item, index, total) => {
  if (item?.isGrandTotal) {
    return {
      freightInvoiceId: 0,
      sl: index + 1,
      particulars: item?.particulars || "",
      cargoQty: 0,
      freightRate: 0,
      debit: +total || 0,
      credit: 0,
    };
  } else if (item?.isBrokerCom || item?.isAddCom) {
    return {
      freightInvoiceId: 0,
      sl: index + 1,
      particulars: item?.particulars || "",
      cargoQty: 0,
      freightRate: 0,
      debit: 0,
      credit: (total * +item?.parcentageValue) / 100 || 0,
    };
  } else if (item?.prevReceive) {
    return {
      freightInvoiceId: 0,
      sl: index + 1,
      particulars: item?.particulars || "",
      cargoQty: 0,
      freightRate: 0,
      debit: 0,
      credit: +item?.credit || 0,
    };
  } else {
    return {
      freightInvoiceId: 0,
      sl: index + 1,
      particulars: item?.particulars || "",
      cargoQty: item?.cargoQty || 0,
      freightRate: item?.freightRate || 0,
      debit: +item?.debit || 0,
      credit: +item?.credit || 0,
    };
  }
};
