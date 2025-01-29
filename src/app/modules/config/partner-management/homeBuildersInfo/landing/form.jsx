/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import RATForm from "../../../../_helper/commonInputFieldsGroups/ratForm";
import IButton from "../../../../_helper/iButton";
import NewSelect from "../../../../_helper/_select";

const HomeBuildersInfoLandingForm = ({ obj }) => {
  const { values, setFieldValue, getData, pageNo, pageSize } = obj;

  return (
    <>
      <form className="form form-label-right">
        <div className="global-form">
          <div className="row">
            <div className="col-lg-3">
              <NewSelect
                name="type"
                options={[
                  { value: 1, label: "Engineer" },
                  { value: 2, label: "Mason" },
                  { value: 3, label: "IHB" },
                ]}
                value={values?.type}
                label="Type"
                onChange={(valueOption) => {
                  setFieldValue("type", valueOption);
                }}
                placeholder="Type"
              />
            </div>
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
