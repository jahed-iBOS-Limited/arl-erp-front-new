import React, { useState, useEffect } from "react";
import { useSelector, shallowEqual } from "react-redux";
import Form from "./form";
// import {
// } from "../helper";
import Loading from "../../../../../helper/loading/_loading";

const initData = {
  channelDDL: "",
  territoryname: "",
};

const TerritorySetupForm = ({
  selectedData,
  setIsShowModal,
  setLandingData,
  value
}) => {
  const [isDisabled, setDisabled] = useState(false);
  // const [singleData, setSingleData] = useState("");
  const [initFormData, setInitFormData] = useState(initData);

  // get user profile data from store
  const profileData = useSelector((state) => {
    return state?.auth?.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state?.auth?.selectedBusinessUnit;
  }, shallowEqual);

  // useEffect(() => {
  //   if (params?.id) {
  //     GetbyId(params?.id, setSingleData);
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [params]);

  const saveHandler = async (values, cb) => {
    setDisabled(true);
    // if (profileData?.accountId && selectedBusinessUnit?.value) {
    //   if (params?.id) {
    //     // eslint-disable-next-line no-unused-vars
    //     const payload = {
    //       intLabelAutoId: +params?.id,
    //       strLabelName: values?.labelName,
    //       intAccountId: profileData?.accountId,
    //       intBusinessUnitId: selectedBusinessUnit?.value,
    //       isRouteWiseVisit: values?.isVisit === "routeWise" ? true : false,
    //       isTerritoryWiseVisit: values?.isVisit === "territoryWise" ? true : false,
    //       intTerritoryTypeId: values?.territoryType?.value,
    //       isSomenuAllow: values?.isAllow === "soMenu" ? true : false,
    //       isTsmmenuAllow: values?.isAllow === "tsmMenu" ? true : false,
    //       isAllMenuAllow: values?.isAllow === "allow" ? true : false,
    //     };
    //     saveEditedSalesforeclabel(payload, setDisabled, cb);
    //   } else {
    //     // eslint-disable-next-line no-unused-vars
    //     const payload = {
    //       strLabelName: values?.labelName,
    //       intAccountId: profileData?.accountId,
    //       intBusinessUnitId: selectedBusinessUnit?.value,
    //       isRouteWiseVisit: values?.isVisit === "routeWise" ? true : false,
    //       isTerritoryWiseVisit:
    //         values?.isVisit === "territoryWise" ? true : false,
    //       intTerritoryTypeId: values?.territoryType?.value,
    //       isSomenuAllow: values?.isAllow === "soMenu" ? true : false,
    //       isTsmmenuAllow: values?.isAllow === "tsmMenu" ? true : false,
    //       isAllMenuAllow: values?.isAllow === "allow" ? true : false,
    //     };
    //     saveSalesforceLabelAction(payload, cb, setDisabled);
    //   }
    // } else {
    //   setDisabled(false);
    // }
  };

  useEffect(()=>{
    setInitFormData({
      ...initData,
      channelDDL:selectedData?.row?.autoId ? {
        label:selectedData?.row?.channelName,
        value:selectedData?.row?.channelId
      }:null,
      territoryName:selectedData.row[selectedData?.editlabelKey] || ""
    })
  },[selectedData])
  return (
    <>
      {isDisabled && <Loading />}
      <Form
        title={`Territory Setup`}
        initData={ initFormData}
        profileData={profileData}
        selectedBusinessUnit={selectedBusinessUnit}
        saveHandler={saveHandler}
        setDisabled={setDisabled}
        selectedData={selectedData}
        setIsShowModal={setIsShowModal}
        setLandingData={setLandingData}
        value={value}
        // isEdit={params?.id}
      />
    </>
  );
};

export default TerritorySetupForm;
