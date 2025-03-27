
import TablePagination from "@mui/material/TablePagination";
import React, { useState } from "react";
import TablePaginationActions from "../../../../_helper/_tablePagination";
export default function CustomPaginationActionsTable({
  inventoryStatement,
  setIsShowModal,
  setInventoryStatement,
  inventoryStatementAllData,
  setTableItem,
}) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value, 10);
    setPage(0);
  };

  return (
    <>
      <table className="table table-striped table-bordered global-table">
        <thead>
          <tr>
            <th>SL</th>
            <th>Item Code</th>
            <th>Item Name</th>
            <th>UoM</th>
            <th>Opening Qty.</th>
            <th>Value</th>
            <th>Receive Qty.</th>
            <th>Value</th>
            <th>Issue Qty.</th>
            <th>Value</th>
            <th>Return Qty.</th>
            <th>Value</th>
            <th>Transfer Qty.</th>
            <th>Value</th>
            <th>Remove Qty.</th>
            <th>Value</th>
            <th>Adjust Qty.</th>
            <th>Value</th>
            <th>Closing Qty.</th>
            <th>Value</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {(rowsPerPage > 0
            ? inventoryStatement?.slice(
                page * rowsPerPage,
                page * rowsPerPage + rowsPerPage
              )
            : inventoryStatement
          )?.map((row, index) => (
            <tr>
              <td>{index + 1}</td>
              <td>{row?.itemCode}</td>
              <td>{row?.itemName}</td>
              <td>{row?.baseUom}</td>
              <td>{row?.openingQty}</td>
              <td>{row?.openingValue}</td>
              <td>{row?.recieveQty}</td>
              <td>{row?.recieveValue}</td>
              <td>{row?.issueQty}.</td>
              <td>{row?.issueValue}</td>
              <td>{row?.returnQty}</td>
              <td>{row?.returnValue}</td>
              <td>{row?.transferQty}</td>
              <td>{row?.transferValue}</td>
              <td>{row?.removeQty}</td>
              <td>{row?.removeValue}</td>
              <td>{row?.adjustQty}</td>
              <td>{row?.adjustValue}</td>
              <td>{row?.closingQty}.</td>
              <td>{row?.closingValue}</td>
              <td>
                <button
                  onClick={() => {
                    setIsShowModal(true);
                    setTableItem(row);
                  }}
                  className="btn btn-primary"
                >
                  Details
                </button>
              </td>
            </tr>
          ))}
          {/*
          {emptyRows > 0 && (
            <TableRow style={{ height: 53 * emptyRows }}>
              <TableCell colSpan={6} />
            </TableRow>
          )} */}
        </tbody>
      </table>
      {inventoryStatement?.length > 0 && (
        <TablePagination
          rowsPerPageOptions={[25, 50, 75, 100]}
          colSpan={3}
          count={inventoryStatement?.length}
          rowsPerPage={rowsPerPage}
          page={page}
          SelectProps={{
            inputProps: { "aria-label": "rows per page" },
            native: true,
          }}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
          ActionsComponent={TablePaginationActions}
        />
      )}
    </>
  );
}
