import React from "react";
import InputField from "../../../../_helper/_inputField";
import NewSelect from "../../../../_helper/_select";
import {
  chooseTableColumns,
  fetchPCFLandingData,
  importPaymentType
} from "./helper";

const ProjectedCashFlowLanding = ({ obj }) => {
  // destrcuture
  const {
    setFieldValue,
    values,
    errors,
    touched,
    pcfLandingData,
    getPCFLandingData,
  } = obj;

  // Form Field For Import View Type
  const ImportTypeFormField = (values, setFieldValue) => (
    <div className="col-lg-3">
      <NewSelect
        name="paymentType"
        label="Payment Type"
        options={importPaymentType}
        value={values?.paymentType}
        onChange={(valueOption) => {
          setFieldValue("paymentType", valueOption);
        }}
        errors={errors}
        touched={touched}
      />
    </div>
  );

  return (
    <>
      <div className="form form-label-right">
        <h4 style={{ marginTop: "30px", marginBottom: "-5px" }}>Landing</h4>
        <div className="row form-group  global-form">
          {/* Form Field For Import View Type */}
          {values?.viewType === "import" &&
            ImportTypeFormField(values, setFieldValue)}

          {/* Common Form Field */}
          <div className="col-lg-3">
            <InputField
              value={values?.fromDate}
              label="From Date"
              name="fromDate"
              type="date"
            />
          </div>
          <div className="col-lg-3">
            <InputField
              value={values?.toDate}
              label="To Date"
              name="toDate"
              type="date"
            />
          </div>
          <div>
            <button
              type="button"
              style={{ marginTop: "18px" }}
              className="btn btn-primary ml-5"
              onClick={() => fetchPCFLandingData({ values, getPCFLandingData })}
            >
              Show
            </button>
          </div>
        </div>
        {/* Landing Table */}
        <div className="loan-scrollable-table mt-3">
          <div className="scroll-table _table">
            {pcfLandingData?.length > 0 && (
              <GenericTable
                data={pcfLandingData}
                columns={chooseTableColumns(values?.viewType)}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProjectedCashFlowLanding;

const GenericTable = ({ data, columns, keyField = "index" }) => {
  return (
    <table className="table table-bordered bj-table bj-table-landing">
      <thead>
        <tr>
          {columns?.map((col, idx) => (
            <th idx={idx}>{col.header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data?.length > 0 &&
          data?.map((item, rowIdx) => (
            <tr key={item[keyField] || rowIdx}>
              {columns?.map((col, colIndex) => (
                <td key={colIndex} className={col?.className || ""}>
                  {col?.render ? col.render(item, rowIdx) : item[col.key]}
                </td>
              ))}
            </tr>
          ))}
      </tbody>
    </table>
  );
};
