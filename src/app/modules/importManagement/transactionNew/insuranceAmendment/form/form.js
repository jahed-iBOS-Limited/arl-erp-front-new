/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { Formik, Form } from "formik";
import { validationSchema } from "../helper";
import InputField from "../../../../_helper/_inputField";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import numberWithCommas from "../../../../_helper/_numberWithCommas";
import removeComma from "../../../../_helper/_removeComma";
import NewSelect from "../../../../_helper/_select";
// import { toast } from "react-toastify";

export default function _Form({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  state,
  insuranceSingleData,
  singleItem,
  lcAmendmentDDL,
  type
}) {
  console.log('single item: ', singleItem);
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{
          ...initData,
          amendmentDate: _dateFormatter(initData?.amendmentDate),
          dueDate: _dateFormatter(initData?.dueDate),
          coverNoteNumber: state?.coverNoteNumber,
          piamountFC: numberWithCommas(state?.numPiAmountFC),
          // numVatamount: singleItem?.type !=="view" ? numberWithCommas(state?.numVatamount) || 0,
          insuranceDate: _dateFormatter(state?.dteInsuranceDate),
          poId: state?.poId,
          ponumber: state?.poNumber,
          lcnumber: insuranceSingleData?.lcnumber,
        }}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler(values, () => {
            resetForm(initData);
          });
        }}
      >
        {({ handleSubmit, resetForm, values, errors, setFieldValue }) => (
          <>
            <div className="d-flex justify-content-center align-items-center">
              {console.log("initData: ", initData)}
              <div style={{ fontWeight: "900", marginLeft: "30px" }}>
                PO : {values?.ponumber}
              </div>
              <div style={{ fontWeight: "900", marginLeft: "30px" }}>
                LC : {values?.lcnumber}
              </div>
            </div>
            {/* {console.log("values",values)} */}
            <Form className="form form-label-right">
              <div className="row">
                <div className="col-lg-12">
                  <div className="row global-form">
                    <>
                      <div className="col-lg-3">
                        <NewSelect
                          value={values?.lcAmendment}
                          options={lcAmendmentDDL || []}
                          placeholder="LC Amendment"
                          name="lcAmendment"
                          label="LC Amendment"
                          onChange={(valueOption) => {
                            setFieldValue("lcAmendment", valueOption);
                          }}
                          isDisabled={type?.type === "view"}
                        />
                      </div>
                      <div className="col-lg-3">
                        <label htmlFor="coverNoteNumber">
                          Cover Note Number
                        </label>
                        <InputField
                          value={values?.coverNoteNumber}
                          placeholder="Cover Note Number"
                          name="coverNoteNumber"
                          disabled
                        />
                      </div>
                      <div className="col-lg-3">
                        <label htmlFor="reason">Reason</label>
                        <InputField
                          value={values?.reason}
                          placeholder="Reason"
                          name="reason"
                          disabled={type?.type === "view"}
                        />
                      </div>
                      <div className="col-lg-3">
                        <label htmlFor="amendmentDate">Amendment Date</label>
                        <InputField
                          value={values?.amendmentDate}
                          placeholder="Amendment Date"
                          name="amendmentDate"
                          type="date"
                          disabled={type?.type === "view"}
                        />
                      </div>
                      <div className="col-lg-3">
                        <label htmlFor="insuranceDate">Insurance Date</label>
                        <InputField
                          value={values?.insuranceDate}
                          placeholder="Insurance Date"
                          name="insuranceDate"
                          type="date"
                          disabled
                        />
                      </div>
                      <div className="col-lg-3">
                        <label htmlFor="piamountFC">PI Amount (FC)</label>
                        <InputField
                          value={values?.piamountFC}
                          placeholder="PI Amount (FC)"
                          name="piamountFC"
                          disabled
                        />
                      </div>
                      <div className="col-lg-3">
                        <label>Exchange Rate</label>
                        <InputField
                          value={values?.exchangeRate}
                          placeholder="Exchange Rate"
                          name="exchangeRate"
                          onChange={(v) => {
                            setFieldValue("exchangeRate", v.target.value);
                            setFieldValue(
                              "piamountBDT",
                              removeComma(v.target.value) *
                                removeComma(values?.piamountFC)
                              // numberWithCommas(
                              //   removeComma(v.target.value) *
                              //     removeComma(values?.piamountFC)
                              // )
                            );
                          }}
                          type="number"
                          min="0"
                          step="any"
                          disabled={type?.type === "view"}
                        />
                      </div>
                      <div className="col-lg-3">
                        <label>PI Amount (BDT)</label>

                        <InputField
                          value={
                            singleItem
                              ? values?.piamountBDT
                              : (values?.piamountBDT
                              ? numberWithCommas(
                                  parseFloat(values?.piamountBDT).toFixed(3)
                                )
                              : "")
                          }
                          // value={(values?.piamountBDT)}
                          placeholder="PI Amount (BDT)"
                          name="piamountBDT"
                          // type={initData?.type === "view" ? "text" : "number"}

                          disabled
                        />
                      </div>
                      <div className="col-lg-3">
                        <label>Total Charge (Including VAT)</label>
                        <InputField
                          value={values?.totalCharge}
                          placeholder="Total Charge"
                          name="totalCharge"
                          type={initData?.type === "view" ? "text" : "number"}
                          min={0}
                          errors={errors}
                          disabled={type?.type === "view"}
                        />
                      </div>
                      <div className="col-lg-3">
                        <label>VAT</label>
                        <InputField
                          value={values?.numVatamount}
                          placeholder="VAT"
                          name="numVatamount"
                          // onBlur={(e) => {
                          //   if (e?.target?.value > values?.totalCharge) {
                          //     toast.warn(
                          //       "Vat can not greater than Total Charge",
                          //       { toastId: "numVatamount" }
                          //     );
                          //   }
                          // }}
                          disabled={type?.type === "view"}
                        />
                      </div>
                      <div className="col-lg-3">
                        <label htmlFor="dueDate">Due Date</label>
                        <InputField
                          value={values?.dueDate}
                          placeholder="Due Date"
                          name="dueDate"
                          type="date"
                          disabled={type?.type === "view"}
                        />
                      </div>
                    </>
                  </div>
                </div>
              </div>

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
              ></button>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}
