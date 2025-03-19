import React, { useEffect } from "react";
import NewSelect from "../../../../_helper/_select";
import InputField from "../../../../_helper/_inputField";
import { useSelector } from "react-redux";
import { shallowEqual } from "react-redux";

export function CashForm({
  errors,
  touched,
  setFieldValue,
  values,
  handleSubmit,
  cashGlDDL,
  onAmountChange,
  selectedPurchase,
}) {
  // get user profile data from store
  const storeData = useSelector((state) => {
    return {
      profileData: state?.authData?.profileData,
      selectedBusinessUnit: state?.authData?.selectedBusinessUnit,
    };
  }, shallowEqual);

  const { profileData, selectedBusinessUnit } = storeData;

  useEffect(() => {
    if (profileData.accountId && selectedBusinessUnit?.value) {
    }
  }, [profileData, selectedBusinessUnit]);

  return (
    <>
      <div className="row">
        <div className="col-lg-2">
          <NewSelect
            name="cashGl"
            options={cashGlDDL}
            value={values?.cashGl}
            label="Select Cash GL"
            onChange={(valueOption) => {
              setFieldValue("cashGl", valueOption);
              // if(onCashGlChange) onCashGlChange(valueOption)
            }}
            placeholder=" Select Cash GL"
            errors={errors}
            touched={touched}
          />
        </div>

        <div className="col-lg-2">
          <InputField
            value={values?.amount || ""}
            label="Amount"
            min="0"
            type="number"
            name="amount"
            placeholder="Amount"
            onChange={(e) => {
              console.log(e.target.value)
              if (+e.target.value > 0 && +e.target.value <= +selectedPurchase?.invoiceAmount) {
                setFieldValue("amount", e.target.value);
                if (onAmountChange) onAmountChange(e.target.value);
              }else {
                setFieldValue("amount", "");
              }
            }}
          />
        </div>

        <div className="col-lg-2">
          <InputField
            value={values?.paidTo || selectedPurchase?.partnerName}
            label="Paid To"
            type="text"
            name="paidTo"
            placeholder="Paid To"
          />
        </div>

        <div className="col-lg-2">
          <InputField
            value={values?.date}
            label="Date"
            type="date"
            name="date"
            placeholder="Select Date"
          />
        </div>
      </div>
    </>
  );
}
