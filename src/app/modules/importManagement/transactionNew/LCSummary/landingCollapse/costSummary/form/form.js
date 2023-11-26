/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { Formik, Form } from "formik";
import NewSelect from "../../../../../../_helper/_select";
import InputField from "../../../../../../_helper/_inputField";

export default function _Form({
  initData,
  btnRef,
  //   saveHandler,
  resetBtnRef,
  disableHandler,
  isEdit,
  setter,
  remover,
  setRowDto,
  rowDto,
  setDivisionDDL,
}) {
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        // validationSchema={isEdit ? validationSchemaEdit : validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          // saveHandler(values, () => {
          //   resetForm(initData);
          //   setRowDto([]);
          // });
        }}
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
          <>
            {/* {disableHandler(!isValid)} */}

            <Form className="form form-label-right">
              <div className="row">
                <div className="col-lg-12">
                  <div className="row global-form">
                    <>
                      <div className="col-lg-3">
                        <NewSelect
                          name="shipment"
                          //   options={partnerTypeDDL || []}
                          value={values?.shipment}
                          label="Select Shipment"
                          onChange={(valueOption) => {
                            setFieldValue("shipment", valueOption);
                          }}
                          placeholder="Select Shipment"
                          errors={errors}
                          touched={touched}
                          //   isDisabled={isEdit}
                        />
                      </div>
                      <div className="col-lg-3">
                        <InputField
                          value={values?.BLAWBTRNo}
                          placeholder="BL/AWB/TR No"
                          label="BL/AWB/TR No"
                          name="BLAWBTRNo"
                        />
                      </div>
                      <div className="col-lg-3">
                        <InputField
                          value={values?.BLAWBTRDate}
                          label="BL/AWB/TR Date"
                          placeholder="BL/AWB/TR Date"
                          name="BLAWBTRDate"
                          type="date"
                        />
                      </div>
                      <div className="col-lg-3">
                        <InputField
                          value={values?.LCOpeningCharge}
                          label="LC Opening Charge"
                          placeholder="LC Opening Charge"
                          name="LCOpeningCharge"
                        />
                      </div>
                      {/* {!isEdit && ( */}

                      <div className="col-lg-3">
                        <InputField
                          value={values?.insurancePolicy}
                          label="Insurance Policy"
                          placeholder="Insurance Policy"
                          name="insurancePolicy"
                          type="text"
                        />
                      </div>
                      <div className="col-lg-3">
                        <InputField
                          value={values?.totalDocReleaseCharges}
                          label="Total Doc Release Charges"
                          placeholder="Total Doc Release Charges"
                          name="totalDocReleaseCharges"
                        />
                      </div>
                      <div className="col-lg-3">
                        <InputField
                          label="Payment On Maturity And PG"
                          placeholder="Payment On Maturity And PG"
                          name="paymentOnMaturityAndPG"
                          type="text"
                          value={values?.paymentOnMaturityAndPG}
                        />
                      </div>
                      <div className="col-lg-3">
                        <InputField
                          label="Custom Duty And Taxes"
                          placeholder="Custom Duty And Taxes"
                          name="customDutyAndTaxes"
                          type="text"
                          value={values?.customDutyAndTaxes}
                        />
                      </div>
                      <div className="col-lg-3">
                        <InputField
                          label="Port Charges"
                          placeholder="Port Charges"
                          name="portCharges"
                          value={values?.portCharges}
                        />
                      </div>
                      <div className="col-lg-3">
                        <InputField
                          label="Shipping Charges"
                          placeholder="Shipping Charges"
                          name="shippingCharges"
                          value={values?.shippingCharges}
                        />
                      </div>
                      <div className="col-lg-3">
                        <InputField
                          label="Transport Charges"
                          placeholder="Transport Charges"
                          name="transportCharges"
                          type="text"
                          value={values?.transportCharges}
                        />
                      </div>
                      <div className="col-lg-3">
                        <InputField
                          label="C&F Charges"
                          placeholder="C&F Charges"
                          name="CFCharges"
                          type="text"
                          value={values?.CFCharges}
                        />
                      </div>
                      <div className="col-lg-3">
                        <InputField
                          label="Survey Charges"
                          placeholder="Survey Charges"
                          name="surveyCharges"
                          type="text"
                          value={values?.surveyCharges}
                        />
                      </div>
                      <div className="col-lg-3">
                        <InputField
                          label="Cleaning Charges"
                          placeholder="Cleaning Charges"
                          name="cleaningCharges"
                          type="text"
                          value={values?.cleaningCharges}
                        />
                      </div>
                      <div className="col-lg-3">
                        <InputField
                          label="Unloading Charges"
                          placeholder="Unloading Charges"
                          name="unloadingCharges"
                          type="text"
                          value={values?.unloadingCharges}
                        />
                      </div>
                      <div className="col-lg-3">
                        <InputField
                          label="Shipment Wise Total Cost"
                          placeholder="Shipment Wise Total Cost"
                          name="shipmentWiseTotalCost"
                          type="text"
                          value={values?.shipmentWiseTotalCost}
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
                // onSubmit={() => resetForm(initData)}
              ></button>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}
