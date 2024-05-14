/* eslint-disable eqeqeq */
import React, { useState, useEffect } from "react";
import { Formik, Form, Field } from "formik";
import Axios from "axios";
import * as Yup from "yup";
import { Input } from "../../../../../../../../_metronic/_partials/controls";
import NewSelect from "../../../../../../_helper/_select";
import IDelete from "../../../../../../_helper/_helperIcons/_delete";
import { _dateFormatter } from "../../../../../../_helper/_dateFormate";
import InputField from "./../../../../../../_helper/_inputField";
import { getBusinessPartnerBasicinfoAction } from "./helper";

// Validation schema
const ProductEditSchema = Yup.object().shape({
  sbu: Yup.object().shape({
    label: Yup.string().required("SBU is required"),
    value: Yup.string().required("SBU is required"),
  }),
  salesOrganaization: Yup.object().shape({
    label: Yup.string().required("Sales Organaization is required"),
    value: Yup.string().required("Sales Organaization is required"),
  }),
  customerType: Yup.object().shape({
    label: Yup.string().required("Customer Type is required"),
    value: Yup.string().required("Customer Type is required"),
  }),
  distributionChannel: Yup.object().shape({
    label: Yup.string().required("Distribution Channel is required"),
    value: Yup.string().required("Distribution Channel is required"),
  }),
  salesTerriory: Yup.object().shape({
    label: Yup.string().required("Sales Terriory is required"),
    value: Yup.string().required("Sales Terriory is required"),
  }),
  // transportZone: Yup.object().shape({
  //   label: Yup.string().required('Transport Zone is required'),
  //   value: Yup.string().required('Transport Zone is required'),
  // }),
  reconGeneralLedger: Yup.object().shape({
    label: Yup.string().required("Recon General Ledger is required"),
    value: Yup.string().required("Recon General Ledger is required"),
  }),
  alternetGeneralLedger: Yup.object().shape({
    label: Yup.string().required("Alternate Generale is required"),
    value: Yup.string().required("Alternate Generale is required"),
  }),
  // defaultDistanceKm: Yup.number()
  //   .min(0, 'Minimum 0 range')
  //   .max(100000, 'Maximum 100000 range')
  //   .required('distanceKm is required'),
  // soldToParty: Yup.object().shape({
  //   label: Yup.string().required('Sold To Party is required'),
  //   value: Yup.string().required('Sold To Party is required'),
  // }),
  // shippingPoint: Yup.object().shape({
  //   label: Yup.string().required('Shipping Point  is required'),
  //   value: Yup.string().required('Shipping Point  is required'),
  // }),
  priceStructure: Yup.object().shape({
    label: Yup.string().required("Price Structure is required"),
    value: Yup.string().required("Price Structure is required"),
  }),
  creditLimitAmount: Yup.number()
    .min(0, "Minimum 0 range")
    .max(1000000000000000, "Maximum 1000000000000000 range"),
  morgazeAmount: Yup.number()
    .min(0, "Minimum 0 range")
    .max(1000000000000000, "Maximum 1000000000000000 range"),
});

export default function _Form({
  product,
  btnRef,
  savePartnerSales,
  resetBtnRef,
  setter,
  defaultSetter,
  remover,
  rowDto,
  sbuDDL,
  salesOrganaizationDDL,
  getSalesOrganaizationDDL,
  distributionChannelDDL,
  salesTerrioryDDL,
  transportZoneDDL,
  reconGLDDL,
  alternateGLDDL,
  soldToPartyDDL,
  shippingPointDDL,
  alternateShippingPointDDL,
  priceStructureDDL,
  creditLimitSetter,
  creditRemover,
  creditRowDto,
  setCreditLimitAmount,
  morgazeSetter,
  morgazeRemover,
  morgazeRowDto,
  itemSlectedHandler,
  setterTwo,
  itemSlectedHandlerTwo,
  rowDtoTwo,
  removerTwo,
  shippingAddressTrueFunc,
  id,
  selectedBusinessUnit,
  profileData,
}) {
  const [mortageTypeDDL, setMortageTypeDDL] = useState([]);
  const [parnerBasicInfo, setParnerBasicInfo] = useState("");

  useEffect(() => {
    getMortageTypeDDL();
  }, []);

  useEffect(() => {
    if (id && profileData && selectedBusinessUnit) {
      getBusinessPartnerBasicinfoAction(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        id,
        setParnerBasicInfo
      );
    }
  }, [profileData, selectedBusinessUnit, id]);

  const getMortageTypeDDL = async () => {
    try {
      const res = await Axios.get(`/fino/FinanceCommonDDL/GetMortageTypeDDL`);
      setMortageTypeDDL(res.data);
    } catch (error) {
     
    }
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={product}
        validationSchema={ProductEditSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          savePartnerSales(values, () => {
            resetForm(product);
          });
        }}
      >
        {({
          handleSubmit,
          resetForm,
          values,
          handleChange,
          errors,
          touched,
          setFieldValue,
          isValid,
        }) => (
          <>
            <Form className="form form-label-right">
              <div className="row">
                <div className="col-lg-12">
                  <div className="row bank-journal bank-journal-custom bj-left">
                    <div className="col-lg-3 mb-2">
                      <NewSelect
                        name="customerType"
                        options={[
                          {
                            value: 1,
                            label: "Dealer",
                          },
                          { value: 2, label: "Distributor" },
                        ]}
                        value={values?.customerType}
                        label="Customer Type"
                        onChange={(valueOption) => {
                          setFieldValue("customerType", valueOption);
                        }}
                        placeholder="Customer Type"
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className="col-lg-3 mb-2">
                      <NewSelect
                        name="sbu"
                        options={sbuDDL}
                        value={values?.sbu}
                        label="SBU List"
                        onChange={(valueOption) => {
                          getSalesOrganaizationDDL(valueOption?.value);
                          setFieldValue("sbu", valueOption);
                          setFieldValue("salesOrganaization", "");
                        }}
                        placeholder="SBU List"
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className="col-lg-3 mb-2">
                      <NewSelect
                        name="salesOrganaization"
                        options={salesOrganaizationDDL}
                        value={values?.salesOrganaization}
                        label="Sales Organaization"
                        onChange={(valueOption) => {
                          setFieldValue("salesOrganaization", valueOption);
                        }}
                        placeholder="Sales Organaization"
                        errors={errors}
                        touched={touched}
                        isDisabled={!values.sbu?.value}
                      />
                    </div>
                    <div className="col-lg-3 mb-2">
                      <NewSelect
                        name="distributionChannel"
                        options={distributionChannelDDL}
                        value={values?.distributionChannel}
                        label="Distribution Channel"
                        onChange={(valueOption) => {
                          setFieldValue("distributionChannel", valueOption);
                        }}
                        placeholder="Distribution Channel"
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className="col-lg-3 mb-2">
                      <NewSelect
                        name="salesTerriory"
                        options={salesTerrioryDDL}
                        value={values?.salesTerriory}
                        label="Sales Terriory"
                        onChange={(valueOption) => {
                          setFieldValue("salesTerriory", valueOption);
                        }}
                        placeholder="Sales Terriory"
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className="col-lg-3 mb-2">
                      <NewSelect
                        name="reconGeneralLedger"
                        options={reconGLDDL}
                        value={values?.reconGeneralLedger}
                        label="Receiveble GL"
                        onChange={(valueOption) => {
                          setFieldValue("reconGeneralLedger", valueOption);
                        }}
                        placeholder="Receiveble GL"
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className="col-lg-3 mb-2">
                      <NewSelect
                        name="alternetGeneralLedger"
                        options={alternateGLDDL}
                        value={values?.alternetGeneralLedger}
                        label="Advance Receive GL"
                        onChange={(valueOption) => {
                          setFieldValue("alternetGeneralLedger", valueOption);
                        }}
                        placeholder="Advance Receive GL"
                        errors={errors}
                        touched={touched}
                      />
                    </div>

                    <div className="col-lg-3 mb-2">
                      <NewSelect
                        name="priceStructure"
                        options={priceStructureDDL}
                        value={values?.priceStructure}
                        label="Price Structure"
                        onChange={(valueOption) => {
                          setFieldValue("priceStructure", valueOption);
                        }}
                        placeholder="Price Structure"
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                  </div>
                </div>
              </div>
              {/* shipping point table */}
              <div className="row pt-1">
                <div className="col-lg-3">
                  <h6
                    style={{
                      textAlign: "center",
                      fontSize: "10.5px",
                      fontWeight: "600",
                      margin: "0 0 3px 0",
                    }}
                  >
                    Assign Shipping Point
                  </h6>
                  <div className="row bank-journal bank-journal-custom bj-left">
                    <div className="col-lg-8 mb-2">
                      <NewSelect
                        name="shippingPoint"
                        options={shippingPointDDL}
                        value={values?.shippingPoint}
                        label="Shipping Point"
                        onChange={(valueOption) => {
                          setFieldValue("shippingPoint", valueOption);
                        }}
                        placeholder="Shipping Point"
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className="col-lg-4 mt-2 d-flex align-items-center">
                      <div>
                        <button
                          onClick={() => {
                            const obj = {
                              shipPointId: values?.shippingPoint?.value,
                              shipPointName: values?.shippingPoint?.label,
                            };
                            defaultSetter(obj);
                          }}
                          className="btn btn-primary"
                          disabled={!values?.shippingPoint}
                          type="button"
                          style={{ padding: "5px" }}
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-9">
                  <h6
                    style={{
                      textAlign: "center",
                      fontSize: "10.5px",
                      fontWeight: "600",
                      margin: "0 0 3px 0",
                    }}
                  >
                    Add Shipping Address
                  </h6>
                  <span
                    className="separtBorder"
                    style={{
                      position: "absolute",
                      width: "2px",
                      background: "white",
                      height: "81%",
                      zIndex: "99",
                      left: "3px",
                      top: "15px",
                    }}
                  ></span>
                  <div className="row bank-journal bank-journal-custom bj-left">
                    <div className="col-lg-3 pr-1 mb-2">
                      <label>Ship To Parner Name</label>
                      <InputField
                        value={values?.shipToParner}
                        name="shipToParner"
                        placeholder="Ship To Parner Name"
                        type="text"
                      />
                    </div>
                    <div className="col-lg-3 pr-1">
                      <label>Address</label>
                      <InputField
                        value={values?.address}
                        name="address"
                        placeholder="Address"
                        type="text"
                      />
                    </div>
                    <div className="col-lg-2 pr-1">
                      <label>Contact</label>
                      <InputField
                        value={values?.contact}
                        name="contact"
                        placeholder="Contact"
                        type="number"
                        min="0"
                      />
                    </div>
                    <div className="col-lg-2 pr-1">
                      <NewSelect
                        name="transportZone"
                        options={transportZoneDDL}
                        value={values?.transportZone}
                        label="Transport Zone"
                        onChange={(valueOption) => {
                          setFieldValue("transportZone", valueOption);
                        }}
                        placeholder="select"
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className="col-lg-2">
                      <div>
                        <label>
                          <input
                            type="checkbox"
                            onChange={() => {
                              setFieldValue(
                                "shipToParner",
                                parnerBasicInfo[0]?.businessPartnerName
                              );
                              setFieldValue(
                                "address",
                                parnerBasicInfo[0]?.businessPartnerAddress
                              );
                              setFieldValue(
                                "contact",
                                parnerBasicInfo[0]?.contactNumber
                              );
                            }}
                            name="shippingAddress"
                            label="Copy Address"
                            style={{marginRight: "3px", position: "relative", top: "3px"}}
                          />
                          <span>Copy Address</span>
                        </label>
                      </div>
                      <div>
                        <button
                          onClick={() => {
                            setterTwo(values);
                          }}
                          className="btn btn-primary mt-2"
                          disabled={
                            !values?.address ||
                            !values?.shipToParner ||
                            !values?.contact ||
                            !values?.transportZone
                          }
                          type="button"
                          style={{ padding: "5px" }}
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="row cash_journal bank-journal bank-journal-custom">
                <div className="col-lg-3 pr-0 pl-0">
                  {rowDto.length > 0 ? (
                    <div className="table-responsive">
                      <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing sales_order_landing_table">
                      <thead>
                        <tr>
                          <th>SL</th>
                          <th>Shipping Point</th>
                          <th>Default</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {rowDto.map((itm, idx) => {
                          return (
                            <tr key={itm?.shipPointId}>
                              <td>{idx + 1}</td>
                              <td>
                                <div className="pl-2">{itm.shipPointName}</div>
                              </td>
                              <td>
                                <div className="pl-2">
                                  <input
                                    id="isDefaultShippoint"
                                    type="checkbox"
                                    className=""
                                    value={itm?.isDefaultShippoint}
                                    checked={itm?.isDefaultShippoint}
                                    name={itm?.isDefaultShippoint}
                                    onChange={(e) => {
                                      itemSlectedHandler(e.target.checked, idx);
                                    }}
                                  />
                                </div>
                              </td>
                              <td className="text-center">
                                {/* <IDelete
                                  remover={remover}
                                  id={itm?.shipPointId}
                                /> */}
                                <i
                                  className="fa fa-trash deleteBtn text-danger"
                                  onClick={() =>
                                    remover(
                                      itm?.shipPointId,
                                      itm?.isDefaultShippoint
                                    )
                                  }
                                ></i>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
                <div className="col-lg-9 pr-0 pl-0">
                  {rowDtoTwo.length > 0 ? (
                    <div className="table-responsive">
                      <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing sales_order_landing_table">
                      <thead>
                        <tr>
                          <th>SL</th>
                          <th>Ship To Parner Name</th>
                          <th>Address</th>
                          <th>Contact</th>
                          <th>Transport Zone</th>
                          <th>Default</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {rowDtoTwo.map((itm, idx) => {
                          return (
                            <tr key={itm?.shipPointId}>
                              <td>{idx + 1}</td>
                              <td>
                                <div className="pl-2">
                                  {itm?.partnerShippingName}
                                </div>
                              </td>
                              <td>
                                <div className="pl-2">
                                  {itm?.partnerShippingAddress}
                                </div>
                              </td>
                              <td>
                                <div className="pl-2">
                                  {itm?.partnerShippingContact}
                                </div>
                              </td>
                              <td>
                                <div className="pl-2">
                                  {itm?.transportZoneName}
                                </div>
                              </td>
                              <td>
                                <div className="pl-2">
                                  <input
                                    id="isDefaultshipToParner"
                                    type="checkbox"
                                    className=""
                                    value={itm?.isDefaultAddress}
                                    checked={itm?.isDefaultAddress}
                                    name={itm?.isDefaultAddress}
                                    onChange={(e) => {
                                      itemSlectedHandlerTwo(
                                        e.target.checked,
                                        idx
                                      );
                                      shippingAddressTrueFunc(itm);
                                    }}
                                  />
                                </div>
                              </td>
                              <td className="text-center">
                                {/* <IDelete remover={removerTwo} id={idx} /> */}
                                <i
                                  className="fa fa-trash deleteBtn text-danger"
                                  onClick={() =>
                                    removerTwo(idx, itm?.isDefaultAddress)
                                  }
                                ></i>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              </div>

              <div className="row my-2">
                <div className="col-lg-6">
                  <h6
                    style={{
                      textAlign: "center",
                      fontSize: "10.5px",
                      fontWeight: "600",
                      margin: "0 0 3px 0",
                    }}
                  >
                    Set Credit Limit
                  </h6>
                  <div className="row bank-journal bank-journal-custom bj-left mr-1">
                    <div className="col-lg-3 mb-2">
                      <Field
                        value={values?.creditLimitAmount || ""}
                        name="creditLimitAmount"
                        type="number"
                        component={Input}
                        placeholder="Credit Limit"
                        label="Credit Limit"
                        min="0"
                      />
                    </div>
                    <div className="col-lg-3 mb-2">
                      <div>Valid From Date</div>
                      <input
                        className="trans-date cj-landing-date"
                        value={values?.creditValidFrom || ""}
                        name="creditValidFrom"
                        onChange={(e) => {
                          setFieldValue("creditValidFrom", e.target.value);
                        }}
                        type="date"
                      />
                    </div>
                    <div className="col-lg-3 mb-2">
                      <div>Valid To Date</div>
                      <input
                        className="trans-date cj-landing-date"
                        value={values?.creditValidTo || ""}
                        name="creditValidTo"
                        onChange={(e) => {
                          setFieldValue("creditValidTo", e.target.value);
                        }}
                        type="date"
                      />
                    </div>
                    <div className="col-lg-3 mt-4">
                      <button
                        style={{ padding: "5px" }}
                        onClick={() => {
                          const obj = {
                            creditLimit: values?.creditLimitAmount,
                            fromDate: values?.creditValidFrom,
                            toDate: values?.creditValidTo,
                            configId: 0,
                          };
                          creditLimitSetter(obj);
                        }}
                        className="btn btn-primary"
                        disabled={
                          values?.creditLimitAmount < 0 ||
                          !values?.creditLimitAmount ||
                          !values?.creditValidFrom ||
                          !values?.creditValidTo
                        }
                        type="button"
                      >
                        Add
                      </button>
                    </div>
                  </div>

                  {/* credit limit table */}
                  <div className="row cash_journal bank-journal bank-journal-custom mr-1">
                    <div className="col-lg-12 pr-0 pl-0">
                      {creditRowDto.length > 0 ? (
                       <div className="table-responsive">
                         <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing sales_order_landing_table">
                          <thead>
                            <tr>
                              <th>SL</th>
                              <th>Credit Limit</th>
                              <th>Valid From</th>
                              <th>Valid To</th>
                              <th>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {creditRowDto.map((itm, idx) => {
                              return (
                                <tr key={idx}>
                                  <td className="text-center">{idx + 1}</td>
                                  <td>
                                    <InputField
                                      value={itm?.creditLimit}
                                      name="names"
                                      placeholder="Name"
                                      type="number"
                                      onChange={(e) =>
                                        setCreditLimitAmount(
                                          idx,
                                          e.target.value
                                        )
                                      }
                                      min="0"
                                    />
                                  </td>
                                  <td>
                                    <div>
                                      <div className="text-right pr-2">
                                        {_dateFormatter(itm?.fromDate)}
                                      </div>
                                    </div>
                                  </td>
                                  <td>
                                    <div>
                                      <div className="text-right pr-2">
                                        {_dateFormatter(itm?.toDate)}
                                      </div>
                                    </div>
                                  </td>
                                  <td className="text-center">
                                    <IDelete remover={creditRemover} id={idx} />
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                       </div>
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                </div>
                <div className="col-lg-6">
                  <h6
                    style={{
                      textAlign: "center",
                      fontSize: "10.5px",
                      fontWeight: "600",
                      margin: "0 0 3px 0",
                    }}
                  >
                    Add Mortgage Information
                  </h6>
                  <div className="row bank-journal bank-journal-custom bj-left">
                    <div className="col-lg-3 mb-1 p-1">
                      <NewSelect
                        name="morgazeType"
                        options={mortageTypeDDL || []}
                        value={values?.morgazeType}
                        label="Mortgage Type"
                        onChange={(valueOption) => {
                          setFieldValue("morgazeType", valueOption);
                        }}
                        placeholder="Type"
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className="col-lg-3 p1">
                      <label>Amount</label>
                      <InputField
                        value={values?.morgazeAmount}
                        name="morgazeAmount"
                        placeholder="Morgaze Amount"
                        type="text"
                      />
                    </div>
                    <div className="col-lg-3 p-1">
                      <label>Narration</label>
                      <InputField
                        value={values?.morgazeNarration}
                        name="morgazeNarration"
                        placeholder="Morgaze Narration"
                        type="text"
                      />
                    </div>
                    <div className="col-lg-3 mt-4 p-1">
                      <button
                        style={{ padding: "5px" }}
                        onClick={() => {
                          const obj = {
                            mortgageTypeId: values?.morgazeType?.value,
                            mortageTypeName: values?.morgazeType?.label,
                            numMortgageAmount: values?.morgazeAmount,
                            narration: values?.morgazeNarration,
                            configId: 0,
                          };
                          morgazeSetter(obj);
                        }}
                        className="btn btn-primary"
                        disabled={
                          !values?.morgazeType ||
                          !values?.morgazeAmount ||
                          !values?.morgazeNarration
                        }
                        type="button"
                      >
                        Add
                      </button>
                    </div>
                  </div>

                  {/* morgaze table */}
                  <div className="row cash_journal bank-journal bank-journal-custom mr-1">
                    <div className="col-lg-12 pr-0 pl-0">
                      {morgazeRowDto.length > 0 ? (
                        <div className="table-responsive">
                          <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing sales_order_landing_table">
                          <thead>
                            <tr>
                              <th>SL</th>
                              <th>Morgaze Type</th>
                              <th>Amount</th>
                              <th>Narration</th>
                              <th>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {morgazeRowDto.map((itm, idx) => {
                              return (
                                <tr key={itm?.mortgageTypeId}>
                                  <td className="text-center">{idx + 1}</td>
                                  <td>
                                    <div>
                                      <div className="pl-2">
                                        {itm?.mortageTypeName}
                                      </div>
                                    </div>
                                  </td>
                                  <td>
                                    <div>
                                      <div className="text-right pr-2">
                                        {itm?.numMortgageAmount}
                                      </div>
                                    </div>
                                  </td>
                                  <td>
                                    <div>
                                      <div className="text-right pr-2">
                                        {itm?.narration}
                                      </div>
                                    </div>
                                  </td>
                                  <td className="text-center">
                                    <IDelete
                                      remover={morgazeRemover}
                                      id={itm?.mortgageTypeId}
                                    />
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                        </div>
                      ) : (
                        ""
                      )}
                    </div>
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
                onSubmit={() => resetForm(product)}
              ></button>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}
