import React, { useState } from "react";
import ClearExpenseViewModel from "./clearExpenseViewModel";
import IView from "../../../../_helper/_helperIcons/_view";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import IViewModal from "../../../../_helper/_viewModal";
import { _fixedPoint } from "./../../../../_helper/_fixedPoint";
function SingleEmployeeModel({ singleEmployeeGridData, show, onHide }) {
  const [isClearExpenseViewModel, setIsClearExpenseViewModel] = useState(false);
  const [gridRowDataClearExpViewBtn, setGridRowDataClearExpViewBtn] = useState(
    ""
  );
  let totalNetAmount = 0,
    totalApprovedAmount = 0,
    totalBalanceAmount = 0;
  return (
    <IViewModal
      show={show}
      onHide={onHide}
      title={singleEmployeeGridData?.[0]?.expenseForName}
      style={{ fontSize: "1.2rem !important" }}
      btnText="Close"
    >
      <>
        {singleEmployeeGridData?.length > 0 && (
          <div className="table-responsive">
            <table className="table table-striped table-bordered mt-3 global-table">
              <thead>
                <tr>
                  <th style={{ width: "35px" }}>SL</th>
                  <th style={{ width: "150px" }}>Request Date</th>
                  <th style={{ width: "150px" }}>Expense Code</th>
                  <th style={{ width: "150px" }}>Request By</th>
                  <th style={{ width: "150px" }}>Purpose</th>
                  <th style={{ width: "150px" }}>Disbursement Center Name</th>
                  <th style={{ width: "150px" }}>Advance Amount</th>
                  <th style={{ width: "150px" }}>Total Amount</th>
                  <th style={{ width: "150px" }}>Net Amount</th>
                  <th style={{ width: "150px" }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {singleEmployeeGridData?.map((item, index) => {
                  totalNetAmount += item?.netAmount || 0;
                  totalApprovedAmount += item?.totalApprovedAmount || 0;
                  totalBalanceAmount += item?.totalBalanceAmount || 0;
                  return (
                    <tr key={index}>
                      <td> {index + 1}</td>
                      <td>
                        <div className="pl-2">
                          {_dateFormatter(item?.submitDate)}
                        </div>
                      </td>
                      <td>
                        <div className="pl-2">{item?.expenseCode}</div>
                      </td>
                      <td>
                        <div className="pl-2">{item?.expenseForName}</div>
                      </td>
                      <td>
                        <div className="pl-2">{item?.comments}</div>
                      </td>
                      <td>
                        <div className="pl-2">
                          {item?.disbursementCenterName}
                        </div>
                      </td>
                      <td>
                        <div className="pr-2 text-right">
                          {_fixedPoint(item?.totalBalanceAmount)}
                        </div>
                      </td>
                      <td>
                        <div className="pr-2 text-right">
                          {_fixedPoint(item?.totalApprovedAmount)}
                        </div>
                      </td>

                      <td>
                        <div className="pr-2 text-right">
                          {_fixedPoint(item?.netAmount)}
                        </div>
                      </td>
                      <td>
                        <div className="pl-2 d-flex justify-content-center">
                          <span className="view">
                            <IView
                              clickHandler={() => {
                                setIsClearExpenseViewModel(true);
                                setGridRowDataClearExpViewBtn(item);
                              }}
                            />
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                <tr>
                  <td colspan="6" className="text-right">
                    <b>Total</b>
                  </td>
                  <td>
                    <div className="pr-2 text-right">
                      <b> {_fixedPoint(totalBalanceAmount)} </b>
                    </div>
                  </td>
                  <td>
                    <div className="pr-2 text-right">
                      <b>{_fixedPoint(totalApprovedAmount)}</b>
                    </div>
                  </td>
                  <td>
                    <div className="pr-2 text-right">
                      <b>{_fixedPoint(totalNetAmount)}</b>
                    </div>
                  </td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
        <ClearExpenseViewModel
          show={isClearExpenseViewModel}
          gridRowDataClearExpViewBtn={gridRowDataClearExpViewBtn}
          onHide={() => setIsClearExpenseViewModel(false)}
        />
      </>
    </IViewModal>
  );
}

export default SingleEmployeeModel;
