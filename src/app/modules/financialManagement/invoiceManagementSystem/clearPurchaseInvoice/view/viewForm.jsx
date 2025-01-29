/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useState, useEffect } from "react";
import { useSelector, shallowEqual } from "react-redux";
import ICard from "../../../../_helper/_card";
import { GetPurchaseInvoiceDetails } from "../helper";
import Form from "./form";

const initData = {
  invoiceCode: "",
  poAmount: "",
  grnAmount: "",
  invoiceAmount: "",
  wareHouseName: "",
};

export default function ClearPurchaseInvoiceViewForm({
  history,
  match: {
    params: { id, supplierId },
  },
}) {
  const [isDisabled, setDisabled] = useState(true);

  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  //SingleData to view
  const [singleData, setSingleData] = useState("");

  // Get BusinessUnitTaxInfo view data
  useEffect(() => {
    if (id && supplierId) {
      GetPurchaseInvoiceDetails(id, supplierId, setSingleData);
    }
  }, [id, supplierId]);

  const disableHandler = (cond) => {
    setDisabled(cond);
  };

  const backHandler = () => {
    history.goBack();
  };

  const [objProps, setObjprops] = useState({});

  return (
    <ICard getProps={setObjprops} isDisabled={isDisabled}>
      <div className="row" style={{ marginTop: "-45px" }}>
        <div className="col-lg-2 offset-10 text-right">
          <button
            onClick={backHandler}
            type="button"
            className="btn btn-primary"
          >
            <i class="fa fa-arrow-left"></i>Back
          </button>
        </div>
      </div>

      <Form
        {...objProps}
        initData={singleData || initData}
        disableHandler={disableHandler}
        accountId={profileData?.accountId}
        selectedBusinessUnit={selectedBusinessUnit}
        isDisabled={true}
        singleData={singleData}
      />
    </ICard>
  );
}
