import React, { useState } from "react";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import ClearExpenseViewModel from "./clearExpenseViewModel";
import IView from "./../../../../_helper/_helperIcons/_view";

function ClearExpenseGrid({
  gridData,
  allGridCheck,
  itemSlectedHandler,
  setClearExpenseGridData,
}) {
  const [isClearExpenseViewModel, setIsClearExpenseViewModel] = useState(false);
  const [gridRowDataClearExpViewBtn, setGridRowDataClearExpViewBtn] = useState(
    ""
  );

  return (
    <>
      {gridData?.length > 0 && (
        <div className="table-responsive">
          <table className="table table-striped table-bordered mt-3 global-table">
            <thead>
              <tr>
                <th style={{ width: "25px" }}>
                  <input
                    type="checkbox"
                    id="parent"
                    onChange={(event) => {
                      setClearExpenseGridData(
                        allGridCheck(event.target.checked, gridData)
                      );
                    }}
                  />
                </th>
                <th style={{ width: "35px" }}>SL</th>
                <th style={{ width: "150px" }}>Submit Date</th>
                <th style={{ width: "150px" }}>Expense Code</th>
                <th style={{ width: "150px" }}>Expense For Name</th>

                <th style={{ width: "150px" }}>Cost Center Name</th>
                <th style={{ width: "150px" }}>Disbursement Center Name</th>
                <th style={{ width: "150px" }}>Total Amount</th>
                <th style={{ width: "150px" }}>Comments</th>
                <th style={{ width: "150px" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {gridData?.map((item, index) => (
                <tr key={index}>
                  <td>
                    <input
                      id="itemCheck"
                      type="checkbox"
                      className=""
                      value={item?.itemCheck}
                      checked={item?.itemCheck}
                      name={item?.itemCheck}
                      onChange={(e) => {
                        setClearExpenseGridData(
                          itemSlectedHandler(e.target.checked, index, gridData)
                        );
                      }}
                    />
                  </td>
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
                    <div className="pl-2">{item?.costCenterName}</div>
                  </td>
                  <td>
                    <div className="pl-2">{item?.disbursementCenterName}</div>
                  </td>
                  <td>
                    <div className="pl-2">{item?.totalApprovedAmount}</div>
                  </td>
                  <td>
                    <div className="pl-2">{item?.comments}</div>
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
              ))}
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
  );
}

export default ClearExpenseGrid;
