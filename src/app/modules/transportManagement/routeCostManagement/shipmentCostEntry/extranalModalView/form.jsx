import { Form, Formik } from "formik";
import React from "react";
// import * as Yup from "yup";
import { IInput } from "../../../../_helper/_input";
import InputField from "../../../../_helper/_inputField";
import NewSelect from "../../../../_helper/_select";
// import { updateDistanceKM, updateRentVehicle } from "./helper";
// import { useLocation } from "react-router";

export default function _Form({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  distanceKM,
  shippingInfo,
  selectedBusinessUnit,
  chalanInfo,
  supplierDDL,
  distanceRowDtoHandler,
  shippingRowDtoHandler,
}) {
  // const [open, setOpen] = React.useState(false);
  // const location = useLocation();
  // const data = location?.state?.data || {};

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{
          ...initData,
          netPayable:
            +initData?.rentAmount +
            +initData?.additionalCost -
            +initData?.deductionCost,
        }}
        // validationSchema={validationSchema}
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
            <Form className="form form-label-right">
              {/* Form */}
              <div className="global-form">
                <div className="row">
                  <div className="col-lg-3">
                    <label>Rent Amount</label>
                    <InputField
                      value={values?.rentAmount}
                      name="rentAmount"
                      placeholder="Rent Amount"
                      type="number"
                      disabled
                    />
                  </div>

                  <div className="col-lg-3">
                    <label>Addition</label>
                    <InputField
                      value={values?.additionalCost}
                      name="additionalCost"
                      placeholder="Addition"
                      type="number"
                      onChange={(e) => {
                        setFieldValue("additionalCost", e.target.value);
                        const netPayable =
                          +values?.rentAmount +
                          +e.target.value -
                          +values?.deductionCost;
                        setFieldValue("netPayable", netPayable);
                      }}
                      disabled
                    />
                  </div>

                  <div className="col-lg-3">
                    <label>Addition Reason</label>
                    <InputField
                      value={values?.additionalCostReason}
                      name="additionalCostReason"
                      placeholder="Addition Reason"
                      type="text"
                      disabled
                    />
                  </div>

                  <div className="col-lg-3">
                    <label>deduction</label>
                    <InputField
                      value={values?.deductionCost}
                      name="deductionCost"
                      placeholder="deduction"
                      type="number"
                      onChange={(e) => {
                        setFieldValue("deductionCost", e.target.value);
                        const netPayable =
                          +values?.rentAmount +
                          +values?.additionalCost -
                          +e.target.value;
                        setFieldValue("netPayable", netPayable);
                      }}
                      disabled
                    />
                  </div>

                  <div className="col-lg-3">
                    <label>Deduction Reason</label>
                    <InputField
                      value={values?.deductionCostReason}
                      name="deductionCostReason"
                      placeholder="deduction Reason"
                      type="text"
                      disabled
                    />
                  </div>

                  <div className="col-lg-3">
                    <NewSelect
                      name="supplier"
                      options={supplierDDL || []}
                      value={values?.supplier}
                      label="Vehicle Supplier Name"
                      onChange={(valueOption) => {
                        setFieldValue("supplier", valueOption);
                      }}
                      placeholder="Vehicle Supplier Name"
                      errors={errors}
                      touched={touched}
                      isDisabled
                    />
                  </div>
                  <div className="col-lg-3 offset-lg-3 mt-5">
                    <strong>
                      <b>Net Payable: </b> {values?.netPayable}
                    </strong>
                  </div>
                </div>
              </div>

              <div className="col-md-10">
                <h4>Distance KM</h4>
                <div className="table-responsive">
                <table className="table table-striped table-bordered global-table">
                  <thead>
                    <tr>
                      <th>SL</th>
                      <th>Customer Name</th>
                      <th>Address</th>
                      <th style={{ width: "150px" }}>Distance KM</th>
                      {/* <th style={{ width: "100px" }}>Action</th> */}
                    </tr>
                  </thead>
                  <tbody>
                    {distanceKM?.map((item, index) => (
                      <tr key={index}>
                        <td> {index + 1}</td>
                        <td>
                          <div className="pl-2">
                            {item?.strPartnerShippingName}
                          </div>
                        </td>
                        <td>
                          <div className="pl-2">
                            {item?.strPartnerShippingAddress}
                          </div>
                        </td>

                        <td>
                          <IInput
                            disabled
                            value={item?.numDistanceKM}
                            name="numDistanceKM"
                            type="number"
                            min={1}
                            onChange={(e) => {
                              distanceRowDtoHandler(
                                "numDistanceKM",
                                +e.target.value,
                                index
                              );
                            }}
                          />
                          {/* <div className="pl-2">{item?.numDistanceKM}</div> */}
                        </td>
                        {/* <td>
                          <div className="pl-2">
                            <button
                              type="button"
                              onClick={() => {
                                updateDistanceKM(
                                  data?.shipmentId,
                                  data?.shipPointId,
                                  data?.partnerId,
                                  selectedBusinessUnit?.value,
                                  item?.numDistanceKM,
                                  () => {
                                    distanceRowDtoHandler(
                                      "oldValue",
                                      +item?.numDistanceKM,
                                      index
                                    );
                                  }
                                );
                              }}
                              className="btn btn-primary"
                            >
                              update
                            </button>
                          </div>
                        </td> */}
                      </tr>
                    ))}
                  </tbody>
                </table>
                </div>
              </div>

              <div className="col-md-10" style={{ marginTop: "20px" }}>
                <h4>Vehicle Rent</h4>
                <div className="table-responsive">
                <table className="table table-striped table-bordered global-table">
                  <thead>
                    <tr>
                      <th>SL</th>
                      <th>Customer Name</th>
                      <th>Address</th>
                      <th style={{ width: "150px" }}>Rent Amount</th>
                      {/* <th style={{ width: "100px" }}>Action</th> */}
                    </tr>
                  </thead>
                  <tbody>
                    {shippingInfo?.map((item, index) => (
                      <tr key={index}>
                        <td> {index + 1}</td>
                        <td>
                          <div className="pl-2">
                            {item?.partnerShippingName}
                          </div>
                        </td>
                        <td>
                          <div className="pl-2">
                            {item?.partnerShippingAddress}
                          </div>
                        </td>

                        <td>
                          <IInput
                            disabled
                            value={item?.rentAmount}
                            name="rentAmount"
                            type="number"
                            min={1}
                            onChange={(e) => {
                              shippingRowDtoHandler(
                                "rentAmount",
                                +e.target.value,
                                index
                              );
                            }}
                          />
                          {/* <div className="pl-2">{item?.rentAmount}</div> */}
                        </td>
                        {/* <td>
                          <div className="pl-2">
                            <button
                              type="button"
                              onClick={(e) => {
                                updateRentVehicle(
                                  data?.shipmentId,
                                  data?.shipPointId,
                                  data?.partnerId,
                                  selectedBusinessUnit?.value,
                                  item?.rentAmount,
                                  () => {
                                    shippingRowDtoHandler(
                                      "oldValue",
                                      item?.rentAmount,
                                      index
                                    );
                                    setFieldValue(
                                      "rentAmount",
                                      item?.rentAmount
                                    );
                                    const netPayable =
                                      +item?.rentAmount +
                                      +values?.additionalCost -
                                      +values?.deductionCost;
                                    setFieldValue("netPayable", netPayable);
                                  }
                                );
                              }}
                              className="btn btn-primary"
                            >
                              update
                            </button>
                          </div>
                        </td> */}
                      </tr>
                    ))}
                  </tbody>
                </table>
                </div>
              </div>

              <div className="col-md-10" style={{ marginTop: "20px" }}>
                <h4>Chalan Info</h4>
                <div className="table-responsive">
                <table className="table table-striped table-bordered global-table">
                  <thead>
                    <tr>
                      <th>SL</th>
                      <th>DeliveryCode</th>
                      <th>Partner ShippingName</th>
                      <th>Partner ShippingAddress</th>
                      <th>Total Delivery Quantity</th>
                    </tr>
                  </thead>
                  {/* {chalanInfo} */}
                  <tbody>
                    {chalanInfo?.map((item, index) => (
                      <tr key={index}>
                        <td> {index + 1}</td>
                        <td>
                          <div className="pl-2">{item?.deliveryCode}</div>
                        </td>
                        <td>
                          <div className="pl-2">
                            {item?.partnerShippingName}
                          </div>
                        </td>
                        <td>
                          <div className="pl-2">
                            {item?.partnerShippingAddress}
                          </div>
                        </td>
                        <td>
                          <div className="pl-2">
                            {item?.totalDeliveryQuantity}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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
                onSubmit={() => resetForm(initData)}
              ></button>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}
