import React from "react";
import { Formik, Form } from "formik";
import InputField from "../../../../_helper/_inputField";
import { cleckSent } from "../helper";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import { _todayDate } from "../../../../_helper/_todayDate";
// import { OverlayTrigger, Tooltip } from "react-bootstrap";
import "../paymentOnMaturity.css";
import { _formatMoney } from './../../../../_helper/_formatMoney';

export default function _Form({
  initData,
  btnRef,
  // saveHandler,
  resetBtnRef,
  gridData,
  singleItem,
  setRowAmount,
  setGridData,
  setIsShowModal,
  setDisabled,
  accountId,
  businessUnitId,
  getGrid,
}) {
  // console.log("singleItem", singleItem);
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          // saveHandler({ ...values }, () => {
          //   resetForm(gridData);
          //   // resetForm(initData);
          //   setGridData([]);
          // });
        }}
      >
        {({
          // handleSubmit,
          // resetForm,
          values,
          // errors,
          // touched,
          setFieldValue,
          // setValues,
        }) => (
          <>
            {/* {console.log("vlaues", values)} */}
            <div className="d-flex justify-content-center align-items-center pt-5">
              <div style={{ fontWeight: "900" }}>
                PO : {singleItem?.poNumber}
              </div>
              <div style={{ fontWeight: "900", marginLeft: "30px" }}>
                {" "}
                LC : {singleItem?.lcNumber}
              </div>
              <div style={{ fontWeight: "900", marginLeft: "30px" }}>
                {" "}
                Shipment No : {singleItem?.shipmentCode}
              </div>
            </div>
            <Form className="form form-label-right">
              <div className="global-form paymentOnMaturity">
                <div
                  className="loan-scrollable-table"
                  style={{ maxHeight: "30em" }}
                >
                  <div className="scroll-table _table">
                    <table className="global-table table">
                      <thead>
                        <tr>
                          <th style={{ minWidth: "40px" }}>SL</th>
                          <th style={{ minWidth: "100px" }}>
                            Payment Schedule
                          </th>
                          <th style={{ minWidth: "50px" }}>Start Date</th>
                          <th style={{ minWidth: "70px" }}>Payment Date</th>
                          <th style={{ minWidth: "70px" }}>
                            Invoice Pay Amount
                          </th>
                          <th style={{ minWidth: "70px" }}>Other Amount</th>
                          {/* <th style={{ minWidth: "70px" }}>PG Status</th> */}
                          <th style={{ minWidth: "70px" }}>
                            Net Pay Amount (FC)
                          </th>
                          <th style={{ minWidth: "70px" }}>Exchange Rate</th>
                          <th style={{ minWidth: "70px" }}>Libor Rate</th>
                          <th style={{ minWidth: "70px" }}>Bank Rate</th>
                          <th style={{ minWidth: "150px" }}>
                            Total Amount(BDT)
                          </th>
                          <th style={{ minWidth: "70px" }}>Action</th>
                        </tr>
                      </thead>
                      <tbody style={{ overflow: "scroll" }}>
                        {gridData?.map((item, index) => {
                          return (
                            <tr key={index}>
                              <td
                                style={{ width: "30px" }}
                                className="text-center"
                              >
                                {index + 1}
                              </td>
                              <td className="text-center">
                                {item?.paymentScheduleCode}
                              </td>
                              <td
                                style={{ width: "80px" }}
                                className="text-center"
                              >
                                {_dateFormatter(item?.dteStartDate)}
                              </td>
                              <td
                                style={{ width: "80px" }}
                                className="text-center"
                              >
                                <InputField
                                  value={item?.paymentDate}
                                  name="paymentDate"
                                  onChange={(e) => {
                                    setFieldValue(
                                      "paymentDate",
                                      e?.target?.value
                                    );
                                    setRowAmount(
                                      "paymentDate",
                                      index,
                                      e?.target?.value,
                                      gridData,
                                      setGridData
                                    );
                                  }}
                                  // disabled={item?.isFinalPayment === true}
                                  disabled={item?.actualPayAmount > 0}
                                  // placeholder="exchangeRate"
                                  type="date"
                                  min={_todayDate()}
                                />
                              </td>
                              <td className="text-center">
                                {item?.invoicePayAmount}
                             
                              </td>
                              <td className="text-center">
                                {item?.otherCharge}{" "}
                              </td>
                              {/* <td className="text-center">
                                {item?.isPG ? "Yes" : "No"}{" "}
                              </td> */}
                              <td className="text-center">
                                {/* {item?.netPayAmount} */}
                                <InputField
                                  value={item?.netPayAmount}
                                  name="netPayAmount"
                                  onChange={(e) => {
                                    setFieldValue(
                                      "netPayAmount",
                                      e?.target?.value
                                    );
                                    setRowAmount(
                                      "netPayAmount",
                                      index,
                                      e?.target?.value,
                                      gridData,
                                      setGridData
                                    );
                                    // mPayCalculation(item, values);
                                  }}
                                  // disabled={item?.isFinalPayment === true}
                                  disabled={item?.actualPayAmount > 0}
                                  type="number"
                                  min="0"
                                />
                              </td>
                              <td className="text-center">
                                <InputField
                                  value={item?.exchangeRate ?? ""}
                                  name="exchangeRate"
                                  onChange={(e) => {
                                    setFieldValue(
                                      "exchangeRate",
                                      e?.target?.value
                                    );
                                    setRowAmount(
                                      "exchangeRate",
                                      index,
                                      e?.target?.value,
                                      gridData,
                                      setGridData
                                    );
                                    // mPayCalculation(item, values);
                                  }}
                                  // disabled={item?.isFinalPayment === true}
                                  disabled={item?.actualPayAmount > 0}
                                  type="number"
                                  min="0"
                                />
                              </td>
                              <td className="text-center">
                                <InputField
                                  value={item?.liborRate ?? ""}
                                  name="liborRate"
                                  // disabled={item?.isFinalPayment === true}
                                  disabled={item?.actualPayAmount > 0}
                                  onChange={(e) => {
                                    setFieldValue(
                                      "liborRate",
                                      e?.target?.value
                                    );
                                    setRowAmount(
                                      "liborRate",
                                      index,
                                      e?.target?.value,
                                      gridData,
                                      setGridData
                                    );
                                  }}
                                  type="number"
                                  min="0"
                                />
                              </td>
                              <td className="text-center">
                                <InputField
                                  value={item?.bankRate ?? ""}
                                  name="bankRate"
                                  // disabled={item?.isFinalPayment === true}
                                  disabled={item?.actualPayAmount > 0}
                                  onChange={(e) => {
                                    setFieldValue("bankRate", e?.target?.value);
                                    setRowAmount(
                                      "bankRate",
                                      index,
                                      e?.target?.value,
                                      gridData,
                                      setGridData
                                    );
                                    // mPayCalculation(item, values);
                                  }}
                                  type="number"
                                  min="0"
                                />
                              </td>
                              <td className="text-right">{_formatMoney(item?.totalAmount)}
                                {/* <OverlayTrigger
                                  overlay={
                                    <Tooltip
                                      className="mytooltip"
                                      id="info-tooltip"
                                    >
                                      {" "}
                                      {item?.totalAmount}{" "}
                                    </Tooltip>
                                  }
                                >
                                  <InputField
                                    value={item?.totalAmount}
                                    name="totalAmount"
                                    disabled={item?.isFinalPayment === true}
                                    onChange={(e) => {
                                      // setFieldValue("totalAmount", e?.target?.value);
                                      setRowAmount(
                                        "totalAmount",
                                        index,
                                        e?.target?.value,
                                        gridData,
                                        setGridData
                                      );
                                      // mPayCalculation(item, values, setFieldValue);
                                    }}
                                    type="number"
                                    min="0"
                                  />
                                </OverlayTrigger> */}
                              </td>
                              {/* <td className='text-center'>
                                <InputField
                                  value={item?.vatAmount}
                                  name='vatAmount'
                                  disabled={item?.isFinalPayment === true}
                                  onChange={(e) => {
                                    setFieldValue(
                                      "vatAmount",
                                      e?.target?.value
                                    );
                                    setRowAmount(
                                      "vatAmount",
                                      index,
                                      e?.target?.value,
                                      gridData,
                                      setGridData
                                    );
                                  }}
                                  type='number'
                                  min='0'
                                />
                              </td> */}
                              <td className="text-center">
                                <span className="text-center">
                                  <button
                                    style={
                                      item?.actualPayAmount > 0
                                        ? {
                                            padding: "1px 5px",
                                            fontSize: "11px",
                                            width: "85px",
                                            background: "green",
                                            color: "white",
                                          }
                                        : {
                                            padding: "1px 5px",
                                            fontSize: "11px",
                                            width: "85px",
                                          }
                                    }
                                    className="btn btn-outline-dark mr-1 pointer"
                                    type="button"
                                    disabled={item?.actualPayAmount > 0}
                                    onClick={() => {
                                      cleckSent(
                                        item,
                                        values,
                                        setDisabled,
                                        accountId,
                                        businessUnitId,
                                        singleItem,
                                        () => {
                                          item["isFinalPayment"] = true;
                                          setGridData([...gridData]);
                                          getGrid();
                                        }
                                      );
                                    }}
                                  >
                                    
                                    {item?.actualPayAmount > 0 ? "Sent" : "Save"}
                                  </button>
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}
