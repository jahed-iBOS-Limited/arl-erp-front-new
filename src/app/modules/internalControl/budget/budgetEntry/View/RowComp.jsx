import React from "react";
import ButtonStyleOne from "../../../../_helper/button/ButtonStyleOne";
import InputField from "../../../../_helper/_inputField";
import NewSelect from "../../../../_helper/_select";

const RowComp = ({ obj }) => {
  let {
    values,
    setFieldValue,
    errors,
    touched,
    addButtonHandler,
    GLDDL,
    sbuId,
    sbuIdView,
  } = obj;
  return (
    <>
      {/* {sbuId && (
        <>
          <div className="col-lg-2">
            <InputField
              label="From Date"
              placeholder="From Date"
              name="fromDate"
              type="date"
              value={values?.fromDate}
              onChange={(e) => {
                setFieldValue("fromDate", e.target.value);
                if (values?.type?.label === "Custom" && values?.toDate) {
                  setRowDto([
                    {
                      amount: 0,
                      fromDate: e.target.value,
                      toDate: values?.toDate,
                    },
                  ]);
                }
              }}
              errors={errors}
              touched={touched}
              disabled={sbuId || sbuIdView}
            />
          </div>
          <div className="col-lg-2">
            <InputField
              label="To Date"
              placeholder="To Date"
              name="toDate"
              disabled={!values?.fromDate || sbuId || sbuIdView}
              min={values?.fromDate}
              type="date"
              value={values?.toDate}
              onChange={(e) => {
                setFieldValue("toDate", e.target.value);
                if (values?.type?.label === "Custom" && values?.fromDate) {
                  setRowDto([
                    {
                      amount: 0,
                      fromDate: values?.fromDate,
                      toDate: e.target.value,
                    },
                  ]);
                }
              }}
              errors={errors}
              touched={touched}
            />
          </div>
        </>
      )} */}
      {!sbuIdView && (
        <div className="col-lg-2">
          <NewSelect
            label="General Ledger"
            placeholder="General Ledger"
            name="gl"
            options={GLDDL}
            value={values?.gl}
            onChange={(valueOption) => {
              setFieldValue("gl", valueOption);
            }}
            errors={errors}
            touched={touched}
          />
        </div>
      )}
      {sbuId && (
        <>
          <div className="col-lg-2">
            <InputField
              label="Amount"
              placeholder="Amount"
              name="amount"
              type="number"
              value={values?.amount}
              onChange={(e) => {
                setFieldValue("amount", e.target.value);
              }}
              errors={errors}
              touched={touched}
            />
          </div>
          <div className="col-lg-2">
            <ButtonStyleOne
              style={{ marginTop: "19px" }}
              label="Add"
              type="button"
              onClick={() => {
                addButtonHandler(values);
              }}
            />
          </div>
        </>
      )}
    </>
  );
};

export default RowComp;
