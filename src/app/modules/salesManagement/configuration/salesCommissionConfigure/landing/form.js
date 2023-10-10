/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import FromDateToDateForm from "../../../../_helper/commonInputFieldsGroups/dateForm";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import { shallowEqual, useSelector } from "react-redux";
import NewSelect from "../../../../_helper/_select";
import RATForm from "../../../../_helper/commonInputFieldsGroups/ratForm";

const SalesCommissionConfigureLandingForm = ({ obj }) => {
  const { values, setFieldValue, pageNo, pageSize, getData, setGridData } = obj;

  const [
    commissionTypes,
    getCommissionTypes,
    ,
    setCommissionTypes,
  ] = useAxiosGet();

  const {
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state?.authData, shallowEqual);

  useEffect(() => {
    getCommissionTypes(
      `/wms/WmsReport/GetCommissionTypeDDL?businessUnitId=${buId}`,
      (resData) => {
        setCommissionTypes(resData?.data);
      }
    );
  }, [buId]);

  return (
    <div>
      <form>
        <div className="row global-form">
          <div className="col-lg-3">
            <NewSelect
              name="commissionType"
              options={commissionTypes}
              value={values?.commissionType}
              label="Commission Type"
              placeholder="Commission Type"
              onChange={(e) => {
                setFieldValue("commissionType", e);
                setGridData([]);
              }}
            />
          </div>
          <RATForm obj={{ values, setFieldValue }} />
          <FromDateToDateForm obj={{ values, setFieldValue }} />
          <div className="col-lg-3">
            <button
              className="btn btn-primary mt-5"
              type="button"
              onClick={() => {
                getData(pageNo, pageSize, values);
              }}
            >
              View
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SalesCommissionConfigureLandingForm;
