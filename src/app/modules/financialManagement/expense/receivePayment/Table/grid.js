import React from "react";
import { useHistory, withRouter } from "react-router-dom";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import { _formatMoney } from "../../../../_helper/_formatMoney";
import Loading from "./../../../../_helper/_loading";

const GridData = ({ rowDto, values, loading }) => {
  let history = useHistory();
  return (
    <>
      {/* Table Start */}
      <div className="row cash_journal">
        <div className="col-lg-12 pr-0 pl-0">
          {rowDto?.length > 0 && (
            <div className="table-responsive">
              <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing">
              <thead>
                <tr>
                  <th style={{ width: "30px" }}>SL</th>
                  <th style={{ width: "30px" }}>Transaction Type</th>
                  <th style={{ width: "30px" }}>Reference No.</th>
                  <th style={{ width: "30px" }}>Transaction Date</th>
                  <th style={{ width: "30px" }}> Amount</th>
                  {/* <th style={{ width: "30px" }}>Amount</th> */}
                  <th style={{ width: "30px" }}>Action </th>
                </tr>
              </thead>
              <tbody>
                {loading && <Loading />}
                {rowDto?.map((item, index) => (
                  <tr>
                    <td className="text-center"> {index + 1}</td>
                    <td className="text-center"> {item?.transactionType}</td>
                    <td className="text-center"> {item?.referanceNo}</td>
                    <td className="text-center">
                      {" "}
                      {_dateFormatter(item?.lastActionDateTime)}
                    </td>
                    <td className="text-center">
                      {" "}
                      {_formatMoney(item?.numTotalApprovedAmount)}
                    </td>
                    {/* <td className="text-center"> {_formatMoney(item?.numPendingAmount)}</td> */}
                    <td className="text-center">
                      <button
                        type="button"
                        className="btn btn-primary"
                        style={{ padding: "4px 5px" }}
                        onClick={() =>
                          history.push({
                            pathname: `/financial-management/expense/receivepayment/cash/${item.id}`,
                            state: { values, item, gridBtnType: "Cash" },
                          })
                        }
                      >
                        Cash
                      </button>
                      <button
                        type="button"
                        className="btn btn-primary ml-2"
                        onClick={() =>
                          history.push({
                            pathname: `/financial-management/expense/receivepayment/bank/${item.id}`,
                            state: { values, item, gridBtnType: "Bank" },
                          })
                        }
                        style={{ padding: "4px 5px" }}
                      >
                        Bank
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          )}
        </div>
      </div>
      {/* Table End */}
    </>
  );
};

export default withRouter(GridData);
