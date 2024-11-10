/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useState, useEffect } from "react";
import { useSelector, shallowEqual } from "react-redux";
import Form from "./form";
import IForm from "../../../../_helper/_form";
import { _todayDate } from "../../../../_helper/_todayDate";
import {
  getTaxCircle_api,
  getTaxZone_api,
  getBusinessUnit_api,
  getRepresentative_api,
  getRepresentativeRank_api,
  saveBusinessUnitTaxInfo,
  saveEditedBusinessUnitTaxInfo,
  GetBusinessUnitTaxView,
} from "../helper";
import { useParams } from "react-router-dom";

const initData = {
  // businessUnitDDL: "",
  taxZoneDDL: "",
  taxCircleDDL: "",
  returnSubmissionDate: _todayDate(),
  representativeDDL: "",
  representativeRankDDL: "",
  representativeAddress: "",
};

export default function BusinessUnitTaxForm({
  history,
  match: {
    params: { id },
  },
}) {
  const [isDisabled, setDisabled] = useState(true);
  const [taxCircleDDL, setTaxCircleDDL] = useState("");
  const [taxZoneDDL, setTaxZoneeDDL] = useState("");
  const [businessUnitDDL, setBusinessUnitDDL] = useState("");
  const [representativeDDL, setRepresentativeDDL] = useState("");
  const [representativeRankDDL, setRepresentativeRankDDL] = useState("");
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
  console.log(params, "taxInfoId");
  // //Dispatch Get emplist action for get emplist ddl
  useEffect(() => {
    if (profileData?.accountId && selectedBusinessUnit?.value) {
      getTaxCircle_api(setTaxCircleDDL);
      getTaxZone_api(setTaxZoneeDDL);
      getRepresentativeRank_api(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setRepresentativeRankDDL
      );
    }
    getRepresentative_api(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setRepresentativeDDL
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBusinessUnit, profileData]);

  useEffect(() => {
    if (profileData?.accountId) {
      getBusinessUnit_api(profileData?.accountId, setBusinessUnitDDL);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData]);

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
          businessUnitTaxInfoId: +id,
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
        saveBusinessUnitTaxInfo(payload, cb);
      }
    } else {
      setDisabled(false);
      
    }
  };

  const disableHandler = (cond) => {
    setDisabled(cond);
  };

  return (
    <IForm
      title="Create Business Unit Tax Info"
      getProps={setObjprops}
      isDisabled={isDisabled}
    >
      <Form
        {...objProps}
        initData={singleData || initData}
        saveHandler={saveHandler}
        disableHandler={disableHandler}
        accountId={profileData?.accountId}
        selectedBusinessUnit={selectedBusinessUnit}
        taxCircleDDL={taxCircleDDL}
        taxZoneDDL={taxZoneDDL}
        businessUnitDDL={businessUnitDDL}
        representativeDDL={representativeDDL}
        representativeRankDDL={representativeRankDDL}
        isEdit={id || false}
      />
    </IForm>
  );
}
