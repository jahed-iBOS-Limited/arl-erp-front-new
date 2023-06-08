import React, { useState, useEffect, useCallback } from "react";
import ButtonStyleOne from "../../../_helper/button/ButtonStyleOne";
import { _dateFormatter } from "../../../_helper/_dateFormate";
import Loading from "../../../_helper/_loading";
import numberWithCommas from "../../../_helper/_numberWithCommas";
import { getApprovalDetailsViewAction } from "./helper";

const BonusApproveView = ({ currentRowData, confirmPopUp, values }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getApprovalDetailsViewAction(currentRowData?.id, setLoading, setData);
  }, [currentRowData]);

  const totalBonusAmount = useCallback(
    data?.rowData?.reduce((acc, item) => acc + +item?.bonusAmount, 0),
    [data]
  );

  return (
    <>
      {values?.status === "0" && (
        <div className="d-flex justify-content-end mt-2">
          <div className="mr-2">
            <ButtonStyleOne
              label="Approve"
              onClick={() =>
                confirmPopUp(1, currentRowData?.id, values?.status)
              }
              type="button"
            />
          </div>
          <ButtonStyleOne
            label="Reject"
            onClick={() => confirmPopUp(2, currentRowData?.id, values?.status)}
            type="button"
          />
        </div>
      )}

      <div className="loan-scrollable-table mt-2">
        {loading && <Loading />}
        <div className="scroll-table _table">
          <table className="table table-striped table-bordered bj-table bj-table-landing">
            <thead>
              <tr>
                <th style={{ minWidth: "30px" }}>SL</th>
                <th>Employee Id</th>
                <th>ERP Emp. Id</th>
                <th
                  style={{
                    position: "sticky",
                    left: "30px",
                    top: "0px",
                    zIndex: "9999999",
                    minWidth: "85px",
                  }}
                >
                  Employee Code
                </th>
                <th>Employee Name</th>
                <th>Group</th>
                <th>Job Type</th>
                <th>Designation</th>
                <th style={{ minWidth: "80px" }}>Religion Name</th>
                <th>Unit</th>
                <th>Job Station Name</th>
                <th style={{ minWidth: "80px" }}>Joining Date</th>
                <th style={{ minWidth: "80px" }}>Effected Date</th>
                <th>Service Length</th>
                <th style={{ minWidth: "90px" }}>Salary</th>
                <th style={{ minWidth: "90px" }}>Basic</th>
                <th style={{ minWidth: "90px" }}>Bonus Amount</th>
                <th>Bank Name</th>
                <th>Bank Branch Name</th>
                <th style={{ minWidth: "90px" }}>Routing Number</th>
                <th>Bank Account No</th>
                <th>Bonus Name</th>
              </tr>
            </thead>
            <tbody>
              {data?.rowData?.length >= 0 &&
                data?.rowData?.map((data, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td className="text-center">{data?.employeeId}</td>
                    <td className="text-center">{data?.erpemployeeId}</td>
                    <td
                      style={{
                        position: "sticky",
                        left: "30px",
                        zIndex: "99999",
                        backgroundColor: index % 2 === 0 ? "#ECF0F3" : "#fff",
                      }}
                    >
                      <div className="text-center pl-2">
                        {data?.employeeCode}
                      </div>
                    </td>
                    <td>
                      <div className="text-left pl-2">{data?.employeeName}</div>
                    </td>
                    <td>
                      <div className="pl-2">{data?.positionGroupName}</div>
                    </td>
                    <td>
                      <div className="pl-2">{data?.employmentTypeName}</div>
                    </td>
                    <td>
                      <div className="pl-2">{data?.designationName}</div>
                    </td>
                    <td>
                      <div className="pl-2">{data?.religionName}</div>
                    </td>
                    <td>
                      <div className="pl-2">{data?.businessUnitName}</div>
                    </td>
                    <td>
                      <div className="pl-2">{data?.workPlaceGroupName}</div>
                    </td>
                    <td>
                      <div className="text-center">
                        {_dateFormatter(data?.joiningDate)}
                      </div>
                    </td>
                    <td>
                      <div className="text-center">
                        {_dateFormatter(data?.effectedDate)}
                      </div>
                    </td>
                    <td>
                      <div className="pl-2">{data?.serviceLength}</div>
                    </td>
                    <td>
                      <div className="text-right">
                        {numberWithCommas(data?.salary)}
                      </div>
                    </td>
                    <td>
                      <div className="text-right">
                        {numberWithCommas(data?.basic)}
                      </div>
                    </td>
                    <td>
                      <div className="text-right">
                        {numberWithCommas(data?.bonusAmount)}
                      </div>
                    </td>
                    <td>
                      <div className="text-left">{data?.bankName}</div>
                    </td>
                    <td>
                      <div className="text-left">{data?.bankBranchName}</div>
                    </td>
                    <td>
                      <div className="text-center">{data?.routingNumber}</div>
                    </td>
                    <td>
                      <div className="text-center">
                        {data?.bankAccountNumber}
                      </div>
                    </td>
                    <td>
                      <div className="text-left">{data?.bonusName}</div>
                    </td>
                  </tr>
                ))}
                {data?.rowData?.length > 0 && (
                <tr>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td>Total</td>
                  <td className="text-right">{numberWithCommas(totalBonusAmount)}</td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default BonusApproveView;
