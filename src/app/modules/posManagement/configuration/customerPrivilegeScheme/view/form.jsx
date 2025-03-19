import React from "react";
import { Formik, Form } from "formik";
import NewSelect from "./../../../../_helper/_select";
import InputField from "./../../../../_helper/_inputField";

export default function _Form({ rowDto }) {
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={rowDto?.objHeader}
        onSubmit={(values, { setSubmitting, resetForm }) => {}}
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
            <Form className="form form-label-right mt-2">
              <div className="row global-form">
                <div className="col-lg-3">
                  <NewSelect
                    name="outletName"
                    options={[]}
                    value={values?.outletName || ""}
                    label="Outlet Name"
                    onChange={(valueOption) => {
                      setFieldValue("outletName", valueOption || "");
                    }}
                    placeholder="Outlet Name"
                    errors={errors}
                    touched={touched}
                    isDisabled
                  />
                </div>
                <div className="col-lg-9"> </div>
                <div className="col-lg-3">
                  <label>Name Of Scheme</label>
                  <InputField
                    value={values?.nameOfScheme || ""}
                    name="nameOfScheme"
                    placeholder="Name Of Scheme"
                    type="text"
                    disabled
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="conditionType"
                    options={[]}
                    value={values?.conditionType || ""}
                    label="Condition Type"
                    onChange={(valueOption) => {}}
                    placeholder="Condition Type"
                    errors={errors}
                    touched={touched}
                    isDisabled
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="itemGroup"
                    options={[]}
                    value={values?.itemGroup || ""}
                    label="Item / Item Group"
                    onChange={(valueOption) => {
                      setFieldValue("itemGroup", valueOption || "");
                    }}
                    placeholder="Item / Item Group"
                    errors={errors}
                    touched={touched}
                    isDisabled
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="customerGroup"
                    options={[]}
                    value={values?.customerGroup || ""}
                    label="Customer / Customer Group"
                    onChange={(valueOption) => {
                      setFieldValue("customerGroup", valueOption || "");
                    }}
                    placeholder="Customer / Customer Group"
                    errors={errors}
                    touched={touched}
                    isDisabled
                  />
                </div>
                <div className="col-lg-3">
                  <label>Scheme Start Date</label>
                  <InputField
                    value={values?.schemeStartDate || ""}
                    name="schemeStartDate"
                    placeholder="Scheme Start Date"
                    type="text"
                    disabled
                  />
                </div>
                <div className="col-lg-3">
                  <label>Scheme End Date</label>
                  <InputField
                    value={values?.schemeEndDate || ""}
                    name="schemeEndDate"
                    placeholder="Scheme End Date"
                    type="text"
                    disabled
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="offerBasedOn"
                    options={[]}
                    value={values?.offerBasedOn || ""}
                    label="Offer Based On"
                    onChange={(valueOption) => {}}
                    placeholder="Offer Based On"
                    errors={errors}
                    touched={touched}
                    isDisabled
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="customersPurchaseType"
                    options={[]}
                    value={values?.customersPurchaseType || ""}
                    label="Customers Purchase Type"
                    onChange={(valueOption) => {
                      setFieldValue("customersPurchaseType", valueOption || "");
                    }}
                    placeholder="Customers Purchase Type"
                    errors={errors}
                    touched={touched}
                    isDisabled
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="schemeType"
                    options={[]}
                    value={values?.schemeType || ""}
                    label="Scheme Type"
                    onChange={(valueOption) => {}}
                    placeholder="Scheme Type"
                    errors={errors}
                    touched={touched}
                    isDisabled
                  />
                </div>
              </div>

              <div className="table-responsive">
                <table className="table table-striped table-bordered global-table">
                  <thead>
                    <tr>
                      <th>SL</th>
                      <th>Minimum Quantity/Amount</th>
                      <th>Maximum Quantity/Amount</th>
                      {/* if  Scheme Type- Item */}
                      {[2].includes(values?.schemeType?.value) && (
                        <>
                          <th>Offer Item</th>
                          <th>Item UoM</th>
                          <th>Offer Quantity</th>
                        </>
                      )}
                      {/* if  Scheme Type- Discount */}
                      {[1].includes(values?.schemeType?.value) && (
                        <>
                          <th>Discount Format</th>
                          <th>Discount (% / Amount)</th>
                          <th>Duration Type</th>
                        </>
                      )}

                      {/* if duration Type -   One Time*/}
                      {![1].includes(values?.durationType?.value) && (
                        <>
                          <th>Month Duration</th>
                          <th>Based On</th>
                        </>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {rowDto?.objRow?.length >= 0 &&
                      rowDto?.objRow?.map((item, idx) => (
                        <tr key={item?.sl}>
                          <td>{item?.sl}</td>
                          <td>{item?.minimumQuantityOrAmount}</td>
                          <td>{item?.maximumQuantityOrAmount}</td>
                          {/* if  Scheme Type- Item */}
                          {[2].includes(values?.schemeType?.value) && (
                            <>
                              <td>{item?.itemName}</td>
                              <td>{item?.itemUomName}</td>
                              <td>{item?.offerQuantity}</td>
                            </>
                          )}

                          {/* if  Scheme Type- Discount */}
                          {[1].includes(values?.schemeType?.value) && (
                            <>
                              <td>{item?.discountFormatName}</td>
                              <td>{item?.discountAmount}</td>
                              <td>{item?.durationTypeName}</td>
                            </>
                          )}
                          {/* if duration Type -   One Time*/}
                          {![1].includes(values?.durationType?.value) && (
                            <>
                              <td>{item?.monthDuration}</td>
                              <td>{item?.basedOnName}</td>
                            </>
                          )}
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}
