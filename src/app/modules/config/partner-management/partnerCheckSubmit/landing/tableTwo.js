/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from "react";
import { _fixedPoint } from "../../../../_helper/_fixedPoint";
import IEdit from "../../../../_helper/_helperIcons/_edit";
import PaginationTable from "../../../../_helper/_tablePagination";
import IViewModal from "../../../../_helper/_viewModal";
import ExportPaymentPostingForm from "../foreignForm/addEditForm";
import IView from "../../../../_helper/_helperIcons/_view";

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
  "Actions",
];

const ExportPaymentPostingTable = ({ obj }) => {
  const {
    values,
    pageNo,
    rowData,
    pageSize,
    setPageNo,
    setPageSize,
    setPositionHandler,
  } = obj;
  const [singleItem, setSingleItem] = useState({});
  const [type, setType] = useState("");
  const [show, setShow] = useState(false);

  return (
    <>
      {rowData?.data?.length > 0 && (
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
                  <td className="text-right">{_fixedPoint(item?.conversionRateBDT, true)}</td>
                  <td className="text-right">{_fixedPoint(item?.ttamount, true)}</td>
                  <td className="text-right">{_fixedPoint(item?.ttAmountBDT, true)}</td>
                  <td className="text-right">{_fixedPoint(item?.erqvalue, true)}</td>
                  <td className="text-right">{_fixedPoint(item?.erqvalueBDT, true)}</td>
                  <td className="text-right">{_fixedPoint(item?.orqvalue, true)}</td>
                  <td className="text-right">{_fixedPoint(item?.orqvalueBDT, true)}</td>
                  <td className="text-right">{_fixedPoint(item?.totalExpenseAganistTt, true)}</td>

                  <td style={{ width: "80px" }} className="text-center">
                    <div className="d-flex justify-content-around">
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
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      <IViewModal show={show} onHide={() => setShow(false)}>
        <ExportPaymentPostingForm type={type} singleItem={singleItem} />
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
