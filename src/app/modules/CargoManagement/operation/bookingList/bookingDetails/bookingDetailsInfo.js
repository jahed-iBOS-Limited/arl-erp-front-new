import moment from 'moment';
import React from 'react'
import { useDispatch } from 'react-redux';
import { getDownlloadFileView_Action } from '../../../../_helper/_redux/Actions';

function BookingDetailsInfo({
    bookingData,
    
}) {
    const dispatch = useDispatch();
  return (
    <div>
       <div className="container mt-4">
        {/* Shipper and Consignee Information */}
        <div className="row">
          <div className="col-md-6">
            <h5>Shipper Information</h5>
            <p>
              <strong>Name:</strong> {bookingData?.shipperName}
            </p>
            <p>
              <strong>Address:</strong> {bookingData?.shipperAddress}
            </p>
            <p>
              <strong>Contact Person:</strong>{" "}
              {bookingData?.shipperContactPerson}
            </p>
            <p>
              <strong>Contact:</strong> {bookingData?.shipperContact}
            </p>
            <p>
              <strong>Email:</strong> {bookingData?.shipperEmail}
            </p>
          </div>
          <div className="col-md-6">
            <h5>Consignee Information</h5>
            <p>
              <strong>Name:</strong> {bookingData?.consigneeName}
            </p>
            <p>
              <strong>Address:</strong> {bookingData?.consigneeAddress}
            </p>
            <p>
              <strong>Contact Person:</strong>{" "}
              {bookingData?.consigneeContactPerson}
            </p>
            <p>
              <strong>Contact:</strong> {bookingData?.consigneeContact}
            </p>
            <p>
              <strong>Email:</strong> {bookingData?.consigneeEmail}
            </p>
          </div>
        </div>

        {/* Freight Information */}
        <div className="row mt-3">
          <div className="col-md-6">
            <h5>Freight Information</h5>
            <p>
              <strong>Port of Loading:</strong> {bookingData?.portOfLoading}
            </p>
            <p>
              <strong>Port of Discharge:</strong> {bookingData?.portOfDischarge}
            </p>
            <p>
              <strong>Origin Address:</strong> {bookingData?.originAddress}
            </p>
            <p>
              <strong>Final Destination:</strong>{" "}
              {bookingData?.finalDestinationAddress}
            </p>
            <p>
              <strong>Freight Charge:</strong> {bookingData?.freightCharge}
            </p>
            <p>
              <strong>Additional Charge:</strong>{" "}
              {bookingData?.additionalCharge}
            </p>
          </div>
          <div className="col-md-6">
            <h5>Service Information</h5>
            <p>
              <strong>Customs Brokerage:</strong>{" "}
              {bookingData?.isCustomsBrokerage ? "Yes" : "No"}
            </p>
            <p>
              <strong>Cargo Insurance:</strong>{" "}
              {bookingData?.isCargoInsurance ? "Yes" : "No"}
            </p>
            <p>
              <strong>Warehouse Service:</strong>{" "}
              {bookingData?.isWarehouseService ? "Yes" : "No"}
            </p>
            <p>
              <strong>Distribution Delivery:</strong>{" "}
              {bookingData?.isDistributionDelivery ? "Yes" : "No"}
            </p>
          </div>
        </div>
        {/* Confirm Booking */}
        <div className="row mt-3">
          <div className="col-md-6">
            <h5>Confirm Booking</h5>
            <p>
              <strong>Booking Amount:</strong> {bookingData?.bookingAmount}
            </p>
            <p>
              <strong>Air Waybill (AWB) Number:</strong>{" "}
              {bookingData?.awbnumber}
            </p>
            <p>
              <strong>Departure Date & Time:</strong>{" "}
              {moment(bookingData?.departureDateTime).format(
                "YYYY-MM-DD HH:mm"
              )}
            </p>
            <p>
              <strong>Arrival Date & Time:</strong>{" "}
              {moment(bookingData?.arrivalDateTime).format("YYYY-MM-DD HH:mm")}
            </p>
            <p>
              <strong>Flight Number:</strong> {bookingData?.flightNumber}
            </p>
            <p>
              <strong>Transit Information:</strong> {bookingData?.transitInfo}
            </p>
            <p>
              <strong>Freight Forwarder Representative:</strong>{" "}
              {bookingData?.primaryContactPerson}
            </p>
          </div>
        </div>

        {/* Cargo Details */}
        <div className="mt-4">
          <h5>Cargo Information</h5>
          <div className="table-responsive">
            <table className="table table-striped global-table">
              <thead>
                <tr>
                  <th>SL</th>
                  <th>Description</th>
                  <th>HS Code</th>
                  <th>Packages</th>
                  <th>Gross Weight (KG)</th>
                  <th>Net Weight (KG)</th>
                  <th>Volume (CBM)</th>
                  <th>Packaging Type</th>
                  <th>Is Temperature Controlled</th>
                  <th>Temperature Range</th>
                  <th>Is Special Handling Instructions</th>
                  <th>Special Handling Instructions</th>
                </tr>
              </thead>
              <tbody>
                {bookingData?.rowsData?.map((row, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{row?.descriptionOfGoods}</td>
                    <td>{row?.hsCode}</td>
                    <td>{row?.numberOfPackages}</td>
                    <td>{row?.grossWeightKG}</td>
                    <td>{row?.netWeightKG}</td>
                    <td>{row?.volumeCBM}</td>
                    <td>{row?.typeOfPackaging}</td>
                    <td>{row?.isTemperatureControl ? "Yes" : "No"}</td>
                    <td>{row?.temperatureRange}</td>
                    <td>{row?.isSHInstruction ? "Yes" : "No"}</td>
                    <td>{row?.shInstructionText}</td>
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
            <table className="table table-bordered global-table">
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
                            getDownlloadFileView_Action(doc?.documentFileId)
                          );
                        }}
                        style={{
                          textDecoration: "underline",
                          color: "blue",
                          cursor: "pointer",
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
            {" "}
            <h5>Services & Charges</h5>
            <div className="table-responsive">
              <table className="table global-table">
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
      </div>
    </div>
  )
}

export default BookingDetailsInfo
