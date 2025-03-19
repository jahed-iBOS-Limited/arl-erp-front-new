import React from "react";
import InputField from "../../../../_helper/_inputField";
import PaginationSearch from "../../../../_helper/_search";
import NewSelect from "../../../../_helper/_select";
import IButton from "../../../../_helper/iButton";
import { BADCBCICForm, PortAndMotherVessel } from "../../../common/components";

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
    organizationDDL,
    setFieldValue,
    shipPointDDL,
    totalRevenue,
    isDisabled,
    setRowData,
    godownDDL,
    totalBill,
    totalQty,
    pageSize,
    setOpen,
    getData,
    rowData,
    status,
    pageNo,
    values,
    buId,
  } = obj;
  return (
    <>
      <form className="form form-label-right">
        <div className="global-form">
          <div className="row">
            {buId === 94 && (
              <BADCBCICForm
                colSize={"col-lg-3"}
                values={values}
                setFieldValue={setFieldValue}
                onChange={onChangeHandler}
              />
            )}
            {buId === 178 && (
              <div className="col-lg-3">
                <NewSelect
                  name="organization"
                  options={organizationDDL || []}
                  value={values?.organization}
                  label="Organization"
                  onChange={(valueOption) => {
                    onChangeHandler(
                      "organization",
                      { ...values, organization: valueOption },
                      valueOption,
                      setFieldValue
                    );
                  }}
                  placeholder="Organization"
                />
              </div>
            )}
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
                name="confirmationStatus"
                options={[
                  { value: 1, label: "Pending" },
                  { value: 2, label: "Approve" },
                ]}
                value={values?.confirmationStatus}
                label="Confirmation Status"
                onChange={(e) => {
                  setFieldValue("confirmationStatus", e);
                  setRowData([]);
                }}
                placeholder="Confirmation Status"
              />
            </div>
            {status &&
              [2, 3].includes(values?.confirmationType?.value) &&
              rowData?.data?.length > 0 && (
                <>
                  <div className="col-lg-3">
                    <InputField
                      label="JV Date"
                      placeholder="JV Date"
                      value={values?.jvDate}
                      name="jvDate"
                      type="date"
                    />
                  </div>
                  <div className="col-lg-3">
                    <InputField
                      label="Bill Ref"
                      placeholder="Bill Ref"
                      value={values?.billRef}
                      name="billRef"
                      type="text"
                    />
                  </div>
                  <div className="col-lg-6">
                    <InputField
                      label="Remarks"
                      placeholder="Remarks"
                      value={values?.remarks}
                      name="remarks"
                      type="text"
                    />
                  </div>
                  <IButton colSize={"col-lg-2"} onClick={() => setOpen(true)}>
                    Attachment
                  </IButton>
                </>
              )}

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
