/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { _fixedPoint } from "../../../../_helper/_fixedPoint";
import IApproval from "../../../../_helper/_helperIcons/_approval";
import IEdit from "../../../../_helper/_helperIcons/_edit";
import IView from "../../../../_helper/_helperIcons/_view";
import { getDownlloadFileView_Action } from "../../../../_helper/_redux/Actions";
import PaginationTable from "../../../../_helper/_tablePagination";
import IViewModal from "../../../../_helper/_viewModal";
import ICon from "../../../../chartering/_chartinghelper/icons/_icon";
import ExportPaymentPostingForm from "../foreignForm/addEditForm";

const headers = [
  "SL",
  "Customer Name",
  "SO Code",
  "Conversion Rate",
  "TT Amount (USD)",
  "TT Amount (BDT)",
  "ERQ Value (USD)",
  "ERQ Value (BDT)",
  "ORQ Value (USD)",
  "ORQ Value (BDT)",
  "Total Expense Against TT",
  "Supervisor Approve",
  "Accounts Approve",
  "Actions",
];

const ExportPaymentPostingTable = ({ obj }) => {
  const {
    values,
    pageNo,
    getData,
    rowData,
    pageSize,
    setPageNo,
    setPageSize,
    employeeInfo,
    setPositionHandler,
  } = obj;

  const dispatch = useDispatch();

  const [singleItem, setSingleItem] = useState({});
  const [type, setType] = useState("");
  const [show, setShow] = useState(false);

  return (
    <>
      {rowData?.data?.length > 0 && (
        <div className="table-responsive">
          <table
          id="table-to-xlsx"
          className={
            "table table-striped table-bordered mt-3 bj-table bj-table-landing table-font-size-sm"
          }
        >
          <thead>
            <tr className="cursor-pointer">
              {headers?.map((th, index) => {
                return <th key={index}> {th} </th>;
              })}
            </tr>
          </thead>
          <tbody>
            {rowData?.data?.map((item, index) => {
              return (
                <tr key={index}>
                  <td style={{ width: "40px" }} className="text-center">
                    {index + 1}
                  </td>
                  <td>{item?.customerName}</td>
                  <td>{item?.salesOrderCode}</td>
                  <td className="text-right">
                    {_fixedPoint(item?.conversionRateBDT, true)}
                  </td>
                  <td className="text-right">
                    {_fixedPoint(item?.ttamount, true)}
                  </td>
                  <td className="text-right">
                    {_fixedPoint(item?.ttAmountBDT, true)}
                  </td>
                  <td className="text-right">
                    {_fixedPoint(item?.erqvalue, true)}
                  </td>
                  <td className="text-right">
                    {_fixedPoint(item?.erqvalueBDT, true)}
                  </td>
                  <td className="text-right">
                    {_fixedPoint(item?.orqvalue, true)}
                  </td>
                  <td className="text-right">
                    {_fixedPoint(item?.orqvalueBDT, true)}
                  </td>
                  <td className="text-right">
                    {_fixedPoint(item?.totalExpenseAganistTt, true)}
                  </td>
                  <td
                    className="text-center"
                    style={{
                      backgroundColor: `${
                        item?.isSupervisorApproved ? "#70da70" : ""
                      }`,
                    }}
                  >
                    {item?.isSupervisorApproved ? "Yes" : "No"}
                  </td>
                  <td
                    className="text-center"
                    style={{
                      backgroundColor: `${
                        item?.isAccountsApproved ? "#70da70" : ""
                      }`,
                    }}
                  >
                    {item?.isAccountsApproved ? "Yes" : "No"}
                  </td>

                  <td style={{ width: "100px" }}>
                    <div className="d-flex justify-content-around align-items-center">
                      <span>
                        <IEdit
                          onClick={() => {
                            setType("edit");
                            setSingleItem(item);
                            setShow(true);
                          }}
                        />
                      </span>
                      <span>
                        <IView
                          clickHandler={() => {
                            setType("view");
                            setSingleItem(item);
                            setShow(true);
                          }}
                        />
                      </span>

                      <span>
                        <ICon
                          title={
                            item?.attachment
                              ? "Show attached file"
                              : "File not attached"
                          }
                          onClick={() => {
                            if (item?.attachment) {
                              dispatch(
                                getDownlloadFileView_Action(values?.fileName)
                              );
                            }
                          }}
                        >
                          <i class="far fa-image"></i>{" "}
                        </ICon>
                      </span>
                      {((!item?.isSupervisorApproved &&
                        employeeInfo?.employeeBasicInfoId === 558793) ||
                        (!item?.isAccountsApproved &&
                          item?.isSupervisorApproved &&
                          employeeInfo?.employeeBasicInfoId)) && (
                        <span>
                          <IApproval
                            title={
                              !item?.isSupervisorApproved
                                ? "Supervisor Approve"
                                : !item?.isAccountsApproved
                                ? "Accounts Approve"
                                : "Already Approved"
                            }
                            onClick={() => {
                              setType("approve");
                              setSingleItem(item);
                              setShow(true);
                            }}
                          />
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        </div>
      )}

      <IViewModal show={show} onHide={() => setShow(false)}>
        <ExportPaymentPostingForm
          type={type}
          setShow={setShow}
          getData={getData}
          singleItem={singleItem}
          landingFormValues={values}
        />
      </IViewModal>

      {rowData?.data?.length > 0 && (
        <PaginationTable
          count={rowData?.totalCount}
          setPositionHandler={setPositionHandler}
          paginationState={{
            pageNo,
            setPageNo,
            pageSize,
            setPageSize,
          }}
          values={values}
        />
      )}
    </>
  );
};

export default ExportPaymentPostingTable;
