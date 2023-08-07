import React, { useState } from "react";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import ICustomTable from "../../../../chartering/_chartinghelper/_customTable";
import { _fixedPoint } from "../../../../_helper/_fixedPoint";
import IView from "../../../../_helper/_helperIcons/_view";
import IViewModal from "../../../../_helper/_viewModal";
import Loading from "../../../../_helper/_loading";
import ApproveTable from "./approveTable";
import { toast } from "react-toastify";

const headers = [
  { name: "SL" },
  { name: "Unit Name" },
  { name: "Application Amount" },
  { name: "Approved by Supervisor" },
  { name: "Approved by Line Manager" },
  { name: "Approved by HR" },
  { name: "Action" },
];

function TableFour({ gridData, values, userId, girdDataFunc }) {
  const [rowData, getRowData, loading, setRowData] = useAxiosGet();
  const [show, setShow] = useState(false);
  const [singleItem, setSingleItem] = useState({});

  let totalApprovedBySupervisor = 0,
    totalApprovedByLineManager = 0,
    totalApprovedByHR = 0,
    totalApplicationAmount = 0;

  const getData = (item) => {
    const url = `/fino/ExpenseTADA/GetExpenseInfoForHRapprove?businessUnitId=${
      item?.intunitid
    }&partId=${15}&employeeId=${0}&fromDate=${values?.fromDate}&toDate=${
      values?.toDate
    }&isBillSubmitted=${
      values?.status?.value
    }&ReportViewBy=${userId}&ExpenseGroup=${values?.expenceGroup?.label}`;
    getRowData(
      // `/fino/ExpenseTADA/GetExpenseReport?Unitid=${
      //   item?.intunitid
      // }&partid=${15}&employeeid=${0}&FromDate=${values?.fromDate}&Todate=${
      //   values?.toDate
      // }&isBillSubmitted=${
      //   values?.status?.value
      // }&ReportViewBy=${userId}&ExpenseGroup=${values?.expenceGroup?.label}`,
      url,
      (resData) => {
        const modifyData = resData?.map((element) => ({
          ...element,
          isSelected: false,
        }));
        if (modifyData?.length) {
          setRowData(modifyData);
          setShow(true);
        } else {
          toast.warn("Data not found");
        }
      }
    );
  };

  return (
    <>
      {loading && <Loading />}
      <div>
        <ICustomTable ths={headers}>
          {gridData?.map((item, index) => {
            totalApplicationAmount += item?.numApplicantAmount || 0;
            totalApprovedByLineManager += item?.numLineManagerAprv || 0;
            totalApprovedBySupervisor += item?.numApprvBySuppervisor || 0;
            totalApprovedByHR += item?.numApprvByHR || 0;
            return (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{item?.strUnit}</td>
                <td className="text-right">
                  {_fixedPoint(item?.numApplicantAmount, true, 0)}
                </td>

                <td className="text-right">
                  {_fixedPoint(item?.numApprvBySuppervisor, true, 0)}
                </td>
                <td className="text-right">
                  {_fixedPoint(item?.numLineManagerAprv, true, 0)}
                </td>
                <td className="text-right">
                  {_fixedPoint(item?.numApprvByHR, true, 0)}
                </td>
                <td className="text-center">
                  <IView
                    clickHandler={() => {
                      setSingleItem(item);
                      getData(item);
                    }}
                  />
                </td>
              </tr>
            );
          })}
          <tr>
            <td colSpan={2} className="text-right">
              <b>Total</b>
            </td>
            <td className="text-right">
              <b>{_fixedPoint(totalApplicationAmount, true, 0)}</b>
            </td>

            <td className="text-right">
              <b>{_fixedPoint(totalApprovedBySupervisor, true, 0)}</b>
            </td>
            <td className="text-right">
              <b>{_fixedPoint(totalApprovedByLineManager, true, 0)}</b>
            </td>
            <td className="text-right">
              <b>{_fixedPoint(totalApprovedByHR, true, 0)}</b>
            </td>

            <td></td>
          </tr>
        </ICustomTable>
      </div>

      <IViewModal
        show={show}
        onHide={() => {
          girdDataFunc(values);
          setShow(false);
        }}
        title={singleItem?.strUnit}
      >
        <ApproveTable obj={{ rowData, setRowData, userId, setShow }} />
      </IViewModal>
    </>
  );
}

export default TableFour;
