/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import TextArea from "../../../../_helper/TextArea";
import NewSelect from "../../../../_helper/_select";
import FromDateToDateForm from "../../../../_helper/commonInputFieldsGroups/dateForm";
import IButton from "../../../../_helper/iButton";

const DamageEntryLandingForm = ({ obj }) => {
  const {
    values,
    pageNo,
    sbuDDL,
    pageSize,
    gridData,
    editHandler,
    setGridData,
    setFieldValue,
    salesReturnLandingActions,
  } = obj;

  return (
    <>
      <form>
        <div className="row global-form">
          <div className="col-lg-2">
            <NewSelect
              name="viewAs"
              options={[
                { value: 1, label: "Supervisor" },
                // { value: 2, label: "Accountant" },
              ]}
              value={values?.viewAs}
              label="View As"
              onChange={(valueOption) => {
                setFieldValue("viewAs", valueOption);
                setGridData([]);
              }}
              placeholder="View As"
            />
          </div>
          <div className="col-lg-2">
            <NewSelect
              name="status"
              options={[
                { value: 0, label: "All" },
                { value: 1, label: "Approved" },
                { value: 2, label: "Pending" },
                { value: 3, label: "Canceled" },
              ]}
              value={values?.status}
              label="Status"
              onChange={(valueOption) => {
                setFieldValue("status", valueOption);
                setGridData([]);
              }}
              placeholder="Status"
            />
          </div>
          <FromDateToDateForm
            obj={{ values, setFieldValue, colSize: "col-lg-2" }}
          />

          {values?.viewAs?.value === 2 && (
            <>
              <div className="col-md-2">
                <NewSelect
                  name="sbu"
                  options={sbuDDL || []}
                  value={values?.sbu}
                  label="SBU"
                  onChange={(valueOption) => {
                    setFieldValue("sbu", valueOption);
                  }}
                  placeholder="Select SBU"
                />
              </div>{" "}
              <div className="col-lg-4">
                <label>Narration</label>
                <TextArea
                  name="narration"
                  value={values?.narration}
                  label="Narration"
                  placeholder="Narration"
                />
              </div>
            </>
          )}
          <IButton
            onClick={() => {
              salesReturnLandingActions(values, pageNo, pageSize);
            }}
            disabled={
              !values?.viewAs || (values?.viewAs?.value === 2 && !values?.sbu)
            }
          />
          {gridData?.data?.length > 0 && values?.status?.value === 2 && (
            <IButton
              className={"btn-info"}
              onClick={() => {
                editHandler(values);
              }}
            >
              Update & Approve
            </IButton>
          )}
        </div>
      </form>
    </>
  );
};

export default DamageEntryLandingForm;
