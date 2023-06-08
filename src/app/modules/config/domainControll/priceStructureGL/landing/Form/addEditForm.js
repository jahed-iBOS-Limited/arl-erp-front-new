import React, { useState } from "react";
import { useSelector, shallowEqual } from "react-redux";
import Form from "./form";

import { useLocation } from "react-router-dom";
import IForm from "../../../../../_helper/_form";
import Loading from "../../../../../_helper/_loading";
import { useEffect } from "react";
import { GetLandingComponentData, getGeneralLedgerDDL } from "./../../helper";
import { updateGeneralLedger } from "./../../helper";

const initData = {
  generalLeadger: "",
};

export function PriceStructureGlLanding({
  history,
  match: {
    params: { id },
  },
}) {
  const [generalLeadgerDDL, setGeneralLeadgerDDL] = useState([]);
  const [componentData, setComponentData] = useState([]);
  const [isDisabled, ] = useState(false);
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  // const [employeeValue, setEmployeeValue] = useState("");

  useEffect(() => {
    getGeneralLedgerDDL(
      profileData?.accountId,
      setGeneralLeadgerDDL,
      setLoading
    );
    GetLandingComponentData(
      profileData?.accountId,
      setComponentData,
      setLoading
    );
  }, [profileData]);

  const saveHandler = async (values, cb) => {
    const newData = componentData?.map((item) => ({
      priceStructureGLID: item?.id || 0,
      generalLedgerId: item?.selectedGeneralLeadger?.value || 0,
    }));
    updateGeneralLedger(newData, cb);
  };

  const rowDtoChangeHandler = (name, value, index) => {
    const data = [...componentData];
    data[index][name] = value;
    setComponentData(data);
  };

  console.log(componentData);

  const [objProps, setObjprops] = useState({});

  return (
    <IForm
      title="Price Structure GL"
      getProps={setObjprops}
      isDisabled={isDisabled}
      isHiddenBack={true}
      isHiddenReset={true}
    >
      {isDisabled && <Loading />}
      <div className="mt-0">
        <Form
          {...objProps}
          initData={initData}
          saveHandler={saveHandler}
          profileData={profileData}
          selectedBusinessUnit={selectedBusinessUnit}
          location={location}
          isEdit={id || false}
          generalLeadgerDDL={generalLeadgerDDL}
          componentData={componentData}
          loading={loading}
          rowDtoChangeHandler={rowDtoChangeHandler}
        />
      </div>
    </IForm>
  );
}
