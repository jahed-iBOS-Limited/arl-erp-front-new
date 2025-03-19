import React from "react";
import { withRouter } from "react-router-dom";
import Loading from "./../../../../_helper/_loading";
import { _dateFormatter } from "./../../../../_helper/_dateFormate";

const GridData = ({ history, rowDto, loading }) => {
  return (
    <>
      <div className="row cash_journal">
        <div className="col-lg-12">
          <div className="table-responsive">
            <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing sales_order_landing_table">
              <thead>
                <tr>
                  <th style={{ width: "20px" }}>SL</th>
                  <th style={{ width: "150px" }}>Sales Order Id</th>
                  <th style={{ width: "150px" }}>Sales Order Code</th>
                  <th style={{ width: "150px" }}>Refference Type Name</th>
                  <th style={{ width: "150px" }}>Payment Terms Name</th>
                  <th style={{ width: "150px" }}>Shipping Date</th>
                  <th style={{ width: "20px" }}>Action </th>
                </tr>
              </thead>
              <tbody>
                {loading && <Loading />}
                {rowDto?.data?.map((tableData, index) => (
                  <tr key={index}>
                    <td> {tableData.sl} </td>
                    <td> {tableData.salesOrderId} </td>
                    <td> {tableData.salesOrderCode} </td>
                    <td> {tableData.refferenceTypeName} </td>
                    <td> {tableData.paymentTermsName} </td>
                    <td> {_dateFormatter(tableData.dueShippingDate)} </td>
                    <td style={{ verticalAlign: "middle" }}>
                      <div className="d-flex justify-content-center align-items-center baiscInfo_table">
                        <button
                          className="btn btn-outline-dark mr-1 pointer"
                          type="button"
                          style={{
                            padding: "1px 5px",
                            fontSize: "11px",
                            width: "100px",
                          }}
                          onClick={() => {
                            history.push({
                              pathname: `/sales-management/ordermanagement/ordertransfer/create`,
                              state: tableData,
                            });
                          }}
                        >
                          Transfer Shipoint
                        </button>
                      </div>
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

export default withRouter(GridData);
