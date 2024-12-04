import React from "react";
import InputField from "../../../../_helper/_inputField";
import { _formatMoney } from "../../../../_helper/_formatMoney";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import IConfirmModal from "../../../../_helper/_confirmModal";

const ProjectedCashFlowLanding = (obj) => {
  const { values, setFieldValue } = obj;

  return (
    <div>
      <h4 style={{ marginTop: "30px", marginBottom: "-5px" }}>Landing</h4>
      <div className="row form-group  global-form">
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
            onClick={() => {}}
          >
            Show
          </button>
        </div>
      </div>
      <div>
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
                {[] > 0 &&
                  [].map((item, index) => (
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
    </div>
  );
};

export default ProjectedCashFlowLanding;
