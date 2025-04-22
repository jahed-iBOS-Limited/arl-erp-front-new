import React, { useEffect, useRef } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { useReactToPrint } from 'react-to-print';
import { imarineBaseUrl } from '../../../../../App';
import { convertNumberToWords } from '../../../_helper/_convertMoneyToWord';
import { _dateFormatter } from '../../../_helper/_dateFormate';
import Loading from '../../../_helper/_loading';
import useAxiosGet from '../../../_helper/customHooks/useAxiosGet';
import logisticsLogo from './logisticsLogo.png';
import './ViewInvoice.css';

export default function ViewInvoice({ clickRowDto }) {
  const { selectedBusinessUnit } = useSelector(
    (state) => state?.authData || {},
    shallowEqual
  );
  const [
    singleChaShipmentBooking,
    getSingleChaShipmentBooking,
    singleChaShipmentBookingLoading,
    setSingleChaShipmentBooking,
  ] = useAxiosGet();

  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: 'Invoice',
    pageStyle: `
        @media print {
          body {
            -webkit-print-color-adjust: exact;

          }
          @page {
            size: portrait !important;
            margin: 15px !important;
          }
        }
      `,
  });

  const tableStyle = {
    fontSize: '12px',
    width: '100%',
    borderCollapse: 'collapse',
  };

  const cellStyle = {
    border: '1px solid #000',
    padding: '2px',
    textAlign: 'left',
  };

  useEffect(() => {
    if (clickRowDto?.chabookingId) {
      getSingleChaShipmentBooking(
        `${imarineBaseUrl}/domain/CHAShipment/GetChaShipmentBookingById?ChaShipmentbookingId=${clickRowDto?.chabookingId}`,
        (resData) => {
          const modifyData = resData?.chaServiceCharges?.filter((item) => {
            return item?.collectionAmount;
          });
          setSingleChaShipmentBooking({
            ...resData,
            chaServiceCharges: modifyData,
          });
        }
      );
    }
  }, [clickRowDto]);

  if (singleChaShipmentBookingLoading) {
    return <Loading />;
  }

  const totalStyle = {
    fontWeight: 'bold',
    textAlign: 'right',
    padding: '5px',
    border: '1px solid #000',
  };

  const totalCollectionAmount =
    singleChaShipmentBooking?.chaServiceCharges?.reduce((acc, curr) => {
      const collectionQty = +curr?.collectionQty || 0;
      const collectionRate = +curr?.collectionRate || 0;
      const collectionAmount = collectionQty * collectionRate;
      return acc + collectionAmount;
    }, 0);

  return (
    <div className="chaShipmentBookingInvoice">
      <div className="d-flex justify-content-end py-2">
        <button
          onClick={handlePrint}
          type="button"
          className="btn btn-primary px-3 py-2"
        >
          <i className="mr-1 fa fa-print pointer" aria-hidden="true"></i>
          Print
        </button>
      </div>
      <div
        style={{
          fontSize: 13,
        }}
        ref={componentRef}
      >
        <table style={tableStyle}>
          <thead>
            <tr>
              <td colSpan="4" style={cellStyle}>
                <div>
                  <span>Company: {selectedBusinessUnit?.label}</span> <br />{' '}
                  <hr style={{ margin: '3px 0px' }} />
                  <span>
                    Address: House - 5, Road - 6, Sector 1, Uttara, Dhaka
                  </span>
                  <hr style={{ margin: '3px 0px' }} />
                  <span>Phone: 08000555777</span> <br />
                  <span>Mobile No: 01332500859</span> <br />
                  <hr style={{ margin: '3px 0px' }} />
                  <span>Email ID: N/A</span> <br />
                  <hr style={{ margin: '3px 0px' }} />
                  <span>BIN: 005848637-0203</span> <br />
                </div>
              </td>
              <td colSpan="2" style={{ ...cellStyle, textAlign: 'center' }}>
                <div>
                  <span>
                    Booking Number:{' '}
                    <b>{singleChaShipmentBooking?.chabookingCode}</b>
                  </span>{' '}
                  <br /> <br />
                  <img
                    src={logisticsLogo}
                    alt="Company Logo"
                    style={{ height: '35px' }}
                  />
                </div>
              </td>
            </tr>
            <tr>
              <td
                colSpan="6"
                style={{
                  backgroundColor: '#ecf0f3',
                  height: '1.5rem',
                  border: '1px solid #000',
                }}
              />
            </tr>
            <tr>
              <td
                colSpan="6"
                style={{
                  textAlign: 'center',
                  fontSize: '24px',
                  fontWeight: 'bold',
                  border: '1px solid #000',
                  padding: '5px 0',
                  textTransform: 'uppercase',
                }}
              >
                Invoice
              </td>
            </tr>
            <tr>
              <td
                colSpan="6"
                style={{
                  backgroundColor: '#ecf0f3',
                  height: '1.5rem',
                  border: '1px solid #000',
                }}
              />
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan="3" style={cellStyle}>
                <b>Bill To</b>
              </td>
              <td colSpan="3" style={cellStyle}>
                Invoice No.:{' '}
                {singleChaShipmentBooking?.commercialInvoiceNo}{' '}
              </td>
            </tr>
            <tr>
              <td colSpan="3" style={cellStyle}>
                Name: {singleChaShipmentBooking?.customerName}
              </td>
              <td style={cellStyle} colSpan="3">
                Date:{' '}
                {singleChaShipmentBooking?.dteCreatedAt
                  ? _dateFormatter(singleChaShipmentBooking?.dteCreatedAt)
                  : ''}
              </td>
            </tr>
            <tr>
              <td colSpan="3" style={cellStyle}>
                Address: {singleChaShipmentBooking?.customerAddress || 'N/A'}
              </td>
              <td colSpan="3" style={cellStyle}>
                Commodity: {singleChaShipmentBooking?.commodityName}
              </td>
            </tr>
            <tr>
              <td colSpan="3" style={cellStyle}>
                Port of Delivery: {singleChaShipmentBooking?.portOfDelivery}
              </td>
              <td colSpan="3" style={cellStyle}>
                Weight: {singleChaShipmentBooking?.grossWeight}
              </td>
            </tr>
            <tr>
              <td colSpan="3" style={cellStyle}>
                IP/EXP No.: {singleChaShipmentBooking?.exp}
              </td>
              <td colSpan="3" style={cellStyle}>
                {singleChaShipmentBooking?.modeOfTransportName === 'Sea' && (
                  <>
                    Container quantity: {singleChaShipmentBooking?.containerQty}
                  </>
                )}
              </td>
            </tr>
            <tr>
              <td colSpan="3" style={cellStyle}>
                IP/EXP Date:{' '}
                {singleChaShipmentBooking?.expDate
                  ? _dateFormatter(singleChaShipmentBooking?.expDate)
                  : ''}
              </td>
              <td colSpan="3" style={cellStyle}>
                Delivery Place: {singleChaShipmentBooking?.placeOfDelivery}
              </td>
            </tr>
            <tr>
              <td colSpan="3" style={cellStyle}>
                LC No.:{singleChaShipmentBooking?.lcNo || 'N/A'}
              </td>
              <td colSpan="3" style={cellStyle}>
                LC Date:{' '}
                {singleChaShipmentBooking?.lcDate
                  ? _dateFormatter(singleChaShipmentBooking?.lcDate)
                  : 'N/A'}
              </td>
            </tr>
            <tr>
              <td colSpan="3" style={cellStyle}>
                Invoice Value: {singleChaShipmentBooking?.invoiceValue}
              </td>
              <td style={cellStyle} colSpan="3">
                Bill of Entry / Export No.:{' '}
                {singleChaShipmentBooking?.billOfEntry}
              </td>
            </tr>
            <tr>
              <td
                colSpan="6"
                style={{
                  backgroundColor: '#transparent',
                  height: '1.5rem',
                  border: '1px solid #000',
                }}
              />
            </tr>

            <tr>
              <th style={cellStyle}>SL.</th>
              <th colSpan="2" style={{ ...cellStyle, textAlign: 'center' }}>
                Description
              </th>
              <th style={{ ...cellStyle, textAlign: 'center' }}>QTY</th>
              <th style={{ ...cellStyle, textAlign: 'center' }}>Rate</th>
              <th style={{ ...cellStyle, textAlign: 'center' }}>Amount</th>
            </tr>
            {singleChaShipmentBooking?.chaServiceCharges?.map((item, index) => {
              const collectionQty = +item?.collectionQty || 0;
              const collectionRate = +item?.collectionRate || 0;
              const collectionAmount = collectionQty * collectionRate;
              return (
                <>
                  <tr key={index}>
                    <td
                      style={{
                        ...cellStyle,
                        width: '30px',
                      }}
                    >
                      {index + 1}
                    </td>
                    <td colSpan="2" style={cellStyle}>
                      {item?.headOfCharges}
                    </td>
                    <td
                      style={{
                        ...cellStyle,
                        width: '150px',
                        textAlign: 'right',
                      }}
                    >
                      {item?.collectionQty}
                    </td>
                    <td
                      style={{
                        ...cellStyle,
                        width: '150px',
                        textAlign: 'right',
                      }}
                    >
                      {item?.collectionRate}
                    </td>
                    <td
                      style={{
                        ...cellStyle,
                        width: '150px',
                        textAlign: 'right',
                      }}
                    >
                      {collectionAmount}
                    </td>
                  </tr>
                </>
              );
            })}
            <tr>
              <td
                colSpan="6"
                style={{
                  backgroundColor: '#ecf0f3',
                  height: '1.5rem',
                  border: '1px solid #000',
                }}
              />
            </tr>
            <tr>
              <td colSpan="5" style={totalStyle}>
                Sub Total:
              </td>
              <td style={totalStyle}>{totalCollectionAmount}</td>
            </tr>
            <tr>
              <td colSpan="6" style={totalStyle}>
                Amount in words:{' '}
                <span
                  style={{
                    textTransform: 'capitalize',
                  }}
                >
                  {totalCollectionAmount &&
                    convertNumberToWords(totalCollectionAmount || 0)}
                </span>
              </td>
            </tr>
            <tr>
              <td colSpan="6" style={cellStyle}>
                <div
                  style={{
                    padding: 2,
                  }}
                >
                  <span>
                    <b>Fund Transfer to</b>
                  </span>
                  <br />
                  <span>BRAC Bank PLC </span>
                  <br />
                  <span>A/C Name: Akij Logistics Ltd.</span>
                  <br />
                  <span>A/C No. 2063890780002</span>
                  <br />
                  <span>Branch: Gulshan</span>
                  <br />
                  <span>Routing: 060261726</span>
                  {/* <br />
                  <span>Swift code: BRAKBDDH</span> */}
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '20px 50px 5px 50px',
                  }}
                >
                  <div>Prepared By:</div>
                  <div>Checked By:</div>
                  <div>Confirmed By:</div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        <span>
          <b>Note: </b>This is system-generated. A signature is not mandatory.
        </span>
      </div>
    </div>
  );
}
