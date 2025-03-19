/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import Loading from "../../../../_helper/_loading";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import useAxiosPost from "../../../../_helper/customHooks/useAxiosPost";
import Form from "./form";
import { toast } from "react-toastify";

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
      const exist = rowData?.find(
        (item) =>
          item?.businessPartnerId === values?.customer?.value &&
          item?.businessPartnerGroupId === values?.partnerGroup?.value
      );
      if (exist) {
        return toast.warn(
          `Business partner already added in ${values?.partnerGroup?.label} group.`
        );
      }
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
    if (rowData?.length < 1) {
      return toast.warn("Please add at least one row!");
    } else {
      postData(
        `/partner/BusinessPartnerBasicInfo/CreateBusinessPartnerGroupDetails`,
        rowData,
        () => {
          setRowData([]);
          cb();
        },
        true
      );
    }
  };

  const isLoader = loader;
  return (
    <>
      {isLoader && <Loading />}
      <Form
        buId={buId}
        accId={accId}
        rowData={rowData}
        initData={initData}
        setRowData={setRowData}
        addHandler={addHandler}
        saveHandler={saveHandler}
        partnerGroups={partnerGroups}
        removeHandler={removeHandler}
      />
    </>
  );
}
