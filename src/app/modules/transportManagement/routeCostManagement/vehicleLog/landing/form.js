/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import NewSelect from "../../../../_helper/_select";
import { getOwnVehicleNo, getVehicleNoDDL } from "../helper";
import InputField from "../../../../_helper/_inputField";
import { useHistory } from "react-router-dom";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import { shallowEqual, useSelector } from "react-redux";
import YearMonthForm from "../../../../_helper/commonInputFieldsGroups/yearMonthForm";

const typeList = [
  { value: 1, label: "Vehicle Log Book for (Credit)" },
  { value: 2, label: "Vehicle Problem Entry" },
  { value: 3, label: "Vehicle Trip Target Entry" },
];

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
  const { shippointDDL: ShipPointDDL } = useSelector(
    (state) => state?.commonDDL,
    shallowEqual
  );

  const history = useHistory();
  const [vehicleList, getVehicleList] = useAxiosGet();
  const [vehicleCategories, getCategories] = useAxiosGet();

  const getVehicles = (values) => {
    const capacityId = values?.vehicleCapacity?.value;
    getVehicleList(
      `/tms/TransportMgtDDL/GetVehicleByCapacityId?Accountid=${accId}&BusinessUnitid=${buId}&VehicleTypeID=${capacityId ||
        1}`
    );
  };

  useEffect(() => {
    getVehicles({});
    getCategories(`/tms/TransportMgtDDL/GetVehicleCapacityDDL`);
  }, [buId]);

  const disableHandler = (values) => {
    const typeId = values?.type?.value;
    const result =
      (typeId !== 3 && !values?.vehicleNo) ||
      (typeId === 1 && (!values?.travelDateFrom || !values?.travelDateTo)) ||
      (typeId === 2 && !values?.shipPoint);

    return result;
  };

  return (
    <>
      <form className="form form-label-right">
        <div className="global-form">
          {/* Row */}
          <div className="row">
            <div className="col-lg-3">
              <NewSelect
                name="type"
                options={typeList}
                value={values?.type}
                label="Type"
                onChange={(valueOption) => {
                  setFieldValue("type", valueOption);
                  setFieldValue("vehicleNo", "");
                  setRowData([]);
                }}
                placeholder="Type"
              />
            </div>

            <div className="col-lg-12"></div>

            {[1].includes(values?.type?.value) && (
              <FormOne
                obj={{
                  values,
                  setFieldValue,
                  setRowData,
                  employeeId,
                  setVehicleNoList,
                  vehicleNoList,
                  accId,
                  buId,
                }}
              />
            )}

            {[2].includes(values?.type?.value) && (
              <FormTwo
                obj={{ values, setFieldValue, vehicleList, ShipPointDDL }}
              />
            )}

            {[3].includes(values?.type?.value) && (
              <FormThree
                obj={{
                  values,
                  vehicleList,
                  getVehicles,
                  ShipPointDDL,
                  setFieldValue,
                  vehicleCategories,
                }}
              />
            )}

            <div className="col-lg-3" style={{ marginTop: "19px" }}>
              <button
                onClick={() => getGridData(values, pageNo, pageSize)}
                type="button"
                className="btn btn-primary mr-2"
                disabled={disableHandler(values)}
              >
                View
              </button>

              {[1].includes(values?.type?.value) && (
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
              )}
            </div>
          </div>
        </div>
      </form>
    </>
  );
};

export default VehicleLogLandingForm;

const FormOne = ({ obj }) => {
  const {
    values,
    setFieldValue,
    setRowData,
    employeeId,
    setVehicleNoList,
    vehicleNoList,
    accId,
    buId,
  } = obj;

  return (
    <>
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
    </>
  );
};

const FormTwo = ({ obj }) => {
  const { values, setFieldValue, vehicleList, ShipPointDDL } = obj;

  return (
    <>
      <div className="col-lg-3">
        <NewSelect
          label="Vehicle No"
          placeholder="Vehicle No"
          name="vehicleNo"
          options={vehicleList || []}
          value={values?.vehicleNo}
          onChange={(valueOption) => {
            setFieldValue("vehicleNo", valueOption);
          }}
        />
      </div>
      <div className="col-lg-3">
        <NewSelect
          label="ShipPoint"
          placeholder="ShipPoint"
          name="shipPoint"
          options={ShipPointDDL || []}
          value={values?.shipPoint}
          onChange={(valueOption) => {
            setFieldValue("shipPoint", valueOption);
          }}
        />
      </div>
    </>
  );
};

const FormThree = ({ obj }) => {
  const {
    values,
    vehicleList,
    getVehicles,
    ShipPointDDL,
    setFieldValue,
    vehicleCategories,
  } = obj;

  return (
    <>
      {" "}
      <div className="col-lg-3">
        <NewSelect
          label="ShipPoint"
          placeholder="ShipPoint"
          name="shipPoint"
          options={ShipPointDDL || []}
          value={values?.shipPoint}
          onChange={(valueOption) => {
            setFieldValue("shipPoint", valueOption);
          }}
        />
      </div>
      <YearMonthForm obj={{ values, setFieldValue }} />
      <div className="col-lg-3">
        <NewSelect
          name="vehicleCapacity"
          options={vehicleCategories || []}
          value={values?.vehicleCapacity}
          label="Vehicle Category"
          onChange={(valueOption) => {
            setFieldValue("vehicleCapacity", valueOption);
            getVehicles({ ...values, vehicleCapacity: valueOption });
          }}
          placeholder="Vehicle Category"
        />
      </div>
      <div className="col-lg-3">
        <NewSelect
          label="Vehicle No"
          placeholder="Vehicle No"
          name="vehicleNo"
          options={vehicleList || []}
          value={values?.vehicleNo}
          onChange={(valueOption) => {
            setFieldValue("vehicleNo", valueOption);
          }}
        />
      </div>
    </>
  );
};
