/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useSelector, shallowEqual } from "react-redux";
import { useHistory } from "react-router-dom";
import { GetVatItemPagination } from "../helper";
import "./vatReport.css";

export function TableRow() {
  // eslint-disable-next-line no-unused-vars
  const [gridData, setGridData] = useState([]);
  const [rowDto, setRowDto] = useState([]);
  const history = useHistory();

  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  useEffect(() => {
    if (selectedBusinessUnit?.value && profileData?.accountId) {
      GetVatItemPagination(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setGridData
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBusinessUnit, profileData]);

  return (
    <>
      {/* Table Start */}
      {/* {rowDto.length > 0 && ( */}
      <div className="loan-scrollable-table">
        <div className="scroll-table _table">
          <table className="table table-striped table-bordered bj-table ">
            <thead>
              <tr>
                <th>SL</th>
                <th>Date</th>
                <th>
                  <tr>
                    <th colspan="3" scope="colgroup">
                      Opening stock of Goods/Service
                    </th>
                  </tr>
                  <tr style={{ width: "200px" }}>
                    <th scope="col">Quantity (unit)</th>
                    <th scope="col">Value(Exclueding all types of taxes)</th>
                  </tr>
                </th>
                <th>
                  <tr>
                    <th colspan="2" scope="colgroup">
                      Production
                    </th>
                  </tr>
                  <tr>
                    <th scope="col">Quantity (unit)</th>
                    <th scope="col">Value(Exclueding all types of taxes)</th>
                  </tr>
                </th>
                <th>
                  <tr>
                    <th colspan="2" scope="colgroup">
                      Total Produced goods/services
                    </th>
                  </tr>
                  <tr>
                    <th scope="col">Quantity (unit)</th>
                    <th scope="col">Value(Exclueding all types of taxes)</th>
                  </tr>
                </th>
                <th>
                  <tr>
                    <th colspan="3" scope="colgroup">
                      Buyer/Supply Recipient
                    </th>
                  </tr>
                  <tr>
                    <th scope="col">Name</th>
                    <th scope="col">Address</th>
                    <th scope="col">Registration/Enlist/National ID NO</th>
                  </tr>
                </th>
                <th>
                  <tr>
                    <th colspan="2" scope="colgroup">
                      Challan Details
                    </th>
                  </tr>
                  <tr>
                    <th scope="col">Number</th>
                    <th scope="col">Date</th>
                  </tr>
                </th>
                <th>
                  <tr>
                    <th colspan="4" scope="colgroup">
                      Sold/Supplied Goods Description
                    </th>
                  </tr>
                  <tr>
                    <th scope="col">Description</th>
                    <th scope="col">Quantity</th>
                    <th scope="col">Taxable Value</th>
                    <th scope="col">Supplementry Duty(If Have)</th>
                  </tr>
                </th>
                <th>
                  <tr>
                    <th colspan="2" scope="colgroup">
                      Closing Balance of Material
                    </th>
                  </tr>
                  <tr>
                    <th scope="col">Quantity(PCS)</th>
                    <th scope="col">Value(Exclueding all types of taxes)</th>
                  </tr>
                </th>
                <th>Comments</th>
              </tr>
            </thead>
            <tbody>
              {rowDto?.length >= 0 &&
                rowDto?.map((data, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>
                      <div className="text-right pr-2">{data?.EmployeeID}</div>
                    </td>
                    <td>
                      <div className="pl-2">{data?.EmployeeCode}</div>
                    </td>
                    <td>
                      <div className="pl-2">{data?.EmployeeName}</div>
                    </td>
                    <td>
                      <div className="pl-2">
                        {data?.EmailAddress ? data?.EmailAddress : "N/A"}
                      </div>
                    </td>
                    <td>
                      <div className="text-right pr-2">
                        {data?.ContactNumber ? data?.ContactNumber : "N/A"}
                      </div>
                    </td>
                    <td>
                      <div className="pl-2">{data?.Designation}</div>
                    </td>
                    <td>
                      <div className="pl-2">{data?.Department}</div>
                    </td>
                    <td>
                      <div className="pl-2">{data?.Unit}</div>
                    </td>
                    <td>
                      <div className="pl-2">{""}</div>
                    </td>
                    <td>
                      <div className="pl-2">{data?.LeaveType}</div>
                    </td>
                    <td>
                      <div className="pl-2">{data?.Reason}</div>
                    </td>
                    <td>
                      <div className="pl-2">{data?.Address}</div>
                    </td>
                    <td>
                      <div className="text-right pr-2">
                        {/* {_dateFormatter(data?.AppliedFromDate)} */}
                      </div>
                    </td>
                    <td>
                      <div className="text-right pr-2">
                        {/* {_dateFormatter(data?.AppliedToDate)} */}
                      </div>
                    </td>
                    <td>
                      <div className="text-right pr-2">{data?.NoOfDay}</div>
                    </td>
                    <td>
                      <div className="pl-2">{""}</div>
                    </td>
                    <td>
                      <div className="pl-2">{""}</div>
                    </td>
                    <td>
                      <div className="pl-2">{""}</div>
                    </td>
                    <td>
                      <div className="pl-2">{data?.PersonalNo}</div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
