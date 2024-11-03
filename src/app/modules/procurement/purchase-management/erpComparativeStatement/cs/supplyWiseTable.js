/* eslint-disable no-restricted-imports */
import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Collapse from "@material-ui/core/Collapse";
import IconButton from "@material-ui/core/IconButton";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import { IInput } from "../../../../_helper/_input";

const useRowStyles = makeStyles({
  root: {
    "& > *": {
      borderBottom: "unset",
    },
  },
});

function Row(props) {
  const { row, data, type, isView, rowDataHandler, index } = props;
  const [open, setOpen] = React.useState(false);
  const classes = useRowStyles();

  return (
    <React.Fragment>
      <TableRow>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell align="center">{row?.itemName}</TableCell>
        <TableCell align="center">{row?.uoMname}</TableCell>
        <TableCell align="center">{row?.itemCategoryName}</TableCell>
        <TableCell align="center">{row?.itemDescription}</TableCell>
        <TableCell align="center">
          {" "}
          <IInput
            value={data[index]?.takenQty || 0}
            name="takenQty"
            required
            placeholder="Taken Quantity"
            type="number"
            min="0"
            disabled={isView}
            // max={item?.referenceNo && item?.restofQty}
            // max={!item?.newItem ? item?.restofQty + item?.initOrderQty : item?.restofQty}
            onChange={(e) => {
              let validNum = e.target.value;

              rowDataHandler("takenQty", validNum, index);
            }}
          />
        </TableCell>
        <TableCell align="center">{row?.quantity}</TableCell>
      </TableRow>
      {type === "Foreign Procurement" ? (
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={3}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box margin={1}>
                <Typography variant="h6" gutterBottom component="div">
                  1st Choice Supplier
                </Typography>
                <Table size="small" aria-label="purchases">
                  <TableHead>
                    <TableRow>
                      <TableCell>Port Name</TableCell>
                      <TableCell>Port Rate</TableCell>
                      <TableCell>Amount</TableCell>
                      <TableCell>Port Remarks</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {row?.firstAndSecondPlaceList[0]?.portList?.map((port) => (
                      <TableRow key={port.portId}>
                        <TableCell>{port?.portName}</TableCell>
                        <TableCell>{port?.portRate}</TableCell>
                        <TableCell>
                          {
                            <TableCell>
                              {" "}
                              {row?.firstAndSecondPlaceList[0]?.supplierRate *
                                data[index]?.takenQty || 0

                              // item?.firstAndSecondPlaceList[0]
                              // ?.totalAmount || 0
                              }
                            </TableCell>
                          }
                        </TableCell>
                        <TableCell>{port?.portRemarks}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            </Collapse>
          </TableCell>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={3}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box margin={1}>
                <Typography variant="h6" gutterBottom component="div">
                  2nd Choice Supplier
                </Typography>
                <Table size="small" aria-label="purchases">
                  <TableHead>
                    <TableRow>
                      <TableCell>Port Name</TableCell>
                      <TableCell>Port Rate</TableCell>
                      <TableCell>Amount</TableCell>
                      <TableCell>Port Remarks</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {row?.firstAndSecondPlaceList[1]?.portList?.map((port) => (
                      <TableRow key={port.portId}>
                        <TableCell>{port?.portName}</TableCell>
                        <TableCell>{port?.portRate}</TableCell>
                        <TableCell>
                          {
                            <TableCell>
                              {" "}
                              {row?.firstAndSecondPlaceList[1]?.supplierRate *
                                data[index]?.takenQty || 0

                              // item?.firstAndSecondPlaceList[0]
                              // ?.totalAmount || 0
                              }
                            </TableCell>
                          }
                        </TableCell>
                        <TableCell>{port?.portRemarks}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      ) : (
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={3}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box margin={1}>
                <Typography variant="h6" gutterBottom component="div">
                  1st Choice Supplier
                </Typography>
                <Table size="small" aria-label="purchases">
                  <TableHead>
                    <TableRow>
                      <TableCell>Supplier Rate</TableCell>
                      <TableCell>Amount</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow key={new Date()}>
                      <TableCell>
                        {row?.firstAndSecondPlaceList[0]?.supplierRate || 0}
                      </TableCell>
                      <TableCell>
                        {" "}
                        {row?.firstAndSecondPlaceList[0]?.supplierRate *
                          data[index]?.takenQty || 0

                        // item?.firstAndSecondPlaceList[0]
                        // ?.totalAmount || 0
                        }
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </Box>
            </Collapse>
          </TableCell>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={3}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box margin={1}>
                <Typography variant="h6" gutterBottom component="div">
                  2nd Choice Supplier
                </Typography>
                <Table size="small" aria-label="purchases">
                  <TableHead>
                    <TableRow>
                      <TableCell>Supplier Rate</TableCell>
                      <TableCell>Amount</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {/* {row?.history?.map((historyRow) => (
                        <TableRow key={historyRow.date}>
                          <TableCell component="th" scope="row">
                            {historyRow.date}
                          </TableCell>
                          <TableCell>{historyRow.customerId}</TableCell>
                        
                        </TableRow>
                      ))} */}
                    <TableRow key={new Date()}>
                      <TableCell>
                        {row?.firstAndSecondPlaceList[1]?.supplierRate || 0}
                      </TableCell>
                      <TableCell>
                        {" "}
                        {row?.firstAndSecondPlaceList[1]?.supplierRate *
                          data[index]?.takenQty || 0

                        // item?.firstAndSecondPlaceList[0]
                        // ?.totalAmount || 0
                        }
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      )}
    </React.Fragment>
  );
}

Row.propTypes = {
  row: PropTypes.shape({
    calories: PropTypes.number.isRequired,
    carbs: PropTypes.number.isRequired,
    fat: PropTypes.number.isRequired,
    history: PropTypes.arrayOf(
      PropTypes.shape({
        amount: PropTypes.number.isRequired,
        customerId: PropTypes.string.isRequired,
        date: PropTypes.string.isRequired,
      })
    ).isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    protein: PropTypes.number.isRequired,
  }).isRequired,
};

export default function SupplyWiseTable({
  isView,
  type,
  data,
  rowDataHandler,
}) {
  return (
    <TableContainer component={Paper} className="mt-4">
      <Table aria-label="collapsible table" size="small">
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell align="center">Item Name</TableCell>
            <TableCell align="center">UOM Name</TableCell>
            <TableCell align="center">Item Category Name</TableCell>
            <TableCell align="center">Item Description</TableCell>
            <TableCell align="center">Taken Quantity</TableCell>
            <TableCell align="center">Quantity</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data?.map((row, index) => (
            <Row
              isView={isView}
              key={index}
              index={index}
              row={row}
              data={data}
              type={type}
              rowDataHandler={rowDataHandler}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
