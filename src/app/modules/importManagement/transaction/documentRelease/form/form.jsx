/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import NewSelect from "../../../../_helper/_select";
import InputField from "../../../../_helper/_inputField";
import "../documentRelease.css";
import ICustomTable from "../../../../_helper/_customTable";
import IDelete from "../../../../_helper/_helperIcons/_delete";
import numberWithCommas from "../../../../_helper/_numberWithCommas";
import { getDays } from "../helper";
import { _formatMoney } from "../../../../_helper/_formatMoney";

const header = [
  "SL",
  "Invoice Payment Amount",
  "Other Amount",
  "Bank Rate",
  "Libor Rate",
  "Total Amount",
  "Net Pay Amount",
  "PG Status",
  "Start Date",
  "Due Date",
  "Tenor Days",
  "Action",
];
// Validation schema
const validationSchema = Yup.object().shape({
  exchangeRate: Yup.number().required("Exchange Rate is required"),
  docReleaseCharge: Yup.number().when("lcType", {
    is: (val) => val?.label !== "At Sight",
    then: Yup.number()
      .positive("DOC Release Charge must be positive")
      .required("DOC Release Charge is required"),
  }),
  vatOnDocRelease: Yup.number().when("lcType", {
    is: (val) => val?.label !== "At Sight",
    then: Yup.number()
      .positive("VAT On Doc Release must be positive")
      .required("VAT On Doc Release is required"),
  }),
  numLiborRate: Yup.number().when("lcType", {
    is: (val) => val?.label !== "At Sight",
    then: Yup.number().positive("Libor Rate must be positive"),
  }),
  numBankRate: Yup.number().when("lcType", {
    is: (val) => val?.label !== "At Sight",
    then: Yup.number().positive("Bank Rate must be positive"),
  }),
  // otherCharges: Yup.number().when("lcType", {
  //   is: (val) => val?.label !== "At Sight",
  //   then: Yup.number().positive(
  //     "Other Charges must be positive and greater then 0"
  //   ),
  // }),

  vatOnDocReleaseAtSight: Yup.number().when("lcType", {
    is: (val) => val?.label === "At Sight",
    then: Yup.number()
      .positive("VAT On Doc Release must be positive")
      .required("VAT On Doc Release is required"),
  }),
  docReleaseChargeAtSight: Yup.number().when("lcType", {
    is: (val) => val?.label === "At Sight",
    then: Yup.number()
      .positive("DOC Release Charge must be positive")
      .required("DOC Release Charge is required"),
  }),
  documentForwardDate: Yup.date().required("Document Forward Date is required"),

  // totalAmount: Yup.number().when("lcType", {
  //   is: (val) => val?.label === "At Sight",
  //   then: Yup.number()
  //     .positive("Total Amount must be positive")
  //     .required("Total Amount is required"),
  // }),
});

export default function _Form({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  location,
  rowDto,
  setRowDto,
  setter,
  remover,
  type,
  cnfDDL,
  setCnfDDL,
  bankAndLaborRateCalculation,
}) {
  const { poNumber, lcNumber, shipmentCode } = location?.state;

  const calculation = (values, setFieldValue) => {
    if (values?.exchangeRate) {
      let inv_exc_multiple = +values?.invoiceAmount * +values?.exchangeRate;
      setFieldValue("totalCharge", inv_exc_multiple);
    }
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler(values, () => {
            resetForm(initData);
          });
        }}
      >
        {({
          handleSubmit,
          // resetForm,
          values,
          errors,
          touched,
          setFieldValue,
          // isValid,
          // handleChange,
        }) => (
          <>
            {/* {console.log("values", values)} */}
            {/* {console.log("initData", initData)} */}
            {/* {console.log("errors", errors)} */}
            <Form className="form form-label-right">
              <div className="d-flex justify-content-center align-items-center">
                <div style={{ fontWeight: "900", marginRight: "20px" }}>
                  PO Number: {poNumber}
                </div>
                <div style={{ fontWeight: "900", marginRight: "30px" }}>
                  LC Number: {lcNumber}
                </div>
                <div style={{ fontWeight: "900", marginRight: "30px" }}>
                  Shipment Code: {shipmentCode}
                </div>
              </div>
              {/* </div> */}
              <div className="global-form">
                <div className="row ">
                  <div className="col-lg-3">
                    <NewSelect
                      name="lcType"
                      // options={[]}
                      value={values?.lcType}
                      label="LC Type"
                      onChange={(valueOption) => {
                        setFieldValue("lcType", valueOption);
                      }}
                      placeholder="LC Type"
                      errors={errors}
                      touched={touched}
                      isDisabled
                    />
                  </div>

                  <div className="col-lg-3">
                    <label>BL/AWB/TR Number</label>
                    <InputField
                      value={values?.BlAwbTRNumber}
                      placeholder="BL/AWB/TR Number"
                      name="BlAwbTRNumber"
                      type="text"
                      disabled
                    />
                  </div>
                  <div className="col-lg-3">
                    <label>BL/AWB/TR Date</label>
                    <InputField
                      value={values?.BlAwbTrDate}
                      placeholder="BL/AWB/TR Date"
                      name="BlAwbTrDate"
                      type="date"
                      disabled
                    />
                  </div>

                  <div className="col-lg-3">
                    <label>Invoice No</label>
                    <InputField
                      value={values?.invoiceNo}
                      placeholder="Invoice No"
                      name="invoiceNo"
                      type="text"
                      disabled
                    />
                  </div>

                  <div className="col-lg-3">
                    <label>Invoice Date</label>
                    <InputField
                      value={values?.invoiceDate}
                      placeholder="Invoice Date"
                      name="invoiceDate"
                      type="date"
                      disabled
                    />
                  </div>
                  <div className="col-lg-3">
                    <label>Doc Receive By Bank Date</label>
                    <InputField
                      value={values?.docReleaseByBankDate}
                      placeholder="Doc Receive By Bank Date"
                      name="docReleaseByBankDate"
                      type="date"
                      disabled={type === "view"}
                    />
                  </div>
                  <div className="col-lg-3">
                    <label>Payment Date</label>
                    <InputField
                      value={values?.paymentDate}
                      placeholder="Payment Date"
                      name="paymentDate"
                      type="date"
                      disabled={type === "view"}
                    />
                  </div>

                  <div className="col-lg-3">
                    <label>{`Invoice Amount (${values?.currencyName})`}</label>
                    <InputField
                      // value={values?.invoiceAmount}
                      value={numberWithCommas(values?.invoiceAmount)}
                      placeholder="Invoice Amount"
                      name="invoiceAmount"
                      type="text"
                      disabled
                    />
                  </div>
                  <div className="col-lg-3">
                    <label>Exchange Rate</label>
                    <InputField
                      value={values?.exchangeRate}
                      placeholder="Exchange Rate"
                      name="exchangeRate"
                      type="number"
                      step="any"
                      min="1"
                      disabled={values?.exchangeRate === 1 || type === "view"}
                      onChange={(e) => {
                        setFieldValue("exchangeRate", e?.target?.value);
                        calculation(
                          { ...values, exchangeRate: e?.target?.value },
                          setFieldValue
                        );
                      }}
                    />
                  </div>

                  <div className="col-lg-3">
                    <label>Invoice Amount (BDT)</label>
                    <InputField
                      value={numberWithCommas(values?.totalCharge)}
                      placeholder="Invoice Amount (BDT)"
                      name="totalCharge"
                      type="text"
                      min="1"
                      disabled
                    />
                  </div>

                  {/* {values?.lcType?.label === "At Sight" && (
                    <div className="col-lg-3">
                      <label>Other Charge</label>
                      <InputField
                        value={values?.otherCharges}
                        placeholder="Others Charges"
                        name="otherCharges"
                        type="number"
                        min="1"
                        disabled={type === "view"}
                        onChange={(e) => {
                          setFieldValue("otherCharges", e?.target?.value);
                          setFieldValue(
                            "totalAmount",
                            initData?.invoiceAmount +
                              Number(e?.target?.value) || 0
                          );
                        }}
                      />
                    </div>
                  )} */}
                  {/* {values?.lcType?.label === "At Sight" && (
                    <div className="col-lg-3">
                      <label>Total Amount</label>
                      <InputField
                        value={values?.totalAmount || values?.totalCharge}
                        placeholder="totalAmount"
                        name="Total Amount"
                        type="number"
                        min="1"
                        disabled={type === "view"}
                      />
                    </div>
                  )} */}
                  {values?.lcType?.label === "At Sight" && (
                    <div className="col-lg-3">
                      {/* <label>DOC Release Charge</label> */}
                      <label>DOC Release / Bank Charge(Including VAT)</label>
                      <InputField
                        value={values?.docReleaseChargeAtSight}
                        placeholder="DOC Release Charge"
                        name="docReleaseChargeAtSight"
                        step="any"
                        type="number"
                        min="1"
                        disabled={type === "view"}
                      />
                    </div>
                  )}
                  {values?.lcType?.label === "At Sight" && (
                    <div className="col-lg-3">
                      <label>VAT On Doc Release Charge</label>
                      <InputField
                        value={values?.vatOnDocReleaseAtSight}
                        placeholder="VAT On DocRelease Charge"
                        name="vatOnDocReleaseAtSight"
                        type="number"
                        step="any"
                        min="1"
                        disabled={type === "view"}
                      />
                    </div>
                  )}

                  {/* lctype not atsight */}

                  {values?.lcType?.label !== "At Sight" && (
                    <div className="col-lg-3">
                      {/* <label>Doc Release Charge</label> */}
                      <label>DOC Release Charge(Including VAT)</label>
                      <InputField
                        value={values?.docReleaseCharge}
                        placeholder="Doc Release Charges"
                        name="docReleaseCharge"
                        type="number"
                        step="any"
                        min="1"
                        onChange={(e) => {
                          setFieldValue(
                            "docReleaseCharge",
                            e?.target?.value ? Number(e?.target?.value) : ""
                          );
                        }}
                        disabled={type === "view"}
                      />
                    </div>
                  )}
                  {values?.lcType?.label !== "At Sight" && (
                    <div className="col-lg-3">
                      <label>VAT On Doc Release</label>
                      <InputField
                        value={values?.vatOnDocRelease}
                        placeholder="VAT On Doc Release"
                        name="vatOnDocRelease"
                        type="number"
                        min="1"
                        step="any"
                        disabled={type === "view"}
                        onChange={(e) => {
                          setFieldValue(
                            "vatOnDocRelease",
                            e?.target?.value ? Number(e?.target?.value) : ""
                          );
                        }}
                      />
                    </div>
                  )}

                  {/* lctype not atsight */}

                  {values?.lcType?.label !== "At Sight" && type === "view" && (
                    <div className="col-lg-3">
                      <label>PG Amount</label>
                      <InputField
                        value={values?.pgAmount}
                        name="pgAmount"
                        placeholder="PG Amount"
                        type="number"
                        step="any"
                        disabled
                      />
                    </div>
                  )}
                  {values?.lcType?.label !== "At Sight" && type === "view" && (
                    <div className="col-lg-3">
                      <label>Tenor Days</label>
                      <InputField
                        value={values?.tenorDays}
                        name="tenorDays"
                        placeholder="Tenor Days"
                        type="text"
                        disabled
                      />
                    </div>
                  )}
                  <div className="col-lg-3">
                    <label>CNF Doc Frw Date</label>
                    <InputField
                      value={values?.documentForwardDate}
                      name="documentForwardDate"
                      placeholder="CNF Doc Frw Date"
                      type="date"
                      disabled={type === "view"}
                    />
                  </div>
                  <div className="col-lg-3">
                    <NewSelect
                      name="cnfDDL"
                      options={cnfDDL || []}
                      value={values?.cnfDDL}
                      label="CnF Agency"
                      onChange={(valueOption) => {
                        setFieldValue("cnfDDL", valueOption);
                      }}
                      placeholder="CnF Agency"
                      errors={errors}
                      touched={touched}
                      isDisabled={true}
                    // isDisabled={type === "view"}
                    />
                  </div>
                  {values?.lcType?.label === "At Sight" && (
                     <div className="col-lg-1 mt-5">
                     <div className="d-flex align-items-center">
                       <input
                         type="checkbox"
                         checked={values?.isLtr}
                         onChange={(e) => setFieldValue("isLtr", e.target.checked)}
                         disabled={type === "view"}
                       />
                       <label className="pl-2">Is LTR</label>
                     </div>
                   </div>
                  )}
                </div>
              </div>

              {values?.lcType?.label !== "At Sight" && type !== "view" && (
                <div>
                  <h6>Create Schedule</h6>
                  <div className="global-form">
                    <div className="row align-items-end">
                      <div className="col-lg-3">
                        <label>Invoice Pay Amount</label>
                        <InputField
                          value={values?.paymentAmount}
                          name="paymentAmount"
                          placeholder="Pay Amount"
                          type="number"
                          // step="any"
                          disabled={type === "view"}
                        />
                      </div>

                      <div className="col-lg-3">
                        <label>Others Charge</label>
                        <InputField
                          value={values?.otherCharges}
                          placeholder="Others Charge"
                          name="otherCharges"
                          type="number"
                          disabled={type === "view"}
                        // min="1"
                        //onChange={(e) => {
                        //setFieldValue("otherCharges", e?.target?.value);
                        //  setFieldValue(
                        //    "pgAmount",
                        //    initData?.pgAmount + Number(e?.target?.value) || 0
                        //  );
                        // }}
                        />
                      </div>
                      {/* <div className='col-lg-3'>
                        <label>PG Amount</label>
                        <InputField
                          value={values?.pgAmount}
                          name='pgAmount'
                          placeholder='PG Amount'
                          type='number'
                          disabled={type === "view"}
                        />
                      </div> */}
                      <div className="col-lg-3">
                        <label>Start Date</label>
                        <input
                          value={values?.startDate}
                          name="startDate"
                          placeholder="Start Date"
                          type="date"
                          onChange={(e) => {
                            setFieldValue("startDate", e.target.value);
                            setFieldValue(
                              "tenorDays",
                              getDays(e.target.value, values?.dueDate)
                            );
                          }}
                          disabled={rowDto.length > 0 || type === "view"}
                        />
                      </div>
                      <div className="col-lg-3">
                        <label>Due Date</label>
                        <input
                          value={values?.dueDate}
                          name="dueDate"
                          placeholder="Due Date"
                          type="date"
                          onChange={(e) => {
                            setFieldValue("dueDate", e.target.value);
                            setFieldValue(
                              "tenorDays",
                              getDays(values.startDate, e.target.value)
                            );
                          }}
                          min={values?.startDate + 1}
                        />
                      </div>
                      <div className="col-lg-3">
                        <label>Tenor Days</label>
                        <InputField
                          value={values?.tenorDays}
                          name="tenorDays"
                          placeholder="Tenor Days"
                          type="text"
                          disabled
                        />
                      </div>
                      <div className="col-lg-3">
                        <label>Bank Rate</label>
                        <InputField
                          value={values?.numBankRate}
                          name="numBankRate"
                          placeholder="Bank Rate"
                          type="number"
                          disabled={type === "view"}
                        />
                      </div>
                      <div className="col-lg-3">
                        <label>Libor Rate</label>
                        <InputField
                          value={values?.numLiborRate}
                          name="numLiborRate"
                          placeholder="Libor Rate"
                          type="number"
                          disabled={type === "view"}
                        />
                      </div>
                      <div className="col-auto d-flex">
                        <input
                          type="checkbox"
                          id="pg_checkbox"
                          checked={values?.pgAmountCheck}
                          name="pgAmountCheck"
                          onChange={(event) => {
                            setFieldValue(
                              "pgAmountCheck",
                              event.target.checked
                            );
                          }}
                        />
                        <label for="pg_checkbox" className="mr-2 ml-3 p-0">
                          PG Amount
                        </label>
                      </div>
                      {values?.lcType?.label !== "At Sight" && type !== "view" && (
                        <div
                          style={{ marginTop: "22px" }}
                          className="col-auto ml-auto"
                        >
                          <button
                            className="btn btn-primary"
                            onClick={() => {
                              setter(values, rowDto);
                            }}
                            type="button"
                            disabled={
                              !values?.paymentAmount ||
                              !values?.startDate ||
                              !values?.dueDate
                            }
                          >
                            Add
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {values?.lcType?.label !== "At Sight" && (
                <ICustomTable
                  ths={
                    type !== "view"
                      ? header
                      : [
                        "SL",
                        "Invoice Payment Amount",
                        "Other Amount",
                        "Net Pay Amount",
                        "PG Status",
                        "Start Date",
                        "Due Date",
                        "Tenor Days",
                      ]
                  }
                >
                  {rowDto?.length > 0 &&
                    rowDto?.map((item, index) => {
                      return (
                        <tr key={index}>
                          <td className="text-center">{index + 1}</td>

                          <td className="text-center">
                            {_formatMoney(item?.paymentAmount)}
                          </td>
                          <td className="text-center">
                            {_formatMoney(item?.otherAmount)}
                          </td>
                          {type !== "view" && (
                            <>
                              <td className="text-center">
                                {item?.bankRate}
                              </td>
                              <td className="text-center">
                                {item?.liborRate}
                              </td>
                              <td className="text-center">
                                {_formatMoney(item?.netAmountFc)}
                              </td>
                            </>
                          )}
                          <td className="text-center">
                            {(item?.netPayAmount).toFixed(4)}
                          </td>
                          <td className="text-center">{item?.pgStatus}</td>
                          <td className="text-center">{item?.startDate}</td>
                          <td className="text-center">{item?.dueDate}</td>
                          <td className="text-center">{item?.tenorDays}</td>
                          {type !== "view" && (
                            <td className="text-center">
                              <IDelete remover={remover} id={index} />
                            </td>
                          )}
                        </tr>
                      );
                    })}
                  {/* <tr>
                    <td
                      className="text-center font-weight-bold"
                      style={{ background: "#D3F0EC" }}
                    >
                      Total Amount
                    </td>
                    <td
                      className="text-center font-weight-bold"
                      style={{ background: "#D3F0EC" }}
                    >
                      {_(
                        rowDto.reduce((acc, item) => {
                          return acc + Number(item?.paymentAmount);
                        }, 0)
                      )}
                    </td>
                    <td
                      className="text-center font-weight-bold"
                      style={{ background: "#D3F0EC" }}
                    >
                      {numberWithCommas(
                        rowDto.reduce((acc, item) => {
                          return acc + Number(item?.otherAmount);
                        }, 0)
                      )}
                    </td>
                    <td
                      className="text-center font-weight-bold"
                      style={{ background: "#D3F0EC" }}
                    >
                      {numberWithCommas(
                        rowDto.reduce((acc, item) => {
                          return acc + Number(item?.netAmountFc);
                        }, 0)
                      )}
                    </td>
                  </tr> */}
                  <tr>
                    {/* <td style={{ border: "none", background: "white" }}></td>
                    <td style={{ border: "none", background: "white" }}></td> */}
                    <td
                      className="text-center font-weight-bold"
                      style={{ background: "#D3F0EC" }}
                    >
                      Remaining Amount
                    </td>
                    <td
                      className="text-center font-weight-bold"
                      style={{ background: "#D3F0EC" }}
                    >
                      {_formatMoney(
                        values?.invoiceAmount -
                        rowDto.reduce((acc, item) => {
                          return acc + item?.paymentAmount;
                        }, 0)
                      )}
                    </td>
                  </tr>
                </ICustomTable>
              )}

              <button
                type="submit"
                style={{ display: "none" }}
                ref={btnRef}
                onSubmit={() => handleSubmit()}
              ></button>
              <button
                type="reset"
                style={{ display: "none" }}
                ref={resetBtnRef}
              // onSubmit={() => resetForm(initData)}
              ></button>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}
