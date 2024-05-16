import React, { useRef } from "react";
import { useSelector, shallowEqual } from "react-redux";
import "../../style.css";
import CommonTable from "./commonTable";
import BongTradersTable from "./bongTradersTable";
import ReactToPrint from "react-to-print";
import { printCount } from "../../utils";

export default function ChallanPrint({ deliveryChallanInfo, row }) {
  const printRef = useRef();

  const { profileData, selectedBusinessUnit } = useSelector(
    (state) => state?.authData,
    shallowEqual
  );

  const {
    challanNo,
    deliveryOrder,
    soldToPartner,
    address,
    driver,
    contactNo,
    charge,
    logistic,
    driverContact,
    contactPerson,
    vehicleNo,
    shipToPartner,
    shippointName,
    deliveryAt,
    productType,
  } = deliveryChallanInfo;

  let totalQuantity = deliveryChallanInfo?.rows?.reduce(
    (acc, cur) => acc + cur?.quantity || 0,
    0
  );
  let totalBundel = deliveryChallanInfo?.rows?.reduce(
    (acc, cur) => (acc += cur?.bundel),
    0
  );
  let totalPieces = deliveryChallanInfo?.rows?.reduce(
    (acc, cur) => (acc += cur?.pieces),
    0
  );

  return (
    <>
      <div className="text-right">
        {deliveryChallanInfo?.isPrintable ? (
          <ReactToPrint
            documentTitle="Delivery Challan"
            trigger={() => (
              <button type="button" className="btn btn-primary">
                <i class="fas fa-print"></i>
                Print
              </button>
            )}
            onAfterPrint={() => {
              printCount(
                profileData?.accountId,
                selectedBusinessUnit?.value,
                row?.deliveryId
              );
            }}
            content={() => printRef.current}
            pageStyle={
              "@media print{body { -webkit-print-color-adjust: exact;}@page {size: portrait ! important}}"
            }
          />
        ) : null}
      </div>
      <div ref={printRef}>
        <div
          className={`mx-auto print_wrapper delivery_challan_print_wrapper ${selectedBusinessUnit?.value ===
            178 && "bongoTradersLtdChalanPrintMargin"}`}
        >
          <div>
            <div className="text-center my-2 delivery_challan">
              <h2>LOADING SLIP</h2>
              <b className="display-5">{selectedBusinessUnit?.label}</b>
              <br />
              <b className="display-5"> {selectedBusinessUnit?.address} </b>
            </div>
            <div className="table-responsive">
              <table className="table delivery_challan_top_table mt-8">
                <tbody>
                  <tr>
                    <td style={{ width: "107px" }}>
                      <b>Challan No</b>
                    </td>
                    <td>:</td>
                    <td>
                      <b>{challanNo}</b>
                    </td>
                    <td style={{ width: "120px" }}>Delivery From:</td>
                    <td>:</td>
                    <td>{shippointName}</td>
                  </tr>
                  <tr>
                    <td>Sold To Partner</td>
                    <td>:</td>
                    <td>{soldToPartner}</td>
                    <td style={{ width: "120px" }}>Delivery Order</td>
                    <td>:</td>
                    <td>{deliveryOrder}</td>
                  </tr>
                  <tr>
                    <td>Ship To Partner</td>
                    <td>:</td>
                    <td>{shipToPartner}</td>
                    <td>Delivery At</td>
                    <td>:</td>
                    <td>{deliveryAt}</td>
                  </tr>
                  <tr>
                    <td>Address</td>
                    <td>:</td>
                    <td>{address}</td>
                    <td>Vehicle</td>
                    <td>:</td>
                    <td>{vehicleNo}</td>
                  </tr>
                  <tr>
                    <td>Contact Person</td>
                    <td>:</td>
                    <td>{contactPerson}</td>
                    <td>Logistic</td>
                    <td>:</td>
                    <td>{logistic}</td>
                  </tr>
                  <tr>
                    <td>Contact No</td>
                    <td>:</td>
                    <td>{contactNo}</td>
                    <td>Driver</td>
                    <td>:</td>
                    <td>{driver}</td>
                  </tr>
                  <tr>
                    <td>Charge</td>
                    <td>:</td>
                    <td>{charge}</td>
                    <td>Driver Contact No</td>
                    <td>:</td>
                    <td>{driverContact}</td>
                  </tr>
                  {(selectedBusinessUnit?.value === 171 ||
                    selectedBusinessUnit?.value === 224) && (
                    <>
                      {" "}
                      <tr>
                        <td>Total Bundle</td>
                        <td>:</td>
                        <td>{totalBundel}</td>
                        <td>Product Type</td>
                        <td>:</td>
                        <td>{productType}</td>
                      </tr>
                      <tr>
                        <td>Total Pieces</td>
                        <td>:</td>
                        <td>{totalPieces}</td>
                      </tr>
                    </>
                  )}
                </tbody>
              </table>
            </div>

            {/* if Bongo Traders Ltd  check*/}
            {selectedBusinessUnit?.isTredingBusiness ? (
              <BongTradersTable
                deliveryChallanInfo={deliveryChallanInfo}
                totalQuantity={totalQuantity}
              />
            ) : (
              <CommonTable
                deliveryChallanInfo={deliveryChallanInfo}
                totalQuantity={totalQuantity}
                selectedBusinessUnit={selectedBusinessUnit}
                totalPieces={totalPieces}
                totalBundel={totalBundel}
              />
            )}
          </div>
          <div></div>
        </div>
      </div>
    </>
  );
}
