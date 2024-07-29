/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import RATForm from "../../../../_helper/commonInputFieldsGroups/ratForm";
import IButton from "../../../../_helper/iButton";

const HomeBuildersInfoLandingForm = ({ obj }) => {
  const { values, setFieldValue, getData, pageNo, pageSize } = obj;

  return (
    <>
      <form className="form form-label-right">
        <div className="global-form">
          <div className="row">
            <RATForm obj={{ values, setFieldValue }} />

            <IButton
              onClick={() => {
                getData(values, pageNo, pageSize);
              }}
            />
          </div>
        </div>
      </form>
    </>
  );
};

export default HomeBuildersInfoLandingForm;
