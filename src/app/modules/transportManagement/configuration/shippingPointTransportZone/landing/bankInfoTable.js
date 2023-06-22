import React from "react";
import PaginationTable from "../../../../_helper/_tablePagination";
import ICustomTable from "../../../../_helper/_customTable"; 

export const headers = [

  "SL",
  "Employee Name",
  "Shipping Point",
  "Bank Name",
  "Branch Name",
  "Account Name",
  "Account Number",
  "Routing Number",
  "Action",
];

export const BankInfoTable = ({ obj }) => {
  const {
    values,
    pageNo,
    rowData,
    pageSize,
    setPageNo,
    setPageSize,
    paginationHandler,
  } = obj;
  return (
    <>
      {rowData?.data?.length > 0 && (
        <ICustomTable ths={headers}>
          {rowData?.data?.map((row, i) => {
            return (
              <tr key={i}>
                <td className="text-center">{i + 1}</td>
                <td>{row?.employeeName}</td>
                <td>{row?.shippingPointName}</td>
                <td>{row?.bankName}</td>
                <td>{row?.branchName}</td>
                <td>{row?.accountName}</td>
                <td>{row?.bankAccountNumber}</td>
                <td>{row?.routingNumber}</td>
                <td className="text-center"></td>
              </tr>
            );
          })}
        </ICustomTable>
      )}
      {rowData?.data?.length > 0 && (
        <PaginationTable
          count={rowData?.totalCount}
          setPositionHandler={paginationHandler}
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
