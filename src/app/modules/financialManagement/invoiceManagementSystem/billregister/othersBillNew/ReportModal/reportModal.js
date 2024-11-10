import React, { useState, useEffect } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import { getCommercialInvoiceById } from "../helper";
import "./reportModal.css";
import { _formatMoney } from "./../../../../_helper/_formatMoney";
import { Formik, Form } from "formik";
import {
  Card,
  CardBody,
  CardHeader,
} from "../../../../../../_metronic/_partials/controls";
import { useRef } from "react";
import ReactToPrint from "react-to-print";
import printIcon from "../../../../_helper/images/print-icon.png";

export default function CommercialInvoiceReport({ setLoading }) {
  const printRef = useRef();

  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  const [rowDto, setRowDto] = useState({});

  const { invoiceId } = useLocation();
  // console.log('invoiceId: ', invoiceId);

  useEffect(() => {
    getCommercialInvoiceById(invoiceId, setLoading, setRowDto);
  }, [invoiceId, setLoading]);

  // let chanllanNoAndDate = rowDto?.header?.challanNoAndDate?.split(",");

  const [grandTotal, setGrandTotal] = useState({
    totalQuantity: 0,
    totalAmount: 0,
  });

  console.log("grandTotal: ", grandTotal);

  useEffect(() => {
    if (rowDto?.row?.length > 0) {
      const reduceObj = rowDto.row.reduce(
        (acc, cur) => {
          return {
            totalQuantity: (acc.totalQuantity += cur?.quantity),
            totalAmount: (acc.totalAmount += cur?.amount),
          };
        },
        { totalQuantity: 0, totalAmount: 0 }
      );
      setGrandTotal(reduceObj);
      console.log(reduceObj, "sdf");
    } else {
      setGrandTotal({ totalQuantity: 0, totalAmount: 0 });
    }
  }, [rowDto]);

  return (
    <>
      <Formik
        enableReinitialize={true}
        // initialValues={{
        //   ...initData,
        //   ...laingValues,
        //   approveAmount: singleData?.amount,
        //   approveAmountMax: singleData?.amount,
        // }}
        // validationSchema={validationSchema}
        // onSubmit={(values, { setSubmitting, resetForm }) => {
        //   saveHandler(values, () => {
        //     resetForm(initData);
        //   });
        // }}
      >
        {({
          handleSubmit,
          resetForm,
          values,
          errors,
          touched,
          setFieldValue,
          isValid,
        }) => (
          <div className="">
            {/* {disabled && <Loading />} */}

            <Card>
              <CardHeader title={"Sales Invoice"}></CardHeader>
              <CardBody>
                <Form
                  className="form form-label-right approveBillRegisterView"
                  componentRef={printRef}
                  ref={printRef}
                >
                  <div style={{ width: "90%", marginLeft: "5%" }}>
                    <div
                      className="text-center"
                      style={{ paddingTop: "20px", paddingBottom: "40px" }}
                    >
                      <h2>{selectedBusinessUnit?.organizationUnitReffName}</h2>
                      <p>{selectedBusinessUnit?.address}</p>
                      <ReactToPrint
                        pageStyle={
                          "@media print{body { -webkit-print-color-adjust: exact;}@page {size: portrait ! important}}"
                        }
                        trigger={() => (
                          <button
                            type="button"
                            className="btn btn-primary printSectionNone"
                            style={{
                              padding: "2px 5px",
                              position: "absolute",
                              top: "0",
                              right: "0",
                            }}
                          >
                            <img
                              style={{
                                width: "25px",
                                paddingRight: "5px",
                              }}
                              src={printIcon}
                              alt="print-icon"
                            />
                            Print
                          </button>
                        )}
                        content={() => printRef.current}
                      />
                    </div>
                    <div className="mt-3">
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "flex-start",
                        }}
                      >
                        <div style={{ width: "60%" }}>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <p style={{ fontWeight: 600 }}>
                              Invoice No : {rowDto?.header?.invoiceCode}
                            </p>
                            <p style={{ fontWeight: 600 }}>
                              Date :{" "}
                              {_dateFormatter(rowDto?.header?.invoiceDate)}
                            </p>
                          </div>
                          <div style={{ border: "1px solid black" }}>
                            <table
                              border="1"
                              style={{ width: "100%" }}
                              className="text-center"
                              // className="table table-striped table-bordered global-table table-font-size-sm "
                            >
                              <thead>
                                <th>SO No</th>
                                <th>Challan No</th>
                                <th>Challan Date</th>
                              </thead>
                              {/* {chanllanNoAndDate?.map((item) => ( */}
                              <tbody>
                                <tr>
                                  <td>{rowDto?.header?.doNo}</td>
                                  <td className="secondLevelTd">
                                    <table style={{ width: "100%" }}>
                                      <tbody style={{ width: "100%" }}>
                                        {rowDto?.objDelivery?.map((item) => (
                                          <tr>
                                            <td className="text-center">
                                              {item?.deliveryCode}
                                            </td>
                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>
                                  </td>
                                  {/* h */}
                                  <td className="secondLevelTd">
                                    <table style={{ width: "100%" }}>
                                      <tbody style={{ width: "100%" }}>
                                        {rowDto?.objDelivery?.map((item) => (
                                          <tr>
                                            <td className="text-center">
                                              {_dateFormatter(
                                                item?.deliveryDate
                                              )}
                                            </td>
                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>
                                  </td>
                                </tr>
                              </tbody>
                              {/* ))} */}
                            </table>

                            <div style={{ display: "flex" }}>
                              <div
                                style={{
                                  width: "50%",
                                  padding: "10px 0px 0px 10px",
                                }}
                              >
                                <p style={{ fontWeight: 600 }}>
                                  Company Name & Address :
                                </p>
                                <p></p>
                                <br />
                                <p style={{ fontWeight: 600 }}>
                                  {
                                    rowDto?.header?.compnayNameAndAddress.split(
                                      "_"
                                    )[0]
                                  }
                                </p>
                                {
                                  rowDto?.header?.compnayNameAndAddress.split(
                                    "_"
                                  )[1]
                                }
                                <p>Phone : </p>
                                <br />
                                <br />
                                <br />
                                <div
                                  style={
                                    {
                                      // display: "flex",
                                      // justifyContent: "flex-start",
                                    }
                                  }
                                >
                                  <span style={{ fontWeight: 700 }}>
                                    Project Name:{" "}
                                  </span>
                                  <span>{rowDto?.header?.projectName}</span>
                                </div>
                              </div>
                              <div style={{ width: "50%" }}>
                                <table
                                  border="1"
                                  style={{ width: "100%" }}
                                  className="text-center"
                                >
                                  <thead>
                                    <th>Purchase Order No</th>
                                    <th>Date</th>
                                  </thead>
                                  <tbody>
                                    <td>{rowDto?.header?.purchaseOrderNo}</td>
                                    <td>
                                      {_dateFormatter(
                                        rowDto?.header?.purchaseDate
                                      )}
                                    </td>
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div style={{ width: "40%" }}>
                          <div
                            style={{
                              width: "100%",
                              padding: "23px 0px",
                            }}
                            className="text-center"
                          >
                            <h2>Commercial Invoice</h2>
                          </div>
                          <div
                            style={{
                              border: "1px solid black",
                              width: "100%",
                              padding: "10px 0px 0px 10px",
                            }}
                          >
                            <p style={{ fontWeight: 700 }}>
                              Contact Person & Designation :
                            </p>
                            <p style={{ fontWeight: 700 }}>
                              {rowDto?.header?.contactPersonAndDesignation}
                            </p>
                            {/* <p style={{ fontWeight: 700 }}>Managing Director</p> */}
                            <br />
                            <br />
                            <br />
                          </div>
                          <div
                            style={{
                              border: "1px solid black",
                              width: "100%",
                              padding: "10px 0px 45px 10px",
                            }}
                          >
                            <p style={{ fontWeight: 700 }}>Contact Number</p>
                            <p style={{ fontWeight: 700 }}>
                              Mobile No : {rowDto?.header?.contactNo}
                            </p>{" "}
                            <br />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="table-responsive">
                        <table style={{ width: "100%" }}>
                          <thead className="text-center">
                            <tr>
                              <th>No</th>
                              <th>Product Description</th>
                              <th>Quantity (MT)</th>
                              <th>Unit price(Tk.) </th>
                              <th>Amount</th>
                            </tr>
                          </thead>
                          <tbody>
                            {rowDto?.row?.length > 0 &&
                              rowDto?.row?.map((tableData, index) => (
                                <>
                                  <tr key={index}>
                                    <td style={{ width: "50px" }}>
                                      {" "}
                                      {index + 1}{" "}
                                    </td>
                                    <td
                                      className="text-left"
                                      style={{ width: "350px" }}
                                    >
                                      {"  "}
                                      {tableData?.productDescription}{" "}
                                    </td>
                                    <td
                                      style={{ minWidth: "20px" }}
                                      className="text-right"
                                    >
                                      {_formatMoney(tableData?.quantity, 2)}
                                    </td>
                                    <td
                                      style={{ minWidth: "20px" }}
                                      className="text-right"
                                    >
                                      {_formatMoney(tableData?.unitPrice, 2)}
                                    </td>
                                    <td
                                      style={{ minWidth: "30px" }}
                                      className="text-right"
                                    >
                                      {" "}
                                      {_formatMoney(tableData?.amount, 2)}{" "}
                                    </td>
                                  </tr>
                                </>
                              ))}
                            {rowDto?.row?.length > 0 && (
                              <>
                                <tr>
                                  <td
                                    colSpan="2"
                                    className="text-right"
                                    style={{ fontWeight: 600 }}
                                  >
                                    Total Sales
                                  </td>
                                  <td
                                    className="text-right"
                                    style={{ fontWeight: 600 }}
                                  >
                                    {_formatMoney(grandTotal?.totalQuantity, 2)}
                                  </td>
                                  <td></td>
                                  <td
                                    className="text-right"
                                    style={{ fontWeight: 600 }}
                                  >
                                    {_formatMoney(grandTotal?.totalAmount, 2)}
                                  </td>
                                </tr>
                                <tr>
                                  <td colSpan="2" className="no-data"></td>
                                  <td
                                    className="text-left no-data"
                                    style={{ fontWeight: 600 }}
                                  >
                                    Transportation Cost
                                  </td>
                                  <td className="no-data"></td>
                                  <td className="text-right">
                                    {_formatMoney(
                                      rowDto?.header?.transportCost,
                                      2
                                    )}
                                  </td>
                                </tr>
                                <tr>
                                  <td colSpan="2" className="no-data"></td>
                                  <td
                                    className="text-left no-data"
                                    style={{ fontWeight: 600 }}
                                  >
                                    Discount
                                  </td>
                                  <td className="no-data"></td>
                                  <td className="text-right">
                                    {_formatMoney(rowDto?.header?.discount, 2)}
                                  </td>
                                </tr>
                                <tr>
                                  <td colSpan="2" className="no-data"></td>
                                  <td
                                    className="text-left no-data"
                                    style={{ fontWeight: 600 }}
                                  >
                                    Advanced Payment
                                  </td>
                                  <td className="no-data"></td>
                                  <td className="text-right">
                                    {_formatMoney(
                                      rowDto?.header?.advancePayment,
                                      2
                                    )}
                                  </td>
                                </tr>
                                <tr>
                                  <td colSpan="2" className="no-data"></td>
                                  <td
                                    style={{ fontWeight: 600 }}
                                    className="no-data"
                                  >
                                    Total Amount
                                  </td>
                                  <td className="no-data"></td>
                                  <td
                                    className="text-right"
                                    style={{ fontWeight: 600 }}
                                  >
                                    {_formatMoney(
                                      rowDto?.header?.totalAmount,
                                      2
                                    )}
                                  </td>
                                </tr>
                              </>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                    <div style={{ marginTop: "10px" }}>
                      <p>
                        <span style={{ fontWeight: 600 }}>Inword :</span>{" "}
                        {rowDto?.header?.amountInWords.toUpperCase()}
                      </p>
                    </div>
                    <div
                      style={{
                        marginTop: "180px",
                        marginBottom: "50px",
                        fontWeight: 600,
                        display: "flex",
                        justifyContent: "space-around",
                      }}
                    >
                      <p style={{ borderTop: "dashed" }}>Customer Signature</p>
                      <p style={{ borderTop: "dashed" }}>
                        Authorised Signature
                      </p>
                      <p style={{ borderTop: "dashed" }}>Approved by</p>
                    </div>
                  </div>
                </Form>
              </CardBody>
            </Card>
          </div>
        )}
      </Formik>
    </>
  );
}
