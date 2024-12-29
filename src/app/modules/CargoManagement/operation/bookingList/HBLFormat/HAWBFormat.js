import moment from 'moment';
import React from 'react';
import ReactQuill from 'react-quill';
import './HAWBFormat.css';
import logisticsLogo from './logisticsLogo.png';
function HBLFormatAirItem({
  bookingData,
  footerText,
  isEPBInvoice,
  htmlContent,
  changeHandelar,
  isPrintView,
}) {
  const totalGrossWeightKG = bookingData?.rowsData?.reduce(
    (acc, item) => acc + (+item?.totalGrossWeightKG || 0),
    0,
  );

  const totalVolumetricWeight = bookingData?.rowsData?.reduce(
    (acc, item) => acc + (+item?.totalVolumetricWeight || 0),
    0,
  );

  const totalNumberOfPackages = bookingData?.rowsData?.reduce(
    (acc, item) => acc + (+item?.totalNumberOfPackages || 0),
    0,
  );

  const totalGrossWeight =
    totalVolumetricWeight > totalGrossWeightKG
      ? totalVolumetricWeight
      : totalGrossWeightKG;
  return (
    <div
      style={{
        position: 'relative',
      }}
    >
      {isEPBInvoice && (
        <p
          style={{
            position: 'absolute',
            top: '20%',
            left: '35%',
            fontSize: '23px',
            color: '#990370',
            fontWeight: 'bold',
            transform: 'rotate(-24deg)',
          }}
        >
          COPY NON-NEGOTIABLE
        </p>
      )}

      <div className="hawbContainer">
        <div className="shipperAandConsigneeInfo">
          <div className="top borderBottom">
            <div className="leftSide borderRight">
              <div className="shipperInfo borderBottom">
                <p className="textTitle">Shipper's Name and Address:</p>
                <p>TO THE ORDER OF</p>
                <p>
                  {bookingData?.objPurchase?.[0]?.infoType === 'lc' &&
                    bookingData?.shipperBank}
                </p>
                <p>
                  {bookingData?.objPurchase?.[0]?.infoType === 'lc' &&
                    bookingData?.shipperBankAddress}
                </p>
                <p>
                  {bookingData?.objPurchase?.[0]?.infoType === 'lc'
                    ? 'A/C '
                    : ''}

                  {bookingData?.shipperName}
                </p>
                {/* <p>{bookingData?.shipperContactPerson}</p> */}
                <p>{bookingData?.shipperContact}</p>
                <p>{bookingData?.shipperEmail}</p>
                <p>
                  {bookingData?.shipperState} ,{bookingData?.shipperCountry},{' '}
                  {bookingData?.shipperAddress}
                </p>
              </div>
              <div className="consigneeInfo borderBottom">
                <p className="textTitle">Consignee's Name and Address:</p>
                <p>TO THE ORDER OF</p>
                <p>
                  {bookingData?.objPurchase?.[0]?.infoType === 'lc' &&
                    bookingData?.buyerBank}
                </p>
                <p>
                  {bookingData?.objPurchase?.[0]?.infoType === 'lc' &&
                    bookingData?.notifyBankAddr}
                </p>
                <p>
                  {bookingData?.objPurchase?.[0]?.infoType === 'lc'
                    ? 'A/C '
                    : ''}{' '}
                  {bookingData?.consigneeName}
                </p>
                <p>{bookingData?.consigneeEmail}</p>
                {/* <p>{bookingData?.consigneeContactPerson}</p> */}
                <p>{bookingData?.consigneeContact}</p>
                <p>
                  {bookingData?.consigState}, {bookingData?.consigCountry}{' '}
                  {bookingData?.consigneeAddress}
                </p>
              </div>
              {/* Notify Party */}
              <div className="notifyParty">
                <p className="textTitle">Notify Party</p>
                {/* <p>TO THE ORDER OF</p> */}
                <p>{bookingData?.notifyParty}</p>
                <p>{bookingData?.notifyBankAddr}</p>
              </div>
            </div>
            <div className="rightSide">
              <div className="rightSideTop">
                <div>
                  <p className="textTitle">Not Negotiable</p>
                  <h6 className="airWayBillTitle">AIR WAYBILL</h6>
                  <p>(Air Consigniment Note)</p>
                  <p>Issued by</p>
                </div>
                <div>
                  <p>
                    <b>HAWB NO: {isEPBInvoice ? '' : bookingData?.hblnumber}</b>
                  </p>
                  <img src={logisticsLogo} alt="barcode" />
                  <p>
                    <b>Akij Logistics Limited</b>
                  </p>
                </div>
              </div>
              <div className="rightSideBottom" />
              <div className="rightSideMiddle borderBottom">
                <p className="rightSideMiddleTitle">
                  Copies 1,2 and 3 of this Air Waybill arc originals and have
                  the same validity
                </p>
                <p className="rightSideMiddleContent">
                  It is agreed that the goods described herein are accepted in
                  apparent good order and condition (except as noted) for
                  carriage SUBJECT TO THE CONDITIONS OF CONTRACT ON THE REVERSE
                  HEREOF. ALL GOODS MAY BE CARRIED BY ANY OTHER MEANS INCLUDING
                  ROAD OR ANY OTHER CARRIER UNLESS SPECIFIC CONTRARY
                  INSTRUCTIONS ARE GIVEN HEREON BY THE SHIPPER, AND SHIPPER
                  AGREES THAT THE SHIPMENT MAY BE CARRIED VIA INTERMEDIATE
                  STOPPING PLACES WHICH THE CARRIER DEEMS APPROPRIATE. THE
                  SHIPPER'S ATTENTION IS DRAWN TO THE NOTICE CONCERNING
                  CARRIER·s LIMITATION OF LIABILITY. Shipper may increase such
                  limitation of liabHity by declaring a higher value for
                  carriage and paying a suppfemental charge if required.
                </p>
              </div>
              <div className="rightSideButtom">
                <div className="borderBottom">
                  <p className="textTitle">Accounting Information</p>
                  <div className="text-center">
                    <br />
                    <h2>
                      FREIGHT{' '}
                      {['exw'].includes(bookingData?.incoterms) &&
                        'COLLECT EXW'}
                      {['fca', 'fob'].includes(bookingData?.incoterms) &&
                        'COLLECT'}
                      {['cif', 'cpt', 'cfr'].includes(bookingData?.incoterms) &&
                        'PREPAID'}
                      {['dap', 'ddp', 'ddu'].includes(bookingData?.incoterms) &&
                        'COLLECT DAP/DDP/DDU'}
                      {['other'].includes(bookingData?.incoterms) && 'COLLECT'}
                    </h2>
                    <br />
                    <p>
                      <b>
                        MAWB NO:
                        {bookingData?.flightNumber}
                      </b>
                    </p>
                  </div>
                </div>
                <div className="borderBottom">
                  <p className="textTitle">
                    I.A.T.A Code {bookingData?.transportPlanning?.iatanumber}
                  </p>
                </div>
                <div className="borderBottomTime">
                  <p className="borderRight">Time &amp; Date Broker Notified</p>
                  <p>Time &amp; Date Cargo Collected</p>
                </div>
              </div>
            </div>
          </div>
          <div className="top borderBottom airInfo">
            <div className="leftSide borderRight">
              <div>
                <p className="textTitle">
                  Airport of Departure and Requested Routing
                </p>
                <div
                  style={{
                    display: 'flex',
                    gap: 5,
                  }}
                >
                  <p>
                    {bookingData?.transportPlanning?.airLineOrShippingLine ||
                      ''}
                  </p>
                  <div
                    style={{
                      display: 'flex',
                      gap: 5,
                    }}
                  >
                    {bookingData?.transportPlanning?.airTransportRow?.map(
                      (item, index) => {
                        return (
                          <p key={index}>
                            <b>
                              ({item?.fromPort} - {item?.toPort})
                            </b>
                          </p>
                        );
                      },
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="rightSide">
              <div className="rightSideColumnOne borderRight">
                <div style={{ display: 'flex', height: '100%' }}>
                  <div
                    style={{ display: 'flex', height: '100%' }}
                    className="commonWithOne borderRight"
                  >
                    <div className="hawbCurrency borderRight">
                      <p className="textTitle">Currency</p>
                      <p>{bookingData?.currency} </p>
                    </div>
                    <div
                      className="air-flight-info"
                      style={{
                        width: '100%',
                      }}
                    >
                      <div className="air-flight-catagory">
                        <p className="borderBottom textTitle">WT/VAL</p>
                        <div style={{ display: 'flex', height: '100%' }}>
                          <p
                            className="borderRight textTitle"
                            style={{
                              width: '50%',
                            }}
                          >
                            {['cif', 'cpt', 'cfr'].includes(
                              bookingData?.incoterms,
                            )
                              ? 'PPD'
                              : ''}
                          </p>
                          <p
                            className="textTitle"
                            style={{
                              width: '50%',
                            }}
                          >
                            {['cif', 'cpt', 'cfr'].includes(
                              bookingData?.incoterms,
                            )
                              ? ''
                              : 'CCX'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    className="air-flight-info"
                    style={{
                      flex: 1,
                    }}
                  >
                    <div className="air-flight-catagory">
                      <p className="borderBottom textTitle">Other</p>
                      <div style={{ display: 'flex', height: '100%' }}>
                        <p
                          className="borderRight textTitle"
                          style={{
                            width: '50%',
                          }}
                        >
                          {['cif', 'cpt', 'cfr'].includes(
                            bookingData?.incoterms,
                          )
                            ? 'PPD'
                            : ''}
                        </p>
                        <p
                          className="textTitle"
                          style={{
                            width: '50%',
                          }}
                        >
                          {['cif', 'cpt', 'cfr'].includes(
                            bookingData?.incoterms,
                          )
                            ? ''
                            : 'CCX'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div
                style={{
                  flex: 1,
                }}
              >
                <div style={{ display: 'flex', height: '100%' }}>
                  <div
                    className="borderRight"
                    style={{
                      width: '50%',
                    }}
                  >
                    <p className="textTitle">Declared Value for Carriage</p>
                  </div>
                  <div
                    style={{
                      width: '50%',
                    }}
                  >
                    <p className="textTitle">Declared Value for Customs</p>
                    <p>
                      <b>
                        {bookingData?.invoiceValue
                          ? bookingData?.invoiceValue
                          : 'AS PER INV'}
                      </b>
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div />
          </div>
          <div className="top borderBottom airInfo">
            <div className="leftSide borderRight">
              <div style={{ display: 'flex', height: '100%' }}>
                <div
                  className="air-destination-info borderRight"
                  style={{ width: '50%' }}
                >
                  <p className="textTitle">Airport of Destination</p>
                  <p>
                    <b>
                      {' '}
                      <p className="medium-font" style={{ paddingTop: 5 }}>
                        {
                          bookingData?.transportPlanning?.airTransportRow?.[
                            bookingData?.transportPlanning?.airTransportRow
                              ?.length - 1
                          ]?.toPort
                        }
                      </p>
                    </b>
                  </p>
                </div>
                <div style={{ width: '50%' }}>
                  <div style={{ display: 'flex', height: '100%' }}>
                    <div className="borderRight" style={{ width: '50%' }}>
                      <p className="textTitle ">Flight/Date</p>
                      {bookingData?.transportPlanning?.estimatedTimeOfDepart
                        ? moment(
                            bookingData?.transportPlanning
                              ?.estimatedTimeOfDepart,
                          ).format('DD.MM.YYYY')
                        : ''}
                    </div>
                    <div className="" style={{ width: '50%' }}>
                      <p className="textTitle ">Flight/Date</p>

                      <p className="medium-font">
                        {bookingData?.transportPlanning?.arrivalDateTime
                          ? moment(
                              bookingData?.transportPlanning?.arrivalDateTime,
                            ).format('DD.MM.YYYY')
                          : ''}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="rightSide">
              <div style={{ display: 'flex' }}>
                <div className="amountofInsurance borderRight commonWithOne">
                  <p className="textTitle">Amount of Insurance</p>
                </div>
                <div>
                  <p>
                    INSURANCE-if Carrier offers insurance and such insurance is
                    requested in accordance with condition on reverse hereof,
                    indicate amount to be insured in figures in box marked
                    amount of insurance
                  </p>
                </div>
              </div>
            </div>
            <div />
          </div>
          <div style={{ minHeight: 50 }} className="borderBottom">
            <p className="textTitle">Handling Information</p>
          </div>
          {/* cargo info */}
          <div className="cargoInfo borderBottom">
            <div>
              <div
                style={{ display: 'flex', textAlign: 'center' }}
                className="borderBottom textTitle"
              >
                <div className="noPiecesRcp borderRight">
                  <p>No Of Pieces RCP</p>
                </div>
                <div className="grossWeight borderRight">
                  <p>Gross Weight</p>
                </div>
                <div className="kgIB borderRight">
                  <p>KG IB</p>
                </div>
                <div className="chargeableWeight borderRight">
                  <p>Chargeable Weight</p>
                </div>
                <div className="rateAndCharge borderRight">
                  <p>Rate</p>
                </div>
                <div className="total borderRight">
                  <p>Total</p>
                </div>
                <div className="natureandQuantityofGoods">
                  <p>
                    Nature and Quantity of Goods <br />
                    (incl, Dimensions or volume)
                  </p>
                </div>
              </div>
            </div>
            <div style={{ height: '100%', fontWeight: '500' }}>
              <div style={{ display: 'flex', height: '100%' }}>
                <div
                  className="noPiecesRcp borderRight"
                  style={{
                    position: 'relative',
                  }}
                >
                  <p>{totalNumberOfPackages}</p>
                  <p
                    style={{
                      position: 'absolute',
                      left: '2px',
                      top: '50px',
                      width: '104px',
                      textDecoration: 'underline',
                    }}
                  >
                    Shipping Marks: <br />
                    {bookingData?.shippingMark || bookingData?.shippingMark}
                  </p>
                </div>
                <div className="grossWeight borderRight">
                  <p>{totalGrossWeightKG} KG</p>
                </div>
                <div className="kgIB borderRight">
                  <p />
                </div>
                <div className="chargeableWeight borderRight">
                  <p>{totalGrossWeight} KG</p>
                </div>
                <div className="rateAndCharge borderRight">
                  {isPrintView ? (
                    <>
                      <div> {htmlContent?.chargeableRate || ''}</div>
                    </>
                  ) : (
                    <>
                      {/* rate input */}
                      <input
                        style={{
                          width: '100%',
                        }}
                        type="text"
                        value={htmlContent?.chargeableRate || ''}
                        onChange={(e) => {
                          changeHandelar &&
                            changeHandelar({
                              key: 'chargeableRate',
                              value: e.target.value,
                            });
                        }}
                      />
                    </>
                  )}
                </div>
                <div className="total borderRight">
                  <p>
                    {htmlContent?.chargeableRate ? (
                      <>
                        {totalNumberOfPackages *
                          (+htmlContent?.chargeableRate || 0)}
                      </>
                    ) : (
                      ''
                    )}
                  </p>
                </div>
                <div className="natureandQuantityofGoods">
                  <p style={{ textDecoration: 'underline' }}>
                    DESCRIPTION OF GOODS :
                  </p>
                  {bookingData?.rowsData?.map((item, index) => {
                    const dimension = item?.dimensionRow?.reduce(
                      (acc, cur) => {
                        return {
                          dimsLength:
                            (+acc?.dimsLength || 0) + (+cur?.dimsLength || 0),
                          dimsWidth:
                            (+acc?.dimsWidth || 0) + (+cur?.dimsWidth || 0),
                          dimsHeight:
                            (+acc?.dimsHeight || 0) + (+cur?.dimsHeight || 0),
                        };
                      },
                      {
                        dimsLength: 0,
                        dimsWidth: 0,
                        dimsHeight: 0,
                      },
                    );
                    return (
                      <>
                        <p>{item?.descriptionOfGoods}</p>
                        <p>
                          Po No:{' '}
                          {item?.dimensionRow?.map((i, index) => {
                            return (
                              (i?.poNumber || '') +
                              (index < item?.dimensionRow?.length - 1
                                ? ','
                                : '')
                            );
                          })}
                        </p>
                        <p>
                          Color:{' '}
                          {item?.dimensionRow?.map((i, index) => {
                            return (
                              (i?.color || '') +
                              (index < item?.dimensionRow?.length - 1
                                ? ','
                                : '')
                            );
                          })}
                        </p>
                        <p>
                          H.S Code:{' '}
                          {(item?.hsCode || '') +
                            (index < bookingData?.rowsData?.length - 1
                              ? ','
                              : '')}
                        </p>
                        <p>
                          Dimn:{' '}
                          {`${dimension?.dimsLength} x ${dimension?.dimsWidth} x ${dimension?.dimsHeight}`}
                        </p>
                        <br />
                      </>
                    );
                  })}

                  <br />
                  <p>
                    Invoice No: {bookingData?.refInvoiceNo} :{' '}
                    {bookingData?.refInvoiceDate &&
                      `${moment(bookingData?.refInvoiceDate).format(
                        'DD-MM-YYYY',
                      )}`}
                  </p>
                  <p>
                    {bookingData?.infoType === 'lc'
                      ? 'LC No'
                      : bookingData?.infoType === 'tt'
                      ? 'TT No'
                      : 'S/C No'}
                    :{' '}
                    {bookingData?.objPurchase?.map((item, index) => {
                      return `${item?.lcnumber || ''} : ${item?.lcdate &&
                        `${moment(item?.lcdate).format('DD-MM-YYYY')}`}${
                        index < bookingData?.objPurchase?.length - 1 ? ',' : ''
                      }`;
                    })}
                  </p>
                  <p>
                    Exp No:
                    {bookingData?.expOrCnfNumber || ''} :{' '}
                    {bookingData?.expOrCnfDate &&
                      `${moment(bookingData?.expOrCnfDate).format(
                        'DD-MM-YYYY',
                      )}`}
                  </p>
                </div>
              </div>
            </div>
          </div>
          {/* collect info */}
          <div className="collectInfo">
            {/* row item (1) */}
            <div className="collectItemRow collectItemRowOne borderBottom">
              <div className="collectItemLeft borderRight">
                <div className="collectChart">
                  {/* grap */}
                  <div className="collectChartBox">
                    <span className=" collectChartBoxItem collectChartBoxPrepaid textTitle">
                      Prepaid
                    </span>
                    <sapn className=" collectChartBoxItem collectChartBoxWC textTitle">
                      Weight charge
                    </sapn>
                    <span className=" collectChartBoxItem collectChartBoxCollect textTitle">
                      Collect
                    </span>
                  </div>
                  <div className="collectChartLeft borderRight">
                    <p className="collectChartValue" />
                    {['cif', 'cpt', 'cfr'].includes(bookingData?.incoterms) && (
                      <>
                        {isPrintView ? (
                          <>
                            <div
                              dangerouslySetInnerHTML={{
                                __html: htmlContent?.weightChargePrepaid || '',
                              }}
                            ></div>
                          </>
                        ) : (
                          <>
                            <ReactQuill
                              value={htmlContent?.weightChargePrepaid || ''}
                              onChange={(value) => {
                                changeHandelar &&
                                  changeHandelar({
                                    key: 'weightChargePrepaid',
                                    value,
                                  });
                              }}
                              modules={{
                                toolbar: false,
                              }}
                              style={{
                                padding: 0,
                                margin: 0,
                              }}
                            />{' '}
                          </>
                        )}
                      </>
                    )}
                  </div>
                  <div className="collectChartRight">
                    <p className="collectChartValue">
                      {!['cif', 'cpt', 'cfr'].includes(
                        bookingData?.incoterms,
                      ) && (
                        <>
                          {isPrintView ? (
                            <>
                              <div
                                dangerouslySetInnerHTML={{
                                  __html:
                                    htmlContent?.weightChargeCollect || '',
                                }}
                              ></div>
                            </>
                          ) : (
                            <>
                              <ReactQuill
                                value={htmlContent?.weightChargeCollect || ''}
                                onChange={(value) => {
                                  changeHandelar &&
                                    changeHandelar({
                                      key: 'weightChargeCollect',
                                      value,
                                    });
                                }}
                                modules={{
                                  toolbar: false,
                                }}
                                style={{
                                  padding: 0,
                                  margin: 0,
                                }}
                              />{' '}
                            </>
                          )}
                        </>
                      )}
                    </p>
                  </div>
                </div>
              </div>
              <div className="collectItemRight">
                <div>
                  <p className="textTitle">Other charges</p>
                </div>
              </div>
            </div>
            {/* row item (2) */}
            <div className="collectItemRow collectItemRowTwo borderBottom">
              <div className="collectItemLeft borderRight">
                <div className="collectChart">
                  {/* grap */}
                  <div
                    className="collectChartBox"
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      width: '100%',
                    }}
                  >
                    <span className=" collectChartBoxItem collectChartBoxValuationCharge textTitle">
                      Valuation charge
                    </span>
                  </div>
                  <div className="collectChartLeft borderRight">
                    <p className="collectChartValue">
                      {['cif', 'cpt', 'cfr'].includes(
                        bookingData?.incoterms,
                      ) && (
                        <>
                          {isPrintView ? (
                            <>
                              <div
                                dangerouslySetInnerHTML={{
                                  __html:
                                    htmlContent?.valuationChargePrepaid || '',
                                }}
                              ></div>
                            </>
                          ) : (
                            <>
                              <ReactQuill
                                value={
                                  htmlContent?.valuationChargePrepaid || ''
                                }
                                onChange={(value) => {
                                  changeHandelar &&
                                    changeHandelar({
                                      key: 'valuationChargePrepaid',
                                      value,
                                    });
                                }}
                                modules={{
                                  toolbar: false,
                                }}
                                style={{
                                  padding: 0,
                                  margin: 0,
                                }}
                              />{' '}
                            </>
                          )}
                        </>
                      )}
                    </p>
                  </div>
                  <div className="collectChartRight">
                    <p className="collectChartValue">
                      {!['cif', 'cpt', 'cfr'].includes(
                        bookingData?.incoterms,
                      ) && (
                        <>
                          {isPrintView ? (
                            <>
                              <div
                                dangerouslySetInnerHTML={{
                                  __html:
                                    htmlContent?.valuationChargeCollect || '',
                                }}
                              ></div>
                            </>
                          ) : (
                            <>
                              <ReactQuill
                                value={
                                  htmlContent?.valuationChargeCollect || ''
                                }
                                onChange={(value) => {
                                  changeHandelar &&
                                    changeHandelar({
                                      key: 'valuationChargeCollect',
                                      value,
                                    });
                                }}
                                modules={{
                                  toolbar: false,
                                }}
                                style={{
                                  padding: 0,
                                  margin: 0,
                                }}
                              />{' '}
                            </>
                          )}
                        </>
                      )}
                    </p>
                  </div>
                </div>
              </div>
              <div className="collectItemRight">
                <div>
                  <p className="textTitle">Carriage</p>
                </div>
              </div>
            </div>
            {/* row item (3) */}
            <div className="collectItemRow collectItemRowThree borderBottom">
              <div className="collectItemLeft borderRight">
                <div className="collectChart">
                  {/* grap */}
                  <div
                    className="collectChartBox"
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      width: '100%',
                    }}
                  >
                    <span className=" collectChartBoxItem collectChartTax textTitle">
                      Tax
                    </span>
                  </div>
                  <div className="collectChartLeft borderRight">
                    <p className="collectChartValue">
                      {['cif', 'cpt', 'cfr'].includes(
                        bookingData?.incoterms,
                      ) && (
                        <>
                          {isPrintView ? (
                            <>
                              <div
                                dangerouslySetInnerHTML={{
                                  __html: htmlContent?.taxPrepaid || '',
                                }}
                              ></div>
                            </>
                          ) : (
                            <>
                              <ReactQuill
                                value={htmlContent?.taxPrepaid || ''}
                                onChange={(value) => {
                                  changeHandelar &&
                                    changeHandelar({
                                      key: 'taxPrepaid',
                                      value,
                                    });
                                }}
                                modules={{
                                  toolbar: false,
                                }}
                                style={{
                                  padding: 0,
                                  margin: 0,
                                }}
                              />{' '}
                            </>
                          )}
                        </>
                      )}
                    </p>
                  </div>
                  <div className="collectChartRight">
                    <p className="collectChartValue">
                      {!['cif', 'cpt', 'cfr'].includes(
                        bookingData?.incoterms,
                      ) && (
                        <>
                          {isPrintView ? (
                            <>
                              <div
                                dangerouslySetInnerHTML={{
                                  __html: htmlContent?.taxCollect || '',
                                }}
                              ></div>
                            </>
                          ) : (
                            <>
                              <ReactQuill
                                value={htmlContent?.taxCollect || ''}
                                onChange={(value) => {
                                  changeHandelar &&
                                    changeHandelar({
                                      key: 'taxCollect',
                                      value,
                                    });
                                }}
                                modules={{
                                  toolbar: false,
                                }}
                                style={{
                                  padding: 0,
                                  margin: 0,
                                }}
                              />{' '}
                            </>
                          )}
                        </>
                      )}
                    </p>
                  </div>
                </div>
              </div>
              <div className="collectItemRight">
                <div>
                  <p className="textTitle"></p>
                </div>
              </div>
            </div>
            {/* row item (4) */}
            <div className="collectItemRow collectItemRowFour borderBottom">
              <div className="collectItemLeft borderRight">
                <div className="collectChart">
                  <div style={{ width: '100%' }}>
                    <div
                      style={{ display: 'flex', position: 'relative' }}
                      className="borderBottom totalOtherChargesDueAgent"
                    >
                      {/* grap */}
                      <div
                        className="collectChartBox"
                        style={{
                          display: 'flex',
                          justifyContent: 'center',
                          width: '100%',
                        }}
                      >
                        <span className=" collectChartBoxItem collectChartBoxTotalOtherChargesDueAgent textTitle">
                          Total Other Charges Due Agent
                        </span>
                      </div>
                      <div className="collectChartLeft borderRight">
                        <p className="collectChartValue">
                          {['cif', 'cpt', 'cfr'].includes(
                            bookingData?.incoterms,
                          ) && (
                            <>
                              {isPrintView ? (
                                <>
                                  <div
                                    dangerouslySetInnerHTML={{
                                      __html:
                                        htmlContent?.totOtherChargesDagentPrepaid ||
                                        '',
                                    }}
                                  ></div>
                                </>
                              ) : (
                                <>
                                  <ReactQuill
                                    value={
                                      htmlContent?.totOtherChargesDagentPrepaid ||
                                      ''
                                    }
                                    onChange={(value) => {
                                      changeHandelar &&
                                        changeHandelar({
                                          key: 'totOtherChargesDagentPrepaid',
                                          value,
                                        });
                                    }}
                                    modules={{
                                      toolbar: false,
                                    }}
                                    style={{
                                      padding: 0,
                                      margin: 0,
                                    }}
                                  />{' '}
                                </>
                              )}
                            </>
                          )}
                        </p>
                      </div>
                      <div className="collectChartRight">
                        <p className="collectChartValue">
                          {!['cif', 'cpt', 'cfr'].includes(
                            bookingData?.incoterms,
                          ) && (
                            <>
                              {isPrintView ? (
                                <>
                                  <div
                                    dangerouslySetInnerHTML={{
                                      __html:
                                        htmlContent?.totOtherChargesDagentCollect ||
                                        '',
                                    }}
                                  ></div>
                                </>
                              ) : (
                                <>
                                  <ReactQuill
                                    value={
                                      htmlContent?.totOtherChargesDagentCollect ||
                                      ''
                                    }
                                    onChange={(value) => {
                                      changeHandelar &&
                                        changeHandelar({
                                          key: 'totOtherChargesDagentCollect',
                                          value,
                                        });
                                    }}
                                    modules={{
                                      toolbar: false,
                                    }}
                                    style={{
                                      padding: 0,
                                      margin: 0,
                                    }}
                                  />{' '}
                                </>
                              )}
                            </>
                          )}
                        </p>
                      </div>
                    </div>
                    <div
                      style={{ display: 'flex', position: 'relative' }}
                      className="totalOtherChargesDueCarrier borderBottom"
                    >
                      {/* grap */}
                      <div
                        className="collectChartBox"
                        style={{
                          display: 'flex',
                          justifyContent: 'center',
                          width: '100%',
                        }}
                      >
                        <span className=" collectChartBoxItem collectChartBoxTotalOtherChargesDueCarrier textTitle">
                          Total OtherCharges Due Carrier
                        </span>
                      </div>
                      <div className="collectChartLeft borderRight">
                        <p className="collectChartValue">
                          {['cif', 'cpt', 'cfr'].includes(
                            bookingData?.incoterms,
                          ) && (
                            <>
                              {isPrintView ? (
                                <>
                                  <div
                                    dangerouslySetInnerHTML={{
                                      __html:
                                        htmlContent?.totOtherChargesDcarrierPrepaid ||
                                        '',
                                    }}
                                  ></div>
                                </>
                              ) : (
                                <>
                                  <ReactQuill
                                    value={
                                      htmlContent?.totOtherChargesDcarrierPrepaid ||
                                      ''
                                    }
                                    onChange={(value) => {
                                      changeHandelar &&
                                        changeHandelar({
                                          key: 'totOtherChargesDcarrierPrepaid',
                                          value,
                                        });
                                    }}
                                    modules={{
                                      toolbar: false,
                                    }}
                                    style={{
                                      padding: 0,
                                      margin: 0,
                                    }}
                                  />{' '}
                                </>
                              )}
                            </>
                          )}
                        </p>
                      </div>
                      <div className="collectChartRight">
                        <p className="collectChartValue">
                          {!['cif', 'cpt', 'cfr'].includes(
                            bookingData?.incoterms,
                          ) && (
                            <>
                              {isPrintView ? (
                                <>
                                  <div
                                    dangerouslySetInnerHTML={{
                                      __html:
                                        htmlContent?.totOtherChargesDcarrierCollect ||
                                        '',
                                    }}
                                  ></div>
                                </>
                              ) : (
                                <>
                                  <ReactQuill
                                    value={
                                      htmlContent?.totOtherChargesDcarrierCollect ||
                                      ''
                                    }
                                    onChange={(value) => {
                                      changeHandelar &&
                                        changeHandelar({
                                          key: 'totOtherChargesDcarrierCollect',
                                          value,
                                        });
                                    }}
                                    modules={{
                                      toolbar: false,
                                    }}
                                    style={{
                                      padding: 0,
                                      margin: 0,
                                    }}
                                  />{' '}
                                </>
                              )}
                            </>
                          )}
                        </p>
                      </div>
                    </div>
                    <div
                      style={{ display: 'flex', position: 'relative' }}
                      className="totalOtherChargesDueCarrier"
                    >
                      {/* grap */}
                      <div className="collectChartLeft borderRight">
                        <p className="collectChartValue">
                          {['cif', 'cpt', 'cfr'].includes(
                            bookingData?.incoterms,
                          ) && (
                            <>
                              {isPrintView ? (
                                <>
                                  <div
                                    dangerouslySetInnerHTML={{
                                      __html:
                                        htmlContent?.totOtherChargesDcarrierPrepaid2 ||
                                        '',
                                    }}
                                  ></div>
                                </>
                              ) : (
                                <>
                                  <ReactQuill
                                    value={
                                      htmlContent?.totOtherChargesDcarrierPrepaid2 ||
                                      ''
                                    }
                                    onChange={(value) => {
                                      changeHandelar &&
                                        changeHandelar({
                                          key:
                                            'totOtherChargesDcarrierPrepaid2',
                                          value,
                                        });
                                    }}
                                    modules={{
                                      toolbar: false,
                                    }}
                                    style={{
                                      padding: 0,
                                      margin: 0,
                                    }}
                                  />{' '}
                                </>
                              )}
                            </>
                          )}
                        </p>
                      </div>
                      <div className="collectChartRight">
                        <p className="collectChartValue">
                          {!['cif', 'cpt', 'cfr'].includes(
                            bookingData?.incoterms,
                          ) && (
                            <>
                              {isPrintView ? (
                                <>
                                  <div
                                    dangerouslySetInnerHTML={{
                                      __html:
                                        htmlContent?.totOtherChargesDcarrierCollect2 ||
                                        '',
                                    }}
                                  ></div>
                                </>
                              ) : (
                                <>
                                  <ReactQuill
                                    value={
                                      htmlContent?.totOtherChargesDcarrierCollect2 ||
                                      ''
                                    }
                                    onChange={(value) => {
                                      changeHandelar &&
                                        changeHandelar({
                                          key:
                                            'totOtherChargesDcarrierCollect2',
                                          value,
                                        });
                                    }}
                                    modules={{
                                      toolbar: false,
                                    }}
                                    style={{
                                      padding: 0,
                                      margin: 0,
                                    }}
                                  />{' '}
                                </>
                              )}
                            </>
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="collectItemRight">
                <div>
                  <p className="smallTitle">
                    Shipper certifies that the particulars on the face hereof
                    are correct and that insofar as any part of the consignment
                    contains restricted articles, such part is properly
                    described by name and is in proper condition for carriage by
                    air according to the applicable Dangerous Goods Regulations.
                  </p>
                  <h1
                    className="collectChartValue"
                    style={{
                      textAlign: 'center',
                      marginTop: 5,
                      textTransform: 'uppercase',
                    }}
                  >
                    {bookingData?.shipperName}
                  </h1>
                  <hr
                    style={{
                      borderTop: '1px dotted',
                      marginTop: 50,
                      marginBottom: 0,
                    }}
                  />
                  <p className="text-center">
                    <b>Signature of Shipper or his Agent</b>
                  </p>
                </div>
              </div>
            </div>
            {/* row item (5) */}
            <div className="collectItemRow collectItemRowFive borderBottom">
              <div className="collectItemLeft borderRight">
                <div className="collectChart">
                  <div style={{ width: '100%' }}>
                    <div
                      style={{ display: 'flex', position: 'relative' }}
                      className="borderBottom totalOtherChargesTotalPrepaid"
                    >
                      {/* grap */}
                      <div
                        className="collectChartBox"
                        style={{
                          display: 'flex',
                          justifyContent: 'center',
                          width: '100%',
                        }}
                      >
                        <span className=" collectChartBoxItem collectChartBoxTotalPrepaid textTitle">
                          Total Prepaid
                        </span>
                        {/*  Total Collect*/}
                        <span className=" collectChartBoxItem collectChartBoxTotalCollect textTitle">
                          Total Collect{' '}
                        </span>
                      </div>
                      <div className="collectChartLeft borderRight">
                        <p className="collectChartValue">
                          {['cif', 'cpt', 'cfr'].includes(
                            bookingData?.incoterms,
                          ) && (
                            <>
                              {isPrintView ? (
                                <>
                                  <div
                                    dangerouslySetInnerHTML={{
                                      __html: htmlContent?.totalPrepaid || '',
                                    }}
                                  ></div>
                                </>
                              ) : (
                                <>
                                  <ReactQuill
                                    value={htmlContent?.totalPrepaid || ''}
                                    onChange={(value) => {
                                      changeHandelar &&
                                        changeHandelar({
                                          key: 'totalPrepaid',
                                          value,
                                        });
                                    }}
                                    modules={{
                                      toolbar: false,
                                    }}
                                    style={{
                                      padding: 0,
                                      margin: 0,
                                    }}
                                  />{' '}
                                </>
                              )}
                            </>
                          )}
                        </p>
                      </div>
                      <div className="collectChartRight">
                        <p className="collectChartValue">
                          {!['cif', 'cpt', 'cfr'].includes(
                            bookingData?.incoterms,
                          ) && (
                            <>
                              {isPrintView ? (
                                <>
                                  <div
                                    dangerouslySetInnerHTML={{
                                      __html: htmlContent?.totalCollect || '',
                                    }}
                                  ></div>
                                </>
                              ) : (
                                <>
                                  <ReactQuill
                                    value={htmlContent?.totalCollect || ''}
                                    onChange={(value) => {
                                      changeHandelar &&
                                        changeHandelar({
                                          key: 'totalCollect',
                                          value,
                                        });
                                    }}
                                    modules={{
                                      toolbar: false,
                                    }}
                                    style={{
                                      padding: 0,
                                      margin: 0,
                                    }}
                                  />{' '}
                                </>
                              )}
                            </>
                          )}
                        </p>
                      </div>
                    </div>
                    <div
                      style={{ display: 'flex', position: 'relative' }}
                      className="currencyConversionRate "
                    >
                      {/* grap */}
                      <div
                        className="collectChartBox"
                        style={{
                          display: 'flex',
                          justifyContent: 'center',
                          width: '100%',
                        }}
                      >
                        <span className=" collectChartBoxItem collectChartBoxCurrencyConversionRate textTitle">
                          Currency Conversion Rate
                        </span>
                        {/* CC charges in dest currency */}
                        <span className=" collectChartBoxItem collectChartBoxCCChargesInDestCurrency textTitle">
                          CC Charges in Dest Currency{' '}
                        </span>
                      </div>
                      <div className="collectChartLeft borderRight">
                        <p className="collectChartValue" />
                      </div>
                      <div className="collectChartRight">
                        <p className="collectChartValue"></p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="collectItemRight" style={{ width: '100%' }}>
                <div
                  className=""
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    gap: 30,
                    marginTop: 5,
                  }}
                >
                  <p>
                    <b>
                      {bookingData?.confirmDate &&
                        moment(bookingData?.confirmDate).format(
                          'DD-MM-YYYY',
                        )}{' '}
                      Dhaka
                    </b>
                  </p>
                  <p>
                    <b>Akij Logistics Limited</b>
                  </p>
                </div>
                <hr
                  style={{
                    borderTop: '1px dotted',
                    marginTop: 25,
                    marginBottom: 0,
                  }}
                />
                <div
                  className="smallTitle"
                  style={{
                    display: 'flex',
                    gap: 10,
                    textTransform: 'uppercase',
                  }}
                >
                  <p>Executed on</p>
                  <p>(Date)</p>
                  <p>at</p>
                  <p>(Place)</p>
                  <p>signature of issuing Carrier or its Agent</p>
                </div>
              </div>
            </div>
            {/* row item (6) */}
            <div className="collectItemRow collectItemRowSix">
              <div className="collectItemLeft borderRight">
                <div className="collectChart">
                  <div style={{ width: '100%' }}>
                    <div
                      style={{ display: 'flex', position: 'relative' }}
                      className="totalOtherChargesChargesAtDestination"
                    >
                      {/* grap */}
                      <div
                        className="collectChartBox"
                        style={{
                          display: 'flex',
                          justifyContent: 'center',
                          width: '100%',
                        }}
                      >
                        <span className=" collectChartBoxItem collectChartBoxChargesAtDestination textTitle">
                          Charges at Destination
                        </span>
                      </div>
                      <div className="collectChartLeft borderRight">
                        <p className="">
                          For Carrier's use only at Destination
                        </p>
                      </div>
                      <div className="collectChartRight">
                        <p className="collectChartValue" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="collectItemRight" style={{ width: '100%' }}>
                <div className="collectChartBox">
                  <span className=" collectChartBoxItem collectChartBoxChargesAtDestination textTitle">
                    Charges at Destination
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <p
        style={{
          textAlign: 'center',
          fontSize: '14px',
          fontWeight: 'bold',
        }}
      >
        {footerText}
      </p>
    </div>
  );
}

const HBLFormatAir = ({
  componentRef,
  bookingData,
  isEPBInvoice,
  htmlContent,
  changeHandelar,
}) => {
  return (
    <div className="hawbWrapper">
      <HBLFormatAirItem
        bookingData={bookingData}
        isEPBInvoice={isEPBInvoice}
        htmlContent={htmlContent}
        changeHandelar={changeHandelar}
      />
      <div className="multipleInvoicePrint" ref={componentRef}>
        {isEPBInvoice ? (
          <HBLFormatAirItem
            footerText=""
            bookingData={bookingData}
            isEPBInvoice={isEPBInvoice}
            htmlContent={htmlContent}
            changeHandelar={changeHandelar}
            isPrintView={true}
          />
        ) : (
          <>
            <HBLFormatAirItem
              footerText=""
              bookingData={bookingData}
              htmlContent={htmlContent}
              changeHandelar={changeHandelar}
              isPrintView={true}
            />
            <div
              style={{
                pageBreakAfter: 'always',
              }}
            ></div>
            <HAWBBackSide />
          </>
        )}
      </div>
    </div>
  );
};

export default HBLFormatAir;

const HAWBBackSide = () => {
  return (
    <div style={{ fontSize: 11 }}>
      <h1 style={{ textAlign: 'center', textDecoration: 'underline' }}>
        {data.title}
      </h1>

      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          width: '100%',
          marginTop: '20px',
        }}
      >
        {/* Left Column */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            width: '48%',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
            }}
          >
            {data.content.slice(0, 6).map((item, index) => (
              <div key={index}>
                {item.content.map((content, i) => (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      gap: '5px',
                      paddingBottom: '5px',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        gap: '5px',
                      }}
                    >
                      {i === 0 && <span>{item?.title}</span>}
                      <span
                        style={{
                          marginLeft:
                            content.title === ''
                              ? '0px'
                              : i === 0
                              ? '10px'
                              : '20px',
                        }}
                      >
                        {' '}
                        {content.title}
                      </span>
                    </div>
                    <span>{content.text}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Right Column */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            width: '48%',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
            }}
          >
            {data.content.slice(6).map((item, index) => (
              <div key={index}>
                {item.content.map((content, i) => (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      gap: '5px',
                      paddingBottom: '5px',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        gap: '5px',
                      }}
                    >
                      {i === 0 && <span>{item?.title}</span>}
                      <span
                        style={{
                          marginLeft:
                            content.title === ''
                              ? '0px'
                              : i === 0
                              ? '5px'
                              : '20px',
                        }}
                      >
                        {' '}
                        {content.title}
                      </span>
                    </div>
                    <span>{content.text}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
const data = {
  title: 'CONDITIONS OF TRADING',
  content: [
    {
      title: '1',
      content: [
        {
          title: '',
          text: `As used in this contract ''air bill'' is equivalent to "air consignment note'' "shipper is equivalent to consignor'' ‘carriage’ is equivalent to transportation'' and carrier includes the issuing agent of this air bill the first air carrier and all air carriers that carry the goods hereunder or perform any other services related to such air carriage. For the purposes or the exemption from all limitation or liability provisions set forth or referred to herein ''Carrier'' includes agents, Servants, or representatives or any such air carrier. Carriage to be performed hereunder by several successive carriers regarded as a single operation.`,
        },
      ],
    },
    {
      title: '2',
      content: [
        {
          title: 'a)',
          text: ` Carriage hereunder is subject to the rules relating to liability established by the convention for the Unification of Certain Rules relating to interna-tional Carriage by Air, signed at Warsaw. October 12, 1929 (hereinafter called "the Convention"), unless such carriage is not "international carriage" as defined by the Convention.`,
        },
        {
          title: 'b)',
          text: ` To the extent not in conflict with the foregoing carriage hereunder and other services performed by each Carrier are subject to (i) applicable laws (including national laws implementing the Convention, government regulations orders, and requirements) (ii) provisions herein set forth, and (iii) applicable tariffs. rules, regulations and timetable (but not the times of departure and arrival therein) of such carrier, which are made part hereof and which may be inspected at any of its offces and at airports formed which it operates regular services.}`,
        },
        {
          title: 'c)',
          text: ` For the purposes of the Convention, the agreed stopping places (which may be altered by Carrier in case of necessity) are those  places, except the place of departure and the place of destination, set forth on the face hereof or shown in Carrier's timetables as scheduled stopping places for the route.`,
        },
        {
          title: 'd)',
          text: ` In the case of carriage subject to the Convention. the shipper acknow-ledges that he has been given as opportunity to make a special declaration of the value of the goods at delivery and that the sum entered on the face of the air hill as "shippar's / consignor’s  declared value-for Carriage, "if in excess oi USD 7.48 U.S Cunency per pound, constitutes such special declaration of value`,
        },
      ],
    },
    {
      title: '3',
      content: [
        {
          title: '',
          text: ` In so far as any provision contained or referred to in this air bill maybe contrary to mandatory law, government regulations. orders orre-quirements such provision shall remain applicable to the extent that it is not overridden thereby. The invalidity of any provision shall not affect any other part hereof.`,
        },
      ],
    },
    {
      title: '4',
      content: [
        {
          title: '',
          text: ` Except as the Convention or other applicable law may otherwise re-quire: ${'\n'}(a) Carrier is not liable to the shipper or to any other person for any damage, delay or loss of whatsoever nature (hereinaftar collectively referred to as ''damage") arising out of or in connection with the carriage of the goods, unless such damage is proved to have been caused‘ by the negligence of Wilful fault of Carrier and there has been no contributory negligence of the shipper, consignee or other claiment: (b) Carrier is not liable for any damage directly or indirectly ansing out of compliance with laws. government regulations. orders or require-ments of from any cause beyond Carrier's control: (c) the charges for carriage having been based upon the value declared by the shipper. it is agreed that any liability shall in no event exceed the shippers declared value for carriage stated on the face hereof. and in the absence of such declaration by shipper, liability of Carrier shall not exceed USD 7.48 U.S. Currecny per pound of goods destroyed, lost, damaged or delayed: all claims shall be subject to proof of value: (d) a carrier issuing an air bill for carriage exclusively over the lines of others does so only as sales agent.`,
        },
      ],
    },
    {
      title: '5',
      content: [
        {
          title: '',
          text: ` It is agreed that no times is fixed for the completion of carriage here under and that Carrier may without notice substitute alternate carriers or aircraft. Carrier assumes, no obligation to carry the goods by any specified air craft or over any particular route or routes of to make connection at any point according to any particular, schedule, and Carrier is hereby authorized to select, or deviate from. the route or routes of shipment, notwithstanding that the same may be stated on the face hereof. The shipper guarantees payment of all charges and advances.`,
        },
      ],
    },
    {
      title: '6',
      content: [
        {
          title: '',
          text: ` The goods or packages said to contain the goods, described on the face hereof are accepted for carriage from their receipt at Carrier's terminal or airport office at the place of departure to the airport at the place of destination. lf so specifically agreed. the goods. or packages  said to contain the goods, described on the face hereof, are also accepted for forwarding to the airport of departure and for reforwarding beyond the airport of destination. If such forwarding or reforwarding is by carriage operated by Carrier, such carriage shall be upon the same terms as to liability as set forth in Paragraphs, 2 and 4 hereof in any other event, the issuing carrier and last carrier, respectively, in forwarding or reforwarding the goods, shall do so only as agents of the shipper owner, or consignee, as the case may be, and shall not be liable for any damage arising out of such additional carriage. unless proved to have been caused by its own negligence or wilful fult. The shipper, owner and consignee hereby authorize such carriers to do all things deemed advisable to effect such forwarding or reforwarding including, bill without limitation, selection of the means of forwarding or refoward-ing and the routes thereof (unless these have been herein specified by the shipper), execution and acceptance of documents of carriage which may include provisions exempting or limiting liability and consign-ing of goods with no declaration of value, not withstanding any decla-ration of value in this air bill.`,
        },
      ],
    },
    {
      title: '7',
      content: [
        {
          title: '',
          text: ` Carrier is authorized (but shall be under no obligation) to advance any duties. taxes or charges and to make any disbursements with respect to the goods, and the shipper. owner and consignee shall be jointly and severally liable for the reimbursement thereof. No Carrier shall be under obligation to incur any expense or to make any advance in connection with the forwarding or reforwarding of the goods except against repayment by the shipper. lf it is necessary to make customs entry of the goods at any place, the goods shall be deemed to be consigned at such, place to the person named on the face hereof as customs consignee or, if no such person be named. to the carrier carrying the goods to such place or to such customs consignee, if any as such carrier may designate.`,
        },
      ],
    },
    {
      title: '8',
      content: [
        {
          title: '',
          text: ` lf the appropriate premium is paid, the goods, covered by this Air Bill are insured on behalf of the shipper, under an open policy in the amount of the Declared Value for Carriage set forth on the face hereof, (recovery being limited to the actual loss or damage) against risks of physical loss or damage from external causes, exception risks excluded by the standard American lnstitute Amended Free of Capture and Seizure clauses and Strike, Riot and Civil Commotion clauses, and subject to the terms and conditions of such open policy, copies of which clauses and open policy are available for inspection by the shipper. Claims should be reported to any office of the carrier.`,
        },
      ],
    },
    {
      title: '9',
      content: [
        {
          title: '',
          text: ` Except as otherwise specifically provided in the contract, delivery of the goods will be made only to the consignee named on the face hereof, unless such consignee is one of the Carriers participating in the carriage, in which event delivery shall be made to the person indicated on the face hereof as the person to the notified. Notice of arrival of the goods will, in the absence of other instructions, be sent to the Consignee, or the person to be notified, by ordinary methods Carrier is not liable for non receipt of such notice.`,
        },
      ],
    },
    {
      title: '10',
      content: [
        {
          title: 'a)',
          text: ` No action shall be maintained in the case of damage to goods unless a written notice, sufficiently describing the goods concerned, the ap-proximate date of the damage. and the details of the claim, is presented to an office of carrier within 7 days from the date of receiptthereof in the case of delay unless presented within 14 days from thedate the goods are placed at the disposal of the person entitled to delivery, and in the case of loss (including non-delivery) unless presented Within 120 days from the date of issue of the air bill.`,
        },
        {
          title: 'b)',
          text: ` Any rights to damages against Carrier shall be extinguished unless an action is brought within two years after the occurrence of the events giving rise to the claim,`,
        },
      ],
    },
    {
      title: '11',
      content: [
        {
          title: '',
          text: `The shipper shall comply with the applicable laws, customs and other goverment regulailons of any country to from through or over which the goods may be carried. including those relating, to the packing carriage or delivery of the goods, and shall furnish such information and attach such documents to this air bill as may be necessary to comply with such laws and regulations. carrier is not liable to the shipper or any other person for losses or expense due in shipper's failure to comply with this provision.`,
        },
      ],
    },
    {
      title: '12',
      content: [
        {
          title: '',
          text: ` No agent servant or representative of Carrier has authority to alter, modify or waive any provision of this contract`,
        },
      ],
    },
  ],
};
