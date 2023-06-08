/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useState, useEffect } from "react";
import { useSelector, shallowEqual } from "react-redux";
import Form from "./form";
import { _todayDate } from "../../../../_helper/_todayDate";
import {
  getTaxCircle_api,
  getTaxZone_api,
  getRepresentative_api,
  // getRepresentativeRank_api,
  saveBusinessUnitTaxInfo,
  saveEditedBusinessUnitTaxInfo,
  GetBusinessUnitTaxView,
} from "../helper";
import { useParams } from "react-router-dom";
import Loading from "../../../../_helper/_loading";

const initData = {
  // businessUnitDDL: "",
  taxZoneDDL: "",
  taxCircleDDL: "",
  returnSubmissionDate: _todayDate(),
  representativeDDL: "",
  representativeRankDDL: "",
  representativeAddress: "",
};

export default function BusinessUnitTaxConfigForm({
  history,
  // match: {
  //   params: { id },
  // },
}) {
  const [isDisabled, setDisabled] = useState(false);
  const [taxCircleDDL, setTaxCircleDDL] = useState("");
  const [taxZoneDDL, setTaxZoneeDDL] = useState("");
  const [representativeDDL, setRepresentativeDDL] = useState("");
  const [representativeRankDDL, setRepresentativeRankDDL] = useState("");
  // eslint-disable-next-line no-unused-vars
  const [objProps, setObjprops] = useState({});
  const params = useParams();
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
    if (params?.id) {
      GetBusinessUnitTaxView(params?.id, setSingleData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);
  useEffect(() => {
    if (profileData?.accountId && selectedBusinessUnit?.value) {
      getTaxCircle_api(setTaxCircleDDL);
      getTaxZone_api(setTaxZoneeDDL);
      // getRepresentativeRank_api(
      //   profileData?.accountId,
      //   selectedBusinessUnit?.value,
      //   setRepresentativeRankDDL
      // );
    }
    getRepresentative_api(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setRepresentativeDDL
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBusinessUnit, profileData]);

  const saveHandler = async (values, cb) => {
    setDisabled(true);
    if (values && profileData?.accountId && selectedBusinessUnit?.value) {
      if (params?.id) {
        const payload = {
          actionBy: profileData.userId,
          businessUnitTaxInfoId: +params?.id,
          businessUnitId: selectedBusinessUnit.value,
          businessUnitName: selectedBusinessUnit.label,
          accountId: profileData.accountId,
          taxZoneId: +values.taxZoneDDL.value,
          taxZoneName: values.taxZoneDDL.label,
          taxCircleId: +values.taxCircleDDL.value,
          taxCircleName: values.taxCircleDDL.label,
          returnSubmissionDate: _todayDate(),
          representativeId: +values.representativeDDL.value,
          representativeName: values.representativeDDL.label,
          representativeRank: values.representativeRankDDL.label,
          representativeAddress: values.representativeAddress,
        };
        saveEditedBusinessUnitTaxInfo(payload);
      } else {
        const payload = {
          actionBy: profileData.userId,
          // businessUnitTaxInfoId: +id,
          businessUnitId: selectedBusinessUnit.value,
          businessUnitName: selectedBusinessUnit.label,
          accountId: profileData.accountId,
          taxZoneId: +values.taxZoneDDL.value,
          taxZoneName: values.taxZoneDDL.label,
          taxCircleId: +values.taxCircleDDL.value,
          taxCircleName: values.taxCircleDDL.label,
          returnSubmissionDate: _todayDate(),
          representativeId: +values.representativeDDL.value,
          representativeName: values.representativeDDL.label,
          representativeRank: values.representativeRankDDL.label,
          representativeAddress: values.representativeAddress,
        };
        saveBusinessUnitTaxInfo(payload, cb, setDisabled);
      }
    } else {
      setDisabled(false);
    }
  };

  // const disableHandler = (cond) => {
  //   setDisabled(cond);
  // };

  return (
    <>
      {isDisabled && <Loading />}
      <Form
        {...objProps}
        initData={singleData || initData}
        saveHandler={saveHandler}
        //disableHandler={disableHandler}
        accountId={profileData?.accountId}
        selectedBusinessUnit={selectedBusinessUnit}
        taxCircleDDL={taxCircleDDL}
        taxZoneDDL={taxZoneDDL}
        representativeDDL={representativeDDL}
        representativeRankDDL={representativeRankDDL}
        profileData={profileData}
        setRepresentativeRankDDL={setRepresentativeRankDDL}
        // isEdit={id || false}
      />
    </>
  );
}
