import React, { useEffect, useState } from "react";
import { Formik, Form, Field } from "formik";
import InputField from "../../../../_helper/_inputField";
import { getComponentDDL } from "../helper";
import ICustomCard from "../../../../_helper/_customCard";
import ChalanInfo from "./../Form/ChalanInfo";
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
  landingValues,
}) {
  // eslint-disable-next-line no-unused-vars
  const [componentDDL, setComponentDDL] = useState([]);
  const [total, setTotal] = useState({ totalStandardCost: 0, totalActual: 0 });
  useEffect(() => {
    if (profileData.accountId) {
      getComponentDDL(profileData.accountId, setComponentDDL);
    }
  }, [profileData]);

  // const history = useHistory();
  //total amount calculation
  useEffect(() => {
    let totalStandardCost = 0;
    let totalActual = 0;
    if (rowDto.length) {
      for (let i = 0; i < rowDto.length; i++) {
        totalStandardCost += +rowDto[i].standardCost;
        totalActual += +rowDto[i].actualCost;
      }
    }
    setTotal({ totalStandardCost, totalActual });
  }, [rowDto]);

  const totalCost = fuleCost?.reduce(
    (acc, cur) => (acc += +cur?.purchaseCreditAmount),
    0
  );
  const totalActualCost = rowDto?.reduce(
    (acc, cur) => (acc += +cur?.actualCost),
    0
  );
  const cal =
    totalActualCost -
    totalCost +
    (initData?.downTripCredit - initData?.downTripCash);
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
          <ICustomCard title='View Shipment Cost'>
            <>
              <Form className='form form-label-right position-relative'>
                <p style={{ position: "absolute", top: "-46px", left: "45%" }}>
                  <b>Pay to Driver: </b>
                  {cal - values?.advanceAmount}
                </p>
                <div className='row global-form'>
                  <div className='col-lg-12'>
                    <div
                      className='row bank-journal  '
                      style={{ paddingBottom: "20px 0" }}
                    >
                      <div className='col-lg-3 pl pr-1 mb-1'>
                        <InputField
                          label='Vehicle No'
                          value={values?.vehicleNo}
                          name='vehicleNo'
                          placeholder='vehial No'
                          type='text'
                          disabled={true}
                        />
                      </div>
                      <div className='col-lg-3 pl pr-1 mb-1'>
                        <InputField
                          label='Driver Name'
                          value={values?.driverName}
                          name='driverName'
                          placeholder='Driver Name'
                          type='text'
                          disabled={true}
                        />
                      </div>
                      <div className='col-lg-3 pl pr-1 mb-1'>
                        <InputField
                          label='Route Name'
                          value={values?.routeName}
                          name='routeName'
                          placeholder='Route Name'
                          type='text'
                          disabled={true}
                        />
                      </div>
                      <div className='col-lg-3 pl pr-1 mb-1'>
                        <InputField
                          label='Distance Km'
                          value={values?.distanceKm}
                          name='distanceKm'
                          placeholder='Distance Km'
                          type='number'
                          disabled={true}
                        />
                      </div>
                      <div className='col-lg-3 pl pr-1 mb-1'>
                        <InputField
                          label='Extra Millage (KM)'
                          value={values?.extraMillage}
                          name='extraKm'
                          placeholder='Extra Millage'
                          type='number'
                          disabled={true}
                        />
                      </div>
                      <div className='col-lg-3 pl pr-1 mb-1'>
                        <InputField
                          label='Reason For Extra Millage (KM)'
                          value={values?.extraMillageReason}
                          name='reasonKm'
                          placeholder='Reason For Extra Millage'
                          type='text'
                          disabled={true}
                        />
                      </div>
                      <div className='col-lg-3 pl pr-1 mb-1'>
                        <InputField
                          value={values?.shipmentDate}
                          label='Shipment Date'
                          type='date'
                          name='shipmentDate'
                          placeholder=''
                          disabled={true}
                        />
                      </div>
                      <div className='col-lg-3 pl pr-1 mb-1'>
                        <InputField
                          label='Start Millage'
                          value={values?.startMillage}
                          name='startMillage'
                          placeholder='Start Millage'
                          type='number'
                          disabled={true}
                        />
                      </div>
                      <div className='col-lg-3 pl pr-1 mb-1'>
                        <InputField
                          label='End Millage'
                          value={values?.endMillage}
                          name='endMillage'
                          placeholder='End Millage'
                          type='number'
                          disabled={true}
                        />
                      </div>
                      <div className='col-lg-3 pl pr-1 mb-1'>
                        <div style={{ marginBottom: "5px" }}>
                          Expense Entered
                        </div>
                        <input
                          checked={values.isExpenseEntered}
                          name='isExpenseEntered'
                          type='checkbox'
                          disabled={true}
                        />
                      </div>
                      <div className='col-lg-3 pl pr-1 mb-1'>
                        <div style={{ marginBottom: "5px" }}>
                          Advane Requested
                        </div>
                        <input
                          checked={values.isAdvanceRequested}
                          name='isAdvanceRequested'
                          type='checkbox'
                          disabled={true}
                        />
                      </div>
                      <div className='col-lg-3 pl pr-1 mb-1'>
                        <InputField
                          label='Total Standard Cost'
                          value={total?.totalStandardCost}
                          name='totalStandardCost'
                          placeholder='Total Standard Cost'
                          type='number'
                          disabled={true}
                        />
                      </div>
                      <div className='col-lg-3 pl pr-1 mb-1'>
                        <InputField
                          label='Advance Amount'
                          value={values?.advanceAmount}
                          name='advanceAmount'
                          placeholder='Advane Amount'
                          type='number'
                          disabled={true}
                        />
                      </div>
                      <div className='col-lg-3 pl pr-1 mb-1'>
                        <InputField
                          label='Total Actual'
                          value={total?.totalActual}
                          name='totalActualCost'
                          placeholder='Total Actual'
                          type='number'
                          disabled={true}
                        />
                      </div>
                      <div className='col-lg-3 pl pr-1 mb-1'>
                        <InputField
                          label='Down Trip Cash'
                          value={values?.downTripCash}
                          name='downTripCash'
                          placeholder='Down Trip Cash'
                          type='number'
                          min='0'
                          disabled={true}
                        />
                      </div>
                      <div className='col-lg-3 pl pr-1 mb-1'>
                        <InputField
                          label='Down Trip Credit'
                          value={values?.downTripCredit}
                          name='downTripCredit'
                          placeholder='Down Trip Credit'
                          type='number'
                          min='0'
                          disabled={true}
                        />
                      </div>
                      {landingValues?.reportType?.label === "Complete" && (
                        <>
                          <div className='col-lg-3'>
                            <label>Vehicle In Date</label>
                            <InputField
                              value={values?.vehicleInDate}
                              name='vehicleInDate'
                              placeholder='Vehicle In Date'
                              type='date'
                              disabled={true}
                            />
                          </div>
                          <div className='col-lg-3'>
                            <label>Vehicle In Time</label>
                            <InputField
                              value={values?.vehicleInTime}
                              name='vehicleInTime'
                              placeholder='Vehicle In Time'
                              type='time'
                              disabled={true}
                            />
                          </div>
                        </>
                      )}
                      {+values?.downTripCredit > 0 && (
                        <div className='col-lg-3 pl pr-1 mb-1'>
                          <NewSelect
                            name='businessUnitName'
                            options={[]}
                            value={values?.businessUnitName}
                            label='Business Unit Name'
                            onChange={(valueOption) => {}}
                            placeholder='Business Unit Name'
                            isDisabled={true}
                          />
                        </div>
                      )}
                      <div className='col-lg-3'>
                        <label>Fuel Rate</label>
                        <InputField
                          value={values?.fuelRate}
                          name='fuelRate'
                          placeholder='Fuel Rate'
                          type='number'
                          onChange={(e) => {}}
                          disabled={true}
                        />
                      </div>
                      <div className='col-lg-3'>
                        <label>Total Fuel Cost</label>
                        <InputField
                          value={values?.totalFuelCost}
                          name='totalFuelCost'
                          placeholder='Total Fuel Cost'
                          type='text'
                          disabled={true}
                        />
                      </div>{" "}
                      <div className='col-lg-3'>
                        <label>Total Fuel Cost Liter</label>
                        <InputField
                          value={values?.totalFuelCostLtr}
                          name='totalFuelCostLtr'
                          placeholder='Total Fuel Cost Liter'
                          type='text'
                          disabled={true}
                        />
                      </div>
                      <div className='col-lg-3' style={{ marginTop: "18px" }}>
                        <Field
                          type='checkbox'
                          name='downTraip'
                          checked={values?.downTraip}
                          disabled={true}
                        />
                        <label className='ml-2'>is Down Trip Allowance?</label>
                      </div>
                      {values?.downTraip === true ? (
                        <div className='col-lg-3 pl pr-1 mb-1'>
                          <InputField
                            label='Down Trip Allowance'
                            value={values?.downTripAllowns}
                            name='downTripAllowns'
                            placeholder='Down Trip Allowance'
                            type='number'
                            disabled={true}
                          />
                        </div>
                      ) : (
                        ""
                      )}
                      <div className='col-lg-12'>
                        <hr />
                      </div>
                      <div className='col-lg-3'>
                        <NewSelect
                          name='profitCenter'
                          value={values?.profitCenter}
                          label='Profit Center'
                          onChange={(valueOption) => {}}
                          placeholder='Profit Center'
                          isDisabled={true}
                        />
                      </div>
                      <div className='col-lg-3'>
                        <NewSelect
                          name='costCenter'
                          value={values?.costCenter}
                          label='Cost Center'
                          onChange={(valueOption) => {}}
                          placeholder='Cost Center'
                          isDisabled={true}
                        />
                      </div>
                      <div className='col-lg-3'>
                        <NewSelect
                          name='costElement'
                          value={values?.costElement}
                          label='Cost Element'
                          onChange={(valueOption) => {}}
                          placeholder='Cost Element'
                          isDisabled={true}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className='row'>
                  <div className='col-lg-8 pr-0 table-responsive'>
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
                              <div className='text-left pl-2'>
                                {item?.transportRouteCostComponent}
                              </div>
                            </td>
                            <td>
                              <div className='text-left pl-2'>
                                <input
                                  type='number'
                                  className='form-control'
                                  value={item.standardCost}
                                  disabled={true}
                                  name='standardCost'
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
                              <div className='text-center'>
                                <input
                                  type='number'
                                  className='form-control'
                                  disabled={true}
                                  value={item.actualCost}
                                  name='actualCost'
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
                <h5 className='mt-3'>Fule Cost</h5>
                <div className='row'>
                  <div className='col-lg-12 table-responsive'>
                    <table className={"table global-table"}>
                      <thead>
                        <tr>
                          <th style={{ width: "20px" }}>SL</th>
                          <th style={{ width: "120px" }}>Fuel Station Name</th>
                          <th style={{ width: "100px" }}>Fuel Type</th>
                          <th style={{ width: "50px" }}>Litter</th>
                          <th style={{ width: "50px" }}>Date</th>
                          <th style={{ width: "50px" }}>Payment Type</th>
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
                            <td>{item?.fuelQty}</td>
                            <td>{item?.fuelDate}</td>
                            <td>{item?.purchaseTypeName}</td>
                            <td>{item?.purchaseCashAmount}</td>
                            <td>{item?.purchaseCreditAmount}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className='row'>
                  <div className='col-lg-6 mt-2'>
                    <h5 className='mt-1'>Distance KM</h5>
                  </div>
                  <div className='col-lg-6 mt-2'>
                    {" "}
                    <h5 className='mt-1'>Vehicle Rent</h5>
                  </div>
                  {/* distanceKM talbe */}
                  <div className='col-lg-6 table-responsive'>
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

                  {/* Vehicle Reant table */}
                  <div className='col-lg-6 table-responsive'>
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
                  <ChalanInfo shipmentId={shipmentId} />
                </div>

                <button
                  type='submit'
                  style={{ display: "none" }}
                  ref={btnRef}
                  onSubmit={() => handleSubmit()}
                ></button>

                <button
                  type='reset'
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
