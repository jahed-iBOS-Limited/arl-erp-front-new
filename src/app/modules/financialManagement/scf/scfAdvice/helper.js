import { _todayDate } from "../../../_helper/_todayDate";
import React from "react";
import * as Yup from "yup";

// advice type ddl
export const adviceTypeDDL = [{ label: "SCF", value: 1 }];

// init data
export const initData = {
  date: _todayDate(),
  bankAccount: "",
  adviceType: adviceTypeDDL[0],
};

// fetch scf landing data
export function fetchSCFLandingData(obj) {
  // destructure obj
  const { getSCFLandingData, selectedBusinessUnit, profileData, values } = obj;
  const { date, bankAccount } = values;
  // get data
  getSCFLandingData(
    `/fino/Advice/GetAdviceViewSCF?Account=${profileData?.accountId}&Unit=${selectedBusinessUnit?.value}&Date=${date}&BankAsPartnerId=${bankAccount?.bankAsPartnerId}`
  );
}

// fetch bank as partner ddl
export function fetchBankAsParterDDL(obj) {
  // destrcuture
  const { getBankAsPartnerDDL, selectedBusinessUnit } = obj;

  getBankAsPartnerDDL(
    `/fino/CommonFino/GetBankAsSupplierDDL?businessUnitId=${selectedBusinessUnit.value}`
  );
}

// table header
export const scfAdviceTableHeader = (obj) => {
  const { scfLandingData, setSCFLandingData } = obj;
  return [
    {
      header: (
        <div className="d-flex flex-row justify-content-around align-items-center">
          <input
            type="checkbox"
            checked={
              scfLandingData?.length > 0
                ? scfLandingData?.every((item) => item?.isSelected)
                : false
            }
            onChange={(e) => {
              setSCFLandingData(
                scfLandingData.map((item) => ({
                  ...item,
                  isSelected: e?.target?.checked,
                }))
              );
            }}
          />
          <p>Select</p>
        </div>
      ),
      render: (item, index) => {
        return item?.isPaymentComplete === false ? (
          <input
            type="checkbox"
            checked={item?.isSelected}
            onChange={(e) => {
              const data = [...scfLandingData];
              data[index]["isSelected"] = e?.target?.checked;
              setSCFLandingData(data);
            }}
          />
        ) : (
          undefined
        );
      },
    },
    { header: "SL", render: (_i, index) => index + 1 },
    { header: "Business Partner", key: "strBusinessPartnerName" },
    { header: "Business Partner Code", key: "strBusinessPartnerCode" },
    { header: "Journal Code", key: "strAdjustmentJournalCode" },
    {
      header: "Payment Status",
      key: "isPaymentComplete",
      render: (item) => (item?.isPaymentComplete ? "Yes" : "No"),
    },
    { header: "Amount", key: "numAmount" },
  ];
};

// table data
export const scfAdviceTableData = [
  {
    numAmount: 200,
    intBusinessPartnerId: 999,
    strBusinessPartnerName: "ABC",
    strBusinessPartnerCode: 789,
    intAdjustmentJournalId: 456,
    strAdjustmentJournalCode: 123,
    isPaymentComplete: false,
    strSellerTin: 12,
  },
  {
    numAmount: 300,
    intBusinessPartnerId: 999,
    strBusinessPartnerName: "EFG",
    strBusinessPartnerCode: 789,
    intAdjustmentJournalId: 456,
    strAdjustmentJournalCode: 123,
    isPaymentComplete: true,
    strSellerTin: 12,
  },
  {
    numAmount: 400,
    intBusinessPartnerId: 999,
    strBusinessPartnerName: "HIG",
    strBusinessPartnerCode: 789,
    intAdjustmentJournalId: 456,
    strAdjustmentJournalCode: 123,
    isPaymentComplete: false,
    strSellerTin: 12,
  },
];

// validation
export const validation = Yup.object().shape({
  date: Yup.date().required("Date is required"),
  bankAccount: Yup.object()
    .shape({
      label: Yup.string().required("Bank account is required"),
      value: Yup.string().required("Bank account is required"),
    })
    .required("Bank account required"),
  adviceType: Yup.object()
    .shape({
      label: Yup.string().required("Advice label required"),
      value: Yup.string().required("Advice value required"),
    })
    .required("Advice type required"),
});

