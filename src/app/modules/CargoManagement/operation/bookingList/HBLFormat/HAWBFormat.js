import moment from 'moment';
import React from 'react';
import './HAWBFormat.css';
import logisticsLogo from './logisticsLogo.png';
function NewHBLFormatAirItem({ bookingData, footerText, isEPBInvoice }) {
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
                <p>{bookingData?.shipperName}</p>
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
                <p>{bookingData?.consigneeName}</p>
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
                <p>TO THE ORDER OF</p>
                <p>
                  {bookingData?.notifyParty}
                  <br />
                  {bookingData?.notifyPartyAddress}
                </p>
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
                    I.A.T.A Code{' '}
                    {bookingData?.transportPlanning?.map((item, index) => {
                      return (
                        <>
                          {item?.iatanumber}
                          {index < bookingData?.transportPlanning?.length - 1
                            ? ','
                            : ''}
                        </>
                      );
                    })}
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
                <p>
                  {bookingData?.transportPlanning?.map((item, index) => {
                    return (
                      <>
                        {item?.pickupLocation}
                        {index < bookingData?.transportPlanning?.length - 1
                          ? ','
                          : ''}
                      </>
                    );
                  }) || ''}
                </p>
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
                    <div className="air-flight-info">
                      <div className="air-flight-catagory">
                        <p className="borderBottom textTitle">WT/VAL</p>
                        <div style={{ display: 'flex', height: '100%' }}>
                          <p className="borderRight textTitle">PPD</p>
                          <p className="textTitle">CCX</p>
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
                        <p className="borderRight textTitle">PPD</p>
                        <p className="textTitle">CCX</p>
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
                        {bookingData?.transportPlanning
                          ?.map((item) => item?.airLineOrShippingLine)
                          .join(' - ')}
                      </p>
                    </b>
                  </p>
                </div>
                <div style={{ width: '50%' }}>
                  <div style={{ display: 'flex', height: '100%' }}>
                    <div className="borderRight" style={{ width: '50%' }}>
                      <p className="textTitle ">Flight/Date</p>
                      {bookingData?.transportPlanning
                        ?.map((item) => {
                          return item?.estimatedTimeOfDepart
                            ? moment(item?.estimatedTimeOfDepart).format(
                                'DD.MM.YYYY',
                              )
                            : '';
                        })
                        .join(' - ')}
                    </div>
                    <div className="" style={{ width: '50%' }}>
                      <p className="textTitle ">Flight/Date</p>

                      <p className="medium-font">
                        {bookingData?.transportPlanning
                          ?.map((item) => {
                            return item?.arrivalDateTime
                              ? moment(item?.arrivalDateTime).format(
                                  'DD.MM.YYYY',
                                )
                              : '';
                          })
                          .join(' - ')}
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
                  <p>
                    {bookingData?.rowsData?.reduce(
                      (acc, item) => acc + (+item?.totalNumberOfPackages || 0),
                      0,
                    )}
                  </p>
                  <p
                    style={{
                      position: 'absolute',
                      left: '2px',
                      top: '50px',
                      width: '104px',
                      textDecoration: 'underline',
                    }}
                  >
                    Shipping Marks:
                  </p>
                </div>
                <div className="grossWeight borderRight">
                  <p>
                    {bookingData?.rowsData?.reduce(
                      (acc, item) => acc + (+item?.totalGrossWeightKG || 0),
                      0,
                    )}{' '}
                    KG
                  </p>
                </div>
                <div className="kgIB borderRight">
                  <p />
                </div>
                <div className="chargeableWeight borderRight">
                  <p>
                    {bookingData?.rowsData?.reduce(
                      (acc, item) => acc + (+item?.totalGrossWeightKG || 0),
                      0,
                    )}{' '}
                    KG
                  </p>
                </div>
                <div className="rateAndCharge borderRight">
                  <p />
                </div>
                <div className="total borderRight">
                  <p />
                </div>
                <div className="natureandQuantityofGoods">
                  <p style={{ textDecoration: 'underline' }}>
                    DESCRIPTION OF GOODS :
                  </p>
                  <p>
                    {bookingData?.rowsData?.map((item, index) => {
                      return `${item?.descriptionOfGoods}${
                        index < bookingData?.rowsData?.length - 1 ? ',' : ''
                      }`;
                    })}
                  </p>
                  <p />
                  <br />
                  <p>Invoice No: {bookingData?.invoiceNumber}</p>
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
                  <p>
                    H.S Code:{' '}
                    <>
                      {bookingData?.rowsData?.map((item, index) => {
                        return `${item?.hsCode || ''}${
                          index < bookingData?.rowsData?.length - 1 ? ',' : ''
                        }`;
                      })}
                    </>
                  </p>
                  <p>Stuffing mode: {bookingData?.modeOfStuffings}</p>

                  <br />
                  <p>
                    Dimn:{' '}
                    <>
                      {bookingData?.rowsData?.reduce(
                        (acc, item) => acc + (+item?.totalDimsHeight || 0),
                        0,
                      )}{' '}
                      x{' '}
                      {bookingData?.rowsData?.reduce(
                        (acc, item) => acc + (+item?.totalDimsWidth || 0),
                        0,
                      )}{' '}
                      x{' '}
                      {bookingData?.rowsData?.reduce(
                        (acc, item) => acc + (+item?.totalDimsLength || 0),
                        0,
                      )}
                      <br />
                      Total CBM :{' '}
                      {bookingData?.rowsData?.reduce(
                        (acc, item) => acc + (+item?.totalVolumeCBM || 0),
                        0,
                      )}
                    </>
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
                    {['cif', 'cpt', 'cfr'].includes(bookingData?.incoterms) &&
                      'As Agreed'}
                  </div>
                  <div className="collectChartRight">
                    <p className="collectChartValue">
                      {!['cif', 'cpt', 'cfr'].includes(
                        bookingData?.incoterms,
                      ) && 'As Agreed'}
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
                    <p className="collectChartValue" />
                  </div>
                  <div className="collectChartRight">
                    <p className="collectChartValue" />
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
                      {['cif', 'cpt', 'cfr'].includes(bookingData?.incoterms) &&
                        'As Agreed'}
                    </p>
                  </div>
                  <div className="collectChartRight">
                    <p className="collectChartValue">
                      {!['cif', 'cpt', 'cfr'].includes(
                        bookingData?.incoterms,
                      ) && 'As Agreed'}
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
                        <p className="collectChartValue" />
                      </div>
                      <div className="collectChartRight">
                        <p className="collectChartValue" />
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
                          ) && 'As Agreed'}
                        </p>
                      </div>
                      <div className="collectChartRight">
                        <p className="collectChartValue">
                          {!['cif', 'cpt', 'cfr'].includes(
                            bookingData?.incoterms,
                          ) && 'As Agreed'}
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
                          ) && 'As Agreed'}
                        </p>
                      </div>
                      <div className="collectChartRight">
                        <p className="collectChartValue">
                          {!['cif', 'cpt', 'cfr'].includes(
                            bookingData?.incoterms,
                          ) && 'As Agreed'}
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
                        <p className="collectChartValue" />
                      </div>
                      <div className="collectChartRight">
                        <p className="collectChartValue" />
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
                    <b>AKIJ iBOS Limited</b>
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

const NewHBLFormatAir = ({ componentRef, bookingData, isEPBInvoice }) => {
  console.log(isEPBInvoice, 'isEPBInvoice new');
  return (
    <div className="hawbWrapper">
      <NewHBLFormatAirItem
        bookingData={bookingData}
        isEPBInvoice={isEPBInvoice}
      />
      <div className="multipleInvoicePrint" ref={componentRef}>
        {isEPBInvoice ? (
          <NewHBLFormatAirItem
            footerText=""
            bookingData={bookingData}
            isEPBInvoice={isEPBInvoice}
          />
        ) : (
          <>
            <NewHBLFormatAirItem
              footerText=""
              bookingData={bookingData}
            />

          </>
        )}
      </div>
    </div>
  );
};

export default NewHBLFormatAir;
