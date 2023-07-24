import React, { useState } from "react";
import { toast } from "react-toastify";
import { _fixedPoint } from "../../../../_helper/_fixedPoint";
import Loading from "../../../../_helper/_loading";
import { approveExpense } from "../helper";

const headers = [
  { name: "SL" },
  { name: "Employee" },
  { name: "Designation" },
  { name: "Bank Name" },
  { name: "Account Number" },
  { name: "Application Amount" },
  { name: "Approved by Supervisor" },
  { name: "Approved by HR" },
];

const ApproveTable = ({ obj }) => {
  const { rowData, setRowData, userId, setShow } = obj;
  const [loading, setLoading] = useState(false);

  const selectedItems = rowData?.filter((e) => e?.isSelected);

  const rowDataHandler = (name, index, value) => {
    let _data = [...rowData];
    _data[index][name] = value;
    setRowData(_data);
  };

  const allSelect = (value) => {
    let _data = [...rowData];
    const modify = _data.map((item) => ({ ...item, isSelected: value }));
    setRowData(modify);
  };

  const selectedAll =
    rowData?.length > 0 && selectedItems?.length === rowData?.length;

  const expenseApprove = () => {
    if (selectedItems?.length < 1) {
      return toast.warn("Please select at least one row!");
    }
    const payload = selectedItems?.map((element) => ({
      expenseId: element?.intexpenseid,
      expenseRowId: element?.introwid,
      businessUnitId: element?.intunitid,
      hrApproveBy: userId,
    }));
    approveExpense(payload, setLoading, () => {
      setShow(false);
    });
  };

  let totalApprovedBySupervisor = 0,
    totalApprovedByHR = 0,
    totalApplicationAmount = 0;

  return (
    <>
      {loading && <Loading />}
      <div>
        <div className="text-right">
          <button
            className={"btn btn-info mt-1"}
            onClick={() => {
              expenseApprove();
            }}
            type="button"
            disabled={!selectedItems?.length}
          >
            Approve
          </button>
        </div>
        <table className="table mt-3 bj-table bj-table-landing">
          <thead style={{ borderTop: "1px solid rgb(207, 203, 203)" }}>
            <tr>
              <th
                onClick={() => allSelect(!selectedAll)}
                style={{ minWidth: "30px" }}
              >
                <input
                  type="checkbox"
                  value={selectedAll}
                  checked={selectedAll}
                  onChange={() => {}}
                />
              </th>
              {headers.map((th, index) => {
                return th && !th.isHide ? (
                  <th key={index} style={th.style}>
                    {th.name}
                  </th>
                ) : null;
              })}
            </tr>
          </thead>
          <tbody>
            {rowData?.map((item, index) => {
              totalApplicationAmount += item?.numApplicantAmount || 0;
              totalApprovedByHR += item?.numApprvByHR || 0;
              totalApprovedBySupervisor += item?.numApprvBySuppervisor || 0;
              return (
                <tr key={index}>
                  <td
                    onClick={() => {
                      rowDataHandler("isSelected", index, !item.isSelected);
                    }}
                    className="text-center"
                  >
                    <input
                      type="checkbox"
                      value={item?.isSelected}
                      checked={item?.isSelected}
                      onChange={() => {}}
                    />
                  </td>
                  <td>{index + 1}</td>
                  <td>{item?.strEmployeeFullName}</td>
                  <td>{item?.strDesignation}</td>
                  <td>{item?.strBank}</td>
                  <td>{item?.strAccountNumber}</td>
                  <td className="text-right">
                    {_fixedPoint(item?.numApplicantAmount, true, 0)}
                  </td>
                  <td className="text-right">
                    {_fixedPoint(item?.numApprvBySuppervisor, true, 0)}
                  </td>
                  <td className="text-right">
                    {_fixedPoint(item?.numApprvByHR, true, 0)}
                  </td>
                </tr>
              );
            })}
            <tr>
              <td colSpan={6} className="text-right">
                <b>Total</b>
              </td>
              <td className="text-right">
                <b>{_fixedPoint(totalApplicationAmount, true, 0)}</b>
              </td>

              <td className="text-right">
                <b>{_fixedPoint(totalApprovedBySupervisor, true, 0)}</b>
              </td>
              <td className="text-right">
                <b>{_fixedPoint(totalApprovedByHR, true, 0)}</b>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
};

export default ApproveTable;
