import moment from "moment";
import React from "react";
import { useDispatch } from "react-redux";
import "./bookingDetailsInfo.css";
import { getDownlloadFileView_Action } from "../../../../_helper/_redux/Actions";

function BookingDetailsInfo({ bookingData }) {
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
              {" "}
              <strong>Division/City:</strong> {bookingData?.shipperState}
            </p>

            <p>
              <strong>State/Province & Postal Code:</strong>{" "}
              {bookingData?.shipperAddress}
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
              <strong>State/Province & Postal Code:</strong>{" "}
              {bookingData?.consigneeAddress}
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

          {/* Reference Document */}
          <div className="box">
            <h5>Reference Document</h5>
            <p>
              <strong>Invoice Value:</strong> {bookingData?.invoiceValue}
            </p>
            <p>
              {" "}
              <strong>Buyer PO Number:</strong> {bookingData?.ponumber}
            </p>
            <p>
              {" "}
              <strong>Buyer PO Date:</strong>{" "}
              {moment(bookingData?.dateOfRequest).format("YYYY-MM-DD")}
            </p>
            <p>
              {" "}
              <strong>Delivery Agent:</strong>{" "}
              {bookingData?.freightAgentReference}
            </p>
            <p>
              <strong>Packing List Reference: </strong>{" "}
              {bookingData?.packingListReference}
            </p>
            <p>
              {" "}
              <strong>Notify Party:</strong> {bookingData?.notifyParty}
            </p>
            <p>
              {" "}
              <strong>Negotiation Party:</strong>{" "}
              {bookingData?.negotiationParty}
            </p>
          </div>

          {/* Transport and Route Information */}
          <div className="box">
            <h5>Transport and Route Information</h5>
            <p>
              {" "}
              <strong>Mode of Transport:</strong> {bookingData?.modeOfTransport}
            </p>
            <p>
              <strong>Country of Loading:</strong>{" "}
              {bookingData?.countryOfOrigin}
            </p>
            <p>
              <strong>Place Of Receive: </strong> {bookingData?.originAddress}
            </p>
            <p>
              <strong>Port of Loading (POL):</strong>{" "}
              {bookingData?.portOfLoading}
            </p>
            <p>
              <strong>Port of Delivery (POD):</strong>{" "}
              {bookingData?.portOfDischarge}
            </p>
            <p>
              <strong>Country:</strong> {bookingData?.fdestCountry}
            </p>

            <p>
              <strong>Division/City: </strong> {bookingData?.fdestState}
            </p>
            <p>
              <strong>Final Destination Address:</strong>{" "}
              {bookingData?.finalDestinationAddress}
            </p>
            <p>
              <strong>Mode of Stuffing:</strong>{" "}
              {bookingData?.modeOfStuffingSeaName}
            </p>
            <p>
              <strong>Mode of Delivery</strong>{" "}
              {bookingData?.modeOfDeliveryName}
            </p>
            <p>
              <strong>Terms of Shipment List:</strong> {bookingData?.incoterms}
            </p>
          </div>

          {/* Billing and Payment Terms */}
          <div className="box">
            <h5>Billing and Payment Terms</h5>
            <p>
              <strong>Country: </strong> {bookingData?.billCountry}
            </p>
            <p>
              {" "}
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
              <strong>
                Store Rent, Haulage/Local Transportation/Pickup Service:
              </strong>{" "}
              {bookingData?.isStoreRentPickupService ? "Yes" : "No"}
            </p>
            <p>
              <strong>Destination Haulage:</strong>{" "}
              {bookingData?.isDestiontionHaulage ? "Yes" : "No"}
            </p>
          </div>
          {/* Shipping Schedule */}
          <div className="box">
            <h5>Shipping Schedule</h5>
            <p>
              <strong>Requested Pickup Date:</strong>{" "}
              {moment(bookingData?.requestPickupDate).format("YYYY-MM-DD")}
            </p>
            <p>
              <strong>Pickup Place</strong> {bookingData?.pickupPlace}
            </p>
            <p>
              <strong>Estimated Delivery Date:</strong>{" "}
              {moment(bookingData?.requestDeliveryDate).format("YYYY-MM-DD")}
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
                  <th>Number of Packages/Units/Carton</th>
                  <th>Per Unit Gross Weight (kg)</th>
                  <th>Per Unit Net Weight (kg)</th>
                  <th>Gross Weight (KG)</th>
                  <th>Net Weight (KG)</th>
                  <th>Volume (CBM)</th>
                  <th>Type of Loading</th>
               
                  <th>Temperature Range</th>
               
                  <th>Special Handling Instructions</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                {bookingData?.rowsData?.map((row, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                 
                    <td>{row?.hsCode}</td>
                    <td>{row?.typeOfCargo}</td>
                    <td>{row?.numberOfPackages}</td>
                    <td>{row?.pugrossWeightKg}</td>
                    <td>{row?.punetWeightKg}</td>
                    <td>{row?.grossWeightKG}</td>
                    <td>{row?.netWeightKG}</td>
                    <td>{row?.totalVolumeCBM}</td>
                    <td>{row?.typeOfLoading}</td>
                   
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
      </div>
    </div>
  );
}

export default BookingDetailsInfo;
