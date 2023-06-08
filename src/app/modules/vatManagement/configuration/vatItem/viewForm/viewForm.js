import React, { useState, useEffect } from "react";
import { useSelector, shallowEqual } from "react-redux";
import Loading from "../../../../_helper/_loading";
import { GetVatItemView } from "../helper";
import Form from "./form";

const initData = {
  taxItemGroupName: "",
  taxItemTypeId: "",
  taxItemCategoryId: "",
  supplyTypeId: "",
  itemTypeId: "",
  hsCode: "",
  uomName: "",
};

export default function VatViewForm({ id }) {
  const [isDisabled, setDisabled] = useState(false);

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
    if (id) {
      GetVatItemView(id, setSingleData, setDisabled);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return (
    <>
      {isDisabled && <Loading />}
      <Form
        initData={singleData || initData}
        accountId={profileData?.accountId}
        selectedBusinessUnit={selectedBusinessUnit}
        isDisabled={true}
      />
    </>
  );
}
