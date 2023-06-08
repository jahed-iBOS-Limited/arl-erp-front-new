import React from "react";
import { Formik, Form } from "formik";
import {
  Card,
  CardBody,
  CardHeader,
  ModalProgressBar,
} from "../../../../../../../_metronic/_partials/controls";
import NewSelect from "../../../../../_helper/_select";
import InputField from "../../../../../_helper/_inputField";

export default function ViewModalForTransportBill({ initData }) {
  return (
    <>
      <Formik enableReinitialize={true} initialValues={initData}>
        {({ values, errors, touched, setFieldValue }) => (
          <>
            <Card>
              {true && <ModalProgressBar />}
              <CardHeader title="View Sales Commission (Bill Register)"></CardHeader>
              <CardBody>
                <Form className="form form-label-right mt-2">
                  <div className="row global-form">
                    <div className="col-lg-3">
                      <NewSelect
                        name="shippoint"
                        options={[]}
                        value={values?.shippoint}
                        label="Shippoint"
                        onChange={(valueOption) => {
                          setFieldValue("shippoint", valueOption);
                        }}
                        placeholder="Shippoint"
                        errors={errors}
                        touched={touched}
                        isDisabled={true}
                      />
                    </div>
                    <div className="col-lg-3">
                      <label>Commission</label>
                      <InputField
                        value={values?.commission}
                        name="commission"
                        placeholder="Commission"
                        type="number"
                        step="any"
                        disabled={true}
                      />
                    </div>

                    <div className="col-lg-3">
                      <label>Challan Date</label>
                      <InputField
                        value={values?.challanDate}
                        name="challanDate"
                        placeholder="Challan Date"
                        type="date"
                        disabled={true}
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
                      <label>Quantity</label>
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
                        disabled
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
                        disabled
                      />
                    </div>
                    <div className="col-lg-3">
                      <label>Delivery Address</label>
                      <InputField
                        value={values?.deliveryAddress}
                        name="deliveryAddress"
                        placeholder="Delivery Address"
                        type="text"
                        disabled
                      />
                    </div>
                    <div className="col-lg-3">
                      <label>LC. No.</label>
                      <InputField
                        value={values?.lcNo}
                        name="lcNo"
                        placeholder="LC. No."
                        type="text"
                        disabled
                      />
                    </div>
                    <div className="col-lg-3">
                      <label> LC. Date</label>
                      <InputField
                        value={values?.lcDate}
                        name="lcDate"
                        placeholder="LC. Date"
                        type="date"
                        disabled
                      />
                    </div>
                    <div className="col-lg-3">
                      <label> Bank Name</label>
                      <InputField
                        value={values?.bankName}
                        name="bankName"
                        placeholder="Bank Name"
                        type="text"
                        disabled
                      />
                    </div>
                    <div className="col-lg-3">
                      <label> Permission Number</label>
                      <InputField
                        value={values?.permissionNumber}
                        name="permissionNumber"
                        placeholder="Permission Number"
                        type="text"
                        disabled
                      />
                    </div>
                    <div className="col-lg-3">
                      <label>Permission Date</label>
                      <InputField
                        value={values?.permissionDate}
                        name="permissionDate"
                        placeholder="Permission Date"
                        type="date"
                        disabled
                      />
                    </div>
                    <div className="col-lg-3">
                      <label>Govt. Price</label>
                      <InputField
                        value={values?.govtPrice}
                        name="govtPrice"
                        placeholder="Govt. Price"
                        type="number"
                        disabled
                      />
                    </div>
                    <div className="col-lg-3">
                      <label>Ship Name</label>
                      <InputField
                        value={values?.shipName}
                        name="shipName"
                        placeholder="Ship Name"
                        type="text"
                        disabled
                      />
                    </div>
                    <div className="col-lg-3">
                      <label>Color</label>
                      <InputField
                        value={values?.color}
                        name="color"
                        placeholder="Color"
                        type="text"
                        disabled
                      />
                    </div>
                    <div className="col-lg-3">
                      <label>District</label>
                      <InputField
                        value={values?.district}
                        name="district"
                        placeholder="District"
                        type="text"
                        disabled
                      />
                    </div>
                    <div className="col-lg-3">
                      <label>Upazila</label>
                      <InputField
                        value={values?.upazila}
                        name="upazila"
                        placeholder="Upazila"
                        type="text"
                        disabled
                      />
                    </div>
                  </div>
                </Form>
              </CardBody>
            </Card>
          </>
        )}
      </Formik>
    </>
  );
}
