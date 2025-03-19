import React, { useState } from "react";
import IView from "../../../../_helper/_helperIcons/_view";
import SingleEmployeeModel from "./singleEmployeeModel";
import {
  GetApproveExpensesForTaDaByEmpId_api,
  GetApproveExpensesByEmployeeId_api,
} from "../helper";
import { useSelector, shallowEqual } from "react-redux";
import Loading from "../../../../_helper/_loading";
import { _fixedPoint } from "./../../../../_helper/_fixedPoint";
import InputField from "./../../../../_helper/_inputField";
function TableGroup({
  gridData,
  itemSlectedHandler,
  setGridData,
  parentValues,
  allGridCheck,
}) {
  const { selectedBusinessUnit, profileData } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  const [singleEmployeeGridData, setSingleEmployeeGridData] = useState([]);
  const [loading, setLoading] = useState(false);
  const SingleEmployeeViewFunc = (item) => {
    if (parentValues?.expenseGroup?.value === "TaDa") {
      GetApproveExpensesForTaDaByEmpId_api(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        parentValues?.plant?.value,
        parentValues?.sbu?.value,
        setSingleEmployeeGridData,
        setLoading,
        parentValues?.CfromDate,
        parentValues?.CtoDate,
        item?.expenseForId,
        item?.disbursementCenterId
      );
    } else {
      GetApproveExpensesByEmployeeId_api(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        parentValues?.plant?.value,
        parentValues?.sbu?.value,
        setSingleEmployeeGridData,
        setLoading,
        parentValues?.CfromDate,
        parentValues?.CtoDate,
        item?.expenseForId,
        item?.disbursementCenterId
      );
    }
  };

  // const isAdjustAmount =
  //   parentValues?.isGroup?.value === 2 &&
  //   parentValues?.expenseGroup?.value === "Other";
  const itemCheckFilterList = gridData?.filter((item) => item?.itemCheck);
  const itemCheckTotalAdjustAmount = itemCheckFilterList.reduce(
    (acc, cur) => (acc += +cur.adjustAmount || 0),
    0
  );
  const itemCheckTotalAdvanceAmount = itemCheckFilterList.reduce(
    (acc, cur) => (acc += +cur.advanceAmount || 0),
    0
  );

  return (
    <>
      {loading && <Loading />}
      <div className="d-flex justify-content-end align-content-center p-0 m-0">
        <p className=" p-0 m-0 mr-2">
          <b>Total Advance Amount:</b>{" "}
          {itemCheckTotalAdvanceAmount || 0},
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
                  <input
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
                  />
                </th>
                <th style={{ width: "35px" }}>SL</th>
                <th style={{ width: "150px" }}>Employee Id</th>
                <th style={{ width: "150px" }}>Request By</th>
                <th style={{ width: "150px" }}>Disbursement Center Name</th>
                <th style={{ width: "150px" }}>Advance Amount</th>
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
                const isTaDa = parentValues?.expenseGroup?.value === "TaDa";
           
                const isSameItemChcek = itemCheckFilterList.some(
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
                          isTaDa
                            ? false
                            : itemCheckFilterList?.length === 0
                            ? false
                            : !isSameItemChcek
                        }
                        onChange={(e) => {
                          // if expenseGroup type TaDa : all item select
                          if (isTaDa) {
                            setGridData(
                              itemSlectedHandler(
                                e.target.checked,
                                index,
                                gridData
                              )
                            );
                          } else {
                            // if expenseGroup type Others : one item select
                            if (itemCheckFilterList?.length === 0) {
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
                          }
                        }}
                      />
                    </td>
                    <td className="text-center"> {index + 1}</td>
                    <td>
                      <div className="pl-2">{item?.expenseForId}</div>
                    </td>
                    <td>
                      <div className="pl-2">{item?.expenseForName}</div>
                    </td>
                    <td>
                      <div className="pl-2">{item?.disbursementCenterName}</div>
                    </td>
                    <td>
                      <div className="pl-2 text-right">
                        {_fixedPoint(item?.advanceAmount)}{" "}
                      </div>
                    </td>
                    <td>
                      <div className="pl-2 text-right">
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
                          if (+item.advanceAmount >= +e.target.value) {
                            console.log(+item.advanceAmount, +e.target.value);
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
                      <div className="pl-2 text-right">
                        {_fixedPoint(item?.netAmount)}
                      </div>
                    </td>
                    <td>
                      <div className="pl-2 d-flex justify-content-center">
                        <span className="view">
                          <IView
                            clickHandler={() => {
                              SingleEmployeeViewFunc(item);
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
      {singleEmployeeGridData?.length > 0 && (
        <SingleEmployeeModel
          show={singleEmployeeGridData?.length > 0}
          singleEmployeeGridData={singleEmployeeGridData}
          onHide={() => setSingleEmployeeGridData([])}
        />
      )}
    </>
  );
}

export default TableGroup;
