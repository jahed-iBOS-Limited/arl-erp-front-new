import moment from 'moment';
import React from 'react';
import { useDispatch } from 'react-redux';
import { getDownlloadFileView_Action } from '../../../../_helper/_redux/Actions';
import './bookingDetailsInfo.css';

function BookingDetailsInfo({ bookingData }) {
  console.log(bookingData);
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

          {/* Billing and Payment Terms */}
          <div className="box">
            <h5>Billing and Payment Terms</h5>
            <p>
              <strong>Country: </strong> {bookingData?.billCountry}
            </p>
            <p>
              {' '}
              <strong>Division/City:</strong> {bookingData?.billState}
            </p>
            <p>
              <strong>Billing Address:</strong> {bookingData?.billingAddress}
            </p>
            <p>
              <strong>Country:</strong> {bookingData?.billCountry}
            </p>
            <p>
              <strong>Division/City:</strong> {bookingData?.billState}
            </p>
            <p>
              <strong>Currency:</strong> {bookingData?.currency}
            </p>
            <p>
              <strong>Payment Terms:</strong> {bookingData?.paymentTerms}
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

          {/* Transport Booking */}
          <div className="box">
            <h5>Transport Booking</h5>
            <p>
              <strong>Pickup Loaction: </strong>{' '}
              {bookingData?.transportPlanning?.pickupLocation}
            </p>
            <p>
              <strong>Estimated Pickup Date:</strong>{' '}
              {moment(bookingData?.transportPlanning?.stuffingDate).format(
                'DD MMM YYYY',
              )}
            </p>
            <p>
              <strong>Vehicle Info:</strong>{' '}
              {bookingData?.transportPlanning?.vehicleInfo}
            </p>
            {bookingData?.transportPlanning?.modeOfTransport === 'Air' && (
              <>
                <p>
                  <strong>No of Pallet</strong> :{' '}
                  {bookingData?.transportPlanning?.noOfPallets}
                </p>
                <p>
                  <strong>Air Line:</strong>{' '}
                  {bookingData?.transportPlanning?.airLineOrShippingLine}
                </p>
                <p>
                  <strong>Carton:</strong>{' '}
                  {bookingData?.transportPlanning?.carton}
                </p>
              </>
            )}
            {bookingData?.transportPlanning?.modeOfTransport === 'Sea' && (
              <>
                <p>
                  <strong>Continer: </strong>{' '}
                  {bookingData?.transportPlanning?.noOfContainer}
                </p>
                <p>
                  <strong>Shipping Line:</strong>{' '}
                  {bookingData?.transportPlanning?.airLineOrShippingLine}
                </p>
                <p>
                  <strong>Vessel Name:</strong>{' '}
                  {bookingData?.transportPlanning?.vesselName}
                </p>
              </>
            )}
            <p>
              <strong>Estimated Departure Date & Time:</strong>{' '}
              {moment(bookingData?.transportPlanning?.departureDateTime).format(
                'DD MMM YYYY HH:mm A',
              )}
            </p>
            <p>
              <strong>Estimated Arrival Date & Time:</strong>{' '}
              {moment(bookingData?.transportPlanning?.arrivalDateTime).format(
                'DD MMM YYYY HH:mm A',
              )}
            </p>
            <p>
              <strong>Transport Mode:</strong>{' '}
              {bookingData?.transportPlanning?.transportMode}
            </p>
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
              <table className="table global-table mt-0">
                <thead>
                  <tr>
                    <th className="p-0">SL</th>
                    <th className="p-0">Attribute</th>
                    <th className="p-0">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {bookingData?.billingData?.map((item, index) => (
                    <tr key={index}>
                      <td> {index + 1} </td>
                      <td className="align-middle">
                        <label>{item?.headOfCharges}</label>
                      </td>
                      <td>{item?.chargeAmount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        {/* stages */}
        <div className="mt-4">
          {' '}
          <h5>Stages</h5>
          <div className="table-responsive">
            <table className="table table-striped global-table mt-0">
              <thead>
                <tr>
                  <th>Pending</th>
                  <th>Confirmed</th>
                  <th>Stuffing</th>
                  <th>Received</th>
                  <th>Transport</th>
                  <th>BL</th>
                  <th>HBL</th>
                  <th>Charges</th>
                  <th>Document Checklist</th>
                  <th>Dispatch</th>
                  <th>Customs Clear</th>
                  <th>In Transit</th>
                  <th>Dest Port Receive</th>
                  <th>Delivered</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    {bookingData?.createdAt &&
                      moment(bookingData?.createdAt).format('DD MMM YYYY')}
                  </td>
                  <td>
                    {' '}
                    {bookingData?.confirmDate
                      ? moment(bookingData?.confirmDate).format('DD MMM YYYY')
                      : 'Not Confirmed  '}{' '}
                  </td>
                  <td>
                    {' '}
                    {bookingData?.stuffingDate
                      ? moment(bookingData?.stuffingDate).format('DD MMM YYYY')
                      : 'Not Picked Up  '}{' '}
                  </td>
                  <td>
                    {' '}
                    {bookingData?.receivedDate
                      ? moment(bookingData?.receivedDate).format('DD MMM YYYY')
                      : 'Not Received  '}{' '}
                  </td>
                  <td> N/A </td>
                  <td>
                    {' '}
                    {bookingData?.bldate &&
                      moment(bookingData?.bldate).format('DD MMM YYYY')}{' '}
                  </td>
                  <td>
                    {' '}
                    {bookingData?.hbldate &&
                      moment(bookingData?.hbldate).format('DD MMM YYYY')}{' '}
                  </td>
                  <td>
                    {' '}
                    {bookingData?.isCharges ? 'Completed' : 'Incomplete'}{' '}
                  </td>
                  <td>
                    {' '}
                    {bookingData?.isDocumentChecklist
                      ? 'Completed'
                      : 'Incomplete'}{' '}
                  </td>
                  <td>
                    {' '}
                    {bookingData?.dispatchDate
                      ? moment(bookingData?.dispatchDate).format('DD MMM YYYY')
                      : 'Not Dispatched  '}{' '}
                  </td>
                  <td>
                    {' '}
                    {bookingData?.customsClearDt
                      ? moment(bookingData?.customsClearDt).format(
                          'DD MMM YYYY',
                        )
                      : 'Not Cleared  '}{' '}
                  </td>
                  <td>
                    {' '}
                    {bookingData?.isInTransit ? 'Completed' : 'Incomplete'}{' '}
                  </td>
                  <td>
                    {' '}
                    {bookingData?.destPortReceiveDt
                      ? moment(bookingData?.destPortReceiveDt).format(
                          'DD MMM YYYY',
                        )
                      : 'Not Received  '}{' '}
                  </td>
                  <td>
                    {' '}
                    {bookingData?.buyerReceiveDt
                      ? moment(bookingData?.buyerReceiveDt).format(
                          'DD MMM YYYY',
                        )
                      : 'Not Delivered  '}{' '}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        {/* container desc table*/}
        <div className="mt-4">
          {' '}
          <h5>Container Description</h5>
          <div className="table-responsive">
            <table className="table table-striped global-table mt-0">
              <thead>
                <tr>
                  <th>SL</th>
                  <th>Container Number</th>
                  <th>Seal Number</th>
                  <th>Size</th>
                  <th>Quantity</th>
                  <th>CBM</th>
                  <th>KGS</th>
                </tr>
              </thead>
              <tbody>
                {bookingData?.transportPlanning?.containerDesc?.map(
                  (item, index) => (
                    <tr key={index}>
                      <td> {index + 1} </td>
                      <td>{item?.containerNumber}</td>
                      <td>{item?.sealNumber}</td>
                      <td>{item?.size}</td>
                      <td>{item?.quantity}</td>
                      <td>{item?.cbm}</td>
                      <td>{item?.kgs}</td>
                    </tr>
                  ),
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookingDetailsInfo;
