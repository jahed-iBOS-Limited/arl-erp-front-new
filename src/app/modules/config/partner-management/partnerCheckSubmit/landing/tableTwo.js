/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from "react";
import { _fixedPoint } from "../../../../_helper/_fixedPoint";
import IEdit from "../../../../_helper/_helperIcons/_edit";
import PaginationTable from "../../../../_helper/_tablePagination";
import IViewModal from "../../../../_helper/_viewModal";
import ExportPaymentPostingForm from "../foreignForm/addEditForm";

const headers = [
  "SL",
  "Customer Name",
  "SO Code",
  "TT Amount",
  "ERQ Value",
  "ORQ Value",
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
                  <td>{_fixedPoint(item?.ttamount, true)}</td>
                  <td>{_fixedPoint(item?.erqvalue, true)}</td>
                  <td>{_fixedPoint(item?.orqvalue, true)}</td>
                  <td>{_fixedPoint(item?.totalExpenseAganistTt, true)}</td>

                  <td style={{ width: "80px" }} className="text-center">
                    {item?.isActive && !item?.isPosted && (
                      <div className="d-flex justify-content-around">
                        <span>
                          <IEdit
                            onClick={() => {
                              setType("edit");
                              setSingleItem(item);
                            }}
                          />
                        </span>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      <IViewModal>
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
