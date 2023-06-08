import React, { useState } from "react";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import ClearExpenseViewModel from "./clearExpenseViewModel";
import IView from "../../../../_helper/_helperIcons/_view";
import InputField from "./../../../../_helper/_inputField";
// import { toast } from "react-toastify";
import { _fixedPoint } from "./../../../../_helper/_fixedPoint";

function TableWidthOutGroup({
  gridData,
  itemSlectedHandler,
  setGridData,
  allGridCheck,
  parentValues,
}) {
  const [isClearExpenseViewModel, setIsClearExpenseViewModel] = useState(false);
  const [gridRowDataClearExpViewBtn, setGridRowDataClearExpViewBtn] = useState(
    ""
  );

  // const isAdjustAmount =
  //   parentValues?.isGroup?.value === 1 &&
  //   parentValues?.expenseGroup?.value === "Other";

  const itemCheckFilterList = gridData?.filter((item) => item?.itemCheck);
  const itemCheckTotalAdjustAmount = itemCheckFilterList.reduce(
    (acc, cur) => (acc += +cur.adjustAmount || 0),
    0
  );

  return (
    <>
      <div className="d-flex justify-content-end align-content-center p-0 m-0">
        <p className=" p-0 m-0 mr-2">
          <b>Total Advance Amount:</b>{" "}
          {itemCheckFilterList?.[0]?.advanceAmount || 0},
        </p>
        <p className=" p-0 m-0 mr-2">
          <b>Total Adjust Amount:</b> {itemCheckTotalAdjustAmount || 0},
        </p>
        <p className=" p-0 m-0">
          <b>Total Net Payable Amount:</b>{" "}
          {itemCheckFilterList.reduce((acc, cur) => acc + cur.netAmount, 0)}
        </p>
      </div>

      {gridData?.length > 0 && (
        <div className="table-responsive">
          <table
            className="table table-striped table-bordered mt-3 global-table"
            id="table-to-xlsx"
          >
            <thead>
              <tr>
                <th style={{ width: "25px" }}>
                  {/* <input
                    type="checkbox"
                    id="parent"
                    onChange={(event) => {
                      if (parentValues?.expenseGroup?.value === "TaDa") {
                        setGridData(
                          allGridCheck(event.target.checked, gridData)
                        );
                      }
                    }}
                    disabled={parentValues?.expenseGroup?.value === "Other"}
                  /> */}
                </th>
                <th style={{ width: "35px" }}>SL</th>
                <th style={{ width: "150px" }}>Request Date</th>
                <th style={{ width: "150px" }}>Employee Id</th>
                <th style={{ width: "150px" }}>Expense Code</th>
                <th style={{ width: "150px" }}>Request By</th>
                <th style={{ width: "150px" }}>Purpose</th>
                <th style={{ width: "150px" }}>Disbursement Center Name</th>
                {/* <th style={{ width: "150px" }}>Advance Amount</th> */}
                <th style={{ width: "150px" }}>Total Amount</th>
                {/* {isAdjustAmount && ( */}
                <th style={{ minWidth: "100px" }}> Adjust Amount</th>
                {/* )} */}

                <th style={{ width: "150px" }}>Net Payable Amount</th>
                <th style={{ width: "150px" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {gridData?.map((item, index) => {
                const itemIsCheck = gridData?.filter((item) => item?.itemCheck);

                const isSameItemChcek = itemIsCheck.some(
                  (data) => data?.expenseForId === item?.expenseForId
                );

                return (
                  <tr key={index}>
                    <td>
                      <input
                        id="itemCheck"
                        type="checkbox"
                        className=""
                        value={item?.itemCheck}
                        checked={item?.itemCheck}
                        name={item?.itemCheck}
                        disabled={
                          itemIsCheck?.length === 0 ? false : !isSameItemChcek
                        }
                        onChange={(e) => {
                          if (itemIsCheck?.length === 0) {
                            setGridData(
                              itemSlectedHandler(
                                e.target.checked,
                                index,
                                gridData
                              )
                            );
                          } else {
                            if (isSameItemChcek) {
                              setGridData(
                                itemSlectedHandler(
                                  e.target.checked,
                                  index,
                                  gridData
                                )
                              );
                            } else {
                              return false;
                            }
                          }

                          // // if expenseGroup type TaDa : all item select
                          // if (parentValues?.expenseGroup?.value === "TaDa") {
                          //   setGridData(
                          //     itemSlectedHandler(
                          //       e.target.checked,
                          //       index,
                          //       gridData
                          //     )
                          //   );
                          // } else {
                          //   // if expenseGroup type Others : one item select
                          //   if (itemIsCheck?.length === 0) {
                          //     setGridData(
                          //       itemSlectedHandler(
                          //         e.target.checked,
                          //         index,
                          //         gridData
                          //       )
                          //     );
                          //   } else {
                          //     const isSameItemChcek = itemIsCheck.some(
                          //       (data) =>
                          //         data?.expenseForId === item?.expenseForId
                          //     );
                          //     if (isSameItemChcek) {
                          //       setGridData(
                          //         itemSlectedHandler(
                          //           e.target.checked,
                          //           index,
                          //           gridData
                          //         )
                          //       );
                          //     } else {
                          //       return false;
                          //     }
                          //   }
                          // }
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
                      <div className="pl-2">{item?.expenseId}</div>
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
                      <div className="pl-2">{item?.disbursementCenterName}</div>
                    </td>
                    {/* <td>
                      <div className="pl-2">
                        {_fixedPoint(item?.advanceAmount)}{" "}
                      </div>
                    </td> */}
                    <td>
                      <div className="pl-2">
                        {_fixedPoint(item?.totalApprovedAmount)}
                      </div>
                    </td>
                    {/* {isAdjustAmount && ( */}
                    <td>
                      <InputField
                        value={item?.adjustAmount}
                        name="adjustAmount"
                        placeholder="Adjust Amount"
                        type="number"
                        onChange={(e) => {
                          const copyData = [...gridData];

                          // total addjustment some (with curent adjustAmount)
                          let totalAdvanceAmount = 0;
                          gridData.forEach((itm, i) => {
                            if (itm.itemCheck) {
                              totalAdvanceAmount +=
                                i === index
                                  ? +e.target.value
                                  : +itm.adjustAmount;
                            }
                          });

                          // if adjustAmount type conditon
                          if (
                            +itemCheckFilterList?.[0]?.advanceAmount >=
                              +totalAdvanceAmount &&
                            +item.totalApprovedAmount >= +e.target.value
                          ) {
                            copyData[index].adjustAmount = e.target.value;
                            copyData[index].netAmount =
                              +copyData[index].totalApprovedAmount -
                              +e.target.value;
                            setGridData(copyData);
                          }
                        }}
                        disabled={!item?.itemCheck}
                      />
                    </td>
                    {/* )} */}

                    <td>
                      <div className="pl-2">{_fixedPoint(item?.netAmount)}</div>
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

export default TableWidthOutGroup;
