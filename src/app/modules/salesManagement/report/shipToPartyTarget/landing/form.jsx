/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import NewSelect from "../../../../_helper/_select";
import YearMonthForm from "../../../../_helper/commonInputFieldsGroups/yearMonthForm";
import IButton from "../../../../_helper/iButton";

const types = [];

const ShipToPartyTargetLandingForm = ({ obj }) => {
  const { values, setFieldValue, getData, pageNo, pageSize } = obj;

  return (
    <>
      <form className="form form-label-right">
        <div className="global-form">
          <div className="row">
            <div className="col-lg-3">
              <NewSelect
                name="type"
                options={types}
                value={values?.type}
                label="Type"
                onChange={(valueOption) => {
                  setFieldValue("type", valueOption);
                }}
                placeholder="Select Type"
              />
            </div>

            <YearMonthForm
              obj={{
                values,
                setFieldValue,
              }}
            />
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

export default ShipToPartyTargetLandingForm;
