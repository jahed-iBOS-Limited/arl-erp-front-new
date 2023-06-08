import React, { useEffect } from "react";
import NewSelect from "../../../../_helper/_select";
import InputField from "../../../../_helper/_inputField";
import { useSelector } from "react-redux";
import { shallowEqual } from "react-redux";
export function BankForm({
  errors,
  touched,
  setFieldValue,
  values,
  handleSubmit,
  bankAcDDL,
  instumentType,
  onBankChange,
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
            name="bank"
            options={bankAcDDL}
            value={values?.bank}
            label="Select Bank Account"
            onChange={(valueOption) => {
              setFieldValue("bank", valueOption);
              // if(onBankChange) onBankChange(valueOption)
            }}
            placeholder=" Select Bank Account"
            errors={errors}
            touched={touched}
          />
        </div>

        <div className="col-lg-2">
          <InputField
            value={values?.amount || ""}
            label="Amount"
            // disabled={id ? true : false}
            type="number"
            name="amount"
            placeholder="Amount"
            min="0"
            onChange={(e)=>{
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
            value={values?.paidTo}
            label="Paid To"
            // disabled={id ? true : false}
            type="text"
            name="paidTo"
            placeholder="Paid To"
          />
        </div>

        <div className="col-lg-2">
          <InputField
            value={values?.date}
            label="Date"
            // disabled={id ? true : false}
            type="date"
            name="date"
            placeholder="Select Date"
          />
        </div>


        <div className="col-lg-2">
          <NewSelect
            name="instumentType"
            options={instumentType}
            value={values?.instumentType}
            label="Select Istument Type"
            onChange={(valueOption) => {
              setFieldValue("instumentType", valueOption);
            }}
            placeholder=" Select Istument Type"
            errors={errors}
            touched={touched}
          />
        </div>

        <div className="col-lg-2">
          <InputField
            value={values?.instumentNo}
            label="Instument No"
            // disabled={id ? true : false}
            type="text"
            name="instumentNo"
            placeholder="Instument No"
          />
        </div>

        <div className="col-lg-2">
          <InputField
            value={values?.instumentDate}
            label="Instument Date"
            // disabled={id ? true : false}
            type="date"
            name="instumentDate"
            placeholder="Select Instument Date"
          />
        </div>
      </div>
    </>
  );
}
