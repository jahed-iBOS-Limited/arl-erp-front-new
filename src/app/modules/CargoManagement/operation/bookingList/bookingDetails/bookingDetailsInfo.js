import moment from 'moment';
import React from 'react';
import { useDispatch } from 'react-redux';
import { getDownlloadFileView_Action } from '../../../../_helper/_redux/Actions';
import './bookingDetailsInfo.css';

function BookingDetailsInfo({ bookingData, billingData }) {
  const dispatch = useDispatch();
  return (
    <div className="BookingDetailsInfo">
      <div className="container mt-4">
        {/* Shipper and Consignee Information */}
        <div className="box-container">
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
              <strong>Division/City:</strong> {bookingData?.shipperState}
            </p>

            <p>
              <strong>State/Province & Postal Code:</strong>{' '}
              {bookingData?.shipperAddress}
            </p>
            <p>
              <strong>Contact Person:</strong>{' '}
              {bookingData?.shipperContactPerson}
            </p>
            <p>
              <strong>Contact:</strong> {bookingData?.shipperContact}
            </p>
            <p>
              <strong>Email:</strong> {bookingData?.shipperEmail}
            </p>
          </div>
          <div className="box">
            <h5>Consignee Information</h5>
            <p>
              <strong>Name:</strong> {bookingData?.consigneeName}
            </p>
            <p>
              <strong>Country:</strong> {bookingData?.consigCountry}
            </p>
            <p>
              <strong>Division/City:</strong> {bookingData?.consigState}
            </p>
            <p>
              <strong>State/Province & Postal Code:</strong>{' '}
              {bookingData?.consigneeAddress}
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
          </div>

          {/* Reference Document */}
          <div className="box">
            <h5>Reference Document</h5>
            <p>
              <strong>Invoice Value:</strong> {bookingData?.invoiceValue}
            </p>
            <p>
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
            </p>
          </div>

          {/* Transport and Route Information */}
          <div className="box">
            <h5>Transport and Route Information</h5>
            <p>
              {' '}
              <strong>Mode of Transport:</strong> {bookingData?.modeOfTransport}
            </p>
            <p>
              <strong>Type of Loading:</strong> {bookingData?.typeOfLoading}
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
              <strong>Port of Delivery (POD):</strong>{' '}
              {bookingData?.portOfDischarge}
            </p>
            <p>
              <strong>Country:</strong> {bookingData?.fdestCountry}
            </p>

            <p>
              <strong>Division/City: </strong> {bookingData?.fdestState}
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
              <strong>Type Of Loading Qty:</strong>{' '}
              {bookingData?.typeOfLoadingQty}
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
          </div>
          {/* Shipping Schedule */}
          <div className="box">
            <h5>Shipping Schedule</h5>
            <p>
              <strong>Requested Pickup Date:</strong>{' '}
              {moment(bookingData?.requestPickupDate).format('DD MMM YYYY')}
            </p>
            <p>
              <strong>Pickup Place</strong> {bookingData?.pickupPlace}
            </p>
            <p>
              <strong>Estimated Delivery Date:</strong>{' '}
              {moment(bookingData?.requestDeliveryDate).format('DD MMM YYYY')}
            </p>
          </div>
          {/* Confirmation Information */}
          <div className="box">
            <h5>Confirmation Information</h5>
            <p>
              <strong>Departure Date & Time:</strong>{' '}
              {moment(bookingData?.departureDateTime).isValid() && moment(bookingData?.departureDateTime).format('DD MMM YYYY')}
            </p>
            <p>
              <strong>Arrival Date & Time:</strong>{' '}
              {moment(bookingData?.arrivalDateTime).isValid() && moment(bookingData?.arrivalDateTime).format('DD MMM YYYY')}
            </p>
            <p>
              <strong>Freight Forwarder Representative:</strong>{' '}
              {bookingData?.primaryContactPerson}
            </p>
            <p>
              <strong>Concern Sales Person:</strong>{' '}
              {bookingData?.concernSalesPerson}
            </p>
            <p>
              <strong>Transport Mode:</strong>{' '}
              {bookingData?.confTransportMode}
            </p>
            <p>
              <strong>Warehouse:</strong>{' '}
              {bookingData?.warehouseName}
            </p>
          </div>

        </div>
        {/* Shipment planning */}
        <div className="mt-4">
          <h5>Shipment planning</h5>
          <p>
            <strong>Pickup Location:</strong>{' '}
            {bookingData?.transportPlanning?.pickupLocation}
          </p>
          <p>
            <strong>
              {
                bookingData?.modeOfTransport === 'Sea' ? 'No of Container:' : 'No of Pallet:'
              }

            </strong>{' '}
            {
              bookingData?.modeOfTransport === 'Sea' ? bookingData?.transportPlanning?.noOfContainer :
                bookingData?.transportPlanning?.noOfPallets}
          </p>

          <p>
            <strong>
              {
                bookingData?.modeOfTransport === 'Sea' ? 'Shipping Line:' : 'Air Line:'
              }
            </strong>{' '}
            {bookingData?.transportPlanning?.airLineOrShippingLine}
          </p>
          <p>
            <strong>GSA:</strong>{' '}
            {bookingData?.transportPlanning?.gsaName}
          </p>
          {
            bookingData?.modeOfTransport === 'Sea' ? (
              <>
                <p>
                  <strong>Vessel Name:</strong>{' '}
                  {bookingData?.transportPlanning?.vesselName}
                </p>
                <p>
                  <strong>Voyage Number:</strong>{' '}
                  {bookingData?.transportPlanning?.voyagaNo}
                </p>
                <p>
                  <strong>Estimated Arrival Date & Time:</strong>{' '}
                  {moment(bookingData?.transportPlanning?.arrivalDateTime).isValid() && moment(bookingData?.transportPlanning?.arrivalDateTime).format('DD MMM YYYY')}

                </p>
                <p>
                  <strong>Estimated Berth Date:</strong>{' '}
                  {moment(bookingData?.transportPlanning?.berthDate).isValid() && moment(bookingData?.transportPlanning?.berthDate).format('DD MMM YYYY')}

                </p>
                <p>
                  <strong>Estimated Cut Off Date:</strong>{' '}
                  {moment(bookingData?.transportPlanning?.cutOffDate).isValid() && moment(bookingData?.transportPlanning?.cutOffDate).format('DD MMM YYYY')}

                </p>
                <p>
                  <strong>Estimated Time Of Depart</strong>{' '}
                  {moment(bookingData?.transportPlanning?.estimatedTimeOfDepart).isValid() && moment(bookingData?.transportPlanning?.estimatedTimeOfDepart).format('DD MMM YYYY')}

                </p>

              </>
            ) : (
              <>
                <p>
                  <strong>IATA Number:</strong>{' '}
                  {bookingData?.transportPlanning?.iatanumber}

                </p>
                <p>
                  <strong>Carton:</strong>{' '}
                  {bookingData?.transportPlanning?.carton}
                </p>
                <p>
                  <strong>Estimated Time Of Depart:</strong>{' '}
                  {moment(bookingData?.transportPlanning?.estimatedTimeOfDepart).isValid() && moment(bookingData?.transportPlanning?.estimatedTimeOfDepart).format('DD MMM YYYY')}
                </p>
              </>
            )
          }
          <p>
            <strong>S.B No:</strong>{' '}
            {bookingData?.transportPlanning?.strSbNo}
          </p>
          <p>
            <strong>S.B Date:</strong>{' '}
            {moment(bookingData?.transportPlanning?.dteSbDate).isValid() && moment(bookingData?.transportPlanning?.dteSbDate).format('DD MMM YYYY')}
          </p>
          {
            bookingData?.modeOfTransport === 'Sea' && (
              <>
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
                      {
                        bookingData?.transportPlanning?.containerDesc?.map((item, index) => (
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
                        ))
                      }
                    </tbody>
                  </table>
                </div>

              </>
            )
          }
          {/* Shipping Schedule  table*/}
          <div className="mt-4">
            <div className="table-responsive">
              <table className="table global-table mt-0">
                <thead>
                  <tr>
                    <th>SL</th>
                    <th>From </th>
                    <th>To</th>
                    <th>
                      {
                        bookingData?.modeOfTransport === 'Sea' ? 'Vessel Name' : 'Flight Number'
                      }
                    </th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    bookingData?.transportPlanning?.airTransportRow?.map((item, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{item?.fromPort}</td>
                        <td>{item?.toPort}</td>
                        <td>{item?.flightNumber}</td>
                        <td>{moment(item?.flightDate).isValid() && moment(item?.flightDate).format('DD MMM YYYY')}</td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>
            </div>
          </div>


        </div>
        {/* Cargo Details */}
        <div className="mt-4">
          <h5>Cargo Information</h5>
          <div className="table-responsive">
            <table className="table table-striped global-table mt-0">
              <thead>
                <tr>
                  <th>SL</th>
                  <th>Cargo Type</th>

                  <th>HS Code</th>
                  <th>Total Number Of Packages</th>
                  <th>Per Unit Gross Weight (kg)</th>
                  <th>Per Unit Net Weight (kg)</th>
                  <th>Gross Weight (KG)</th>
                  <th>Net Weight (KG)</th>
                  <th>Volume (CBM)</th>
                  <th>Temperature Range</th>

                  <th>Special Handling Instructions</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                {bookingData?.rowsData?.map((row, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{row?.typeOfCargo}</td>
                    <td>{row?.hsCode}</td>
                    <td>{row?.totalNumberOfPackages}</td>
                    <td>{row?.totalPerUnitGrossWeightKG}</td>
                    <td>{row?.totalPerUnitNetWeightKG}</td>
                    <td>{row?.totalGrossWeightKG}</td>
                    <td>{row?.totalNetWeightKG}</td>
                    <td>{row?.totalVolumeCBM}</td>

                    <td>{row?.temperatureRange || 'N/A'}</td>

                    <td>{row?.shInstructionText || 'N/A'}</td>
                    <td>{row?.descriptionOfGoods}</td>
                  </tr>
                ))}
              </tbody>
            </table>
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
                        width: "60px",
                      }}
                    >
                      Actual Amount
                    </th>
                    <th
                      style={{
                        width: "60px",
                      }}
                    >
                      Dummy Amount
                    </th>
                    <th
                      style={{
                        width: "150px",
                      }}
                    >
                      Party
                    </th>
                    <th
                      style={{
                        width: "150px",
                      }}
                    >
                      Party Name
                    </th>
                    <th
                      style={{
                        width: "60px",
                      }}
                    >
                      Actual Amount
                    </th>
                    <th
                      style={{
                        width: "60px",
                      }}
                    >
                      Dummy Amount
                    </th>
                    <th
                      style={{
                        width: "150px",
                      }}
                    >
                      Party
                    </th>
                    <th
                      style={{
                        width: "150px",
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

                          <td>
                            {item?.collectionActualAmount}
                          </td>
                          <td>
                            {item?.collectionDummyAmount}
                          </td>
                          <td>
                            {item?.collectionPartyType}
                          </td>
                          <td>
                            {item?.collectionParty}
                          </td>
                          <td>
                            {item?.paymentActualAmount}
                          </td>
                          <td>
                            {item?.paymentDummyAmount}
                          </td>
                          <td>
                            {item?.paymentPartyType}
                          </td>
                          <td>
                            {item?.paymentParty}
                          </td>


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
