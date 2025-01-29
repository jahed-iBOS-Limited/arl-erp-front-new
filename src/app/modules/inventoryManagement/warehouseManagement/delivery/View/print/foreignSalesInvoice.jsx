import React, { useEffect, useRef } from "react";
import { shallowEqual, useSelector } from "react-redux";
import ICard from "../../../../../_helper/_card";
import useAxiosGet from "../../../../../_helper/customHooks/useAxiosGet";
import "../../style.css";
import { _fixedPoint } from "../../../../../_helper/_fixedPoint";
import { ToWords } from "to-words";
import { _dateFormatter } from "../../../../../_helper/_dateFormate";

export default function ForeingSalesInvoicePrint({ landingData }) {
  const printRef = useRef();

  const {
    profileData: { accountId: accId },
    selectedBusinessUnit: { value: buId, label: buName, address: buAddress },
  } = useSelector((state) => state?.authData, shallowEqual);

  const toWords = new ToWords({
    localeCode: "en-US",
    converterOptions: {
      currency: true,
      ignoreDecimal: false,
      ignoreZeroCurrency: false,
      doNotAddOnly: false,
    },
  });

  const [foreignSalesInvoice, getForeignSalesInvoice] = useAxiosGet();

  const headerData = foreignSalesInvoice?.headerData;
  // const heads = foreignSalesInvoice?.head;
  const rows = foreignSalesInvoice?.rowData;

  const { deliveryId } = landingData;

  useEffect(() => {
    getForeignSalesInvoice(
      `/wms/Delivery/ViewForeignDeliveryInvoice?deliveryId=${deliveryId}&accountId=${accId}&businessUnitId=${buId}`
      // `/wms/Delivery/ViewForeignDeliveryInvoice?deliveryId=${deliveryId}&accountId=${accId}&businessUnitId=${buId}`
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accId, buId, deliveryId]);

  let totalAmountUSD = 0;

  return (
    <>
      <ICard
        printTitle="Print"
        title=""
        isPrint={true}
        isShowPrintBtn={true}
        componentRef={printRef}
        pageStyle={
          "@media print{body { -webkit-print-color-adjust: exact;}@page {size: portrait ! important}}"
        }
      >
        <div ref={printRef}>
          <div
            className={`mx-auto print_wrapper delivery_challan_print_wrapper`}
          >
            <div className="borderTop">
              <div className="text-center my-2 delivery_challan">
                <h2>Invoice</h2>
                <b className="display-5">{buName}</b>
                <br />
                <b className="display-5"> {buAddress} </b>
              </div>
              <div className="table-responsive">
                <table className="table delivery_challan_top_table mt-8">
                  <tbody>
                    <tr>
                      <td style={{ width: "107px" }}>
                        <b>Invoice No</b>
                      </td>
                      <td>:</td>
                      <td>
                        <b>{headerData?.deliveryCode}</b>
                      </td>
                      <td style={{ width: "120px" }}>
                        <b>Customer Code</b>
                      </td>
                      <td>:</td>
                      <td>
                        <b>{headerData?.soldToPartnerCode}</b>
                      </td>
                    </tr>
                    <tr>
                      <td>Invoice Date</td>
                      <td>:</td>
                      <td>{_dateFormatter(headerData?.deliveryDate)}</td>
                      <td style={{ width: "120px" }}>Name</td>
                      <td>:</td>
                      <td>{headerData?.soldToPartnerName}</td>
                    </tr>
                    <tr>
                      <td>Trans. Agency</td>
                      <td>:</td>
                      <td>{headerData?.supplierName}</td>
                      <td>Address</td>
                      <td>:</td>
                      <td>{headerData?.soldToPartnerAddress}</td>
                    </tr>
                    <tr>
                      <td>Truck No</td>
                      <td>:</td>
                      <td>{headerData?.vehicleName}</td>
                    </tr>
                    <tr>
                      <td>Driver's Name</td>
                      <td>:</td>
                      <td>{headerData?.driverName}</td>
                      <td>Phone/Mobile</td>
                      <td>:</td>
                      <td>{headerData?.contactNumber}</td>
                    </tr>
                    <tr>
                      <td>Territory</td>
                      <td>:</td>
                      <td>{headerData?.portOfDischarge}</td>
                      <td>Contact Person</td>
                      <td>:</td>
                      <td>{headerData?.contractFor}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Main Table */}
              <div className="table-responsive">
                <table className="table table-striped table-bordered  global-table">
                  <thead>
                    <tr>
                      <th style={{ width: "35px" }} rowSpan={2}>
                        SL
                      </th>
                      <th style={{ width: "220px" }} rowSpan={2}>
                        {" "}
                        Description
                      </th>
                      <th rowSpan={2}>Qty/Carton</th>
                      <th colSpan={4}>Quantity</th>
                      <th rowSpan={2}>Total Carton</th>
                      <th rowSpan={2}>Rate (USD)/Carton</th>
                      <th rowSpan={2}>VAT</th>
                      <th rowSpan={2}>Discount</th>
                      <th rowSpan={2}>Amount(USD)</th>
                    </tr>
                    <tr>
                      <th>Sales</th>
                      <th>Bonus</th>
                      <th>Sample</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows?.map((item, index) => {
                      totalAmountUSD += item?.totalFobAmountUSD;
                      return (
                        <tr>
                          <td>{index + 1}</td>
                          <td>{item?.itemName}</td>
                          <td className="text-right">
                            {
                              item?.pieceInCTN
                              // item?.headings?.find(
                              //   (element) => element?.headerName === "PCS In CTN"
                              // )?.headerValue
                            }
                          </td>
                          <td className="text-right">
                            {item?.totalCarton * item?.pieceInCTN
                            // item?.headings?.find(
                            //   (element) => element?.headerName === "PCS In CTN"
                            // )?.headerValue
                            }
                          </td>
                          <td className="text-right">0</td>
                          <td className="text-right">0</td>
                          <td className="text-right">
                            {item?.totalCarton * item?.pieceInCTN
                            // item?.headings?.find(
                            //   (element) => element?.headerName === "PCS In CTN"
                            // )?.headerValue
                            }
                          </td>
                          <td className="text-right">{item?.totalCarton}</td>
                          <td className="text-right">
                            {item?.fobRatePerCartonUSD}
                          </td>
                          <td className="text-right">{item?.vat || 0}</td>
                          <td className="text-right">{item?.discount || 0}</td>
                          <td className="text-right">
                            {item?.totalFobAmountUSD || 0}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan={8} rowSpan={2}>
                        <p>
                          USD In Words:{" "}
                          {toWords.convert(totalAmountUSD.toFixed(0))}
                        </p>
                      </td>
                      <td colSpan="3" className="text-right">
                        <b>Total Amount</b>
                      </td>
                      <td className="text-right">
                        <b>{_fixedPoint(totalAmountUSD, true)}</b>
                      </td>
                    </tr>
                    <tr>
                      <td colSpan="3" className="text-right">
                        <b>Less Adjustment</b>
                      </td>
                      <td className="text-right">
                        <b>{0}</b>
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={8} rowSpan={2}>
                        <p>Received the goods in good saleable condition</p>
                      </td>
                      <td colSpan="3" className="text-right">
                        <b>Less Special Discount</b>
                      </td>
                      <td className="text-right">
                        <b>{0}</b>
                      </td>
                    </tr>
                    <tr>
                      <td colSpan="3" className="text-right">
                        <b>Net Payable</b>
                      </td>
                      <td className="text-right">
                        <b>{_fixedPoint(totalAmountUSD, true)}</b>
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* Signature Section */}
              <section>
                <div
                  className="d-flex justify-content-between"
                  style={{ margin: "80px 0 0" }}
                >
                  <div>
                    <b style={{ borderTop: "1px solid", padding: "5px 0 0" }}>
                      Customer's Signature & Seal
                    </b>
                  </div>
                  <div>
                    <b style={{ borderTop: "1px solid", padding: "5px 0 0" }}>
                      Driver's Signature
                    </b>
                  </div>
                  <div>
                    <b style={{ borderTop: "1px solid", padding: "5px 0 0" }}>
                      For Akij Essentials Ltd.
                    </b>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </ICard>
    </>
  );
}
