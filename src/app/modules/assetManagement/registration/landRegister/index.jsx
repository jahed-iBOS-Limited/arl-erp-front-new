import { Form, Formik } from "formik";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
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
};
export default function LandRegister() {
  const {
    businessUnitList,
    profileData: { userId },
  } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  const [thanaDDL, getThanaDDL] = useAxiosGet();
  const [subRegisterDDL, getSubRegisterDDL] = useAxiosGet();

  const [templateList, getTemplateList, , setTemplateList] = useAxiosGet();
  const [
    bankBranchList,
    getBankBranchList,
    ,
    setBankBranchList,
  ] = useAxiosGet();
  const printRef = useRef();
  const [, onSave, loader] = useAxiosPost();
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(15);
  const [gridData, getGridData, loading, setGridData] = useAxiosGet();
  const [singleRowItem, setSingleRowItem] = useState(null);
  const [
    bankAccountInfo,
    getBankAccountInfo,
    ,
    setBankAccountInfo,
  ] = useAxiosGet();

  //   useEffect(() => {
  //     if (singleRowItem?.intBankLetterTemplateId) {
  //       handleInvoicePrint();
  //     }
  //     // eslint-disable-next-line react-hooks/exhaustive-deps
  //   }, [singleRowItem]);

  const saveHandler = (values, cb) => {
    console.log({ values });
    const payload = {
      intLandRegisterId: 0, // Assuming a unique ID for each land register entry
      intBusinessUnitId: values?.businessUnit?.value || 0,
      strBusinessUnitName: values?.businessUnit?.label || "",
      strTerritory: values?.territory || "",
      intThanaId: values?.thana?.value || 0,
      strThanaName: values?.thana?.label || "",
      strDeedNo: values?.deedNo || "",
      numDeedAmount: values?.deedAmount || 0,
      intDeedTypeId: values?.deedType?.value || 0,
      strDeedTypeName: values?.deedType?.label || "",
      dteRegistrationDate: values?.registrationDate || "",
      numLandQuantity: values?.landQuantity || 0,
      strSellerName: values?.seller || "",
      strCsKhatian: values?.csKhatian || "",
      strCsPlot: values?.csPlot || "",
      strSaKhatian: values?.saKhatian || "",
      strSaPlot: values?.saPlot || "",
      strRsKhatian: values?.rsKhatian || "",
      strRsPlot: values?.rsPlot || "",
      numRsLandQuantity: values?.rsLandQuantity || 0,
      strMouzaName: values?.mouza || "",
      strCityJaripPlot: values?.cityJaripPlot || "",
      numCityJaripPlotLand: values?.cityJaripPlotLand || 0,
      intSubRegisterId: values?.subRegister?.value || 0,
      strSubRegisterName: values?.subRegister?.label || "",
      strCityJaripKhatian: values?.cityJaripKhatian || "",
      numRegistrationCost: values?.registrationCost || 0,
      numBrokerAmount: values?.brokerAmount || 0,
      numOtherCost: values?.otherCost || 0,
      strDagNo: values?.dagNo || "",
      strPloatNo: values?.ploatNo || "",
      isActive: true,
      dteCreateDate: _todayDate(),
      intCreateBy: userId,
      dteUpdateDate: _todayDate(),
      intUpdateBy: userId,
    };

    onSave(`/fino/BankLetter/SaveBankLetterTemplatePrint`, payload, null, true);
  };

  //   const handleInvoicePrint = useReactToPrint({
  //     content: () => printRef.current,
  //     pageStyle:
  //       "@media print{body { -webkit-print-color-adjust: exact; margin: 0mm;}@page {size: portrait ! important}}",
  //   });

  const getLandingData = (values, pageNo, pageSize, searchValue = "") => {
    getGridData(
      `/fino/BankLetter/GetFilteredBankLetters?businessUnitId=${values?.businessUnit?.value}&pageNumber=${pageNo}&pageSize=${pageSize}`
    );
  };

  const setPositionHandler = (pageNo, pageSize, values, searchValue = "") => {
    getLandingData(values, pageNo, pageSize, searchValue);
  };

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
      initialValues={initData}
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
            title="Land Register"
            isHiddenReset
            isHiddenBack
            isHiddenSave
            renderProps={() => {
              return (
                <div>
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
                      setFieldValue("bankBranch", "");
                      setFieldValue("bankAccount", "");
                      setBankBranchList([]);
                      setBankAccountInfo([]);
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
                    options={
                      [
                        //   {
                        //     value: 1,
                        //     label: "Account Opening",
                        //   },
                        //   {
                        //     value: 2,
                        //     label: "Account Close",
                        //   },
                        //   {
                        //     value: 3,
                        //     label: "FDR",
                        //   },
                        //   {
                        //     value: 4,
                        //     label: "Authorization Letter",
                        //   },
                        //   {
                        //     value: 5,
                        //     label: "Signatory change",
                        //   },
                      ]
                    }
                    value={values?.deedType}
                    label="Deed Type"
                    onChange={(valueOption) => {
                      setFieldValue("deedType", valueOption || "");
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

                <div className="col-lg-3">
                  <button
                    onClick={() => {
                      getLandingData(values, pageNo, pageSize, "");
                    }}
                    type="button"
                    className="btn  btn-primary mt-5"
                  >
                    View
                  </button>
                </div>
              </div>
              {gridData?.data?.length > 0 && (
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
              )}
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
