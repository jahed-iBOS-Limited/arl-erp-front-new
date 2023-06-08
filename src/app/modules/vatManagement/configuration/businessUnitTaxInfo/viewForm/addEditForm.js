/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useState, useEffect } from "react";
import { useSelector, shallowEqual } from "react-redux";
import ICard from "../../../../_helper/_card";
import { _todayDate } from "../../../../_helper/_todayDate";
import { GetBusinessUnitTaxView } from "../helper";
import Form from "./form";

const initData = {
  businessUnitDDL: "",
  taxZoneDDL: "",
  taxCircleDDL: "",
  returnSubmissionDate: "",
  representativeDDL: "",
  representativeRankDDL: "",
  representativeAddress: "",
};

export default function BSUViewForm({
  history,
  match: {
    params: { id },
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
    if (id) {
      GetBusinessUnitTaxView(id, setSingleData);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const saveHandler = async (values, cb) => {
    setDisabled(true);
    if (values && profileData?.accountId && selectedBusinessUnit?.value) {
      const payload = {
        actionBy: profileData.userId,
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
        isActive: true,
      };
   
    } else {
      setDisabled(false);
      
    }
  };

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
        //initData={id ? singleData : initData}
        saveHandler={saveHandler}
        disableHandler={disableHandler}
        accountId={profileData?.accountId}
        selectedBusinessUnit={selectedBusinessUnit}
        // isEdit={id || false}
        isDisabled={true}
      />
    </ICard>
  );
}
