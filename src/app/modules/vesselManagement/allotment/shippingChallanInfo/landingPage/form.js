import React from "react";
import PaginationSearch from "../../../../_helper/_search";
import NewSelect from "../../../../_helper/_select";
import IButton from "../../../../_helper/iButton";
import { BADCBCICForm, PortAndMotherVessel } from "../../../common/components";
import FromDateToDateForm from "../../../../_helper/commonInputFieldsGroups/dateForm";

const confirmationTypes = [
  { value: 1, label: "Receive Confirmation" },
  { value: 2, label: "Supervisor Confirmation" },
  // { value: 2, label: "Supervisor Confirmation (Truck Bill)" },
  // { value: 3, label: "Supervisor Confirmation (Godown Unload Bill)" },
];

const Form = ({ obj }) => {
  const {
    paginationSearchHandler,
    onChangeHandler,
    setFieldValue,
    shipPointDDL,
    totalRevenue,
    isDisabled,
    setRowData,
    godownDDL,
    totalBill,
    totalQty,
    pageSize,
    getData,
    rowData,
    status,
    pageNo,
    values,
  } = obj;
  return (
    <>
      <form className="form form-label-right">
        <div className="global-form">
          <div className="row">
            <BADCBCICForm
              colSize={"col-lg-3"}
              values={values}
              setFieldValue={setFieldValue}
              onChange={onChangeHandler}
            />
            <div className="col-lg-3">
              <NewSelect
                name="confirmationType"
                options={confirmationTypes}
                value={values?.confirmationType}
                label="Confirmation Type"
                onChange={(e) => {
                  setFieldValue("confirmationType", e);
                  setRowData([]);
                }}
                placeholder="Confirmation Type"
              />
            </div>
            <div className="col-lg-3">
              <NewSelect
                name="shipPoint"
                options={[{ value: 0, label: "All" }, ...shipPointDDL]}
                value={values?.shipPoint}
                label="ShipPoint"
                onChange={(e) => {
                  setFieldValue("shipPoint", e);
                  setRowData([]);
                }}
                placeholder="ShipPoint"
              />
            </div>
            <div className="col-lg-3">
              <NewSelect
                name="shipToPartner"
                options={[{ value: 0, label: "All" }, ...godownDDL]}
                value={values?.shipToPartner}
                label="Ship to Partner"
                placeholder="Ship to Partner"
                onChange={(e) => {
                  setFieldValue("shipToPartner", e);
                  setRowData([]);
                }}
              />
            </div>

            <PortAndMotherVessel
              obj={{
                values,
                setFieldValue,
                onChange: () => {
                  setRowData([]);
                },
              }}
            />

            <div className="col-lg-3">
              <NewSelect
                name="status"
                options={[
                  { value: 1, label: "Pending" },
                  { value: 2, label: "Updated" },
                ]}
                value={values?.status}
                label="Status"
                onChange={(e) => {
                  setFieldValue("status", e);
                  setRowData([]);
                }}
                placeholder="Status"
              />
            </div>
            <FromDateToDateForm obj={{ values, setFieldValue }} />

            <IButton
              colSize={"col-lg-1"}
              onClick={() => {
                getData(values, pageNo, pageSize);
              }}
              disabled={isDisabled(values)}
            />
          </div>
        </div>
      </form>

      {/* this section is appearing in the middle of the form and table */}
      <div className="row mb-3">
        <div className="col-lg-4">
          <PaginationSearch
            placeholder="Delivery Code/Sales Order/ShipPoint"
            paginationSearchHandler={paginationSearchHandler}
            values={values}
          />
        </div>

        {rowData?.data?.length > 0 && status && (
          <div className="col-lg-8">
            <div className="row">
              <div className="col-lg-4">
                <h3>Total Quantity: {totalQty}</h3>
              </div>
              <div className="col-lg-4">
                <h3>Total Bill: {totalBill(values)}</h3>
              </div>
              <div className="col-lg-4">
                <h3>Total Revenue: {totalRevenue}</h3>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Form;
