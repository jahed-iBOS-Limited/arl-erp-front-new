import { Form, Formik } from "formik";
import React from "react";
import { useLocation } from "react-router";
import { useHistory } from "react-router-dom";
import * as Yup from "yup";
import { IInput } from "../../../../_helper/_input";
import InputField from "../../../../_helper/_inputField";
import NewSelect from "../../../../_helper/_select";
import {
  getZoneRateInfo,
  updateDistanceKM,
  updateRentVehicle,
} from "../helper";

// // Validation schema
const validationSchema = Yup.object().shape({
  supplier: Yup.object().shape({
    label: Yup.string().required("Supplier Name is required"),
    value: Yup.string().required("Supplier Name is required"),
  }),
});

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
  billId,
  isComplete,
  zoneDDL,
  setZoneRateInfo,
  setLoading,
  formType,
  zoneUpdateHandler,
  zoneRateInfo,
}) {
  // const [open, setOpen] = React.useState(false);
  const location = useLocation();
  const data = location?.state?.data || {};
  const history = useHistory();
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
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler(values, () => {
            resetForm(initData);
            history.push(
              "/transport-management/routecostmanagement/rentalVehicleCost"
            );
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
                      disabled={billId || isComplete}
                    />
                  </div>

                  <div className="col-lg-3">
                    <label>Addition Reason</label>
                    <InputField
                      value={values?.additionalCostReason}
                      name="additionalCostReason"
                      placeholder="Addition Reason"
                      type="text"
                      disabled={billId || isComplete}
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
                      disabled={billId || isComplete}
                    />
                  </div>

                  <div className="col-lg-3">
                    <label>Deduction Reason</label>
                    <InputField
                      value={values?.deductionCostReason}
                      name="deductionCostReason"
                      placeholder="deduction Reason"
                      type="text"
                      disabled={billId || isComplete}
                    />
                  </div>

                  <div className="col-lg-3">
                    <NewSelect
                      name="supplier"
                      options={supplierDDL || []}
                      value={values?.supplier || ""}
                      label="Vehicle Supplier Name"
                      onChange={(valueOption) => {
                        setFieldValue("supplier", valueOption);
                      }}
                      placeholder="Vehicle Supplier Name"
                      errors={errors}
                      touched={touched}
                      // isDisabled={billId}
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

                      {!billId && !isComplete && (
                        <th style={{ width: "100px" }}>Action</th>
                      )}
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
                            disabled={billId || isComplete}
                          />
                          {/* <div className="pl-2">{item?.numDistanceKM}</div> */}
                        </td>

                        {!billId && !isComplete && (
                          <td>
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
                          </td>
                        )}
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
                      {selectedBusinessUnit?.value !== 4 && (
                        <th style={{ width: "100px" }}>Action</th>
                      )}
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
                            value={item?.rentAmount}
                            name="rentAmount"
                            type="number"
                            min={1}
                            disabled={
                              selectedBusinessUnit?.value === 4 || billId
                            }
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
                        {selectedBusinessUnit?.value !== 4 && !billId && (
                          <td>
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
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
                </div>
              </div>

              <div className="col-md-10" style={{ marginTop: "20px" }}>
                <div className="d-flex justify-content-between">
                  <h4 className="mb-0">Chalan Info</h4>
                  {formType === "zoneUpdate" && (
                    <div>
                      <div className="d-flex justify-content-around">
                        <h5 className="mr-3">
                          {" "}
                          Rate: {zoneRateInfo?.updatetzRate}
                        </h5>
                        <h5 className="ml-3">
                          {" "}
                          Amount: {zoneRateInfo?.updateBillAmount}
                        </h5>
                      </div>
                    </div>
                  )}
                </div>

                <div className="table-responsive">
                <table
                  className={
                    "table table-striped table-bordered mt-3 bj-table bj-table-landing table-font-size-sm"
                  }
                >
                  <thead>
                    <tr className="cursor-pointer">
                      <th> Ship To Party</th>
                      <th>Address</th>
                      <th>Challan No</th>
                      <th>Sales Order No</th>
                      <th>Item Code</th>
                      <th>Product Name</th>
                      <th>UoM Name</th>
                      <th>Qty</th>
                      {formType === "zoneUpdate" && (
                        <>
                          <th>Updated Zone</th>
                          <th>Action</th>
                        </>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {chalanInfo?.objRow?.map((itm) => {
                      return (
                        <tr>
                          <td
                            className="text-center"
                            style={{ fontWeight: "bold" }}
                          >
                            {itm?.customerName}
                          </td>
                          <td className="text-center">
                            {itm?.customerAddress}
                          </td>
                          <td className="text-center"> {itm?.deliveryCode}</td>
                          <td className="text-center">{itm?.salesOrderCode}</td>
                          <td className="text-center"> {itm?.itemCode}</td>
                          <td className="text-center">{itm?.itemName}</td>
                          <td className="text-center">{itm?.uomName}</td>
                          <td className="text-center">{itm?.quantity}</td>
                          {formType === "zoneUpdate" && (
                            <>
                              <td style={{ width: "160px" }}>
                                <NewSelect
                                  isClearable={false}
                                  name="zone"
                                  options={zoneDDL || []}
                                  value={values?.zone || ""}
                                  onChange={(valueOption) => {
                                    setFieldValue("zone", valueOption);
                                    getZoneRateInfo(
                                      selectedBusinessUnit?.value,
                                      itm?.deliveryCode,
                                      0,
                                      valueOption?.value,
                                      2,
                                      setZoneRateInfo,
                                      setLoading
                                    );
                                  }}
                                />
                              </td>
                              <td className="text-center">
                                <button
                                  className="btn btn-primary p-2"
                                  type="button"
                                  onClick={() => {
                                    zoneUpdateHandler(values, itm);
                                  }}
                                  disabled={!values?.zone}
                                >
                                  Update
                                </button>
                              </td>
                            </>
                          )}
                        </tr>
                      );
                    })}
                    <tr>
                      <td colSpan="7" className="text-left">
                        <p className="text-left m-0 ml-1">
                          <b>Total Quantity:</b>
                        </p>
                      </td>
                      <td className="text-center">
                        <b>
                          {chalanInfo?.objRow?.reduce(
                            (acc, curr) => (acc += curr?.quantity),
                            0
                          )}
                        </b>
                      </td>
                      {formType === "zoneUpdate" && <td colSpan={2}></td>}
                    </tr>
                  </tbody>
                </table>
                </div>
                {/* <table className="table table-striped table-bordered global-table">
                  <thead>
                    <tr>
                      <th>SL</th>
                      <th>DeliveryCode</th>
                      <th>Partner ShippingName</th>
                      <th>Partner ShippingAddress</th>
                      <th>Total Delivery Quantity</th>
                    </tr>
                  </thead>
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
                </table> */}
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
