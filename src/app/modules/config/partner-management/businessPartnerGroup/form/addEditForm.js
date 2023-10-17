/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import IForm from "../../../../_helper/_form";
import Loading from "../../../../_helper/_loading";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import Form from "./form";
import useAxiosPost from "../../../../_helper/customHooks/useAxiosPost";

const initData = {
  channel: "",
  customer: "",
  partnerGroup: "",
};

export default function BusinessPartnerGroupForm() {
  // get user data from store
  const {
    profileData: { accountId: accId, userId },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state.authData, shallowEqual);

  const [objProps, setObjProps] = useState({});
  const [rowData, setRowData] = useState([]);
  const [partnerGroups, getPartnerGroups] = useAxiosGet();
  const [, postData, loader] = useAxiosPost();

  useEffect(() => {
    getPartnerGroups(
      `/partner/BusinessPartnerBasicInfo/GetBusinessPartnerGroupDDL`
    );
  }, [buId]);

  const addHandler = (values, cb) => {
    try {
      const newRow = {
        sl: 0,
        autoId: 0,
        businessPartnerId: values?.customer?.value,
        businessPartnerName: values?.customer?.label,
        businessPartnerGroupId: values?.partnerGroup?.value,
        businessPartnerGroupName: values?.partnerGroup?.label,
        actionBy: userId,

        businessUnitId: buId,
      };

      setRowData([...rowData, newRow]);
      cb && cb();
    } catch (error) {
      console.log("Error occurred");
    }
  };

  const removeHandler = (index) => {
    setRowData(rowData?.filter((_, i) => i !== index));
  };

  const saveHandler = (values, cb) => {
    postData(
      `/partner/BusinessPartnerBasicInfo/CreateBusinessPartnerGroupDetails`,
      rowData,
      () => {
        setRowData([]);
        cb();
      },
      true
    );
  };

  const isLoader = loader;
  return (
    <IForm
      title="Business Partner Group Entry"
      getProps={setObjProps}
      isDisabled={isLoader}
    >
      {isLoader && <Loading />}
      <Form
        {...objProps}
        buId={buId}
        accId={accId}
        rowData={rowData}
        initData={initData}
        addHandler={addHandler}
        saveHandler={saveHandler}
        partnerGroups={partnerGroups}
        removeHandler={removeHandler}
      />
    </IForm>
  );
}
