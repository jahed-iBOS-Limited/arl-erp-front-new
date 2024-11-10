/* eslint-disable no-restricted-imports */
import React from "react";
import PropTypes from "prop-types";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import TablePagination from "@material-ui/core/TablePagination";
import IconButton from "@material-ui/core/IconButton";
import FirstPageIcon from "@material-ui/icons/FirstPage";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import LastPageIcon from "@material-ui/icons/LastPage";
import SearchFormInventoryStatement from "./search";
import InfoCircle from "./../../../../_helper/_helperIcons/_infoCircle";

const useStyles1 = makeStyles((theme) => ({
  root: {
    flexShrink: 0,
    marginLeft: theme.spacing(2.5),
  },
}));

function TablePaginationActions(props) {
  const classes = useStyles1();
  const theme = useTheme();
  const { count, page, rowsPerPage, onChangePage } = props;

  const handleFirstPageButtonClick = (event) => {
    onChangePage(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onChangePage(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onChangePage(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onChangePage(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <div className={classes.root}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === "rtl" ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowRight />
        ) : (
          <KeyboardArrowLeft />
        )}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowLeft />
        ) : (
          <KeyboardArrowRight />
        )}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === "rtl" ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </div>
  );
}

TablePaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onChangePage: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};

export default function CustomPaginationActionsTable({
  inventoryStatement,
  setIsShowModal,
  setInventoryStatement,
  inventoryStatementAllData,
  setTableItem,
}) {
  //   const classes = useStyles2();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(25);

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
      <div className="loan-scrollable-table">
        <div className="scroll-table _table">
          <table className="table table-striped table-bordered bj-table bj-table-landing">
            <thead>
              <tr>
                <th>SL</th>
                <th style={{ width : '10px'}}>Item Code</th>
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
                  <td style={{ width : 10}}>{row?.itemCode}</td>
                  <td>{row?.itemName}</td>
                  <td style={{ width : "10px"}}>{row?.baseUom}</td>
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
                  <td className="text-center">
                    {/* <button
                  onClick={() => {
                    setIsShowModal(true);
                    setTableItem(row);
                  }}
                  className="btn btn-primary"
                > */}
                    <InfoCircle
                      clickHandler={() => {
                        setIsShowModal(true);
                        setTableItem(row);
                      }}
                      classes={"text-primary"}
                    />
                    {/* </button> */}
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
        </div>
      </div>
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
