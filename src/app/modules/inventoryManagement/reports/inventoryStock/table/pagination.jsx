
import TablePagination from '@mui/material/TablePagination';
import React from 'react';
import TablePaginationActions from '../../../../_helper/_tablePagination';
import SearchFormInventoryStatement from './search';

export default function CustomPaginationActionsTable({
  inventoryStatement,
  setIsShowModal,
  setInventoryStatement,
  inventoryStatementAllData,
  setTableItem,
}) {
  //   const classes = useStyles2();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(20);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <>
      <SearchFormInventoryStatement
        setInventoryStatement={setInventoryStatement}
        inventoryStatementAllData={inventoryStatementAllData}
      />
      <div className="scroll-table _table">
        <div className="table-responsive">
          <table className="table table-striped table-bordered bj-table bj-table-landing table-font-size-sm">
            <thead>
              <tr>
                <th>SL</th>
                <th>Item Code</th>
                <th>Item Name</th>
                <th>UoM Name</th>
                <th>Location Name</th>
                <th>Open Stock</th>
                <th>Block Stock</th>
              </tr>
            </thead>
            <tbody>
              {(rowsPerPage > 0
                ? inventoryStatement?.slice(
                  page * rowsPerPage,
                  page * rowsPerPage + rowsPerPage,
                )
                : inventoryStatement
              )?.map((row, index) => (
                <tr>
                  <td>{row?.sl}</td>
                  <td>{row?.itemCode}</td>
                  <td>{row?.itemName}</td>
                  <td>{row?.baseUOMName}</td>
                  <td>{row?.locationName}</td>
                  <td className="text-center align-middle">{row?.openStock}</td>
                  <td className="text-center align-middle">
                    {row?.blockStock}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {inventoryStatement?.length > 0 && (
        <TablePagination
          rowsPerPageOptions={[5, 10, 20, 50, 100, 200, 300, 400, 500]}
          colSpan={3}
          count={inventoryStatement?.length}
          rowsPerPage={rowsPerPage}
          page={page}
          SelectProps={{
            inputProps: { 'aria-label': 'rows per page' },
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
