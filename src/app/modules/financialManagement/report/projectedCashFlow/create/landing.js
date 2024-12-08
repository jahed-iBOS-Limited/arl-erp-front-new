import React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import IConfirmModal from "../../../../_helper/_confirmModal";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import { _formatMoney } from "../../../../_helper/_formatMoney";
import InputField from "../../../../_helper/_inputField";
import NewSelect from "../../../../_helper/_select";
import { fetchPCFLandingData, importPaymentType } from "./helper";

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
            <table className="table table-bordered bj-table bj-table-landing">
              <thead>
                <tr>
                  <th style={{ minWidth: "30px" }}>SL</th>
                  <th>Expense/Payment Name</th>
                  <th style={{ minWidth: "80px" }}>Amount</th>
                  <th style={{ minWidth: "80px" }}>Date</th>
                  <th style={{ minWidth: "50px" }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {pcfLandingData?.length > 0 &&
                  pcfLandingData.map((item, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{item?.ExpensePaymentConcat}</td>
                      <td className="text-right">
                        {_formatMoney(item?.numAmount)}
                      </td>
                      <td className="text-center">
                        {_dateFormatter(item?.dteDueDate)}
                      </td>
                      <td className="text-center">
                        <OverlayTrigger
                          overlay={<Tooltip id="cs-icon">{"Inactive"}</Tooltip>}
                        >
                          <span>
                            <i
                              className="fa fa-minus-square"
                              aria-hidden="true"
                              onClick={() => {
                                IConfirmModal({
                                  message:
                                    "Are you sure you want to inactive ?",
                                  yesAlertFunc: () => {},
                                  noAlertFunc: () => {},
                                });
                              }}
                            ></i>
                          </span>
                        </OverlayTrigger>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProjectedCashFlowLanding;
