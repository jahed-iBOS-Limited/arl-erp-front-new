import React from "react";
import ICard from "../../../_helper/_card";
import Loading from "../../../_helper/_loading";
import { _dateFormatterTwo } from "../../../_helper/_dateFormate";
import ICustomTable from "../../../_helper/_customTable";

const ths = [
  "Ship To Party",
  "Address",
  "Challan No",
  "Sales Order No",
  "Item Code",
  "Product Name",
  "UoM Name",
  "Qty",
  "Rate",
  "Amount",
];

const ShipmentReportModal = ({ objProps }) => {
  const {
    shipmentDetails,
    shipmentDetailsLoading,
    selectedBusinessUnit,
  } = objProps;

  let totalQuantity = 0;
  let totalItemPrice = 0;
  let totalAmount = 0;


  return (
    <ICard title="Shipment Details" createBtnText={"Done"}>
      <div>
        <div
          className="mx-auto print_wrapper-shipping"
          style={{ color: "#000" }}
        >
          {shipmentDetailsLoading && <Loading />}
          <div>
            <div style={{ display: "flex" }}>
              <div style={{ width: "15%" }}></div>
              <div style={{ width: "70%" }}>
                <div className="text-center my-2">
                  <h3> Shipping Note </h3>
                  <h4 className="display-5"> {selectedBusinessUnit?.label} </h4>
                  <h6 className="display-5">
                    {" "}
                    {shipmentDetails?.objHeader?.shipPointAddress}{" "}
                  </h6>
                </div>
              </div>
            </div>

            <div className="d-flex justify-content-between my-5">
              <div>
                <b>
                  Delivery From:{" "}
                  {`${shipmentDetails?.objHeader?.shipPointName || ""}`}
                </b>

                <br />
                <b>
                  Shipment No:{" "}
                  {`${shipmentDetails?.objHeader?.shipmentId || 0}`}
                </b>

                <br />
                <b>
                  Driver Name: {`${shipmentDetails?.objHeader?.driverName}`}
                </b>

                <br />
                <b>
                  Driver Contact:{" "}
                  {`${shipmentDetails?.objHeader?.driverContact}`}
                </b>

                <br />

                <b>
                  Product Gross Weight:{" "}
                  {`${shipmentDetails?.objHeader?.totalGrossWeight}`}
                </b>

                <br />
                <b>
                  Partner Reference:{" "}
                  {`${shipmentDetails?.objHeader?.soReferenceNo || ""}`}
                </b>

                <br />
                <b>
                  Pricing Date:{" "}
                  {`${_dateFormatterTwo(
                    shipmentDetails?.objHeader?.pricingDate
                  ) || ""}`}
                </b>

                <br />
                <b>TLM: {shipmentDetails?.objHeader?.tlm}</b>
              </div>
              <div>
                <b>
                  Delivery Date:{" "}
                  {_dateFormatterTwo(shipmentDetails?.objHeader?.shipmentDate)}{" "}
                </b>{" "}
                <br />
                <b>
                  Vehicle Name: {shipmentDetails?.objHeader?.strVehicleName}
                </b>
                <br />
                <b>
                  Vehicle Owner Name:{" "}
                  {shipmentDetails?.objHeader?.ownerTypeName}
                </b>{" "}
                <br />
                <b>
                  Vehicle Weight (Kg):{" "}
                  {shipmentDetails?.objHeader?.vehicleEntryId
                    ? shipmentDetails?.objHeader?.netWeight
                    : shipmentDetails?.objHeader?.unloadVehicleWeight}
                </b>
                <br />
                <b>
                  Contact Info:{" "}
                  {`${shipmentDetails?.objHeader?.shipToPartnerContactNo ||
                    ""}`}
                </b>
                <br />
                <b>
                  Complete Date:{" "}
                  {_dateFormatterTwo(shipmentDetails?.objHeader?.completeDate)}
                </b>
                <br />
                <b>Packer Name: {shipmentDetails?.objHeader?.packerName}</b>
                <br />
              </div>
            </div>

            <div className=" my-5">
              <ICustomTable ths={ths}>
                {shipmentDetails?.objRow?.map((itm, index) => {
                  totalQuantity += itm?.quantity;
                  totalItemPrice += itm?.itemPrice;
                  totalAmount += (+itm?.itemPrice || 0) * (+itm?.quantity || 0);

                  return (
                    <tr key={index}>
                      <td>
                        <div className="text-left">{itm?.customerName} </div>
                      </td>
                      <td> {itm?.customerAddress}</td>
                      <td> {itm?.deliveryCode}</td>
                      <td> {itm?.salesOrderCode}</td>
                      <td className="text-center"> {itm?.itemCode}</td>
                      <td>
                        {[144, 188, 189].includes(selectedBusinessUnit?.value)
                          ? itm?.itemSalesName
                          : itm?.itemName}
                      </td>
                      <td>{itm?.uomName}</td>
                      <td className="text-center">{itm?.quantity}</td>
                      {/* Akij Essential Limited === 144 */}
                      {[144].includes(selectedBusinessUnit?.value) && (
                        <>
                          <td className="text-center">{itm?.itemPrice}</td>
                          <td className="text-center">
                            {(+itm?.itemPrice || 0) * (+itm?.quantity || 0)}
                          </td>
                        </>
                      )}

                      {/* <td className="text-center">{itm?.deliveryValue}</td> */}
                    </tr>
                  );
                })}
                <tr>
                  <td colSpan="7" className="text-left">
                    <p className="text-left m-0 ml-1">
                      <b>Total Quantity:</b>
                    </p>
                  </td>
                  <td className="text-center">
                    <b>{totalQuantity}</b>
                  </td>
                  {/* Akij Essential Limited === 144 */}
                  {[144].includes(selectedBusinessUnit?.value) && (
                    <>
                      {" "}
                      <td className="text-center">
                        <b>{totalItemPrice}</b>
                      </td>
                      <td className="text-center">
                        <b>{totalAmount}</b>
                      </td>
                    </>
                  )}
                </tr>
              </ICustomTable>
            </div>
          </div>
        </div>
      </div>
    </ICard>
  );
};

export default ShipmentReportModal;
