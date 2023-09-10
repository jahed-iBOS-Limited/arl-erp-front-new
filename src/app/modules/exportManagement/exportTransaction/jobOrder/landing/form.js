import React from "react";
import NewSelect from "../../../../_helper/_select";
import FromDateToDateForm from "../../../../_helper/commonInputFieldsGroups/dateForm";
import IButton from "../../../../_helper/iButton";

export const JobOrderLandingForm = ({ obj }) => {
  const { values, setRowData, setFieldValue, getLandingData } = obj;

  return (
    <>
      <form>
        <div className="row global-form">
          <div className="col-lg-3">
            <NewSelect
              name="status"
              options={[
                { value: false, label: "Quotation Open" },
                { value: true, label: "Quotation Closed" },
              ]}
              value={values?.status}
              label="Quotation Status"
              onChange={(valueOption) => {
                if (valueOption) {
                  setFieldValue("status", valueOption);
                  setRowData([]);
                } else {
                  setFieldValue("status", "");
                  setRowData([]);
                }
              }}
              placeholder="Quotation Status"
            />
          </div>

          <FromDateToDateForm
            obj={{
              values,
              setFieldValue,
              onChange: () => {
                setRowData([]);
              },
            }}
          />

          <IButton
            disabled={!values?.status}
            onClick={() => {
              getLandingData(values);
            }}
          />
        </div>
      </form>
    </>
  );
};
