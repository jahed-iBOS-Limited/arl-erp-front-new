import React from "react";
import { shallowEqual, useSelector } from "react-redux";
import moment from "moment";
import { _formatMoney } from "./../../../_helper/_formatMoney";
import "./style.css";

function PrintViewSixPointThree({ salesInvoicePrintStatus, singleData }) {
  const isFixedRateFind = singleData?.objList?.some((itm) => itm?.isFixedRate);
  let actualQty = 0;
  let totalwithoutTax = 0;
  let amountofSD = 0;
  let amountofVAT = 0;
  let totalPrice = 0;
  const tableTitles = [
    "S.L No",
    "Details of Supply",
    "Unit of Supply",
    "Actual  Qty",
    "Rate  without  Tax",
    "Total without Tax",
    "SD %",
    "Amount of SD",
    `VAT ${isFixedRateFind ? "" : "%"}`,
    "Amount of VAT",
    "Total Price",
  ];
  const { selectedBusinessUnit } = useSelector((state) => {
    return state?.authData;
  }, shallowEqual);
  const isMagnum = [171, 224]?.includes(selectedBusinessUnit?.value);
  return (
    <>
      <div
        className='printDif mx-10 mr-15'
        id='pdf-section'
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <div>
          {salesInvoicePrintStatus && <p className='duplicatePrint'>Copy</p>}
          <div className='row sales-invoice-model  m-0'>
            {salesInvoicePrintStatus && <p className=''>Copy</p>}
            <div className='col-lg-12 p-0'>
              <div className='title text-center mt-5'>
                <div className='top'>
                  <div
                    className='d-flex justify-content-end'
                    style={{ marginBottom: "-35px", marginRight: "50px" }}
                  >
                    <span
                      style={{ border: "1px solid gray", fontSize: 18 }}
                      className='p-2'
                    >
                      <strong>Mushak-6.3</strong>
                    </span>
                  </div>
                  <h1 className='mb-1'>
                    <b>Government of the People's Republic of Bangladesh</b>
                  </h1>
                  <h5 className='mb-1'>
                    <b>National Board of Revenue</b>
                  </h5>
                </div>

                <div className='buttom'>
                  <h5 className='mt-1 mb-0'>
                    <b>Tax Challan</b>
                  </h5>
                  <p>
                    <b>[See Clauses (C) and (f) of Sub-Rule (1) of Rule 40]</b>
                  </p>
                  <p>
                    <strong>
                      Name of Registered Person:
                      {singleData?.objHeader?.businessUnitName}
                    </strong>
                  </p>
                  <p>
                    <strong>
                      BIN of Registered Person:
                      {singleData?.objHeader?.companyBin}
                    </strong>
                  </p>

                  <p>
                    <strong>
                      Challan Issuing Address:
                      {singleData?.objHeader?.taxBranchAddress}
                    </strong>
                  </p>
                </div>
              </div>
            </div>
            {isMagnum ? (
              <HeaderInfoIsMagnum singleData={singleData} />
            ) : (
              <HeaderInfo singleData={singleData} />
            )}

            <div className='col-lg-12 p-0'>
              <table className='table table-striped table-bordered global-table'>
                <thead>
                  <tr className='vendorListHeading'>
                    {tableTitles.map((th, index) => {
                      return (
                        <th style={{ padding: "0 !important" }} key={index}>
                          <div
                            style={{
                              height: "100%",
                              display: "block",
                              background: "#d6dadd",
                              padding: "10px 0",
                              fontWeight: "900",
                            }}
                          >
                            {th}
                          </div>
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody>
                  {singleData?.objList?.map((itm, i) => {
                    // vat calculation
                    const vatCalculationOne =
                      (itm?.vatTotal / (itm?.grandTotal - itm?.vatTotal)) * 100;
                    const vatCalculationTwo = itm?.vatTotal / itm?.quantity;
                    const vatPersent = itm?.isFixedRate
                      ? vatCalculationTwo
                      : vatCalculationOne;

                    // sd calculation
                    const sdPersent =
                      (itm?.sdtotal /
                        (itm?.grandTotal - itm?.vatTotal - itm?.sdtotal)) *
                      100;

                    actualQty += itm?.quantity;
                    totalwithoutTax += itm?.baseTotal;
                    amountofSD += itm?.sdtotal;
                    amountofVAT += itm?.vatTotal;
                    totalPrice += itm?.grandTotal;

                    return (
                      <tr key={i}>
                        <td className='text-center'>
                          <b>{i + 1}</b>
                        </td>
                        <td className='text-center'>
                          <b>{itm?.taxItemGroupName}</b>
                        </td>
                        <td className='text-center'>
                          <b>{itm?.uomname}</b>
                        </td>
                        <td className='text-center'>
                          <b>{Number(itm?.quantity.toFixed(3))}</b>
                        </td>
                        <td className='text-center'>
                          <b>{Number(itm?.basePrice.toFixed(2))}</b>
                        </td>
                        <td className='text-center'>
                          <b>{Number(itm?.baseTotal.toFixed(2))}</b>
                        </td>
                        {/* <td className="text-center"> {itm?.sdtotal}</td> */}
                        <td className='text-center'>
                          <b> {`${Number(sdPersent?.toFixed(2))}%`}</b>
                        </td>
                        <td className='text-center'>
                          <b>{Number(itm?.sdtotal?.toFixed(2))}</b>
                        </td>
                        <td className='text-center'>
                          <b>{`${Number(vatPersent?.toFixed(2))} ${
                            itm?.isFixedRate ? "" : "%"
                          }`}</b>
                        </td>
                        <td className='text-center'>
                          <b>{Number(itm?.vatTotal.toFixed(2))}</b>
                        </td>
                        <td className='text-center'>
                          <b>
                            {_formatMoney(Number(itm?.grandTotal?.toFixed(2)))}
                          </b>
                        </td>
                      </tr>
                    );
                  })}
                  <tr>
                    <td colSpan='3'>
                      <b>Total:</b>
                    </td>
                    <td className='text-center'>
                      <b>{Number(actualQty?.toFixed(3))}</b>
                    </td>
                    <td></td>
                    <td className='text-center'>
                      <b>{Number(totalwithoutTax?.toFixed(2))}</b>
                    </td>
                    <td> </td>
                    <td className='text-center'>
                      <b>{Number(amountofSD?.toFixed(2))}</b>
                    </td>
                    <td> </td>
                    <td className='text-center'>
                      <b>{Number(amountofVAT?.toFixed(2))}</b>
                    </td>
                    <td className='text-center'>
                      <b>{_formatMoney(Number(totalPrice?.toFixed(2)))}</b>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div className='row footer_buttom  mt-10 taxSalesModelFooter'>
            <div className='col-lg-12 p-0'>
              <div
                className='d-flex justify-content-between px-5'
                style={{ marginTop: "30px" }}
              >
                <div>
                  {singleData?.objHeader?.tradeTypeId !== 5 && (
                    <p>
                      <strong>Zero Rated Vat</strong>
                    </p>
                  )}
                  <p>
                    <b>Name of organization Officer-in-charge:</b>
                  </p>
                  <p>
                    <b>Designation:</b>
                  </p>
                </div>
                <p style={{ borderTop: "1px solid" }}>
                  <b>Signature</b>
                </p>
                <p style={{ borderTop: "1px solid" }}>
                  <b>Driver Signature</b>
                </p>
                <p style={{ borderTop: "1px solid" }}>
                  <b>Receiver Signature</b>
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className='mt-5'>
          <p> &copy; System developed by AKIJ iBOS Limited</p>
        </div>
      </div>
    </>
  );
}

export default PrintViewSixPointThree;

function HeaderInfoIsMagnum({ singleData }) {
  return (
    <div className='col-lg-12 p-0'>
      <div className='d-flex justify-content-between'>
        <div className='left pr-4'>
          <p>
            <b>
              Customer Name:
              {singleData?.objHeader?.soldtoPartnerName}
            </b>
          </p>
          <p>
            <b>BIN of Purchaser: {singleData?.objHeader?.binNo}</b>
          </p>
          <p>
            <strong>
              Customer Address: {singleData?.objHeader?.soldtoPartnerAddress}
            </strong>
          </p>
          <p>
            <b>
              Final Distination: {singleData?.objHeader?.shiptoPartnerAddress}
            </b>
          </p>
        </div>
        <div className='right'>
          <p>
            <b>
              Date of Issue:{" "}
              {singleData?.objHeader?.taxDeliveryDateTime.split("T")[0]}
            </b>
          </p>
          <p>
            <b>
              Time of Issue:{" "}
              {moment(
                singleData?.objHeader?.taxDeliveryDateTime
                  .split("T")[1]
                  .split(".")[0],
                "HHmmss"
              ).format("LT")}
            </b>
          </p>
          <p>
            <b>
              Contact Person Name:{" "}
              {singleData?.objHeader?.contactNo?.split("-")?.[1] || ""}
            </b>
          </p>
          <p>
            <b>Invoice No: {singleData?.objHeader?.taxSalesCode}</b>
          </p>
          <p>
            <strong>Vehicle No: {singleData?.objHeader?.vehicleNo}</strong>
          </p>
        </div>
      </div>
    </div>
  );
}

function HeaderInfo({ singleData }) {
  return (
    <div className='col-lg-12 p-0'>
      <div className='d-flex justify-content-between'>
        <div className='left pr-4'>
          <p>
            <b>
              Customer Name:
              {singleData?.objHeader?.soldtoPartnerName}
            </b>
          </p>
          <p>
            <b>BIN of Purchaser: {singleData?.objHeader?.binNo}</b>
          </p>
          <p>
            <strong>
              Customer Address: {singleData?.objHeader?.soldtoPartnerAddress}
            </strong>
          </p>
          <p>
            <b>
              Final Distination: {singleData?.objHeader?.shiptoPartnerAddress}
            </b>
          </p>
          <p>
            <b>
              Date of Issue:{" "}
              {singleData?.objHeader?.taxDeliveryDateTime.split("T")[0]}
            </b>
          </p>
          <p>
            <b>
              Time of Issue:{" "}
              {moment(
                singleData?.objHeader?.taxDeliveryDateTime
                  .split("T")[1]
                  .split(".")[0],
                "HHmmss"
              ).format("LT")}
            </b>
          </p>
          <p>
            <b>
              Contact Person Name:{" "}
              {singleData?.objHeader?.contactNo?.split("-")?.[1] || ""}
            </b>
          </p>
          <p>
            <strong>
              Contact No:{" "}
              {singleData?.objHeader?.contactNo?.split("-")?.[0] || ""}
            </strong>
          </p>
        </div>
        <div className='right'>
          <p>
            <strong>
              Reference No:{" "}
              {singleData?.objHeader?.deliveryCode ||
                singleData?.objHeader?.referenceNo}
            </strong>
          </p>
          {singleData?.objHeader?.soNo && (
            <p>
              <strong>SO No: {singleData?.objHeader?.soNo}</strong>
            </p>
          )}

          <p>
            <b>Invoice No: {singleData?.objHeader?.taxSalesCode}</b>
          </p>

          <p>
            <strong>Vehicle No: {singleData?.objHeader?.vehicleNo}</strong>
          </p>
          <p>
            <b>Driver Name: {singleData?.objHeader?.driverName}</b>
          </p>
          <p>
            <strong>
              Driver Contact:{" "}
              {singleData?.objHeader?.driverContract ||
                singleData?.objHeader?.driverContact}
            </strong>
          </p>
          <p>
            <strong>
              Vehicle Supplier Name:{" "}
              {singleData?.objHeader?.vehicleSupplierName}
            </strong>
          </p>
        </div>
      </div>
    </div>
  );
}
