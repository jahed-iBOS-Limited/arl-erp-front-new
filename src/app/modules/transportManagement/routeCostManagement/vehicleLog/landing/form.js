import React from "react";
import NewSelect from "../../../../_helper/_select";
import { getOwnVehicleNo, getVehicleNoDDL } from "../helper";
import InputField from "../../../../_helper/_inputField";
import { useHistory } from "react-router-dom";

const VehicleLogLandingForm = ({ obj }) => {
  const {
    buId,
    accId,
    values,
    pageNo,
    pageSize,
    employeeId,
    setRowData,
    getGridData,
    setFieldValue,
    vehicleNoList,
    setVehicleNoList,
  } = obj;

  const history = useHistory();

  return (
    <>
      <form className="form form-label-right">
        <div className="global-form">
          {/* Row */}
          <div className="row">
            <div className="col-lg-3">
              <NewSelect
                name="type"
                options={[
                  { value: 1, label: "Vehicle Log Book for (Credit)" },
                  { value: 2, label: "Vehicle Problem Entry" },
                ]}
                value={values?.type}
                label="Type"
                onChange={(valueOption) => {
                  setFieldValue("type", valueOption);
                }}
                placeholder="Type"
              />
            </div>

            <div className="col-lg-12"></div>

            <div className="col-lg-2">
              <label>
                <b>Entry By</b>
              </label>
              <div
                role="group"
                aria-labelledby="my-radio-group"
                className="d-flex align-items-center mt-1"
              >
                <div className="d-flex align-items-center">
                  <input
                    type="radio"
                    name="entryBy"
                    value="own"
                    checked={values?.entryBy === "own"}
                    className="mr-1 pointer"
                    onChange={(e) => {
                      setFieldValue("entryBy", e?.target?.value);
                      setFieldValue("vehicleNo", "");
                      setRowData([]);
                      getOwnVehicleNo(employeeId, setVehicleNoList);
                    }}
                  />
                  <p className="mr-3 mb-0 pointer">Own</p>
                </div>
                <input
                  id="other"
                  type="radio"
                  name="entryBy"
                  value="other"
                  checked={values?.entryBy === "other"}
                  className="mr-1 pointer"
                  onChange={(e) => {
                    setFieldValue("entryBy", e?.target?.value);
                    setFieldValue("vehicleNo", "");
                    setRowData([]);
                    getVehicleNoDDL(accId, buId, setVehicleNoList);
                  }}
                />
                <p className="pr-0 mb-0" htmlFor="other">
                  Other
                </p>
              </div>
            </div>
            <div className="col-lg-3">
              <NewSelect
                name="vehicleNo"
                options={vehicleNoList}
                value={values?.vehicleNo}
                label="Vehicle No."
                onChange={(valueOption) => {
                  setFieldValue("vehicleNo", valueOption);
                }}
                placeholder="Vehicle No."
              />
            </div>
            <div className="col-lg-2">
              <label>Travel Date From</label>
              <InputField
                value={values?.travelDateFrom}
                name="travelDateFrom"
                placeholder="Travel Date From"
                type="date"
              />
            </div>
            <div className="col-lg-2">
              <label>Travel Date To</label>
              <InputField
                value={values?.travelDateTo}
                name="travelDateTo"
                placeholder="Travel Date To"
                type="date"
              />
            </div>
            <div className="col-lg-3" style={{ marginTop: "19px" }}>
              <button
                onClick={() => getGridData(values, pageNo, pageSize)}
                type="button"
                className="btn btn-primary mr-2"
                disabled={
                  !values?.vehicleNo ||
                  !values?.travelDateFrom ||
                  !values?.travelDateTo
                }
              >
                View
              </button>

              <button
                type="button"
                className="btn btn-primary"
                disabled={
                  values?.travelDateFrom === "" ||
                  values?.travelDateTo === "" ||
                  values?.vehicleNo === ""
                }
                onClick={() =>
                  history.push({
                    pathname:
                      "/transport-management/routecostmanagement/routestandardcost/vehicleLogExpense/create",
                    state: {
                      values,
                    },
                  })
                }
              >
                Create Expense
              </button>
            </div>
          </div>
        </div>
      </form>
    </>
  );
};

export default VehicleLogLandingForm;
