/* eslint-disable eqeqeq */
import Axios from "axios";
import { Form, Formik } from "formik";
import { DropzoneDialogBase } from "material-ui-dropzone";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { ToWords } from "to-words";
import * as Yup from "yup";
import { _dateFormatter } from "../../../../../../_helper/_dateFormate";
import IDelete from "../../../../../../_helper/_helperIcons/_delete";
import { getDownlloadFileView_Action } from "../../../../../../_helper/_redux/Actions";
import NewSelect from "../../../../../../_helper/_select";
import { _todayDate } from "../../../../../../_helper/_todayDate";
import InputField from "./../../../../../../_helper/_inputField";
import {
  attachmentUpload,
  getBankNameDDL_api,
  getBranchNameDDL_api,
  getBusinessPartnerBasicinfoAction,
} from "./helper";
import { getSalesTerrioryDDLAction } from "./_redux/Actions";

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
    label: Yup.string().required("Sales Territory is required"),
    value: Yup.string().required("Sales Territory is required"),
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
  partyStatusType: Yup.object().shape({
    label: Yup.string().required("Party Status Type is required"),
    value: Yup.string().required("Party Status Type is required"),
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
  shippingPointDDL,
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
  id,
  selectedBusinessUnit,
  profileData,
  numberOfDaysChangeHandler,
  setCreditRowDto,
  filterAdvanceReceiveGL,
  operationalZones,
  getOperationalZoneDDL,
  AGConcernDDL,
}) {
  const [mortageTypeDDL, setMortageTypeDDL] = useState([]);
  const [bankNameDDL, setBankNameDDL] = useState([]);
  const [branchNameDDL, setBranchNameDDL] = useState([]);
  const [filterReconGLDDL, setFilterReconGLDDL] = useState([]);

  const [parnerBasicInfo, setParnerBasicInfo] = useState("");

  // Credit Limit File Attachment
  const [fileObjects, setFileObjects] = useState([]);
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();

  const toWords = new ToWords({
    localeCode: "en-BD",
    converterOptions: {
      currency: false,
      ignoreDecimal: false,
      ignoreZeroCurrency: false,
      doNotAddOnly: true,
    },
  });

  useEffect(() => {
    getMortageTypeDDL();
    getBankNameDDL_api(setBankNameDDL);
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
    } catch (error) {}
  };

  const ReceivebleGLDDLConditionFunc = (salesOrgId, setFieldValue) => {
    //Sales Organaization select
    //LOCAL SALES Id: 6
    //Foreign Id:
    //Wastage Sales Id: 17
    if (salesOrgId === 6) {
      // return Trade Receivable (Local)
      const findData = reconGLDDL.find((i) => i?.value === 49);
      setFilterReconGLDDL(findData ? [findData] : "");
      setFieldValue && setFieldValue("reconGeneralLedger", findData || "");
    } else if (salesOrgId === 7) {
      // return Trade Receivable (Foreign)
      const findData = reconGLDDL.find((i) => i?.value === 50);
      setFilterReconGLDDL(findData ? [findData] : "");
      setFieldValue && setFieldValue("reconGeneralLedger", findData || "");
    } else if (salesOrgId === 17) {
      // return Trade Receivable (Wastage)
      const findData = reconGLDDL.find((i) => i?.value === 51);
      setFilterReconGLDDL(findData ? [findData] : "");
      setFieldValue && setFieldValue("reconGeneralLedger", findData || "");
    } else {
      setFilterReconGLDDL([]);
      setFieldValue && setFieldValue("reconGeneralLedger", "");
    }
  };

  useEffect(() => {
    if (
      id &&
      profileData?.accountId &&
      selectedBusinessUnit?.value &&
      product?.salesOrganaization?.value
    ) {
      ReceivebleGLDDLConditionFunc(product?.salesOrganaization?.value, null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData, selectedBusinessUnit, id, product]);

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
                          { value: 3, label: "B2B" },
                          { value: 4, label: "B2C" },
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
                          ReceivebleGLDDLConditionFunc(
                            valueOption?.value,
                            setFieldValue
                          );
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
                          setFieldValue("salesTerriory", "");
                          dispatch(
                            getSalesTerrioryDDLAction(
                              profileData.accountId,
                              selectedBusinessUnit.value,
                              valueOption?.value
                            )
                          );
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
                          getOperationalZoneDDL({
                            ...values,
                            salesTerriory: valueOption,
                          });
                        }}
                        placeholder="Sales Terriory"
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className="col-lg-3 mb-2">
                      <NewSelect
                        name="reconGeneralLedger"
                        options={filterReconGLDDL || []}
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
                        options={filterAdvanceReceiveGL || []}
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
                    <div className="col-lg-3 mb-2">
                      <label>Colletion Days (After Delivery)</label>
                      <InputField
                        value={values?.collectionDays}
                        name="collectionDays"
                        placeholder="Colletion Days (After Delivery)"
                        type="number"
                      />
                    </div>
                    <div className="col-lg-3 mb-2">
                      <NewSelect
                        name="paymentMode"
                        options={[
                          { value: 1, label: "Cash" },
                          { value: 2, label: "Credit" },
                          { value: 3, label: "Both" },
                        ]}
                        value={values?.paymentMode}
                        label="Payment Mode"
                        onChange={(valueOption) => {
                          setFieldValue("paymentMode", valueOption);
                        }}
                        placeholder="Payment Mode"
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className="col-lg-3 mb-2">
                      <NewSelect
                        name="exclusivity"
                        options={[
                          { value: true, label: "Exclusive" },
                          {
                            value: false,
                            label: "Non-Exclusive",
                          },
                        ]}
                        value={values?.exclusivity}
                        label="Exclusivity"
                        onChange={(valueOption) => {
                          setFieldValue("exclusivity", valueOption);
                        }}
                        placeholder="Exclusivity"
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className="col-lg-3 mb-2">
                      <NewSelect
                        name="partyStatusType"
                        options={[
                          {
                            value: "ChannelPartner",
                            label: "Channel Partner",
                          },
                          {
                            value: "Business Associate",
                            label: "Business Associate",
                          },
                          {
                            value: "BusinessPartner",
                            label: "Business Partner",
                          },
                        ]}
                        value={values?.partyStatusType}
                        label="Party Status Type"
                        onChange={(valueOption) => {
                          setFieldValue("partyStatusType", valueOption);
                        }}
                        placeholder="Party Status Type"
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className="col-lg-3 mb-2">
                      <NewSelect
                        name="customerCategory"
                        options={[
                          {
                            value: "Platinum",
                            label: "Platinum",
                          },
                          { value: "Gold", label: "Gold" },
                          { value: "Silver", label: "Silver" },
                        ]}
                        value={values?.customerCategory}
                        label="Customer Category"
                        onChange={(valueOption) => {
                          setFieldValue("customerCategory", valueOption);
                        }}
                        placeholder="Customer Category"
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className="col-lg-3 mb-2">
                      <NewSelect
                        name="agConcern"
                        options={AGConcernDDL?.data || []}
                        value={values?.agConcern}
                        label="Akij Concern"
                        onChange={(valueOption) => {
                          setFieldValue("agConcern", valueOption);
                        }}
                        placeholder="Akij Concern"
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className="col-lg-3 mb-2 d-flex align-items-center">
                      <label className="mt-1">
                        <input
                          type="checkbox"
                          onChange={(e) => {
                            setFieldValue(
                              "isTaxOnDeliveryAmount",
                              e.target.checked
                            );
                          }}
                          name="isTaxOnDeliveryAmount"
                          label="Tax On Delivery"
                          style={{
                            marginRight: "5px",
                            position: "relative",
                            top: "3px",
                          }}
                          value={values?.isTaxOnDeliveryAmount}
                          checked={values?.isTaxOnDeliveryAmount}
                        />
                        <span>Tax On Delivery</span>
                      </label>
                    </div>
                    <div className="col-lg-3 mb-2 d-flex align-items-center">
                      <label className="mt-1">
                        <input
                          type="checkbox"
                          onChange={(e) => {
                            setFieldValue(
                              "priceIncludingTax",
                              e.target.checked
                            );
                          }}
                          name="priceIncludingTax"
                          label="Price Including Tax"
                          style={{
                            marginRight: "5px",
                            position: "relative",
                            top: "3px",
                          }}
                          value={values?.priceIncludingTax}
                          checked={values?.priceIncludingTax}
                        />
                        <span>Price Including Tax</span>
                      </label>
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
                      <label>Ship To Partner Name</label>
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
                    {selectedBusinessUnit?.value === 4 && (
                      <div className="col-lg-2 pr-1">
                        <NewSelect
                          name="operationalZone"
                          options={operationalZones || []}
                          value={values?.operationalZone}
                          label="Operational Zone"
                          onChange={(valueOption) => {
                            setFieldValue("operationalZone", valueOption);
                          }}
                          placeholder="Operational Zone"
                          errors={errors}
                          touched={touched}
                        />
                      </div>
                    )}
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
                            style={{
                              marginRight: "3px",
                              position: "relative",
                              top: "3px",
                            }}
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
                  {rowDto?.length > 0 ? (
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
                            <tr key={idx}>
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
                  {rowDtoTwo?.length > 0 ? (
                   <div className="table-responsive">
                     <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing sales_order_landing_table">
                      <thead>
                        <tr>
                          <th>SL</th>
                          <th>Ship To Parner Name</th>
                          <th>Address</th>
                          <th>Contact</th>
                          <th>Transport Zone</th>
                          {selectedBusinessUnit?.value === 4 && (
                            <th>Operational Zone</th>
                          )}
                          <th>Default</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {rowDtoTwo.map((itm, idx) => {
                          return (
                            <tr key={idx}>
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
                              {selectedBusinessUnit?.value === 4 && (
                                <td>
                                  <div className="pl-2">
                                    {itm?.setUpZoneName}
                                  </div>
                                </td>
                              )}
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
                <div className="col-lg-12 p-0">
                  <h6
                    style={{
                      textAlign: "center",
                      fontSize: "10.5px",
                      fontWeight: "600",
                      margin: "5px 0 3px 0",
                    }}
                  >
                    Add Mortgage Information(Optional)
                  </h6>
                  <div className="row global-form mt-0">
                    <div className="col-lg-4">
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
                    <div className="col-lg-4">
                      <label>Amount</label>
                      <InputField
                        value={values?.morgazeAmount}
                        name="morgazeAmount"
                        placeholder="Morgaze Amount"
                        type="text"
                      />
                    </div>
                    <div className="col-lg-4">
                      <label>Narration</label>
                      <InputField
                        value={values?.morgazeNarration}
                        name="morgazeNarration"
                        placeholder="Morgaze Narration"
                        type="text"
                      />
                    </div>
                    <div className="col-lg-4">
                      <NewSelect
                        name="bankName"
                        options={bankNameDDL || []}
                        value={values?.bankName}
                        label="Bank Name"
                        onChange={(valueOption) => {
                          setFieldValue("bankName", valueOption);
                          setFieldValue("branchName", "");
                          getBranchNameDDL_api(
                            valueOption?.value,
                            18, // Hardcode for BD
                            setBranchNameDDL
                          );
                        }}
                        placeholder="Bank Name"
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className="col-lg-4">
                      <NewSelect
                        name="branchName"
                        options={branchNameDDL || []}
                        value={values?.branchName}
                        label="Branch Name"
                        onChange={(valueOption) => {
                          setFieldValue("branchName", valueOption);
                        }}
                        placeholder="Branch Name"
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className="col-lg-4">
                      <label>Ref No.</label>
                      <InputField
                        value={values?.refNo}
                        name="refNo"
                        placeholder="Ref No."
                        type="text"
                      />
                    </div>
                    <div className="col-lg-4">
                      <label>Expired Date</label>
                      <InputField
                        value={values?.expireDate}
                        name="expireDate"
                        placeholder="Expired Date"
                        type="date"
                      />
                    </div>
                    <div className="col-lg-4">
                      <InputField
                        label="Issue Date"
                        value={values?.issueDate}
                        name="issueDate"
                        placeholder="Issue Date"
                        type="date"
                      />
                    </div>
                    <div className="col d-flex justify-content-end align-items-center mt-2">
                      <button
                        style={{ padding: "5px" }}
                        onClick={() => {
                          const obj = {
                            mortgageTypeId: values?.morgazeType?.value,
                            mortageTypeName: values?.morgazeType?.label,
                            numMortgageAmount: values?.morgazeAmount,
                            narration: values?.morgazeNarration,
                            configId: 0,
                            bankId: values?.bankName?.value || 0,
                            bankName: values?.bankName?.label || "",
                            branchName: values?.branchName?.label,
                            branchId: values?.branchName?.value || 0,
                            refNo: values?.refNo || "",
                            expireDate: values?.expireDate || "",
                            issueDate: values?.issueDate || "",
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
                  <div className="row">
                    <div className="col-lg-12">
                      {morgazeRowDto?.length > 0 ? (
                      <div className="table-responsive">
                          <table className="table table-striped table-bordered global-table mt-0">
                          <thead>
                            <tr>
                              <th>SL</th>
                              <th>Morgaze Type</th>
                              <th>Amount</th>
                              <th>Narration</th>
                              <th>Bank Name</th>
                              <th>Branch Name</th>
                              <th>Ref No.</th>
                              <th>Expire Date</th>
                              <th>Issue Date</th>
                              <th>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {morgazeRowDto?.map((itm, idx) => {
                              return (
                                <tr key={itm?.mortgageTypeId + idx}>
                                  <td className="text-center">{idx + 1}</td>
                                  <td>{itm?.mortageTypeName}</td>
                                  <td>{itm?.numMortgageAmount}</td>
                                  <td>{itm?.narration}</td>
                                  <td>{itm?.bankName}</td>
                                  <td>{itm?.branchName}</td>
                                  <td>{itm?.refNo}</td>
                                  <td>{_dateFormatter(itm?.expireDate)}</td>
                                  <td>{_dateFormatter(itm?.issueDate)}</td>
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

                <div className="col-lg-12 p-0">
                  <div className="row">
                    <div className="col-lg-4">
                      <div
                        role="group"
                        aria-labelledby="my-radio-group"
                        className="d-flex align-items-center mt-1"
                      >
                        <label className="mr-3">
                          <input
                            type="radio"
                            name="limitType"
                            checked={values.limitType === "dayesLimit"}
                            className="mr-1 pointer"
                            onChange={(e) => {
                              if (values.daysLimitBtnDisabled) {
                                return toast.warning(
                                  "Firstly delete the credit limit row then click save button  finally change from credit limit to days limit"
                                );
                              }
                              setFieldValue("limitType", "dayesLimit");
                              setFieldValue("creditLimitAmount", "");
                              setFieldValue("daysCreditLimitAmount", "");
                              setFieldValue("numberOfDays", "");
                              setCreditRowDto([]);
                            }}
                            // disabled={values.daysLimitBtnDisabled}
                          />
                          Days Limit
                        </label>
                        <label className="mr-3">
                          <input
                            type="radio"
                            name="limitType"
                            checked={values.limitType === "creditLimit"}
                            className="mr-1 pointer"
                            onChange={(e) => {
                              if (values.daysLimitBtnDisabled) {
                                return toast.warning(
                                  "Firstly delete the credit limit row then click save button  finally change from credit limit to days limit"
                                );
                              }
                              if (
                                +values?.numberOfDays > 0 ||
                                +values?.creditLimitAmount > 0
                              ) {
                                toast.warning('Credit Limit must be "0"');
                              } else {
                                setFieldValue("limitType", "creditLimit");
                                setFieldValue("creditLimitAmount", "");
                                setFieldValue("daysCreditLimitAmount", "");
                                setFieldValue("numberOfDays", "");
                                setCreditRowDto([]);
                              }
                            }}
                          />
                          Credit Limit
                        </label>
                        <label className="pr-0">
                          <input
                            type="radio"
                            name="limitType"
                            checked={values.limitType === "both"}
                            className="mr-1 pointer"
                            onChange={(e) => {
                              setFieldValue("limitType", "both");
                            }}
                          />
                          Both
                        </label>
                      </div>
                    </div>
                  </div>
                  {(values.limitType === "dayesLimit" ||
                    values.limitType === "both") && (
                    <div className="row global-form">
                      <div className="col-lg-3">
                        <label>Number Of Days</label>
                        <InputField
                          value={values?.numberOfDays}
                          name="numberOfDays"
                          placeholder="Number Of Days"
                          type="number"
                          min={0}
                          onChange={(e) => {
                            setFieldValue("numberOfDays", e.target.value);
                            const currentValues = {
                              ...values,
                              numberOfDays: +e.target.value,
                            };
                            numberOfDaysChangeHandler(currentValues);

                            if (e?.target?.value > 0) {
                              const toDate = new Date();
                              toDate.setDate(
                                toDate.getDate() + +e?.target?.value - 1
                              );
                              setFieldValue("creditValidFrom", _todayDate());
                              setFieldValue(
                                "creditValidTo",
                                _dateFormatter(toDate)
                              );
                            } else {
                              setFieldValue("creditValidFrom", "");
                              setFieldValue("creditValidTo", "");
                            }
                          }}
                        />
                      </div>
                      <div className="col-lg-3">
                        <label>Credit Limit</label>
                        <InputField
                          value={values?.daysCreditLimitAmount}
                          name="daysCreditLimitAmount"
                          placeholder="Credit Limit"
                          min="0"
                          type="number"
                          onChange={(e) => {
                            setFieldValue(
                              "daysCreditLimitAmount",
                              e.target.value
                            );
                            const curentVaues = {
                              ...values,
                              daysCreditLimitAmount: +e.target.value,
                            };
                            numberOfDaysChangeHandler(curentVaues);
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {(values.limitType === "creditLimit" ||
                  values.limitType === "both") && (
                  <div className="col-lg-12 p-0">
                    <h6
                      style={{
                        textAlign: "center",
                        fontSize: "10.5px",
                        fontWeight: "600",
                        margin: "5px 0 3px 0",
                      }}
                    >
                      Set Credit Limit(Optional)
                    </h6>
                    <div className="row global-form mt-0">
                      <div className="col-12">
                        <h6>
                          In word (credit limit):{" "}
                          {toWords.convert(values?.creditLimitAmount || 0)}
                        </h6>
                      </div>
                      <div className="col-lg-3">
                        <label>Credit Limit</label>
                        <InputField
                          value={values?.creditLimitAmount}
                          name="creditLimitAmount"
                          placeholder="Credit Limit"
                          min="0"
                          type="number"
                          onChange={(e) => {
                            setFieldValue("creditLimitAmount", e.target.value);
                          }}
                        />
                      </div>

                      <div className="col-lg-3">
                        <label>Valid From Date</label>
                        <InputField
                          value={values?.creditValidFrom}
                          name="creditValidFrom"
                          placeholder="Valid From Date"
                          type="date"
                          onChange={(e) => {
                            setFieldValue("creditValidFrom", e.target.value);
                          }}
                        />
                      </div>

                      <div className="col-lg-3">
                        <label>Valid To Date</label>
                        <InputField
                          value={values?.creditValidTo}
                          name="creditValidTo"
                          placeholder="Valid To Date"
                          type="date"
                          onChange={(e) => {
                            setFieldValue("creditValidTo", e.target.value);
                          }}
                        />
                      </div>

                      <div className="col-lg-3">
                        <NewSelect
                          name="limitStatus"
                          options={[
                            {
                              value: "Short Time",
                              label: "Short Time",
                            },
                            {
                              value: "Life Time",
                              label: "Life Time",
                            },
                          ]}
                          value={values?.limitStatus}
                          label="Limit Status"
                          onChange={(valueOption) => {
                            setFieldValue("limitStatus", valueOption);
                          }}
                          placeholder="Limit Status"
                          errors={errors}
                          touched={touched}
                        />
                      </div>
                      <div className="col mt-0 d-flex align-items-center justify-content-end">
                        <span
                          style={{
                            cursor: "pointer",
                            border: "1px solid",
                          }}
                          className="mr-4"
                          onClick={() => setOpen(true)}
                        >
                          <i
                            style={{
                              color: "#1F2937",
                              fontSize: "20px",
                            }}
                            class="fa fa-upload"
                            aria-hidden="true"
                          ></i>
                        </span>

                        <button
                          style={{ padding: "5px" }}
                          onClick={() => {
                            let obj = {
                              creditLimit: +values?.creditLimitAmount,
                              fromDate: values?.creditValidFrom,
                              toDate: values?.creditValidTo,
                              configId: 0,
                              strLimitStatus: values?.limitStatus?.value,
                              isDayLimit: false,
                              limitDays: 0,
                            };

                            if (fileObjects?.length > 0) {
                              // attachmentLink add
                              attachmentUpload(fileObjects).then((data) => {
                                obj["uploadFile"] = data[0]?.id || "";
                                setFileObjects([]);
                              });
                            }
                            creditLimitSetter(obj);
                          }}
                          className="btn btn-primary mb-1 mt-1"
                          disabled={
                            +values?.creditLimitAmount < 0 ||
                            !values?.creditLimitAmount ||
                            !values?.creditValidFrom ||
                            !values?.creditValidTo ||
                            !values?.limitStatus?.value ||
                            fileObjects?.length === 0
                          }
                          type="button"
                        >
                          Add
                        </button>
                      </div>
                    </div>

                    {/* credit limit table */}
                    <div className="row">
                      <div className="col-lg-12">
                        {creditRowDto?.length > 0 ? (
                          <div className="table-responsive">
                            <table className="table table-striped table-bordered global-table mt-0">
                            <thead>
                              <tr>
                                <th>SL</th>
                                <th style={{ width: "120px" }}>Credit Limit</th>
                                <th>Valid From</th>
                                <th>Valid To</th>
                                <th>Limit Status</th>
                                <th>Attachments</th>
                                <th>Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {creditRowDto?.map((itm, idx) => {
                                return (
                                  itm?.isDayLimit === false && (
                                    <tr key={idx}>
                                      <td className="text-center">{idx + 1}</td>
                                      <td style={{ width: "60px" }}>
                                        <InputField
                                          value={itm?.creditLimit}
                                          name="names"
                                          placeholder="Name"
                                          type="number"
                                          disabled={true} // Last Chnage Assign By | Iftakhar Alam
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
                                      <td>
                                        <div>{itm?.strLimitStatus}</div>
                                      </td>
                                      <td>
                                        <div>
                                          <div className="text-center pointer">
                                            {itm?.uploadFile ? (
                                              <span
                                                onClick={() => {
                                                  dispatch(
                                                    getDownlloadFileView_Action(
                                                      itm?.uploadFile
                                                    )
                                                  );
                                                }}
                                              >
                                                <i class="fas fa-eye"></i>
                                              </span>
                                            ) : (
                                              "-"
                                            )}
                                          </div>
                                        </div>
                                      </td>
                                      <td className="text-center">
                                        <IDelete
                                          remover={creditRemover}
                                          id={idx}
                                        />
                                      </td>
                                    </tr>
                                  )
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
                )}
              </div>

              {/* Credit Limit Attachment */}
              <DropzoneDialogBase
                filesLimit={1}
                acceptedFiles={["image/*", "application/pdf"]}
                fileObjects={fileObjects}
                cancelButtonText={"cancel"}
                submitButtonText={"submit"}
                maxFileSize={1000000}
                open={open}
                onAdd={(newFileObjs) => {
                  setFileObjects([].concat(newFileObjs));
                }}
                onDelete={(deleteFileObj) => {
                  const newData = fileObjects.filter(
                    (item) => item.file.name !== deleteFileObj.file.name
                  );
                  setFileObjects(newData);
                }}
                onClose={() => setOpen(false)}
                onSave={() => {
                  setOpen(false);
                }}
                showPreviews={true}
                showFileNamesInPreview={true}
              />

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
