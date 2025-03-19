import React from "react";
import { shallowEqual, useSelector } from "react-redux";
import { getVoyageDDLNew } from "../../helper";
import FormikSelect from "../../_chartinghelper/common/formikSelect";
import customStyles from "../../_chartinghelper/common/selectCustomStyle";

const AdjustmentFilter = ({ objProps }) => {
  const {
    setFieldValue,
    errors,
    touched,
    values,
    vesselDDL,
    voyageNoDDL,
    setVoyageNoDDL,
    setLoading,
    getLanding,
  } = objProps;

  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state?.authData;
  }, shallowEqual);

  return (
    <>
      <div className="marine-form-card-content">
        <div className="row">
          <div className="col-lg-3">
            <FormikSelect
              value={values?.vesselName || ""}
              isSearchable={true}
              options={vesselDDL || []}
              styles={customStyles}
              name="vesselName"
              placeholder="Vessel Name"
              label="Vessel Name"
              onChange={(valueOption) => {
                setFieldValue("vesselName", valueOption);
                setFieldValue("voyageNo", "");
                if (valueOption) {
                  getVoyageDDLNew({
                    accId: profileData?.accountId,
                    buId: selectedBusinessUnit?.value,
                    id: valueOption?.value,
                    setter: setVoyageNoDDL,
                    setLoading: setLoading,
                    hireType: 0,
                    isComplete: 0,
                    voyageTypeId: 0,
                  });
                }
              }}
              errors={errors}
              touched={touched}
            />
          </div>
          <div className="col-lg-3">
            <FormikSelect
              value={values?.voyageNo || ""}
              isSearchable={true}
              options={voyageNoDDL || []}
              styles={customStyles}
              name="voyageNo"
              placeholder="Voyage No"
              label="Voyage No"
              onChange={(valueOption) => {
                setFieldValue("voyageNo", valueOption);
                getLanding({ ...values, voyageNo: valueOption });
              }}
              isDisabled={false}
              errors={errors}
              touched={touched}
            />
          </div>
          {/* <div>
            <button
              type="button"
              style={{ marginTop: "14px" }}
              className={"btn btn-primary"}
              onClick={() => {
                getLanding(values);
              }}
              disabled={!values?.vesselName || !values?.voyageNo}
            >
              Show
            </button>
          </div> */}
        </div>
      </div>
    </>
  );
};

export default AdjustmentFilter;
