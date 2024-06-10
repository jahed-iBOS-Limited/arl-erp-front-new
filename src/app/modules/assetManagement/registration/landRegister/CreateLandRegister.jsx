import { Form, Formik } from "formik";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";

import { useReactToPrint } from "react-to-print";
import * as Yup from "yup";
import { _dateFormatter } from "../../../_helper/_dateFormate";
import IForm from "../../../_helper/_form";
import InputField from "../../../_helper/_inputField";
import Loading from "../../../_helper/_loading";
import NewSelect from "../../../_helper/_select";
import PaginationTable from "../../../_helper/_tablePagination";
import { _todayDate } from "../../../_helper/_todayDate";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import useAxiosPost from "../../../_helper/customHooks/useAxiosPost";
// import "./style.css";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { yearDDL } from "../../../humanCapitalManagement/report/employeeExpense/form/addEditForm";

const initData = {
  businessUnit: "",
  territory: "",
  thana: "",
  deedNo: "",
  deedAmount: "",
  deedType: "",
  registrationDate: "",
  landQuantity: "",
  seller: "",
  csKhatian: "",
  csPlot: "",
  saKhatian: "",
  cityJaripKhatian: "",
  saPlot: "",
  rsPlot: "",
  rsKhatian: "",
  rsLandQuantity: "",
  mouza: "",
  cityJaripPlot: "",
  cityJaripPlotLand: "",
  subRegister: "",
  registrationCost: "",
  brokerAmount: "",
  ploatNo: "",
  dagNo: "",
  otherCost: "",
};
export default function CreateLandRegister() {
  const {
    businessUnitList,
    profileData: { userId },
    selectedBusinessUnit: { value: buId, label },
  } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);
  const history = useHistory();
  const location = useLocation();
  const { state } = location;
  console.log({ state });
  const [thanaDDL, getThanaDDL] = useAxiosGet();
  const [subRegisterDDL, getSubRegisterDDL] = useAxiosGet();
  const [deedTypeDDL, getDeedTypeDDL] = useAxiosGet();
  const [districtDDL, getDistrictDDL, loadDistrictDDL] = useAxiosGet();

  const printRef = useRef();
  const [, onSave, loader] = useAxiosPost();

  useEffect(() => {
    getDistrictDDL(
      "/oms/TerritoryInfo/GetDistrictDDL?countryId=18&divisionId=0"
    );
    getDeedTypeDDL("/asset/AGLandMange/DeedTypeDDL");
    getSubRegisterDDL("/asset/AGLandMange/GetSubRegisterOfficeDDL");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const saveHandler = (values, cb) => {
    console.log({ values });
    const payload = {
      intLandGeneralPk: state?.intLandGeneralPk ? state?.intLandGeneralPk : 0,
      strTerritoryName: values?.territory,
      strDistrictName: values?.district?.label,
      intDistrictId: values?.district?.value,
      intUnitId: values?.businessUnit?.value || 0,
      intSubOfficeId: values?.subRegister?.value || 0,
      strSubOfficeName: values?.subRegister?.label || 0,
      intDeedTypeId: values?.deedType?.value || 0,
      strDeedNo: values?.deedNo || "",
      dteDeedDate: values?.registrationDate || "",
      strSellerName: values?.seller || "",
      numTotalLandPurchaseQty: parseFloat(values?.landQuantity) || 0,
      monDeedValue: parseFloat(values?.deedAmount) || 0,
      strCskhatian: values?.csKhatian || "",
      strCsplotNo: values?.csPlot || "",
      strSakhatianNo: values?.saKhatian || "",
      strSaplotNo: values?.saPlot || "",
      strRskhatianNo: values?.rsKhatian || "",
      strRsplotNo: values?.rsPlot || "",
      numRsplotLandBaseQty: parseFloat(values?.rsLandQuantity) || 0,
      strCityJoripKhatianNo: values?.cityJaripKhatian || "",
      strCityJoripPlot: values?.cityJaripPlot || "",
      numCityJoripLandQty: parseFloat(values?.cityJaripPlotLand) || 0,
      monBroker: parseFloat(values?.brokerAmount) || 0,
      monRegistrationCost: parseFloat(values?.registrationCost) || 0,
      monAit: 0, // assuming this value is not present in the form
      monOtherCost: parseFloat(values?.otherCost) || 0,
      strRemarkForOtherCost: "", // assuming this value is not present in the form
      intThanaId: values?.thana?.value || 0,
      strThanakName: values?.thana?.label || "",
      strMouzaName: values?.mouza || "",
      strPloatNo: values?.ploatNo || "",
      strDagNo: values?.dagNo || "",
      ysnComplete: true, // assuming this value is always true
      ysnActive: true, // assuming this value is always true
      calcDeadYear: values?.deedYear?.value, // assuming this value is not present in the form
      dteInsertDate: _todayDate(),
      intInsertBy: userId,
      strRemark: "", // assuming this value is not present in the form
    };

    onSave(`/asset/AGLandMange/SaveAGLandTrxGeneral`, payload, null, true);
  };

  const mapStateToInitialValues = (state) => ({
    businessUnit: { value: buId, label: label },
    territory: state?.strTerritoryName || "",
    district: { value: state?.intDistrictId, label: state?.strDistrictName },
    thana: { value: state?.intThanaId, label: state?.strThanakName } || "",
    deedNo: state?.strDeedNo || "",
    deedAmount: state?.monDeedValue || "",
    deedType:
      deedTypeDDL.find((type) => type.value === state?.intDeedTypeId) || "",
    registrationDate: state?.dteDeedDate
      ? moment(state?.dteDeedDate).format("YYYY-MM-DD")
      : "",
    landQuantity: state?.numTotalLandPurchaseQty || "",
    seller: state?.strSellerName || "",
    csKhatian: state?.strCskhatian || "",
    csPlot: state?.strCsplotNo || "",
    saKhatian: state?.strSakhatianNo || "",
    cityJaripKhatian: state?.strCityJoripKhatianNo || "",
    saPlot: state?.strSaplotNo || "",
    rsPlot: state?.strRsplotNo || "",
    rsKhatian: state?.strRskhatianNo || "",
    rsLandQuantity: state?.numRsplotLandBaseQty || "",
    mouza: state?.strMouzaName || "",
    cityJaripPlot: state?.strCityJoripPlot || "",
    cityJaripPlotLand: +state?.numCityJoripLandQty || "",
    registrationCost: state?.monRegistrationCost || "",
    brokerAmount: state?.monBroker || "",
    deedYear: { value: state?.calcDeadYear, label: state?.calcDeadYear },
    otherCost: state?.monOtherCost,
    dagNo: state?.strDagNo,
    ploatNo: state?.strPloatNo,
    subRegister: {
      value: state?.intSubOfficeId,
      label: state?.strSubOfficeName,
    },
  });

  //   const validationSchema = Yup.object().shape({
  //     businessUnit: Yup.object().required("Business Unit is required"),
  //     bank: Yup.object().required("Bank is required"),
  //     bankBranch: Yup.object().required("Bank Branch is required"),
  //     date: Yup.date().required("Date is required"),
  //     brDate: Yup.date().required("BR Date is required"),
  //     templateType: Yup.object().required("Template Type is required"),
  //     templateName: Yup.object().required("Template Name is required"),
  //     accountType: Yup.string().required("Account Type is required"),
  //   });

  return (
    <Formik
      enableReinitialize={true}
      initialValues={state ? mapStateToInitialValues(state) : initData}
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
        setFieldValue,
        isValid,
        errors,
        touched,
      }) => (
        <>
          {loader && <Loading />}
          <IForm
            title={`Create Land Register  `}
            isHiddenReset
            isHiddenBack
            isHiddenSave
            renderProps={() => {
              return (
                <div>
                  <button
                    type="button"
                    className="btn btn-primary mx-2"
                    onClick={() => {
                      history.push(`/mngAsset/registration/LandRegister`);
                    }}
                  >
                    Go Back
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    onClick={() => {
                      handleSubmit();
                    }}
                  >
                    Save
                  </button>
                </div>
              );
            }}
          >
            <Form>
              <div className="form-group  global-form row">
                {/* bu */}
                <div className="col-lg-3">
                  <NewSelect
                    name="businessUnit"
                    options={businessUnitList || []}
                    value={values?.businessUnit}
                    label="Business Unit"
                    onChange={(valueOption) => {
                      setFieldValue("businessUnit", valueOption || "");
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                {/* territory */}
                <div className="col-lg-3">
                  <InputField
                    value={values.territory}
                    label="Territory"
                    name="territory"
                    type="text"
                    onChange={(e) => setFieldValue("territory", e.target.value)}
                  />
                </div>

                {/* district */}
                <div className="col-lg-3">
                  <NewSelect
                    name="district"
                    options={[{ label: "All", value: 0 }, ...districtDDL]}
                    value={values?.district}
                    label="District"
                    onChange={(valueOption) => {
                      setFieldValue("thana", "");
                      setFieldValue("district", valueOption);
                      if (!valueOption) return;
                      getThanaDDL(
                        `/oms/TerritoryInfo/GetThanaDDL?countryId=18&divisionId=0&districtId=${valueOption?.value}`
                      );
                    }}
                  />
                </div>

                {/* thana */}
                <div className="col-lg-3">
                  <NewSelect
                    name="thana"
                    options={thanaDDL || []}
                    value={values?.thana}
                    label="Thana"
                    onChange={(valueOption) => {
                      setFieldValue("thana", valueOption || "");
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                {/* Deed No */}
                <div className="col-lg-3">
                  <InputField
                    value={values.deedNo}
                    label="Deed No"
                    name="deedNo"
                    type="text"
                    onChange={(e) => setFieldValue("deedNo", e.target.value)}
                  />
                </div>
                {/* Deed value */}
                <div className="col-lg-3">
                  <InputField
                    value={values.deedAmount}
                    label="Deed value"
                    name="deedAmount"
                    min={0}
                    type="number"
                    onChange={(e) =>
                      setFieldValue("deedAmount", e.target.value)
                    }
                  />
                </div>
                {/* deedType */}
                <div className="col-lg-3">
                  <NewSelect
                    name="deedType"
                    options={deedTypeDDL?.length > 1 ? deedTypeDDL : []}
                    value={values?.deedType}
                    label="Deed Type"
                    onChange={(valueOption) => {
                      setFieldValue("deedType", valueOption || "");
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="deedType"
                    options={yearDDL}
                    value={values?.deedYear}
                    label="Deed Year"
                    onChange={(valueOption) => {
                      setFieldValue("deedYear", valueOption || "");
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                {/* register date */}
                <div className="col-lg-3">
                  <InputField
                    value={values?.registrationDate}
                    label="Registration Date"
                    name="registrationDate"
                    type="date"
                    onChange={(e) => {
                      setFieldValue("registrationDate", e.target.value);
                    }}
                  />
                </div>
                {/* Land Quantity (Decimal) */}
                <div className="col-lg-3">
                  <InputField
                    value={values.landQuantity}
                    label="Land Quantity"
                    name="landQuantity"
                    type="number"
                    onChange={(e) =>
                      setFieldValue("landQuantity", e.target.value)
                    }
                  />
                </div>
                {/* Seller Name */}
                <div className="col-lg-3">
                  <InputField
                    value={values.seller}
                    label="Seller Name"
                    name="seller"
                    type="text"
                    onChange={(e) => setFieldValue("seller", e.target.value)}
                  />
                </div>
                {/* CS Khatian  */}
                <div className="col-lg-3">
                  <InputField
                    value={values.csKhatian}
                    label="CS Khatian"
                    name="csKhatian"
                    type="text"
                    onChange={(e) => setFieldValue("csKhatian", e.target.value)}
                  />
                </div>
                {/* CS Plot  */}
                <div className="col-lg-3">
                  <InputField
                    value={values.csPlot}
                    label="CS Plot"
                    name="csPlot"
                    type="text"
                    onChange={(e) => setFieldValue("csPlot", e.target.value)}
                  />
                </div>
                {/* SA Khatian  */}
                <div className="col-lg-3">
                  <InputField
                    value={values.saKhatian}
                    label="SA Khatian"
                    name="saKhatian"
                    type="text"
                    onChange={(e) => setFieldValue("saKhatian", e.target.value)}
                  />
                </div>
                {/* SA Plot  */}
                <div className="col-lg-3">
                  <InputField
                    value={values.saPlot}
                    label="SA Plot"
                    name="saPlot"
                    type="text"
                    onChange={(e) => setFieldValue("saPlot", e.target.value)}
                  />
                </div>
                {/* RS Khatian  */}
                <div className="col-lg-3">
                  <InputField
                    value={values.rsKhatian}
                    label="RS Khatian"
                    name="rsKhatian"
                    type="text"
                    onChange={(e) => setFieldValue("rsKhatian", e.target.value)}
                  />
                </div>
                {/* RS Plot  */}
                <div className="col-lg-3">
                  <InputField
                    value={values.rsPlot}
                    label="RS Plot"
                    name="rsPlot"
                    type="text"
                    onChange={(e) => setFieldValue("rsPlot", e.target.value)}
                  />
                </div>
                {/* RS Plot-Based Land Quantity */}
                <div className="col-lg-3">
                  <InputField
                    value={values.rsLandQuantity}
                    label="RS Plot-Based Land Quantity"
                    name="rsLandQuantity"
                    min={0}
                    type="number"
                    onChange={(e) =>
                      setFieldValue("rsLandQuantity", e.target.value)
                    }
                  />
                </div>
                {/* mouza  */}
                <div className="col-lg-3">
                  <InputField
                    value={values.mouza}
                    label="Mouza Name"
                    name="mouza"
                    type="text"
                    onChange={(e) => setFieldValue("mouza", e.target.value)}
                  />
                </div>
                {/* City Jarip Plot  */}
                <div className="col-lg-3">
                  <InputField
                    value={values.cityJaripPlot}
                    label="City Jarip Plot"
                    name="cityJaripPlot"
                    type="text"
                    onChange={(e) =>
                      setFieldValue("cityJaripPlot", e.target.value)
                    }
                  />
                </div>
                {/* City Jarip Plot  land quantity*/}
                <div className="col-lg-3">
                  <InputField
                    value={values.cityJaripPlotLand}
                    label="City Jarip Plot-Based Land Quantity"
                    name="cityJaripPlotLand"
                    type="number"
                    onChange={(e) =>
                      setFieldValue("cityJaripPlotLand", e.target.value)
                    }
                  />
                </div>
                {/* Sub Registrar Office */}
                <div className="col-lg-3">
                  <NewSelect
                    name="subRegister"
                    options={subRegisterDDL || []}
                    value={values?.subRegister}
                    label="Sub Registrar Office"
                    onChange={(valueOption) => {
                      setFieldValue("subRegister", valueOption || "");
                    }}
                    errors={errors}
                    touched={touched}
                  />
                  {/* <InputField
                    value={values?.subRegister}
                    label="Sub Registrar Office"
                    name="subRegister"
                    type="text"
                    onChange={(e) =>
                      setFieldValue("subRegister", e.target.value)
                    }
                  /> */}
                </div>
                {/* City Jarip Khatian */}
                <div className="col-lg-3">
                  <InputField
                    value={values.cityJaripKhatian}
                    label="City Jarip Khatian"
                    name="cityJaripKhatian"
                    type="text"
                    onChange={(e) =>
                      setFieldValue("cityJaripKhatian", e.target.value)
                    }
                  />
                </div>

                {/* Registration Cost*/}
                <div className="col-lg-3">
                  <InputField
                    value={values.registrationCost}
                    label="Registration Cost"
                    name="registrationCost"
                    type="number"
                    onChange={(e) =>
                      setFieldValue("registrationCost", e.target.value)
                    }
                  />
                </div>
                {/* Broker Amount*/}
                <div className="col-lg-3">
                  <InputField
                    value={values.brokerAmount}
                    label="Broker Amount"
                    name="brokerAmount"
                    type="number"
                    onChange={(e) =>
                      setFieldValue("brokerAmount", e.target.value)
                    }
                  />
                </div>
                {/* OtherCost*/}
                <div className="col-lg-3">
                  <InputField
                    value={values.otherCost}
                    label="Other Cost"
                    name="otherCost"
                    type="number"
                    onChange={(e) => setFieldValue("otherCost", e.target.value)}
                  />
                </div>
                {/* Dag No */}
                <div className="col-lg-3">
                  <InputField
                    value={values.dagNo}
                    label="Dag No"
                    name="dagNo"
                    type="text"
                    onChange={(e) => setFieldValue("dagNo", e.target.value)}
                  />
                </div>

                {/* Ploat No */}
                <div className="col-lg-3">
                  <InputField
                    value={values.ploatNo}
                    label="Ploat No"
                    name="ploatNo"
                    type="text"
                    onChange={(e) => setFieldValue("ploatNo", e.target.value)}
                  />
                </div>

                {/* <div className="col-lg-3">
                  <button
                    onClick={() => {
                      getLandingData(values, pageNo, pageSize, "");
                    }}
                    type="button"
                    className="btn  btn-primary mt-5"
                  >
                    View
                  </button>
                </div> */}
              </div>
              {/* {gridData?.data?.length > 0 && (
                <div className="table-responsive">
                  <table className="table table-striped mt-2 table-bordered bj-table bj-table-landing">
                    <thead>
                      <tr>
                        <th>SL</th>
                        <th>Business Unit Name</th>
                        <th>Bank Name</th>
                        <th>Branch Name</th>
                        <th>Template Type Name</th>
                        <th>Bank Letter Template Name</th>
                        <th>Created Date</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {gridData?.data?.map((item, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td className="text-center">
                            {item?.strBusinessUnitName}
                          </td>
                          <td className="text-center">{item?.strBankName}</td>
                          <td className="text-center">{item?.strBranchName}</td>
                          <td className="text-center">
                            {item?.strTemplateTypeName}
                          </td>
                          <td className="text-center">
                            {item?.strBankLetterTemplateName}
                          </td>
                          <td className="text-center">
                            {_dateFormatter(item?.dteUpdateDate)}
                          </td>
                          <td className="text-center">
                            <div className="">
                              <span
                                className="px-5"
                                onClick={() => {
                                  setSingleRowItem(item);
                                }}
                              >
                                <OverlayTrigger
                                  overlay={
                                    <Tooltip id="cs-icon">Print</Tooltip>
                                  }
                                >
                                  <i
                                    style={{ fontSize: "16px" }}
                                    class="fa fa-print cursor-pointer"
                                    aria-hidden="true"
                                  ></i>
                                </OverlayTrigger>
                              </span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {gridData?.data?.length > 0 && (
                <PaginationTable
                  count={gridData?.totalRecords}
                  setPositionHandler={setPositionHandler}
                  paginationState={{
                    pageNo,
                    setPageNo,
                    pageSize,
                    setPageSize,
                  }}
                  values={values}
                />
              )} */}
              <div>
                <div ref={printRef} className="bank-letter-print-wrapper">
                  <div style={{ margin: "-13px 50px 51px 50px" }}>
                    <table>
                      <thead>
                        <tr>
                          <td
                            style={{
                              border: "none",
                            }}
                          >
                            {/* place holder for the fixed-position header */}
                            <div
                              style={{
                                height: "110px",
                              }}
                            ></div>
                          </td>
                        </tr>
                      </thead>
                      {/* CONTENT GOES HERE */}
                      <tbody></tbody>
                      <tfoot>
                        <tr>
                          <td
                            style={{
                              border: "none",
                            }}
                          >
                            {/* place holder for the fixed-position footer */}
                            <div
                              style={{
                                height: "150px",
                              }}
                            ></div>
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
              </div>
            </Form>
          </IForm>
        </>
      )}
    </Formik>
  );
}
