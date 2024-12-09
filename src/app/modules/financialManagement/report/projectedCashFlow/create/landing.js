import React from "react";
import InputField from "../../../../_helper/_inputField";
import { _formatMoney } from "../../../../_helper/_formatMoney";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import IConfirmModal from "../../../../_helper/_confirmModal";

const ProjectedCashFlowLanding = (obj) => {
  const { values, setFieldValue } = obj;

  return (
    <>
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
                                message: "Are you sure you want to inactive ?",
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
    </>
  );
};

export default ProjectedCashFlowLanding;
