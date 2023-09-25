import { Form, Formik } from "formik";
import React, { useState } from "react";
import * as Yup from "yup";
import IForm from "./../../../_helper/_form";
import InputField from "./../../../_helper/_inputField";
import Loading from "./../../../_helper/_loading";
import NewSelect from "./../../../_helper/_select";
import AttachmentUploaderNew from "../../../_helper/attachmentUploaderNew";
import IViewModal from "../../../_helper/_viewModal";
import Schedule from "./schedule";

const initData = {
  salesOrg: "",
  customer: "",
  paymentType: "",
  billToParty: "",
  referenceCode: "",
  scheduleType: "",
  invoiceDay: "",
  validFrom: "",
  validTo: "",
};

// const validationSchema = Yup.object().shape({
//   item: Yup.object()
//     .shape({
//       label: Yup.string().required("Item is required"),
//       value: Yup.string().required("Item is required"),
//     })
//     .typeError("Item is required"),

//   remarks: Yup.string().required("Remarks is required"),
//   amount: Yup.number().required("Amount is required"),
//   date: Yup.date().required("Date is required"),
// });

export default function ServiceSalesCreate() {
  const [objProps, setObjprops] = useState({});
  const [attachmentList, setAttachmentList] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const saveHandler = (values, cb) => {
    alert("Working...");
  };
  return (
    <Formik
      enableReinitialize={true}
      initialValues={initData}
      //   validationSchema={validationSchema}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        saveHandler(values, () => {
          resetForm(initData);
        });
      }}
    >
      {({
        handleSubmit,
        resetForm,
        values,
        setFieldValue,
        isValid,
        errors,
        touched,
      }) => (
        <>
          {false && <Loading />}
          <IForm title="Service Sales Entry" getProps={setObjprops}>
            <Form>
              <div className="form-group  global-form row">
                <div className="col-lg-3">
                  <NewSelect
                    name="salesOrg"
                    options={[
                      { value: 1, label: "salesOrg-1" },
                      { value: 2, label: "salesOrg-2" },
                    ]}
                    value={values?.salesOrg}
                    label="Sales Org"
                    onChange={(valueOption) => {
                      setFieldValue("salesOrg", valueOption);
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="customer"
                    options={[
                      { value: 1, label: "customer-1" },
                      { value: 2, label: "customer-2" },
                    ]}
                    value={values?.customer}
                    label="Customer"
                    onChange={(valueOption) => {
                      setFieldValue("customer", valueOption);
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="paymentType"
                    options={[
                      { value: 1, label: "Re-Curring" },
                      { value: 2, label: "One Time" },
                    ]}
                    value={values?.paymentType}
                    label="Payment Type"
                    onChange={(valueOption) => {
                      setFieldValue("paymentType", valueOption);
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    value={values?.billToParty}
                    label="Bill To Party"
                    name="billToParty"
                    type="number"
                    onChange={(e) => {
                      setFieldValue("billToParty", e.target.value);
                    }}
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    value={values?.referenceCode}
                    label="Reference Code"
                    name="referenceCode"
                    type="text"
                    onChange={(e) => {
                      setFieldValue("referenceCode", e.target.value);
                    }}
                  />
                </div>
                {[1]?.includes(values?.paymentType?.value) ? (
                  <>
                    {" "}
                    <div className="col-lg-3">
                      <NewSelect
                        name="scheduleType"
                        options={[
                          { value: 1, label: "scheduleType-1" },
                          { value: 2, label: "scheduleType-2" },
                        ]}
                        value={values?.scheduleType}
                        label="Schedule Type"
                        onChange={(valueOption) => {
                          setFieldValue("scheduleType", valueOption);
                        }}
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className="col-lg-3">
                      <InputField
                        value={values?.invoiceDay}
                        label="Invoice Day"
                        name="invoiceDay"
                        type="number"
                        onChange={(e) => {
                          setFieldValue("invoiceDay", e.target.value);
                        }}
                      />
                    </div>
                    <div className="col-lg-3">
                      <InputField
                        value={values?.validFrom}
                        label="Valid From"
                        name="validFrom"
                        type="validFrom"
                        onChange={(e) => {
                          setFieldValue("validFrom", e.target.value);
                        }}
                      />
                    </div>
                    <div className="col-lg-3">
                      <InputField
                        value={values?.validTo}
                        label="Valid To"
                        name="validTo"
                        type="validTo"
                        onChange={(e) => {
                          setFieldValue("validTo", e.target.value);
                        }}
                      />
                    </div>
                  </>
                ) : null}
                <div className="col-lg-2 mt-5">
                  <AttachmentUploaderNew
                    CBAttachmentRes={(attachmentData) => {
                      if (Array.isArray(attachmentData)) {
                        setAttachmentList(attachmentData);
                      }
                    }}
                  />
                </div>
              </div>

              <div className="form-group  global-form row mt-5">
                <div className="col-lg-3">
                  <NewSelect
                    name="item"
                    options={[
                      { value: 1, label: "item-1" },
                      { value: 2, label: "item-2" },
                    ]}
                    value={values?.item}
                    label="Item Name"
                    onChange={(valueOption) => {
                      setFieldValue("item", valueOption);
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>

                <div className="col-lg-3">
                  <InputField
                    value={values?.qty}
                    label="Qty"
                    name="qty"
                    type="number"
                    onChange={(e) => {
                      setFieldValue("qty", e.target.value);
                    }}
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    value={values?.rate}
                    label="Rate"
                    name="rate"
                    type="number"
                    onChange={(e) => {
                      setFieldValue("rate", e.target.value);
                    }}
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    value={values?.vat}
                    label="Vat %"
                    name="vat"
                    type="number"
                    onChange={(e) => {
                      setFieldValue("vat", e.target.value);
                    }}
                  />
                </div>
                <div className="d-flex">
                  <div style={{ marginTop: "18px" }}>
                    <button type="button" className="btn btn-primary ml-4">
                      Add
                    </button>
                  </div>
                  <div style={{ marginTop: "18px" }}>
                    <button onClick={() => setIsOpen(true)} type="button" className="btn btn-primary ml-4">
                      Schedule
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-5">
                <div>
                  {[1]?.length > 0 && (
                    <table className="table table-striped table-bordered bj-table bj-table-landing">
                      <thead>
                        <tr>
                          <th>Item Name</th>
                          <th>Uom</th>
                          <th>Qty</th>
                          <th>Rate</th>
                          <th>Amount</th>
                          <th>Vat %</th>
                          <th>Nate Amount</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[1]?.map((item, index) => (
                          <tr key={index}></tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>

              <IViewModal show={isOpen} onHide={() => setIsOpen(false)}>
                <Schedule />
              </IViewModal>

              <button
                type="submit"
                style={{ display: "none" }}
                ref={objProps?.btnRef}
                onSubmit={() => handleSubmit()}
              ></button>

              <button
                type="reset"
                style={{ display: "none" }}
                ref={objProps?.resetBtnRef}
                onSubmit={() => resetForm(initData)}
              ></button>
            </Form>
          </IForm>
        </>
      )}
    </Formik>
  );
}
