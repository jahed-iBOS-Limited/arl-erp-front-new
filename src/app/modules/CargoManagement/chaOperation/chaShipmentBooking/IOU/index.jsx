import { Form, Formik } from 'formik';
import React, { useEffect, useRef, useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { useReactToPrint } from 'react-to-print';
import * as Yup from 'yup';
import { imarineBaseUrl } from '../../../../../../App';
import { convertNumberToWords } from '../../../../_helper/_convertMoneyToWord';
import { _dateFormatter } from '../../../../_helper/_dateFormate';
import InputField from '../../../../_helper/_inputField';
import Loading from '../../../../_helper/_loading';
import useAxiosGet from '../../../../_helper/customHooks/useAxiosGet';
import useAxiosPost from '../../../../_helper/customHooks/useAxiosPost';
const validationSchema = Yup.object().shape({});
export default function IOU({ clickRowDto, CB }) {
  const formikRef = useRef(null);
  const [isEditModeOn, setIsEditModeOn] = useState(false);
  const [
    shippingHeadOfCharges,
    getShippingHeadOfCharges,
    shippingHeadOfChargesLoading,
    setShippingHeadOfCharges,
  ] = useAxiosGet();
  const [prviousShippingHeadOfCharges, setPrviousShippingHeadOfCharges] =
    useState([]);

  const { selectedBusinessUnit } = useSelector(
    (state) => state?.authData || {},
    shallowEqual
  );
  const [
    singleChaShipmentBooking,
    getSingleChaShipmentBooking,
    singleChaShipmentBookingLoading,
  ] = useAxiosGet();
  const [savedIOUData, getSavedIOUData, isLoading] = useAxiosGet();
  const [isFirstTime, setIsFirstTime] = useState(true);
  const [, saveIOUInvoice, isSaving] = useAxiosPost();
  const [totalAmountObj, setTotalAmountObj] = useState({
    totalAmount: 0,
    advanceAmount: 0,
    grandTotal: 0,
  });

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
        `${imarineBaseUrl}/domain/CHAShipment/GetChaShipmentBookingById?ChaShipmentbookingId=${clickRowDto?.chabookingId}`
      );
      commonGetShippingHeadOfCharges();
    }
  }, [clickRowDto]);
  const commonGetShippingHeadOfCharges = () => {
    getShippingHeadOfCharges(
      `${imarineBaseUrl}/domain/ShippingService/GetShippingHeadOfCharges?typeId=2`,
      (resShippingHeadOfCharges) => {
        getSavedIOUData(
          `${imarineBaseUrl}/domain/CHAShipment/GetByIouInvoiceId?bookingId=${clickRowDto?.chabookingId}`,
          (resSveData) => {
            try {
              const storeShippingHeadOfCharges =
                resSveData?.chaIouInvoice &&
                JSON.parse(resSveData?.chaIouInvoice || []);

              if (formikRef.current) {
                formikRef.current.setFieldValue(
                  'cashReceivedBy',
                  storeShippingHeadOfCharges?.cashReceivedBy || ''
                );
              }

              // parse data to array
              const parseData =
                storeShippingHeadOfCharges?.shippingHeadOfCharges || [];

              const arryList = [];
              if (resShippingHeadOfCharges?.length > 0) {
                if (parseData?.length > 0) {
                  setIsFirstTime(false);
                } else {
                  setIsEditModeOn(true);
                }

                resShippingHeadOfCharges.forEach((item) => {
                  const saveHeadOfChargeList =
                    parseData?.filter(
                      (findItem) => findItem?.headOfChargeId === item?.value
                    ) || [];

                  if (saveHeadOfChargeList?.length > 0) {
                    saveHeadOfChargeList.forEach((saveItem) => {
                      const amount =
                        (+saveItem?.quantity || 0) * (+saveItem?.rate || 0);
                      const obj = {
                        ...item,
                        ...saveItem,
                        quantity: saveItem?.quantity || '',
                        rate: saveItem?.rate || '',
                        isDisableInput: amount > 0 ? true : false,
                        advanceAmount:
                          storeShippingHeadOfCharges?.advanceAmount || 0,
                        grandTotal: storeShippingHeadOfCharges?.grandTotal || 0,
                        totalAmount:
                          storeShippingHeadOfCharges?.totalAmount || 0,
                      };
                      arryList.push(obj);
                    });
                  } else {
                    const obj = {
                      ...item,
                      headOfCharges: item?.label || '',
                      headOfChargeId: item?.value || 0,
                      quantity: '',
                      rate: '',
                      amount: '',
                      isDisableInput: false,
                    };
                    arryList.push(obj);
                  }
                });

                setShippingHeadOfCharges([...arryList]);
                const arry = JSON.parse(JSON.stringify([...arryList])) || [];
                setPrviousShippingHeadOfCharges(arry);
              }
            } catch (error) {
              console.log(error, 'error');
            }
          }
        );
      }
    );
  };

  const totalStyle = {
    fontWeight: 'bold',
    textAlign: 'right',
    padding: '5px',
    border: '1px solid #000',
  };
  const saveHandler = (values, cb) => {
    const modifyData = shippingHeadOfCharges
      ?.filter((item) => {
        const total = (+item?.rate || 0) * (+item?.quantity || 0);
        return total > 0;
      })
      .map((item) => {
        return {
          headOfChargeId: item?.headOfChargeId || 0,
          headOfCharges: item?.headOfCharges || '',
          quantity: item?.quantity || 0,
          rate: item?.rate || 0,
          amount: item?.quantity * item?.rate || 0,
        };
      });

    const prvTotalAmount =
      prviousShippingHeadOfCharges?.reduce((a, b) => {
        const total = (+b?.rate || 0) * (+b?.quantity || 0);
        return a + total;
      }, 0) || 0;

    const payload = {
      iouInvoiceId: savedIOUData?.iouInvoiceId || 0,
      chaBookingId: clickRowDto?.chabookingId || 0,
      chaIouInvoice: JSON.stringify({
        shippingHeadOfCharges: modifyData,
        advanceAmount: prvTotalAmount || 0,
        totalAmount: totalAmountObj?.totalAmount || 0,
        grandTotal: totalAmountObj?.grandTotal || 0,
        cashReceivedBy: values?.cashReceivedBy || '',
      }),
    };
    saveIOUInvoice(
      `${imarineBaseUrl}/domain/CHAShipment/SaveOrUpdateChaIouInvoice`,
      payload,
      () => {
        commonGetShippingHeadOfCharges();
        setIsEditModeOn(false);
      }
    );
  };

  useEffect(() => {
    const currentTotalAmount =
      shippingHeadOfCharges?.reduce((a, b) => {
        const total = (+b?.rate || 0) * (+b?.quantity || 0);
        return a + total;
      }, 0) || 0;
    const prvAdvanceAmount =
      +prviousShippingHeadOfCharges?.[0]?.advanceAmount || 0;
    // const advanceAmount = isFirstTime ? 0 : currentTotalAmount - prvTotalAmount;
    // const prvTotalAmount =
    // prviousShippingHeadOfCharges?.reduce((a, b) => {
    //   const total = (+b?.rate || 0) * (+b?.quantity || 0);
    //   return a + total;
    // }, 0) || 0;
    const advanceAmount = isFirstTime ? 0 : prvAdvanceAmount;
    const grandTotal = currentTotalAmount - advanceAmount;
    setTotalAmountObj({
      totalAmount: currentTotalAmount,
      advanceAmount,
      grandTotal,
    });
  }, [shippingHeadOfCharges, prviousShippingHeadOfCharges]);

  if (singleChaShipmentBookingLoading) {
    return <Loading />;
  }
  return (
    <Formik
      enableReinitialize={true}
      initialValues={{}}
      validationSchema={validationSchema}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        saveHandler(values, () => {
          resetForm();
        });
      }}
      innerRef={formikRef}
    >
      {({ errors, touched, setFieldValue, isValid, values, resetForm }) => (
        <Form>
          {(isLoading || isSaving || shippingHeadOfChargesLoading) && (
            <Loading />
          )}
          <div className="d-flex justify-content-end py-2">
            {!isEditModeOn && (
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={() => setIsEditModeOn(true)}
                  type="button"
                  className="btn btn-primary px-3 py-2"
                >
                  <i class="fa fa-pencil-square-o" aria-hidden="true"></i>
                  Edit
                </button>
                <button
                  onClick={handlePrint}
                  type="button"
                  className="btn btn-primary px-3 py-2"
                >
                  <i
                    className="mr-1 fa fa-print pointer"
                    aria-hidden="true"
                  ></i>
                  Print
                </button>
              </div>
            )}

            {isEditModeOn && (
              <div className="d-flex gap-2">
                <button
                  type="button"
                  className="btn btn-danger px-3 py-2 ml-2"
                  onClick={() => {
                    resetForm();
                    setIsEditModeOn(false);
                    commonGetShippingHeadOfCharges();
                  }}
                >
                  <i
                    className="mr-1 fa fa-times pointer"
                    aria-hidden="true"
                  ></i>
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary px-3 py-2 ml-2"
                >
                  <i className="mr-1 fa fa-save pointer" aria-hidden="true"></i>
                  Save
                </button>
              </div>
            )}
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
                      <span>
                        Company: <b>{selectedBusinessUnit?.label}</b>
                      </span>
                      <hr style={{ margin: '3px 0px' }} />
                      <span>
                        Address: House - 5, Road - 6, Sector 1, Uttara, Dhaka
                      </span>
                      <hr style={{ margin: '3px 0px' }} />
                      <span>Mobile No: 01332500859</span> <br />
                      <span>Phone: 08000555777</span> <br />
                      <hr style={{ margin: '3px 0px' }} />
                      <span>Email ID: N/A</span> <br />
                      <hr style={{ margin: '3px 0px' }} />
                      <span>BIN: 005848637-0203</span> <br />
                    </div>
                  </td>
                  <td colSpan="2" style={{ ...cellStyle, textAlign: 'center' }}>
                    <div>
                      <span>
                        Booking /Job Number:{' '}
                        <b>{singleChaShipmentBooking?.chabookingCode}</b>
                      </span>{' '}
                      <br /> <br />
                      <img
                        src={'/logisticsLogo.png'}
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
                    IOU Form
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
                    <b> Indentor Name</b>
                  </td>
                  <td colSpan="3" style={cellStyle}>
                    Invoice No.: {singleChaShipmentBooking?.commercialInvoiceNo}
                  </td>
                </tr>
                <tr>
                  <td colSpan="3" style={cellStyle}>
                    Cash Received By:
                    {/* {singleChaShipmentBooking?.customerName} */}
                    {isEditModeOn ? (
                      <InputField
                        style={{
                          display: 'inline-block',
                        }}
                        type="text"
                        name="cashReceivedBy"
                        value={values?.cashReceivedBy || ''}
                        placeholder="Cash Received By"
                        onChange={(e) => {
                          console.log(e, 'e');
                          setFieldValue('cashReceivedBy', e.target.value);
                        }}
                      />
                    ) : (
                      ` ${values?.cashReceivedBy || ''}`
                    )}
                  </td>
                  <td colSpan="3" style={cellStyle}>
                    Date:{' '}
                    {singleChaShipmentBooking?.dteCreatedAt
                      ? _dateFormatter(singleChaShipmentBooking?.dteCreatedAt)
                      : ''}
                  </td>
                </tr>
                <tr>
                  <td colSpan="3" style={cellStyle}>
                    Address: N/A
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
                    {singleChaShipmentBooking?.modeOfTransportName ===
                      'Sea' && (
                      <>
                        Container quantity:{' '}
                        {singleChaShipmentBooking?.containerQty}
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
                      backgroundColor: 'transparent',
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
                  <th style={{ ...cellStyle, textAlign: 'center' }}>
                    Qty/Unit
                  </th>
                  <th style={{ ...cellStyle, textAlign: 'center' }}>Rate</th>
                  <th style={{ ...cellStyle, textAlign: 'center' }}>Amount</th>
                  {isEditModeOn && (
                    <>
                      <th style={{ ...cellStyle, textAlign: 'center' }}>
                        Action
                      </th>
                    </>
                  )}
                </tr>
                {shippingHeadOfCharges?.map((item, index) => {
                  const total = (+item?.rate || 0) * (+item?.quantity || 0);
                  const displayValue = total > 0 ? total : '';

                  if (!isEditModeOn && total === 0) {
                    return <></>;
                  }

                  return (
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
                        {isEditModeOn ? (
                          <InputField
                            type="number"
                            name="quantity"
                            value={item?.quantity}
                            placeholder="Quantity"
                            onChange={(e) => {
                              const copyPrv = [...shippingHeadOfCharges];
                              copyPrv[index].quantity = e.target.value;
                              setShippingHeadOfCharges(copyPrv);
                            }}
                            disabled={item?.isDisableInput}
                          />
                        ) : (
                          item?.quantity
                        )}
                      </td>
                      <td
                        style={{
                          ...cellStyle,
                          width: '150px',
                          textAlign: 'right',
                        }}
                      >
                        {isEditModeOn ? (
                          <InputField
                            type="number"
                            name="rate"
                            value={item?.rate}
                            placeholder="Rate"
                            onChange={(e) => {
                              const copyPrv = [...shippingHeadOfCharges];
                              copyPrv[index].rate = e.target.value;
                              setShippingHeadOfCharges(copyPrv);
                            }}
                            disabled={item?.isDisableInput}
                          />
                        ) : (
                          item?.rate
                        )}
                      </td>
                      <td
                        style={{
                          ...cellStyle,
                          width: '150px',
                          textAlign: 'right',
                        }}
                      >
                        {displayValue}
                      </td>

                      {isEditModeOn && (
                        <>
                          <td>
                            <div
                              className="d-flex justify-content-center"
                              style={{
                                gap: '5px',
                              }}
                            >
                              <button
                                type="button"
                                className="btn btn-primary"
                                onClick={() => {
                                  const hardCopy = JSON.parse(
                                    JSON.stringify(shippingHeadOfCharges)
                                  );
                                  const aboveRow = hardCopy?.[index];
                                  // insert new row below the above row
                                  const modifiedData = [
                                    ...hardCopy?.slice(0, index + 1),
                                    {
                                      headOfCharges:
                                        aboveRow?.headOfCharges || '',
                                      headOfChargeId:
                                        aboveRow?.headOfChargeId || 0,
                                    },
                                    ...hardCopy?.slice(index + 1),
                                  ];
                                  setShippingHeadOfCharges(modifiedData);
                                }}
                              >
                                <i
                                  className="fa fa-clone"
                                  aria-hidden="true"
                                ></i>
                              </button>
                            </div>
                          </td>
                        </>
                      )}
                    </tr>
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
                  <td style={cellStyle}>{totalAmountObj?.totalAmount}</td>
                </tr>
                <tr>
                  <td colSpan="5" style={totalStyle}>
                    Advance:
                  </td>
                  <td style={cellStyle}>{totalAmountObj?.advanceAmount}</td>
                </tr>
                <tr>
                  <td colSpan="5" style={totalStyle}>
                    Total (Payable):
                  </td>
                  <td style={cellStyle}>{totalAmountObj?.grandTotal}</td>
                </tr>
                <tr>
                  <td colSpan="6" style={cellStyle}>
                    <span
                      style={{
                        textTransform: 'capitalize',
                      }}
                    >
                      {totalAmountObj?.grandTotal &&
                        convertNumberToWords(
                          totalAmountObj?.grandTotal || 0
                        )}{' '}
                      Taka Only
                    </span>
                  </td>
                </tr>
                <tr>
                  <td colSpan="6" style={cellStyle}>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        padding: '150px 50px 5px 50px',
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
          </div>
        </Form>
      )}
    </Formik>
  );
}
