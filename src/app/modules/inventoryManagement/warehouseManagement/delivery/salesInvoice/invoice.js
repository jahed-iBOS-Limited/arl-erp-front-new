import React, { useRef } from "react";
import { shallowEqual, useSelector } from "react-redux";
import "./invoice.css";
import ICard from "../../../../_helper/_card";

const SalesInvoice = () => {
  // get selected business unit from store
  const {
    selectedBusinessUnit,
    // profileData
  } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  const printRef = useRef();

  return (
    <>
      <ICard
        printTitle="Print"
        title="Sales Invoice"
        isPrint={true}
        isShowPrintBtn={true}
        componentRef={printRef}
        documentTitle="Sales Invoice"
        pageStyle={
          "@media print{body { -webkit-print-color-adjust: exact;}@page {size: portrait ! important}}"
        }
      >
        <div ref={printRef} className="container">
          <section id="header">
            <div className="text-center">
              <h1>{selectedBusinessUnit?.label}</h1>
              <p>{selectedBusinessUnit?.address}</p>
              <br />
              <br />
            </div>
            <div className="pl-3" style={{ maxWidth: "55%" }}>
              <div className="d-flex justify-content-between">
                <p className="mb-0">
                  <b> Invoice No: INOP546546</b>
                </p>
                <p className="mb-0">
                  <b>Date: 16/11/2021</b>
                </p>
              </div>
            </div>
          </section>
          <section id="salesInvoiceTable">
            <div className="table-responsive">
              <table className="table table-striped global-table">
                <tr>
                  <th>DO No</th>
                  <th>Challan No</th>
                  <th>Date of delivery</th>
                  <h1 className="text-center align-middle">
                    {" "}
                    Commercial Invoice
                  </h1>
                </tr>

                <tr className="text-center">
                  <td>DO-65488</td>
                  <td>65296</td>
                  <td>09-11-2021</td>
                </tr>
                <tr>
                  <td colSpan="3" className="internal-table">
                    <div className="row">
                      <div className="col-lg-6">
                        {" "}
                        <h5
                          style={{ textDecoration: "underline" }}
                          className="p-2"
                        >
                          Company Name & Address:
                        </h5>{" "}
                      </div>
                      {/* <div className="col-lg-6 ">
                                        <table className="w-100">
                                            <tr>
                                                <th className="bt-none">Purchase Order No</th>
                                                <th className="br-none bt-none">Date</th>
                                            </tr>
                                            <tr className="text-center">
                                                <td>COCC-549692896</td>
                                                <td className="br-none">02-12-2022</td>
                                            </tr>
                                        </table>
                                    </div> */}
                    </div>
                    <div className="p-2">
                      <p>
                        <b>Akij food and beverage ltd.</b>
                        <p className="mb-0">lalmatia, dhaka.</p>
                        <p className="mb-0">Phone: </p>
                        <p>Fax: </p>
                      </p>
                      {/* <div className="d-flex">
                                        <p className="mr-3">
                                            <b>Project Name-</b>
                                        </p>
                                        <p>
                                            magnam steel industries ltd.
                                            <br />
                                            gulistan, dhaka.
                                        </p>
                                    </div> */}
                    </div>
                  </td>
                  <td className="vt-align internal-table">
                    <div className="pb-5 pl-2 pt-2">
                      <p style={{ textDecoration: "underline" }}>
                        <b>Contact Person & Designation:</b>
                      </p>
                      <p>Mr. wang youngyoung</p>
                    </div>
                    <div
                      style={{ borderTop: "2px solid rgb(20, 20, 20)" }}
                      className="p-2"
                    >
                      <p>
                        <b>Contact Number:</b>
                      </p>
                      <p>
                        <b>Mobile No: 01886-584585</b>
                      </p>
                    </div>
                  </td>
                </tr>
              </table>
            </div>

            <div id="second-table">
              <div className="table-responsive">
                <table className="table table-striped global-table mt-0 pt-0">
                  <tr>
                    <th>No</th>
                    <th>Product Description</th>
                    <th>Quantity</th>
                    <th>Unit Price (Tk.)</th>
                    <th>Amount</th>
                  </tr>
                  <tr>
                    <td className="text-center">1</td>
                    <td>211-55-MMMM</td>
                    <td className="text-right">20.00</td>
                    <td className="text-right">77,2223.00</td>
                    <td className="text-right">10000000</td>
                  </tr>
                  <tr>
                    <td colSpan="2" className="text-right pr-2">
                      {" "}
                      <p className="pr-1 mb-0">Total Sales</p>
                    </td>
                    <td className="text-right">20.00</td>
                    <td className="text-right">00</td>
                    <td className="text-right">1887220</td>
                  </tr>

                  <tr className="hide-border">
                    <td colSpan="4" rowSpan="4" className="text-right">
                      <div
                        className="w-50 text-left"
                        style={{ marginLeft: "70%" }}
                      >
                        {/* <p className="pr-1 mb-0">VAT</p> */}
                        <p className="pr-1 mb-0">Transportation Cost</p>
                        <p className="pr-1 mb-0">Total Amount</p>
                        <p className="pr-1 mb-0">Advance Received</p>
                        <p className="pr-1 mb-0">Due Amount</p>
                      </div>
                    </td>
                    <td className="text-right">10,000</td>
                  </tr>
                  {/* <tr><td className="text-right">10,000</td></tr> */}
                  <tr>
                    <td className="text-right">10,000</td>
                  </tr>
                  <tr>
                    <td className="text-right">10,000</td>
                  </tr>
                  <tr>
                    <td className="text-right">10,000</td>
                  </tr>
                </table>
              </div>
            </div>
          </section>
          <p className="mt-2">
            <b>Inword: </b> Taka ten thousands
          </p>
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <div className="d-flex justify-content-between">
            <div className="text-center">
              <p className="mb-0">__ __ __ __ __ __ __ __ __ __ __</p>
              <p>Customer Signature</p>
            </div>
            <div className="text-center">
              <p className="mb-0">__ __ __ __ __ __ __ __ __ __ __</p>
              <p>Authorized Signature</p>
            </div>
            <div className="text-center">
              <p className="mb-0">__ __ __ __ __ __ __ __ __ __ __</p>
              <p>Approved By</p>
            </div>
          </div>
        </div>
      </ICard>
    </>
  );
};

export default SalesInvoice;
