import moment from 'moment';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { getDownlloadFileView_Action } from '../../../../_helper/_redux/Actions';
import './bookingDetailsInfo.css';
import { Collapse } from '@material-ui/core';

function BookingDetailsInfo({ bookingData, billingData }) {
  const [expandedRows, setExpandedRows] = useState([]);
  const handleRowClick = (index) => {
    const currentIndex = expandedRows.indexOf(index);
    const newExpandedRows = [];
    if (currentIndex === -1) {
      newExpandedRows.push(index);
    } else {
      newExpandedRows.splice(currentIndex, 1);
    }
    setExpandedRows(newExpandedRows);
  };
  const dispatch = useDispatch();

  const transportPlanningAir =
    bookingData?.transportPlanning?.find((i) => {
      return i?.transportPlanningModeId === 1;
    }) || '';

  const transportPlanningSea =
    bookingData?.transportPlanning?.find((i) => {
      return i?.transportPlanningModeId === 2;
    }) || '';

  return (
    <div className="BookingDetailsInfo">
      <div className="container mt-4">
        <div className="box-container">
          {/* Shipper Information */}
          <div className="box">
            <h5>Shipper Information</h5>
            <p>
              <strong>Name:</strong> {bookingData?.shipperName}
            </p>
            <p>
              <strong>Country:</strong> {bookingData?.shipperCountry}
            </p>
            <p>
              {' '}
              <strong>State/Province/Region:</strong>{' '}
              {bookingData?.shipperState}
            </p>
            <p>
              {' '}
              <strong>City:</strong> {bookingData?.shipperCity}
            </p>

            <p>
              <strong>Zip/Postal Code:</strong> {bookingData?.shipperPostalCode}
            </p>
            <p>
              <strong>Address:</strong> {bookingData?.shipperAddress}
            </p>
            <p>
              <strong>Contact Person:</strong>{' '}
              {bookingData?.shipperContactPerson}
            </p>
            <p>
              <strong>Contact Number:</strong> {bookingData?.shipperContact}
            </p>
            <p>
              <strong>Email:</strong> {bookingData?.shipperEmail}
            </p>
            <p>
              <strong>Bank:</strong> {bookingData?.shipperBank}
            </p>
            <p>
              <strong>Branch:</strong> {bookingData?.shipperBankBranch}
            </p>
          </div>
          {/* Consignee Information */}
          <div className="box">
            <h5>Consignee Information</h5>
            <p>
              <strong>Name:</strong> {bookingData?.consigneeName}
            </p>
            <p>
              <strong>Country:</strong> {bookingData?.consigCountry}
            </p>
            <p>
              <strong>Division/City:</strong> {bookingData?.consignCity}
            </p>
            <p>
              <strong>State/Province & Postal Code:</strong>{' '}
              {(bookingData?.consigState || '') +
                ' - ' +
                (bookingData?.consigPostalCode || '')}
            </p>
            <p>
              <strong>Address 1:</strong> {bookingData?.consigneeAddress}
            </p>
            <p>
              <strong>Address 2:</strong> {bookingData?.buyerAddress2}
            </p>
            <p>
              <strong>Contact Person:</strong>{' '}
              {bookingData?.consigneeContactPerson}
            </p>
            <p>
              <strong>Contact:</strong> {bookingData?.consigneeContact}
            </p>
            <p>
              <strong>Email:</strong> {bookingData?.consigneeEmail}
            </p>
            <p>
              <strong>Buyer Bank:</strong> {bookingData?.buyerBank}
            </p>
            <p>
              <strong>Bank Address:</strong> {bookingData?.notifyBankAddr}
            </p>
            <p>
              <strong>Delivery Agent:</strong>{' '}
              {bookingData?.freightAgentReference}
            </p>
            <p>
              <strong>Notify Party:</strong> {bookingData?.notifyParty}
            </p>
            <p>
              <strong>Notify Party 2:</strong> {bookingData?.notifyParty2}
            </p>
          </div>

          {/* Reference Document */}
          <div className="box">
            <h5>Reference Document</h5>
            <p>
              <strong>Reference Document Type:</strong>{' '}
              {bookingData?.expCnfType}
            </p>
            <p>
              <strong>
                {bookingData?.expCnfType === 'CNF'
                  ? 'CNF Number'
                  : 'EXP Number'}
                :
              </strong>{' '}
              {bookingData?.expOrCnfNumber}
            </p>
            <p>
              <strong>
                {bookingData?.expCnfType === 'CNF' ? 'CNF Date' : 'EXP Date'}:
              </strong>{' '}
              {moment(bookingData?.expOrCnfDate).isValid() &&
                moment(bookingData?.expOrCnfDate).format('DD MMM YYYY')}
            </p>
            <p>
              <strong>Invoice Number:</strong> {bookingData?.refInvoiceNo}
            </p>
            <p>
              <strong>Invoice Date:</strong>{' '}
              {moment(bookingData?.refInvoiceDate).isValid() &&
                moment(bookingData?.refInvoiceDate).format('DD MMM YYYY')}
            </p>

            <p>
              <strong>Currency:</strong> {bookingData?.currency}
            </p>
            <p>
              <strong>Invoice Value:</strong> {bookingData?.invoiceValue}
            </p>
            <p>
              <strong>Buying House:</strong> {bookingData?.packingListReference}
            </p>
            <p>
              <strong>Shipping Mark:</strong> {bookingData?.shippingMark}
            </p>
            <div className="mt-4">
              <div className="table-responsive">
                <table className="table global-table mt-0">
                  <thead>
                    <tr>
                      <th>SL</th>
                      <th> LC Number </th>
                      <th> LC Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookingData?.objPurchase?.map((item, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{item?.lcnumber}</td>
                        <td>
                          {moment(item?.lcdate).isValid() &&
                            moment(item?.lcdate).format('DD MMM YYYY')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* <p>
              {' '}
              <strong>Buyer PO Number:</strong> {bookingData?.ponumber}
            </p>
            <p>
              <strong>Buyer Name:</strong> {bookingData?.buyerName}
            </p>
            <p>
              <strong>Buyer Email:</strong> {bookingData?.buyerEmail}
            </p>
            <p>
              {' '}
              <strong>Buyer PO Date:</strong>{' '}
              {moment(bookingData?.dateOfRequest).format('DD MMM YYYY')}
            </p>
            <p>
              {' '}
              <strong>Delivery Agent:</strong>{' '}
              {bookingData?.freightAgentReference}
            </p>
            <p>
              <strong>Packing List Reference: </strong>{' '}
              {bookingData?.packingListReference}
            </p>
            <p>
              {' '}
              <strong>Notify Party:</strong> {bookingData?.notifyParty}
            </p>
            <p>
              {' '}
              <strong>Negotiation Party:</strong>{' '}
              {bookingData?.negotiationParty}
            </p> */}
          </div>

          {/* Transport and Route Information */}
          <div className="box">
            <h5>Transport and Route Information</h5>
            <p>
              {' '}
              <strong>Mode of Transport:</strong> {bookingData?.modeOfTransport}
            </p>

            <p>
              <strong>Country of Loading:</strong>{' '}
              {bookingData?.countryOfOrigin}
            </p>
            <p>
              <strong>Place Of Receive: </strong> {bookingData?.originAddress}
            </p>
            <p>
              <strong>Port of Loading (POL):</strong>{' '}
              {bookingData?.portOfLoading}
            </p>
            <p>
              <strong>Port of Discharge (POD):</strong>{' '}
              {bookingData?.portOfDischarge}
            </p>
            <p>
              <strong>Dest. Country:</strong> {bookingData?.fdestCountry}
            </p>

            <p>
              <strong>State/Province/Region: </strong> {bookingData?.fdestState}
            </p>
            <p>
              <strong>City: </strong> {bookingData?.fdestCity}
            </p>
            <p>
              <strong>Zip/Postal Code: </strong> {bookingData?.fdestPostalCode}
            </p>
            <p>
              <strong>Final Destination Address:</strong>{' '}
              {bookingData?.finalDestinationAddress}
            </p>
            <p>
              <strong>Mode of Stuffing:</strong>{' '}
              {bookingData?.modeOfStuffingSeaName}
            </p>
            <p>
              <strong>Mode of Delivery</strong>{' '}
              {bookingData?.modeOfDeliveryName}
            </p>
            <p>
              <strong>Terms of Shipment List:</strong> {bookingData?.incoterms}
            </p>
            <p>
              <strong>Freight Terms:</strong>{' '}
              {bookingData?.freightForwarderTerms}
            </p>
            <p>
              <strong> Type Of Loading:</strong> {bookingData?.typeOfLoading}
            </p>
          </div>
          {/* Additional Servicess */}
          <div className="box">
            <h5>Additional Services</h5>
            <p>
              <strong>Customs Brokerage:</strong>{' '}
              {bookingData?.isCustomsBrokerage ? 'Yes' : 'No'}
            </p>
            <p>
              <strong>Cargo Insurance:</strong>{' '}
              {bookingData?.isCargoInsurance ? 'Yes' : 'No'}
            </p>
            <p>
              <strong>Warehouse Service:</strong>{' '}
              {bookingData?.isWarehouseService ? 'Yes' : 'No'}
            </p>
            <p>
              <strong>Store Rent:</strong>{' '}
              {bookingData?.isStoreRent ? 'Yes' : 'No'}
            </p>
            <p>
              <strong>Haulage/Local Transportation/Pickup Service</strong>{' '}
              {bookingData?.isHaulagePickupService ? 'Yes' : 'No'}
            </p>
            <p>
              <strong>Destination Haulage:</strong>{' '}
              {bookingData?.isDestiontionHaulage ? 'Yes' : 'No'}
            </p>
            <p>
              <strong>Local Transportation:</strong>{' '}
              {bookingData?.isLocalTransportation ? 'Yes' : 'No'}
            </p>
          </div>
          {/* Booking Schedule */}
          <div className="box">
            <h5>Booking Schedule</h5>
            <p>
              <strong>Requested Pickup Date/Expected:</strong>{' '}
              {moment(bookingData?.requestPickupDate).isValid() &&
                moment(bookingData?.requestPickupDate).format('DD MMM YYYY')}
            </p>
            <p>
              <strong>Pickup Place:</strong> {bookingData?.pickupPlace}
            </p>
            <p>
              <strong>Estimated Delivery Date:</strong>{' '}
              {moment(bookingData?.requestDeliveryDate).isValid() &&
                moment(bookingData?.requestDeliveryDate).format('DD MMM YYYY')}
            </p>
          </div>
        </div>
        <div className="box-container">
          {/* Shipment planning sea*/}
          {transportPlanningSea && (
            <>
              <CommonTransportPlanningView
                transportPlanning={transportPlanningSea}
                modeOfTransport="Sea"
              />
            </>
          )}
          {/* Shipment planning air*/}
          {transportPlanningAir && (
            <>
              <CommonTransportPlanningView
                transportPlanning={transportPlanningAir}
                modeOfTransport="Air"
              />
            </>
          )}

          {/* Confirmation Information */}
          <div className="box">
            <h5>Confirmation Information</h5>
            <p>
              <strong>Departure Date & Time:</strong>{' '}
              {moment(bookingData?.departureDateTime).isValid() &&
                moment(bookingData?.departureDateTime).format('DD MMM YYYY')}
            </p>
            <p>
              <strong>Arrival Date & Time:</strong>{' '}
              {moment(bookingData?.arrivalDateTime).isValid() &&
                moment(bookingData?.arrivalDateTime).format('DD MMM YYYY')}
            </p>
            <p>
              <strong>Freight Forwarder Representative:</strong>{' '}
              {bookingData?.primaryContactPerson}
            </p>
            <p>
              <strong>Concern Sales Person:</strong>{' '}
              {bookingData?.concernSalesPerson}
            </p>
            {/* <p>
              <strong>Transport Mode:</strong> {bookingData?.confTransportMode}
            </p> */}
            <p>
              <strong>Warehouse:</strong> {bookingData?.warehouseName}
            </p>
          </div>
        </div>
        {/* Shipment planning 2*/}

        <div className="mt-4">
          {/* Shipping Schedule  table*/}
          {transportPlanningSea && (
            <div>
              <CommonShippingScheduleView
                modeOfTransport="Sea"
                transportPlanning={transportPlanningSea}
              />
            </div>
          )}
          {transportPlanningAir && (
            <div>
              <CommonShippingScheduleView
                modeOfTransport="Air"
                transportPlanning={transportPlanningAir}
              />
            </div>
          )}
        </div>

        {/* Cargo Details */}
        <div className="mt-4">
          <h5>Cargo Information</h5>
          <div className="mt-4">
            <div className="table-responsive" style={{ overflowX: 'auto' }}>
              <table
                className="table global-table mt-0"
                style={{ minWidth: '1600px', width: '100%' }}
              >
                <thead>
                  <tr>
                    <th>SL</th>
                    <th>Type of Cargo</th>
                    <th>Des. of Goods</th>
                    <th>HS Code</th>
                    <th>PO Number</th>
                    <th>Style</th>
                    <th>Color</th>
                    <th>Gross Weight (kg)</th>
                    <th>Net Weight (kg)</th>
                    <th>Volume (CBM)</th>
                    {bookingData?.modeOfTransport === 'Air' && (
                      <th>Volumetric Weight</th>
                    )}
                    <th>Dimensions (Length)</th>
                    <th>Dimensions (Width)</th>
                    <th>Dimensions (Height)</th>
                    <th>Carton</th>
                    <th>Temperature Range</th>
                    <th>Special Handling Ins.</th>
                  </tr>
                </thead>
                <tbody>
                  {bookingData?.rowsData?.map((item, index) => (
                    <React.Fragment key={index}>
                      <tr>
                        <td>{index + 1}</td>
                        <td>{item?.typeOfCargo}</td>
                        <td>{item?.descriptionOfGoods || ''}</td>
                        <td>{item?.hsCode}</td>
                        <td>
                          {item?.dimensionRow
                            ?.map((d) => d?.poNumber)
                            .join(', ')}
                        </td>
                        <td>
                          {item?.dimensionRow?.map((d) => d?.style).join(', ')}
                        </td>
                        <td>
                          {item?.dimensionRow?.map((d) => d?.color).join(', ')}
                        </td>
                        <td>{item?.totalGrossWeightKG}</td>
                        <td>{item?.totalNetWeightKG}</td>
                        <td
                          onClick={() => handleRowClick(index)}
                          style={{
                            color: 'blue',
                            cursor: 'pointer',
                            textDecoration: 'underline',
                          }}
                        >
                          {item?.totalVolumeCBM}
                        </td>
                        {bookingData?.modeOfTransport === 'Air' && (
                          <td
                            onClick={() => handleRowClick(index)}
                            style={{
                              color: 'blue',
                              cursor: 'pointer',
                              textDecoration: 'underline',
                            }}
                          >
                            {item?.totalVolumetricWeight}
                          </td>
                        )}
                        <td
                          onClick={() => handleRowClick(index)}
                          style={{
                            color: 'blue',
                            cursor: 'pointer',
                            textDecoration: 'underline',
                          }}
                        >
                          {item?.totalDimsLength}
                        </td>
                        <td
                          onClick={() => handleRowClick(index)}
                          style={{
                            color: 'blue',
                            cursor: 'pointer',
                            textDecoration: 'underline',
                          }}
                        >
                          {item?.totalDimsWidth}
                        </td>
                        <td
                          onClick={() => handleRowClick(index)}
                          style={{
                            color: 'blue',
                            cursor: 'pointer',
                            textDecoration: 'underline',
                          }}
                        >
                          {item?.totalDimsHeight}
                        </td>
                        <td
                          onClick={() => handleRowClick(index)}
                          style={{
                            color: 'blue',
                            cursor: 'pointer',
                            textDecoration: 'underline',
                          }}
                        >
                          {item?.totalNumberOfPackages}
                        </td>
                        <td>{item?.temperatureRange || 'N/A'}</td>
                        <td>{item?.shInstructionText || 'N/A'}</td>
                      </tr>
                      <tr>
                        <td colSpan={9} />
                        <td
                          colSpan={
                            bookingData?.modeOfTransport === 'Air' ? 6 : 5
                          }
                        >
                          <Collapse
                            in={expandedRows.includes(index)}
                            timeout="auto"
                            unmountOnExit
                          >
                            <div className="table-responsive">
                              <table className="table global-table mt-0">
                                <thead>
                                  <tr>
                                    <td>Per Unit (CBM)</td>
                                    {bookingData?.modeOfTransport === 'Air' && (
                                      <td>Volumetric Weight</td>
                                    )}

                                    <td>Per Unit Length</td>
                                    <td>Per Unit Width</td>
                                    <td>Per Unit Height</td>
                                    <td>Carton</td>
                                  </tr>
                                </thead>
                                <tbody>
                                  {item?.dimensionRow?.map(
                                    (volumeItem, volumeIndex) => (
                                      <tr key={volumeIndex}>
                                        <td>{volumeItem?.volumeCBM}</td>
                                        {bookingData?.modeOfTransport ===
                                          'Air' && (
                                          <td>
                                            {volumeItem?.volumetricWeight}
                                          </td>
                                        )}
                                        <td>{volumeItem?.dimsLength}</td>
                                        <td>{volumeItem?.dimsWidth}</td>
                                        <td>{volumeItem?.dimsHeight}</td>
                                        <td>{volumeItem?.numberOfPackage}</td>
                                      </tr>
                                    ),
                                  )}
                                </tbody>
                              </table>
                            </div>
                          </Collapse>
                        </td>
                      </tr>
                    </React.Fragment>
                  ))}
                  <tr>
                    <td colSpan={7} align="right">
                      <span className="font-bold">Total</span>
                    </td>
                    <td>
                      <span className="font-bold">
                        {bookingData?.rowsData?.reduce(
                          (acc, item) => acc + +item?.totalGrossWeightKG,
                          0,
                        )}
                      </span>
                    </td>
                    <td>
                      <span className="font-bold">
                        {bookingData?.rowsData?.reduce(
                          (acc, item) => acc + +item?.totalNetWeightKG,
                          0,
                        )}
                      </span>
                    </td>
                    <td>
                      <span className="font-bold">
                        {bookingData?.rowsData?.reduce(
                          (acc, item) => acc + +item?.totalVolumeCBM,
                          0,
                        )}
                      </span>
                    </td>
                    {bookingData?.modeOfTransport === 'Air' && (
                      <td>
                        <span className="font-bold">
                          {bookingData?.rowsData?.reduce(
                            (acc, item) => acc + +item?.totalVolumetricWeight,
                            0,
                          )}
                        </span>
                      </td>
                    )}
                    <td>
                      <span className="font-bold">
                        {bookingData?.rowsData?.reduce(
                          (acc, item) => acc + +item?.totalDimsLength,
                          0,
                        )}
                      </span>
                    </td>
                    <td>
                      <span className="font-bold">
                        {bookingData?.rowsData?.reduce(
                          (acc, item) => acc + +item?.totalDimsWidth,
                          0,
                        )}
                      </span>
                    </td>
                    <td>
                      <span className="font-bold">
                        {bookingData?.rowsData?.reduce(
                          (acc, item) => acc + +item?.totalDimsHeight,
                          0,
                        )}
                      </span>
                    </td>
                    <td>
                      <span className="font-bold">
                        {bookingData?.rowsData?.reduce(
                          (acc, item) => acc + +item?.totalNumberOfPackages,
                          0,
                        )}
                      </span>
                    </td>
                    {/* <td>
                                    <span className='font-bold'>{bookingData?.rowsData?.reduce((acc, item) => acc + (+item?.totalPerUnitGrossWeightKG), 0)}</span>
                                </td>
                                <td>
                                    <span className='font-bold'>{bookingData?.rowsData?.reduce((acc, item) => acc + (+item?.totalPerUnitNetWeightKG), 0)}</span>
                                </td> */}
                    <td colSpan={5}></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Documents */}
        <div className="mt-4">
          <h5>Documents</h5>
          <div className="table-responsive">
            <table className="table table-bordered global-table mt-0">
              <thead>
                <tr>
                  <th>SL</th>
                  <th>Document Type</th>
                  <th>Document File ID</th>
                </tr>
              </thead>
              <tbody>
                {bookingData?.documents?.map((doc, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{doc?.documentType}</td>
                    <td>
                      <span
                        onClick={() => {
                          dispatch(
                            getDownlloadFileView_Action(doc?.documentFileId),
                          );
                        }}
                        style={{
                          textDecoration: 'underline',
                          color: 'blue',
                          cursor: 'pointer',
                        }}
                      >
                        {doc?.documentFileId}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {/* Services & Charges  */}
        <div className="row">
          <div className="col-lg-12">
            {' '}
            <h5>Services & Charges</h5>
            <div className="table-responsive">
              <table className="table global-table">
                <thead>
                  <tr>
                    <th rowspan="2">SL</th>
                    <th rowspan="2">Attribute</th>
                    <th colspan="4" class="group-header">
                      Collection <span>(Amounts & Party)</span>
                    </th>
                    <th colspan="4" class="group-header">
                      Payment <span>(Amounts & Party)</span>
                    </th>
                  </tr>
                  <tr>
                    <th
                      style={{
                        width: '60px',
                      }}
                    >
                      Actual Amount
                    </th>
                    <th
                      style={{
                        width: '60px',
                      }}
                    >
                      Dummy Amount
                    </th>
                    <th
                      style={{
                        width: '150px',
                      }}
                    >
                      Party
                    </th>
                    <th
                      style={{
                        width: '150px',
                      }}
                    >
                      Party Name
                    </th>
                    <th
                      style={{
                        width: '60px',
                      }}
                    >
                      Actual Amount
                    </th>
                    <th
                      style={{
                        width: '60px',
                      }}
                    >
                      Dummy Amount
                    </th>
                    <th
                      style={{
                        width: '150px',
                      }}
                    >
                      Party
                    </th>
                    <th
                      style={{
                        width: '150px',
                      }}
                    >
                      Party Name
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {billingData?.map((item, index) => {
                    return (
                      <>
                        <tr>
                          <td>{index + 1}</td>
                          <td>{item?.headOfCharges}</td>

                          <td>{item?.collectionActualAmount}</td>
                          <td>{item?.collectionDummyAmount}</td>
                          <td>{item?.collectionPartyType}</td>
                          <td>{item?.collectionParty}</td>
                          <td>{item?.paymentActualAmount}</td>
                          <td>{item?.paymentDummyAmount}</td>
                          <td>{item?.paymentPartyType}</td>
                          <td>{item?.paymentParty}</td>
                        </tr>
                      </>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookingDetailsInfo;

const CommonTransportPlanningView = ({
  transportPlanning,
  modeOfTransport,
}) => {
  console.log(modeOfTransport, 'modeOfTransport');
  return (
    <>
      <div className="box">
        <h5>Shipment planning ({modeOfTransport === 'Sea' ? 'Sea' : 'Air'})</h5>
        <p>
          <strong>Pickup Location:</strong> {transportPlanning?.pickupLocation}
        </p>
        <p>
          <strong>
            {modeOfTransport === 'Sea' ? 'No of Container:' : 'No of Pallet:'}
          </strong>{' '}
          {modeOfTransport === 'Sea'
            ? transportPlanning?.noOfContainer
            : transportPlanning?.noOfPallets}
        </p>

        <p>
          <strong>
            {modeOfTransport === 'Sea' ? 'Shipping Line:' : 'Air Line:'}
          </strong>{' '}
          {transportPlanning?.airLineOrShippingLine}
        </p>
        <p>
          <strong>GSA:</strong> {transportPlanning?.gsaName}
        </p>
        {modeOfTransport === 'Sea' ? (
          <>
            <p>
              <strong>Vessel Name:</strong> {transportPlanning?.vesselName}
            </p>
            <p>
              <strong>Voyage Number:</strong> {transportPlanning?.voyagaNo}
            </p>
            <p>
              <strong>Estimated Arrival Date & Time:</strong>{' '}
              {transportPlanning?.arrivalDateTime &&
                moment(transportPlanning?.arrivalDateTime).format(
                  'DD MMM YYYY',
                )}
            </p>
            <p>
              <strong>Estimated Berth Date:</strong>{' '}
              {transportPlanning?.berthDate &&
                moment(transportPlanning?.berthDate).format('DD MMM YYYY')}
            </p>
            <p>
              <strong>Estimated Cut Off Date:</strong>{' '}
              {transportPlanning?.cutOffDate &&
                moment(transportPlanning?.cutOffDate).format('DD MMM YYYY')}
            </p>
            <p>
              <strong>Estimated Time Of Depart</strong>{' '}
              {transportPlanning?.estimatedTimeOfDepart &&
                moment(transportPlanning?.estimatedTimeOfDepart).format(
                  'DD MMM YYYY',
                )}
            </p>
          </>
        ) : (
          <>
            <p>
              <strong>IATA Number:</strong> {transportPlanning?.iatanumber}
            </p>
            <p>
              <strong>Carton:</strong> {transportPlanning?.carton}
            </p>
            <p>
              <strong>Estimated Time Of Depart:</strong>{' '}
              {transportPlanning?.estimatedTimeOfDepart &&
                moment(transportPlanning?.estimatedTimeOfDepart).format(
                  'DD MMM YYYY',
                )}
            </p>
          </>
        )}
        <p>
          <strong>S.B No:</strong> {transportPlanning?.strSbNo}
        </p>
        <p>
          <strong>S.B Date:</strong>{' '}
          {transportPlanning?.dteSbDate &&
            moment(transportPlanning?.dteSbDate).format('DD MMM YYYY')}
        </p>
      </div>
    </>
  );
};

const CommonShippingScheduleView = ({ modeOfTransport, transportPlanning }) => {
  return (
    <>
      {modeOfTransport === 'Sea' && (
        <div className="table-responsive">
          <table className="table global-table mt-0">
            <thead>
              <tr>
                <th>SL</th>
                <th>PO Number</th>
                <th>Style</th>
                <th>Color</th>
                <th>Container No</th>
                <th>Seal No</th>
                <th>Container Size</th>
                <th>Rate</th>
                <th>Cartoon Quantity</th>
                <th>CBM</th>
                <th>KGS</th>
              </tr>
            </thead>
            <tbody>
              {transportPlanning?.containerDesc?.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{item?.poNumber}</td>
                  <td>{item?.style}</td>
                  <td>{item?.color}</td>
                  <td>{item?.containerNumber}</td>
                  <td>{item?.sealNumber}</td>
                  <td>{item?.size}</td>
                  <td>{item?.rate}</td>
                  <td>{item?.quantity}</td>
                  <td>{item?.cbm}</td>
                  <td>{item?.kgs}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <h5>Shipping Schedule ({modeOfTransport === 'Sea' ? 'Sea' : 'Air'})</h5>

      <div className="mt-4">
        <div className="table-responsive">
          <table className="table global-table mt-0">
            <thead>
              <tr>
                <th>SL</th>
                <th>From </th>
                <th>To</th>
                <th>
                  {modeOfTransport === 'Sea' ? 'Vessel Name' : 'Flight Number'}
                </th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {transportPlanning?.airTransportRow?.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{item?.fromPort}</td>
                  <td>{item?.toPort}</td>
                  <td>{item?.flightNumber}</td>
                  <td>
                    {moment(item?.flightDate).isValid() &&
                      moment(item?.flightDate).format('DD MMM YYYY')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};
