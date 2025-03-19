import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import ICustomCard from "../../../../_helper/_customCard";
import InputField from "../../../../_helper/_inputField";
import { getComponentDDL } from "../helper";
import NewSelect from "./../../../../_helper/_select";

export default function _Form({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  rowDto,
  setRowDto,
  profileData,
  dataHandler,
  fuleCost,
  vehicleReant,
  distanceKM,
  shipmentId,
}) {
  // eslint-disable-next-line no-unused-vars
  const [componentDDL, setComponentDDL] = useState([]);
  useEffect(() => {
    if (profileData.accountId) {
      getComponentDDL(profileData.accountId, setComponentDDL);
    }
  }, [profileData]);

  const totalActualCost = rowDto?.reduce(
    (acc, cur) => (acc += +cur?.actualCost),
    0
  );

  const totalCashAmount = fuleCost?.reduce(
    (acc, cur) => (acc += +cur?.purchaseCashAmount),
    0
  );
  const totalCreditAmount = fuleCost?.reduce(
    (acc, cur) => (acc += +cur?.purchaseCreditAmount),
    0
  )
  const cal = (totalActualCost + totalCashAmount) - (+totalCreditAmount);
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler(values, () => {
            resetForm(initData);
            setRowDto([]);
          });
        }}
      >
        {({ handleSubmit, resetForm, values, isValid }) => (
          <ICustomCard title="View Manual Shipment Cost">
            <>
              <Form className="form form-label-right position-relative">
                <p style={{ position: "absolute", top: "-46px", left: "45%" }}>
                  <b>Pay to Driver: </b>
                  {cal - (+values?.advanceAmount  + +values?.downTripCash)}
                </p>
                <div className="row global-form">
                  <div className="col-lg-12">
                    <div
                      className="row bank-journal  "
                      style={{ paddingBottom: "20px 0" }}
                    >
                      <div className="col-lg-3 pl pr-1 mb-1">
                        <InputField
                          label="Vehicle No"
                          value={values?.vehicleNo}
                          name="vehicleNo"
                          placeholder="vehial No"
                          type="text"
                          disabled={true}
                        />
                      </div>

                      <div className="col-lg-3 pl pr-1 mb-1">
                        <InputField
                          label="Customer Name"
                          value={values?.customerName}
                          name="customerName"
                          placeholder="Customer Name"
                          type="text"
                          disabled={true}
                        />
                      </div>

                      <div className="col-lg-3 pl pr-1 mb-1">
                        <InputField
                          label="Driver Name"
                          value={values?.driverName}
                          name="driverName"
                          placeholder="Driver Name"
                          type="text"
                          disabled={true}
                        />
                      </div>

                      <div className="col-lg-3 pl pr-1 mb-1">
                        <InputField
                          label="Route Name"
                          value={values?.routeName}
                          name="routeName"
                          placeholder="Route Name"
                          type="text"
                          disabled={true}
                        />
                      </div>

                      <div className="col-lg-3 pl pr-1 mb-1">
                        <InputField
                          label="Distance Km"
                          value={values?.distanceKm}
                          name="distanceKm"
                          placeholder="Distance Km"
                          type="number"
                          disabled={true}
                        />
                      </div>
                      <div className="col-lg-3 pl pr-1 mb-1">
                        <InputField
                          label="Extra Millage (KM)"
                          value={values?.extraMillage}
                          name="extraKm"
                          placeholder="Extra Millage"
                          type="number"
                          disabled={true}
                        />
                      </div>
                      <div className="col-lg-3 pl pr-1 mb-1">
                        <InputField
                          label="Reason For Extra Millage (KM)"
                          value={values?.extraMillageReason}
                          name="reasonKm"
                          placeholder="Reason For Extra Millage"
                          type="text"
                          disabled={true}
                        />
                      </div>
                      <div className="col-lg-3 pl pr-1 mb-1">
                        <InputField
                          value={values?.shipmentDate}
                          label="Shipment Date"
                          type="date"
                          name="shipmentDate"
                          placeholder=""
                          disabled={true}
                        />
                      </div>

                      <div className="col-lg-3 pl pr-1 mb-1">
                        <InputField
                          label="Start Millage"
                          value={values?.startMillage}
                          name="startMillage"
                          placeholder="Start Millage"
                          type="number"
                          disabled={true}
                        />
                      </div>

                      <div className="col-lg-3 pl pr-1 mb-1">
                        <InputField
                          label="End Millage"
                          value={values?.endMillage}
                          name="endMillage"
                          placeholder="End Millage"
                          type="number"
                          disabled={true}
                        />
                      </div>

                      <div className="col-lg-3 pl pr-1 mb-1">
                        <div style={{ marginBottom: "5px" }}>
                          Expense Entered
                        </div>
                        <input
                          checked={values.isExpenseEntered}
                          name="isExpenseEntered"
                          type="checkbox"
                          disabled={true}
                        />
                      </div>

                      <div className="col-lg-3 pl pr-1 mb-1">
                        <div style={{ marginBottom: "5px" }}>
                          Advane Requested
                        </div>
                        <input
                          checked={values.isAdvanceRequested}
                          name="isAdvanceRequested"
                          type="checkbox"
                          disabled={true}
                        />
                      </div>

                      <div className="col-lg-3 pl pr-1 mb-1">
                        <InputField
                          label="Total Standard Cost"
                          value={values?.totalStandardCost}
                          name="totalStandardCost"
                          placeholder="Total Standard Cost"
                          type="number"
                          disabled={true}
                        />
                      </div>

                      <div className="col-lg-3 pl pr-1 mb-1">
                        <InputField
                          label="Advance Amount"
                          value={values?.advanceAmount}
                          name="advanceAmount"
                          placeholder="Advane Amount"
                          type="number"
                          disabled={true}
                        />
                      </div>

                      <div className="col-lg-3 pl pr-1 mb-1">
                        <InputField
                          label="Total Actual"
                          value={values?.totalActualCost}
                          name="totalActualCost"
                          placeholder="Total Actual"
                          type="number"
                          disabled={true}
                        />
                      </div>

                      <div className="col-lg-3 pl pr-1 mb-1">
                        <InputField
                          label="Down Trip Cash"
                          value={values?.downTripCash}
                          name="downTripCash"
                          placeholder="Down Trip Cash"
                          type="number"
                          min="0"
                          disabled={true}
                        />
                      </div>
                      <div className="col-lg-3 pl pr-1 mb-1">
                        <InputField
                          label="Down Trip Credit"
                          value={values?.downTripCredit}
                          name="downTripCredit"
                          placeholder="Down Trip Credit"
                          type="number"
                          min="0"
                          disabled={true}
                        />
                      </div>
                      <div className="col-lg-3">
                        <label>Vehicle In Date</label>
                        <InputField
                          value={values?.vehicleInDate}
                          name="vehicleInDate"
                          placeholder="Vehicle In Date"
                          type="date"
                          disabled
                        />
                      </div>
                      <div className="col-lg-3">
                        <label>Vehicle In Time</label>
                        <InputField
                          value={values?.vehicleInTime}
                          name="vehicleInTime"
                          placeholder="Vehicle In Time"
                          type="time"
                          required
                          disabled
                        />
                      </div>{" "}
                      {+values?.downTripCredit > 0 && (
                        <div className="col-lg-3 pl pr-1 mb-1">
                          <NewSelect
                            name="businessUnitName"
                            options={[]}
                            value={values?.businessUnitName}
                            label="Business Unit Name"
                            onChange={(valueOption) => {}}
                            placeholder="Business Unit Name"
                            isDisabled={true}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-lg-8 pr-0 table-responsive">
                    <table className={"table mt-1 bj-table"}>
                      <thead>
                        <tr>
                          <th style={{ width: "20px" }}>SL</th>
                          <th style={{ width: "120px" }}>Cost Component</th>
                          <th style={{ width: "100px" }}>Standard Amount</th>
                          <th style={{ width: "50px" }}>Actual Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {rowDto?.map((item, index) => (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>
                              <div className="text-left pl-2">
                                {item?.transportRouteCostComponent}
                              </div>
                            </td>
                            <td>
                              <div className="text-left pl-2">
                                <input
                                  type="number"
                                  className="form-control"
                                  value={item.standardCost}
                                  disabled={true}
                                  name="standardCost"
                                  onChange={(e) => {
                                    dataHandler(
                                      "standardCost",
                                      e.target.value,
                                      index
                                    );
                                  }}
                                />
                              </div>
                            </td>
                            <td>
                              <div className="text-center">
                                <input
                                  type="number"
                                  className="form-control"
                                  disabled={true}
                                  value={item.actualCost}
                                  name="actualCost"
                                  onChange={(e) => {
                                    dataHandler(
                                      "actualCost",
                                      e.target.value,
                                      index
                                    );
                                  }}
                                />
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                <h5 className="mt-3">Fule Cost</h5>
                <div className="row">
                  <div className="col-lg-12 table-responsive">
                    <table className={"table global-table"}>
                      <thead>
                        <tr>
                          <th style={{ width: "20px" }}>SL</th>
                          <th style={{ width: "120px" }}>Fuel Station Name</th>
                          <th style={{ width: "100px" }}>Fuel Type</th>
                          <th style={{ width: "50px" }}>Litter</th>
                          <th style={{ width: "50px" }}>Date</th>
                          <th style={{ width: "50px" }}>Payment Type</th>
                          <th style={{ width: "50px" }}>Fuel Memo No</th>
                          <th style={{ width: "50px" }}>Cash Amount</th>
                          <th style={{ width: "50px" }}>Credit Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {fuleCost?.map((item, index) => (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{item?.fuelStationName}</td>
                            <td>{item?.fuelTypeName}</td>
                            <td className="text-right">{item?.fuelQty}</td>
                            <td className="text-center">{item?.fuelDate}</td>
                            <td>{item?.purchaseTypeName}</td>
                            <td>{item?.fuelMemoNo || ""}</td>
                            <td className="text-right">
                              {item?.purchaseCashAmount}
                            </td>
                            <td className="text-right">
                              {item?.purchaseCreditAmount}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                {/* <div className="row">
                  <div className="col-lg-6 mt-2">
                    <h5 className="mt-1">Distance KM</h5>
                  </div>
                  <div className="col-lg-6 mt-2">
                    {" "}
                    <h5 className="mt-1">Vehicle Rent</h5>
                  </div>
                  
                  <div className="col-lg-6">
                    <table className={"table global-table"}>
                      <thead>
                        <tr>
                          <th style={{ width: "20px" }}>SL</th>
                          <th style={{ width: "120px" }}>Customer Name </th>
                          <th style={{ width: "100px" }}>Address</th>
                          <th style={{ width: "50px" }}>Distance KM</th>
                        </tr>
                      </thead>
                      <tbody>
                        {distanceKM?.map((item, index) => (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{item?.strPartnerShippingName}</td>
                            <td>{item?.strPartnerShippingAddress}</td>
                            <td>{item?.numDistanceKM}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  
                  <div className="col-lg-6">
                    <table className={"table global-table"}>
                      <thead>
                        <tr>
                          <th style={{ width: "20px" }}>SL</th>
                          <th style={{ width: "120px" }}>Customer Name </th>
                          <th style={{ width: "100px" }}>Address</th>
                          <th style={{ width: "50px" }}>Rent Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {vehicleReant?.map((item, index) => (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{item?.partnerShippingName}</td>
                            <td>{item?.partnerShippingAddress}</td>
                            <td>{item?.rentAmount}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div> */}

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
          </ICustomCard>
        )}
      </Formik>
    </>
  );
}
