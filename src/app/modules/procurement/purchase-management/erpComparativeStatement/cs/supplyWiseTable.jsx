
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import PropTypes from 'prop-types';
import React from 'react';
import { eProcurementBaseURL } from '../../../../../../App';
import { IInput } from '../../../../_helper/_input';
import IViewModal from '../../../../_helper/_viewModal';
import useAxiosGet from '../../purchaseOrder/customHooks/useAxiosGet';
import LastTransactionInfo from './lastTransactionInfo';

function Row(props) {
  const {
    row,
    data,
    type,
    isView,
    rowDataHandler,
    index,
    setShowPurchaseModal,
    getLastPurchaseInfo,
  } = props;
  const [open, setOpen] = React.useState(false);

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
        <TableCell align="center">
          {' '}
          <span
            style={{
              color: '#007bff', // Link color
              cursor: 'pointer',
              textDecoration: 'underline',
              display: 'flex',
              alignItems: 'center',
            }}
            onClick={() => {
              getLastPurchaseInfo(
                `${eProcurementBaseURL}/ComparativeStatement/GetItemsLastPurchaseInformation?itemId=${row?.itemId}`,
              );
              setShowPurchaseModal(true);
            }}
          >
            {row?.itemName}
          </span>{' '}
        </TableCell>
        <TableCell align="center">{row?.uoMname}</TableCell>
        <TableCell align="center">{row?.itemCategoryName}</TableCell>
        <TableCell align="center">{row?.itemDescription}</TableCell>
        <TableCell align="center">
          {' '}
          <IInput
            value={data[index]?.csQuantity || 0}
            name="csQuantity"
            required
            placeholder="Taken Quantity"
            type="number"
            min="0"
            disabled={isView}
            // max={item?.referenceNo && item?.restofQty}
            // max={!item?.newItem ? item?.restofQty + item?.initOrderQty : item?.restofQty}
            onChange={(e) => {
              let validNum = e.target.value;

              rowDataHandler('csQuantity', validNum, index);
            }}
          />
        </TableCell>
        <TableCell align="center">{row?.quantity}</TableCell>
      </TableRow>
      {type === 'Foreign Procurement' ? (
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
                        <TableCell>{port?.rate}</TableCell>
                        <TableCell>
                          {
                            <TableCell>
                              {' '}
                              {
                                port?.rate * data[index]?.csQuantity || 0

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
                        <TableCell>{port?.rate}</TableCell>
                        <TableCell>
                          {
                            <TableCell>
                              {' '}
                              {
                                port?.rate * data[index]?.csQuantity || 0

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
                        {' '}
                        {
                          row?.firstAndSecondPlaceList[0]?.supplierRate *
                            data[index]?.csQuantity || 0

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
                        {' '}
                        {
                          row?.firstAndSecondPlaceList[1]?.supplierRate *
                            data[index]?.csQuantity || 0

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
      }),
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
  const [showPurchaseModal, setShowPurchaseModal] = React.useState(false);
  const [lastPurchaseInfo, getLastPurchaseInfo, , ,] = useAxiosGet();

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
              setShowPurchaseModal={setShowPurchaseModal}
              getLastPurchaseInfo={getLastPurchaseInfo}
            />
          ))}
        </TableBody>
      </Table>
      <IViewModal
        show={showPurchaseModal}
        onHide={() => {
          setShowPurchaseModal(false);
        }}
      >
        <LastTransactionInfo data={lastPurchaseInfo} />
      </IViewModal>
    </TableContainer>
  );
}
