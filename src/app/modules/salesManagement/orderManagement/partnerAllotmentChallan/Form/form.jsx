import React, { useEffect, useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import NewSelect from "./../../../../_helper/_select";
import InputField from "./../../../../_helper/_inputField";
import { GetShippointDDL_api, GetAccOfPartnerDDl_api } from "../helper";
// Validation schema
const validationSchema = Yup.object().shape({
  shippoint: Yup.object().shape({
    label: Yup.string().required("Shippoint is required"),
    value: Yup.string().required("Shippoint is required"),
  }),

  itemName: Yup.object().shape({
    label: Yup.string().required("Item Name Name is required"),
    value: Yup.string().required("Item Name Name is required"),
  }),
  accOfPartner: Yup.object().when(
    "isAccOfPartner",
    (isAccOfPartner, Schema) => {
      if (isAccOfPartner) return Schema.required("Account Of is required");
    }
  ),

  supplierCountry: Yup.string()
    .min(1, "Minimum 1 symbols")
    .required("Supplier Country is required"),
  deliveryAddress: Yup.string()
    .min(1, "Minimum 1 symbols")
    .required("Delivery Address is required"),
  upazila: Yup.string()
    .min(1, "Minimum 1 symbols")
    .required("Upazila is required"),
  district: Yup.string()
    .min(1, "Minimum 1 symbols")
    .required("District is required"),
  bankName: Yup.string()
    .min(1, "Minimum 1 symbols")
    .required("Bank Name is required"),
  // permissionNumber: Yup.string()
  //   .min(1, "Minimum 1 symbols")
  //   .required("Permission Name is required"),
  shipName: Yup.string()
    .min(1, "Minimum 1 symbols")
    .required("Ship Name is required"),
  lcNo: Yup.string()
    .min(1, "Minimum 1 symbols")
    .required("LC. No.is required"),
  color: Yup.string()
    .min(1, "Minimum 1 symbols")
    .required("Color is required"),
  commission: Yup.number()
    .min(0, "Minimum 0 number")
    .required("Commission is required")
    .test("commission", "Maximum 100 Number ", function(value) {
      return 100 >= value;
    }),
  govtPrice: Yup.number()
    .min(0, "Minimum 0 number")
    .required("Govt. Price is required"),

  itemPrice: Yup.number()
    .min(0, "Minimum 0 number")
    .required("Price is required"),
  quantity: Yup.number()
    .min(0, "Minimum 0 number")
    .required("Quantity is required")
    .test("quantity", "Invalid Number", function(value) {
      return this.parent.maxQuantity >= value;
    }),
  // supplierDate: Yup.date().required("Supplier Date is required"),
  lcDate: Yup.date().required("LC Date is required"),
  // permissionDate: Yup.date().required("LC Date is required"),
  challanDate: Yup.date().required("Challan Date is required"),
});

export default function _Form({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  profileData,
  selectedBusinessUnit,
  allotmentId,
  deliveryLandingData,
  salesCenterDDL,
}) {
  const [shippointDDL, setShippointDDL] = useState([]);
  const [accOfPartnerDDl, setAccOfPartnerDDl] = useState([]);

  useEffect(() => {
    if (profileData?.accountId && selectedBusinessUnit?.value) {
      GetShippointDDL_api(
        profileData?.userId,
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setShippointDDL
      );
      GetAccOfPartnerDDl_api(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setAccOfPartnerDDl
      );
    }
  }, [profileData, selectedBusinessUnit]);

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
                    name="shippoint"
                    options={shippointDDL || []}
                    value={values?.shippoint}
                    label="Shippoint"
                    onChange={(valueOption) => {
                      setFieldValue("shippoint", valueOption);
                    }}
                    placeholder="Shippoint"
                    errors={errors}
                    touched={touched}
                    isDisabled={deliveryLandingData?.deliveryLandingRowBtnEnter}
                  />
                </div>
                <div className="col-lg-3">
                  <label>Commission Per Bag</label>
                  <InputField
                    value={values?.commission}
                    name="commission"
                    placeholder="Commission Per Bag"
                    type="number"
                    step="any"
                  />
                </div>
                <div className="col-lg-3">
                  <label>Challan Date</label>
                  <InputField
                    value={values?.challanDate}
                    name="challanDate"
                    placeholder="Challan Date"
                    type="date"
                    disabled={deliveryLandingData?.deliveryLandingRowBtnEnter}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="itemName"
                    options={[]}
                    value={values?.itemName}
                    label="Item Name"
                    onChange={(valueOption) => {
                      setFieldValue("itemName", valueOption);
                    }}
                    placeholder="Item Name"
                    errors={errors}
                    touched={touched}
                    isDisabled={true}
                  />
                </div>
                <div className="col-lg-3">
                  <label>Price</label>
                  <InputField
                    value={values?.itemPrice}
                    name="itemPrice"
                    placeholder="Price"
                    type="number"
                    disabled
                  />
                </div>
                <div className="col-lg-3">
                  <label>Quantity (Ton)</label>
                  <InputField
                    value={values?.quantity}
                    name="quantity"
                    placeholder="Quantity"
                    type="number"
                    onChange={(e) => {
                      setFieldValue("quantity", e.target.value);
                      setFieldValue(
                        "totalPrice",
                        +values?.itemPrice * +e.target.value
                      );
                    }}
                    disabled={deliveryLandingData?.deliveryLandingRowBtnEnter}
                  />
                </div>
                <div className="col-lg-3">
                  <label>Total Price</label>
                  <InputField
                    value={values?.totalPrice}
                    name="totalPrice"
                    placeholder="Total Price"
                    type="number"
                    disabled
                  />
                </div>
                <div className="col-lg-3">
                  <label>Supplier Country</label>
                  <InputField
                    value={values?.supplierCountry}
                    name="supplierCountry"
                    placeholder="Supplier Country"
                    type="text"
                  />
                </div>
                <div className="col-lg-3">
                  <label>Delivery Address</label>
                  <InputField
                    value={values?.deliveryAddress}
                    name="deliveryAddress"
                    placeholder="Delivery Address"
                    type="text"
                  />
                </div>
                <div className="col-lg-3">
                  <label>LC. No.</label>
                  <InputField
                    value={values?.lcNo}
                    name="lcNo"
                    placeholder="LC. No."
                    type="text"
                  />
                </div>
                <div className="col-lg-3">
                  <label> LC. Date</label>
                  <InputField
                    value={values?.lcDate}
                    name="lcDate"
                    placeholder="LC. Date"
                    type="date"
                  />
                </div>
                <div className="col-lg-3">
                  <label> Bank Name & Branch Name</label>
                  <InputField
                    value={values?.bankName}
                    name="bankName"
                    placeholder="Bank Name, Branch Name"
                    type="text"
                  />
                </div>
                {/* <div className="col-lg-3">
                  <label> Permission Number</label>
                  <InputField
                    value={values?.permissionNumber}
                    name="permissionNumber"
                    placeholder="Permission Number"
                    type="text"
                  />
                </div>
                <div className="col-lg-3">
                  <label>Permission Date</label>
                  <InputField
                    value={values?.permissionDate}
                    name="permissionDate"
                    placeholder="Permission Date"
                    type="date"
                  />
                </div> */}
                <div className="col-lg-3">
                  <label>Govt. Price (Bag)</label>
                  <InputField
                    value={values?.govtPrice}
                    name="govtPrice"
                    placeholder="Govt. Price"
                    type="number"
                  />
                </div>
                <div className="col-lg-3">
                  <label>Ship Name</label>
                  <InputField
                    value={values?.shipName}
                    name="shipName"
                    placeholder="Ship Name"
                    type="text"
                  />
                </div>
                <div className="col-lg-3">
                  <label>Color</label>
                  <InputField
                    value={values?.color}
                    name="color"
                    placeholder="Color"
                    type="text"
                  />
                </div>
                <div className="col-lg-3">
                  <label>District</label>
                  <InputField
                    value={values?.district}
                    name="district"
                    placeholder="District"
                    type="text"
                  />
                </div>
                <div className="col-lg-3">
                  <label>Upazila</label>
                  <InputField
                    value={values?.upazila}
                    name="upazila"
                    placeholder="Upazila"
                    type="text"
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="salesCenter"
                    options={salesCenterDDL || []}
                    value={values?.salesCenter}
                    label="Sales Center"
                    onChange={(valueOption) => {
                      setFieldValue("salesCenter", valueOption);
                    }}
                    placeholder="Sales Center"
                    errors={errors}
                    touched={touched}
                    // isDisabled={true}
                  />
                </div>
                {!deliveryLandingData?.deliveryLandingRowBtnEnter && (
                  <div className="col-lg-3">
                    <NewSelect
                      name="accOfPartner"
                      options={accOfPartnerDDl || []}
                      value={values?.accOfPartner}
                      label="Account Of"
                      onChange={(valueOption) => {
                        setFieldValue("accOfPartner", valueOption);
                      }}
                      placeholder="Account Of"
                      errors={errors}
                      touched={touched}
                      // isDisabled={true}
                    />
                  </div>
                )}
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
                onSubmit={() => resetForm(initData)}
              ></button>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}
