/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useLocation, useParams } from "react-router-dom";
import Loading from "../../../../_helper/_loading";
import { _todayDate } from "../../../../_helper/_todayDate";
import { editAssetRent, getAssetSingleData, saveAssetRent } from "../helper";
import Form from "./form";

const initData = {
  rentType: { value: 1, label: "Daily" },
  rentFromDate: _todayDate(),
  rentToDate: _todayDate(),
  partner: "",
  asset: "",
  sbu: "",
  currency: { value: 141, label: "Taka", code: "BDT" },
  rentRate: "",
  currConversationRate: "",
};

export default function CreateAssetRentForm() {
  // eslint-disable-next-line no-unused-vars
  const [isDisabled, setDisabled] = useState(false);
  const [rowDto, setRowDto] = useState([]);
  const [assetSingleData, setAssetSingleData] = useState("");

  const params = useParams();
  const location = useLocation();

  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  useEffect(() => {
    if (params?.id) {
      getAssetSingleData(params?.id, setAssetSingleData, setDisabled);
    }
  }, [params?.id]);

  const saveHandler = async (values, cb) => {
    const payload = {
      rentAssetId: params?.id || 0,
      accountId: profileData?.accountId,
      businessUnitId: selectedBusinessUnit?.value,
      rentTypeId: values?.rentType?.value,
      rentTypeName: values?.rentType?.label,
      businessPartnerId: values?.partner?.value,
      businessPartnerName: values?.partner?.label,
      rentFromDate: values?.rentFromDate,
      rentToDate: values?.rentType?.value === 3 ? values?.rentToDate : "",
      assetId: values?.asset?.value || 0,
      assetName: values?.asset?.label || "",
      assetCode: values?.asset?.code,
      sbuId: values?.sbu?.value || 0,
      sbuName: values?.sbu?.label || "",
      rentRate: +values?.rentRate,
      currencyId: values?.currency?.value,
      currencyName: values?.currency?.label,
      currConversationRate: +values?.currConversationRate,
      actionBy: profileData?.userId,
    };
    if (!params?.id) {
      console.log("Save Asset Rent ", payload);
      saveAssetRent(payload, setDisabled, cb);
    } else {
      editAssetRent(payload, setDisabled, cb);
    }
  };

  return (
    <>
      {isDisabled && <Loading />}
      <Form
        params={params}
        initData={params?.id ? assetSingleData : initData}
        saveHandler={saveHandler}
        profileData={profileData}
        selectedBusinessUnit={selectedBusinessUnit}
        rowDto={rowDto}
        setRowDto={setRowDto}
        prId={2}
        type={params?.type}
        location={location}
        assetSingleData={assetSingleData}
      />
    </>
  );
}
