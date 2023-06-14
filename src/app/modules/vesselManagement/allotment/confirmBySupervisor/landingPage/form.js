import React from "react";
import TextArea from "../../../../_helper/TextArea";
import InputField from "../../../../_helper/_inputField";
import NewSelect from "../../../../_helper/_select";
import { BADCBCICForm } from "../../../common/components";
import { getMotherVesselDDL } from "../helper";
import PaginationSearch from "../../../../_helper/_search";
import { getTotal } from "../../../common/helper";

const confirmationTypes = [
  { value: 1, label: "Receive Confirmation" },
  { value: 2, label: "Supervisor Confirmation (Truck Bill)" },
  { value: 3, label: "Supervisor Confirmation (Godown Unload Bill)" },
];

const Form = ({ obj }) => {
  const {
    values,
    setFieldValue,
    onChangeHandler,
    rowData,
    setRowData,
    status,
    getData,
    setOpen,
    shipPointDDL,
    godownDDL,
    portDDL,
    accId,
    buId,
    setMotherVesselDDL,
    motherVesselDDL,
    pageNo,
    pageSize,
    paginationSearchHandler,
    saveHandler,
  } = obj;
  return (
    <>
      <form className="form form-label-right">
        <div className="global-form">
          <div className="row">
            <BADCBCICForm
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
                }}
              />
            </div>
            <div className="col-lg-3">
              <NewSelect
                name="port"
                options={[{ value: 0, label: "All" }, ...portDDL]}
                value={values?.port}
                label="Port"
                placeholder="Port"
                onChange={(e) => {
                  setFieldValue("port", e);
                  setFieldValue("motherVessel", "");
                  getMotherVesselDDL(accId, buId, e?.value, setMotherVesselDDL);
                }}
              />
            </div>
            <div className="col-lg-3">
              <NewSelect
                name="motherVessel"
                options={[{ value: 0, label: "All" }, ...motherVesselDDL] || []}
                value={values?.motherVessel}
                label="Mother Vessel"
                placeholder="Mother Vessel"
                onChange={(e) => {
                  setFieldValue("motherVessel", e);
                }}
              />
            </div>
            <div className="col-lg-3">
              <NewSelect
                name="confirmationStatus"
                options={[
                  { value: 1, label: "Pending" },
                  { value: 2, label: "Approve" },
                ]}
                value={
                  values?.confirmationStatus || {
                    value: 1,
                    label: "Pending",
                  }
                }
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
                    <label>Remarks</label>
                    <TextArea
                      placeholder="Remarks"
                      value={values?.remarks}
                      name="remarks"
                      rows={3}
                    />
                  </div>
                  <div className="col-lg-2">
                    <button
                      className="btn btn-primary mr-2 mt-5"
                      type="button"
                      onClick={() => setOpen(true)}
                    >
                      Attachment
                    </button>
                  </div>
                </>
              )}

            <div className="col-12 text-right">
              <button
                className="btn btn-primary btn-sm mt-2"
                type="button"
                onClick={() => {
                  getData(values, pageNo, pageSize);
                }}
              >
                View
              </button>
            </div>
          </div>
        </div>
      </form>
      <div className="mt-5">
        <PaginationSearch
          placeholder="Delivery Code/Sales Order/ShipPoint"
          paginationSearchHandler={paginationSearchHandler}
          values={values}
        />
      </div>
      {rowData?.data?.length > 0 && status && (
        <div className="row my-3">
          <div className="col-lg-4">
            <h3>
              Total Quantity:{" "}
              {getTotal(rowData?.data, "quantity", "isSelected")}
            </h3>
          </div>
          <div className="col-lg-4">
            <h3>
              Total Bill:{" "}
              {rowData?.data
                ?.filter((item) => item?.isSelected)
                ?.reduce(
                  (x, y) =>
                    (x +=
                      (values?.confirmationType?.value === 2
                        ? +y?.transportRate
                        : values?.confirmationType?.value === 3
                        ? +y?.godownUnloadingRate
                        : 0) * +y?.quantity),
                  0
                )}
            </h3>
          </div>

          <div className="col-lg-4 text-right">
            <button
              className="btn btn-success"
              type="button"
              onClick={() => {
                saveHandler(values);
              }}
              disabled={
                !values?.remarks ||
                !values?.billRef ||
                rowData?.data?.filter((item) => item?.isSelected)?.length < 1
              }
            >
              Approve
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Form;
