import React, { useEffect } from "react";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import Loading from "../../../../_helper/_loading";
import { imarineBaseUrl } from "../../../../../App";
import "./style.css";
function Details({ rowClickData }) {
  const bookingRequestId = rowClickData?.bookingRequestId;
  const [
    shipBookingRequestGetById,
    setShipBookingRequestGetById,
    shipBookingRequestLoading,
  ] = useAxiosGet();
  useEffect(() => {
    if (bookingRequestId) {
      setShipBookingRequestGetById(
        `${imarineBaseUrl}/domain/ShippingService/ShipBookingRequestGetById?BookingId=${bookingRequestId}`
      );
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookingRequestId]);

  const bookingData = shipBookingRequestGetById?.[0] || {};

  console.log(bookingData, "bookingData");

  return (
    <div className="bookingDetails">
      {shipBookingRequestLoading && <Loading />}
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
                    <td>{doc?.documentFileId}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Details;
