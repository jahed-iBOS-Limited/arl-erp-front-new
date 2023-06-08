import React, { useState, useEffect } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { getBuTaxConfigGridData } from "./_redux/Actions";
import { useDispatch } from "react-redux";
import NewSelect from "../../../_helper/_select";
import InputField from "../../../_helper/_inputField";
import {
  getRepresentativeRank_api,
  getTaxBracketDDL_api,
  getSurchargeTypeDDL,
  getBusinessNaturetypeDDL_api,
} from "./helper";

const BusTaxConfigSchema = Yup.object().shape({
  isCd: Yup.bool(),
  isRd: Yup.bool(),
  isSd: Yup.bool(),
  isVat: Yup.bool(),
  isSurcharge: Yup.bool(),
  isAit: Yup.bool(),
  isAtv: Yup.bool(),
  isVds: Yup.bool(),
  isTds: Yup.bool(),
  returnSubmissionDate: Yup.string().required("Return Submission is required"),
  representativeAddress: Yup.string()
    .min(2, "Minimum 2 symbols")
    .max(100, "Maximum 100 symbols")
    .required("Representative Address is required"),
  businesUnitAddress: Yup.string()
    .min(2, "Minimum 2 symbols")
    .max(100, "Maximum 100 symbols")
    .required("BusinesUnit Address is required"),
  binNo: Yup.string()
    .min(2, "Minimum 2 symbols")
    .max(100, "Maximum 100 symbols")
    .required("BinNo is required"),
  economicActivityName: Yup.string()
    .min(2, "Minimum 2 symbols")
    .max(100, "Maximum 100 symbols")
    .required("Economic Activity Name is required"),
  taxZoneDDL: Yup.object().shape({
    label: Yup.string().required("Tax Zone is required"),
    value: Yup.string().required("Tax Zone is required"),
  }),
  taxCircleDDL: Yup.object().shape({
    label: Yup.string().required("Tax Circle is required"),
    value: Yup.string().required("Tax Circle is required"),
  }),
  representativeDDL: Yup.object().shape({
    label: Yup.string().required("Representative is required"),
    value: Yup.string().required("Representative is required"),
  }),
  taxBracket: Yup.object().shape({
    label: Yup.string().required("Tax Bracket is required"),
    value: Yup.string().required("Tax Bracket is required"),
  }),
  ownerShipType: Yup.object().shape({
    label: Yup.string().required("Owner Ship Type required"),
    value: Yup.string().required("Owner Ship Type required"),
  }),
  surchargeType: Yup.object().shape({
    label: Yup.string().required("Surcharge Type required"),
    value: Yup.string().required("Surcharge Type required"),
  }),
  businessNature: Yup.object().shape({
    label: Yup.string().required("Business Nature required"),
    value: Yup.string().required("Business Nature required"),
  }),
});

export default function RoleExForm({
  initData,
  rowDto,
  saveBusTaxConfig,
  btnRef,
  itemSelectHandler,
  profileData,
  selectedBusinessUnit,
  taxCircleDDL,
  taxZoneDDL,
  representativeDDL,
  setDisabled,
}) {
  const dispatch = useDispatch();
  const [representativeRankDDL, setRepresentativeRankDDL] = useState([]);
  const [taxBracketDDL, setTaxBracketDDL] = useState([]);
  const [surchargeTypeDDL, setSurchargeTypeDDL] = useState([]);
  const [businessNaturetypeDDL, setBusinessNaturetypeDDL] = useState([]);

  useEffect(() => {
    getTaxBracketDDL_api(setTaxBracketDDL);
    getSurchargeTypeDDL(setSurchargeTypeDDL);
    getBusinessNaturetypeDDL_api(setBusinessNaturetypeDDL);
  }, []);

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        validationSchema={BusTaxConfigSchema}
        onSubmit={(values, { resetForm }) => {
          saveBusTaxConfig(values, () => {
            resetForm(initData);
            dispatch(
              getBuTaxConfigGridData(
                profileData?.accountId,
                selectedBusinessUnit?.value,
                setDisabled
              )
            );
          });
        }}
      >
        {({ values, errors, setFieldValue, isValid, touched }) => (
          <>
            <Form className="form form-label-right">
              <div className="form-group row align-items-center">
                <div className="col-lg-12">
                  {rowDto?.length > 0 && (
                    <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing">
                      <thead>
                        <tr>
                          <th>Trade Type</th>
                          <th>CD</th>
                          <th>RD</th>
                          <th>SD</th>
                          <th>VAT</th>
                          <th>AIT</th>
                          <th>AT</th>
                          {/* <th>ATV</th> */}

                          <th>Surcharge</th>
                          <th>VDS</th>
                          <th>TDS</th>
                        </tr>
                      </thead>
                      <tbody>
                        {rowDto?.map((item, index) => (
                          <tr key={index}>
                            <td>
                              <div className="pl-2">{item?.tradeTypeName}</div>
                            </td>
                            {/* cd */}
                            <td>
                              <div className="text-center">
                                <Field
                                  name="isCd"
                                  component={() => (
                                    <input
                                      type="checkbox"
                                      className="ml-2"
                                      value={item?.isCd || values.isCd}
                                      checked={item?.isCd || values.isCd}
                                      name="isCd"
                                      onChange={(e) => {
                                        itemSelectHandler(
                                          index,
                                          e.target.checked,
                                          e.target.name
                                        );
                                      }}
                                    />
                                  )}
                                />
                              </div>
                            </td>

                            {/* rd */}
                            <td>
                              <div className="text-center">
                                <Field
                                  name="isRd"
                                  component={() => (
                                    <input
                                      type="checkbox"
                                      className="ml-2"
                                      value={item?.isRd || values.isRd}
                                      checked={item?.isRd || values.isRd}
                                      name="isRd"
                                      onChange={(e) => {
                                        itemSelectHandler(
                                          index,
                                          e.target.checked,
                                          e.target.name
                                        );
                                      }}
                                    />
                                  )}
                                />
                              </div>
                            </td>

                            {/* sd */}
                            <td>
                              <div className="text-center">
                                <Field
                                  name="isSd"
                                  component={() => (
                                    <input
                                      type="checkbox"
                                      className="ml-2"
                                      value={item?.isSd || values.isSd}
                                      checked={item?.isSd || values.isSd}
                                      name="isSd"
                                      onChange={(e) => {
                                        // setFieldValue("isSd", e.target.checked);
                                        itemSelectHandler(
                                          index,
                                          e.target.checked,
                                          e.target.name
                                        );
                                      }}
                                    />
                                  )}
                                />
                              </div>
                            </td>
                            {/* vat */}
                            <td>
                              <div className="text-center">
                                <Field
                                  name="isVat"
                                  component={() => (
                                    <input
                                      type="checkbox"
                                      className="ml-2"
                                      value={item?.isVat || values.isVat}
                                      checked={item?.isVat || values.isVat}
                                      name="isVat"
                                      onChange={(e) => {
                                        itemSelectHandler(
                                          index,
                                          e.target.checked,
                                          e.target.name
                                        );
                                      }}
                                    />
                                  )}
                                />
                              </div>
                            </td>
                            {/* ait */}
                            <td>
                              <div className="text-center">
                                <Field
                                  name="isAit"
                                  component={() => (
                                    <input
                                      type="checkbox"
                                      className="ml-2"
                                      value={item?.isAit || values.isAit}
                                      checked={item?.isAit || values.isAit}
                                      name="isAit"
                                      onChange={(e) => {
                                        itemSelectHandler(
                                          index,
                                          e.target.checked,
                                          e.target.name
                                        );
                                      }}
                                    />
                                  )}
                                />
                              </div>
                            </td>
                            {/* at */}
                            <td>
                              <div className="text-center">
                                <Field
                                  name="isAt"
                                  component={() => (
                                    <input
                                      type="checkbox"
                                      className="ml-2"
                                      value={item?.isAt || values.isAt}
                                      checked={item?.isAt || values.isAt}
                                      name="isAt"
                                      onChange={(e) => {
                                        itemSelectHandler(
                                          index,
                                          e.target.checked,
                                          e.target.name
                                        );
                                      }}
                                    />
                                  )}
                                />
                              </div>
                            </td>
                            {/* <td>
                              <div className="text-center">
                                <Field
                                  name="isAtv"
                                  component={() => (
                                    <input
                                      type="checkbox"
                                      className="ml-2"
                                      value={item?.isAtv || values.isAtv}
                                      checked={item?.isAtv || values.isAtv}
                                      name="isAtv"
                                      onChange={(e) => {
                                        itemSelectHandler(
                                          index,
                                          e.target.checked,
                                          e.target.name
                                        );
                                      }}
                                    />
                                  )}
                                />
                              </div>
                            </td> */}
                            <td>
                              <div className="text-center">
                                <Field
                                  name="isSurcharge"
                                  component={() => (
                                    <input
                                      type="checkbox"
                                      className="ml-2"
                                      value={
                                        item?.isSurcharge || values.isSurcharge
                                      }
                                      checked={
                                        item?.isSurcharge || values.isSurcharge
                                      }
                                      name="isSurcharge"
                                      onChange={(e) => {
                                        itemSelectHandler(
                                          index,
                                          e.target.checked,
                                          e.target.name
                                        );
                                      }}
                                    />
                                  )}
                                />
                              </div>
                            </td>

                            <td>
                              <div className="text-center">
                                <Field
                                  name="isVds"
                                  component={() => (
                                    <input
                                      type="checkbox"
                                      className="ml-2"
                                      value={item?.isVds || values.isVds}
                                      checked={item?.isVds || values.isVds}
                                      name="isVds"
                                      onChange={(e) => {
                                        itemSelectHandler(
                                          index,
                                          e.target.checked,
                                          e.target.name
                                        );
                                      }}
                                    />
                                  )}
                                />
                              </div>
                            </td>

                            <td>
                              <div className="text-center">
                                <Field
                                  name="isTds"
                                  component={() => (
                                    <input
                                      type="checkbox"
                                      className="ml-2"
                                      value={item?.isTds || values.isTds}
                                      checked={item?.isTds || values.isTds}
                                      name="isTds"
                                      onChange={(e) => {
                                        itemSelectHandler(
                                          index,
                                          e.target.checked,
                                          e.target.name
                                        );
                                      }}
                                    />
                                  )}
                                />
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                  {/* <BusinessUnitTaxConfigForm /> */}
                </div>
              </div>
              <div className="form-group row global-form">
                <div className="col-lg-3">
                  <NewSelect
                    name="taxZoneDDL"
                    options={taxZoneDDL || []}
                    value={values?.taxZoneDDL}
                    label="Tax Zone"
                    onChange={(valueOption) => {
                      setFieldValue("taxZoneDDL", valueOption);
                    }}
                    errors={errors}
                    placeholder="Tax Zone"
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="taxCircleDDL"
                    options={taxCircleDDL || []}
                    value={values?.taxCircleDDL}
                    label="Tax Circle"
                    onChange={(valueOption) => {
                      setFieldValue("taxCircleDDL", valueOption);
                    }}
                    placeholder="Tax Circle"
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    value={values.returnSubmissionDate}
                    label="Return Submission"
                    name="returnSubmissionDate"
                    type="date"
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="representativeDDL"
                    options={representativeDDL || []}
                    value={values?.representativeDDL}
                    label="Representative"
                    onChange={(valueOption) => {
                      getRepresentativeRank_api(
                        profileData?.accountId,
                        selectedBusinessUnit?.value,
                        valueOption?.value,
                        setRepresentativeRankDDL,
                        setFieldValue
                      );
                      setFieldValue(
                        "representativeAddress",
                        representativeRankDDL?.employeePresentAddress
                      );
                      setFieldValue("representativeDDL", valueOption);
                    }}
                    placeholder="Representative"
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="representativeRankDDL"
                    options={representativeRankDDL || []}
                    value={values?.representativeRankDDL}
                    label="Representative Designation"
                    placeholder="Representative Designation"
                    errors={errors}
                    touched={touched}
                    onChange={(valueOption) => {
                      setFieldValue("representativeRankDDL", valueOption);
                    }}
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    value={values.representativeAddress}
                    label="Representative Address"
                    name="representativeAddress"
                    placeHolder="Representative Address"
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    value={values?.binNo}
                    label="Bin No."
                    name="binNo"
                    type="text"
                    placeholder="Bin No"
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="taxBracket"
                    options={taxBracketDDL || []}
                    value={values?.taxBracket}
                    label="Tax Bracket"
                    onChange={(valueOption) => {
                      setFieldValue("taxBracket", valueOption);
                    }}
                    placeholder="Tax Bracket"
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="ownerShipType"
                    options={
                      [
                        { value: 1, label: "Private limited" },
                        { value: 2, label: "Public limited" },
                      ] || []
                    }
                    value={values?.ownerShipType}
                    label="OwnerShip Type"
                    onChange={(valueOption) => {
                      setFieldValue("ownerShipType", valueOption);
                    }}
                    placeholder="OwnerShip Type"
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <label>Busines Unit Address</label>
                  <InputField
                    value={values?.businesUnitAddress}
                    name="businesUnitAddress"
                    placeholder="Busines Unit Address"
                    type="text"
                  />
                </div>
                <div className="col-lg-3">
                  <label>Economic Activity Name</label>
                  <InputField
                    value={values?.economicActivityName}
                    name="economicActivityName"
                    placeholder="Economic Activity Name"
                    type="text"
                  />
                </div>
                <div className="col-lg-3 d-flex justify-content-center align-items-center mt-3">
                  <div>
                    <Field
                      id="vatDeductionSourceTax"
                      className="p-2"
                      type="checkbox"
                      name="vatDeductionSourceTax"
                      checked={values?.vatDeductionSourceTax || ""}
                      onChange={() =>
                        setFieldValue(
                          "vatDeductionSourceTax",
                          !values?.vatDeductionSourceTax
                        )
                      }
                    />
                    <label className="p-2" for="vatDeductionSourceTax">
                      Vat Deduction Source Tax
                    </label>
                  </div>
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="surchargeType"
                    options={surchargeTypeDDL || []}
                    value={values?.surchargeType}
                    label="Surcharge Type"
                    onChange={(valueOption) => {
                      setFieldValue("surchargeType", valueOption);
                    }}
                    placeholder="Surcharge Type"
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="businessNature"
                    options={businessNaturetypeDDL || []}
                    value={values?.businessNature}
                    label="BusinessNature"
                    onChange={(valueOption) => {
                      setFieldValue("businessNature", valueOption);
                    }}
                    placeholder="BusinessNature"
                    errors={errors}
                    touched={touched}
                  />
                </div>
              </div>
              <button
                type="submit"
                style={{ display: "none" }}
                ref={btnRef}
              ></button>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}
