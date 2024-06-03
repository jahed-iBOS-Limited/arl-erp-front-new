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
import { getLetterHead } from "./helper";
import AccountOpenOne from "./printDocuments/templates/AccountsOpen/one";
import AccountOpenTwo from "./printDocuments/templates/AccountsOpen/two";
import FdrThree from "./printDocuments/templates/Fdr/FdrThree";
import FdrONE from "./printDocuments/templates/Fdr/fdrOne";
import FdrTwo from "./printDocuments/templates/Fdr/fdrTwo";
import "./style.css";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import AccountCloseOne from "./printDocuments/templates/AccountClose/one";
import AccountCloseTwo from "./printDocuments/templates/AccountClose/two";
import AccountCloseThree from "./printDocuments/templates/AccountClose/three";
import AccountCloseFour from "./printDocuments/templates/AccountClose/four";
import AuthorizationOne from "./printDocuments/templates/Authorization/one";
import SignatoryChangeOne from "./printDocuments/templates/SignatoryChange/one";
import SignatoryChangeTwo from "./printDocuments/templates/SignatoryChange/two";

const initData = {
  businessUnit: "",
  bank: "",
  bankBranch: "",
  date: "",
  brDate: "",
  templateType: "",
  templateName: "",
  accountType: "",
};
export default function BankLetter() {
  const {
    businessUnitList,
    profileData: { userId },
  } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  const [bankList, getBankList] = useAxiosGet();
  const [templateList, getTemplateList, , setTemplateList] = useAxiosGet();
  const [bankBranchList, getBankBranchList] = useAxiosGet();
  const printRef = useRef();
  const [, onSave, loader] = useAxiosPost();
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(15);
  const [gridData, getGridData, loading, setGridData] = useAxiosGet();
  const [singleRowItem, setSingleRowItem] = useState(null);

  useEffect(() => {
    getBankList(`/hcm/HCMDDL/GetBankDDL`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (singleRowItem?.intBankLetterTemplateId) {
      handleInvoicePrint();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [singleRowItem]);

  const saveHandler = (values, cb) => {
    const payload = {
      intBankLetterTemplatePrintId: 0,
      intBusinessUnitId: values?.businessUnit?.value,
      strBusinessUnitName: values?.businessUnit?.label,
      strBusinessUnitShortName: values?.businessUnit?.buShortName,
      strRefDate: moment(values?.date)?.format("MMMM D, YYYY"),
      strDate: values?.date,
      intBankId: values?.bank?.value,
      strBankName: values?.bank?.label,
      strBankShortName: values?.bank?.bankShortName,
      strBranchId: values?.bankBranch?.value,
      strBranchName: values?.bankBranch?.label,
      strBranchAddress: values?.bankBranch?.address || "",
      intBankLetterTemplateId: values?.templateName?.value,
      strBankLetterTemplateName: values?.templateName?.label,
      intTemplateTypeId: values?.templateType?.value,
      strTemplateTypeName: values?.templateType?.label,
      isActivce: true,
      dteCreateDate: _todayDate(),
      intCreateBy: userId,
      dteUpdateDate: _todayDate(),
      dteUpdateBy: userId,
      strBrdate: values?.brDate,
      strAccountType: values?.accountType,
    };
    onSave(`/fino/BankLetter/SaveBankLetterTemplatePrint`, payload, null, true);
  };

  const handleInvoicePrint = useReactToPrint({
    content: () => printRef.current,
    pageStyle:
      "@media print{body { -webkit-print-color-adjust: exact; margin: 0mm;}@page {size: portrait ! important}}",
  });

  const getLandingData = (values, pageNo, pageSize, searchValue = "") => {
    getGridData(
      `/fino/BankLetter/GetFilteredBankLetters?businessUnitId=${values?.businessUnit?.value}&pageNumber=${pageNo}&pageSize=${pageSize}`
    );
  };

  const setPositionHandler = (pageNo, pageSize, values, searchValue = "") => {
    getLandingData(values, pageNo, pageSize, searchValue);
  };

  const validationSchema = Yup.object().shape({
    businessUnit: Yup.object().required("Business Unit is required"),
    bank: Yup.object().required("Bank is required"),
    bankBranch: Yup.object().required("Bank Branch is required"),
    date: Yup.date().required("Date is required"),
    brDate: Yup.date().required("BR Date is required"),
    templateType: Yup.object().required("Template Type is required"),
    templateName: Yup.object().required("Template Name is required"),
    accountType: Yup.string().required("Account Type is required"),
  });

  return (
    <Formik
      enableReinitialize={true}
      initialValues={initData}
      validationSchema={validationSchema}
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
            title="Bank Letter"
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
                <div className="col-lg-3">
                  <NewSelect
                    name="bank"
                    options={bankList || []}
                    value={values?.bank}
                    label="Bank"
                    onChange={(valueOption) => {
                      setFieldValue("bank", valueOption || "");
                      if (valueOption) {
                        getBankBranchList(
                          `/hcm/HCMDDL/GetBankBranchDDL?BankId=${valueOption?.value}`
                        );
                      }
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="bankBranch"
                    options={bankBranchList || []}
                    value={values?.bankBranch}
                    label="Bank Branch"
                    onChange={(valueOption) => {
                      setFieldValue("bankBranch", valueOption || "");
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    value={values?.accountType}
                    label="Account Type"
                    name="accountType"
                    type="text"
                    onChange={(e) => {
                      setFieldValue("accountType", e.target.value);
                    }}
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    value={values?.date}
                    label="Date"
                    name="date"
                    type="date"
                    onChange={(e) => {
                      setFieldValue("date", e.target.value);
                    }}
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    value={values?.brDate}
                    label="BR Date"
                    name="brDate"
                    type="date"
                    onChange={(e) => {
                      setFieldValue("brDate", e.target.value);
                    }}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="templateType"
                    options={[
                      {
                        value: 1,
                        label: "Account Opening",
                      },
                      {
                        value: 2,
                        label: "Account Close",
                      },
                      {
                        value: 3,
                        label: "FDR",
                      },
                      {
                        value: 4,
                        label: "Authorization Letter",
                      },
                      {
                        value: 5,
                        label: "Signatory change",
                      },
                    ]}
                    value={values?.templateType}
                    label="Template Type"
                    onChange={(valueOption) => {
                      setFieldValue("templateType", valueOption || "");
                      if (valueOption) {
                        getTemplateList(
                          `/fino/BankLetter/GetBankLetterTempaleteListById?TemplateTypeId=${valueOption?.value}`,
                          (res) => {
                            const data = res.map((item) => ({
                              ...item,
                              value: item?.intBankLetterTemplateId,
                              label: item?.strBankLetterTemplateName,
                            }));
                            setTemplateList(data);
                          }
                        );
                      }
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="templateName"
                    options={templateList || []}
                    value={values?.templateName}
                    label="Template Name"
                    onChange={(valueOption) => {
                      setFieldValue("templateName", valueOption || "");
                    }}
                    errors={errors}
                    touched={touched}
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
                  count={gridData?.totalCount}
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
                    <div
                      className="invoice-header"
                      style={{
                        backgroundImage: `url(${getLetterHead({
                          buId: singleRowItem?.intBusinessUnitId,
                        })})`,
                        backgroundRepeat: "no-repeat",
                        height: "150px",
                        backgroundPosition: "left 10px",
                        backgroundSize: "cover",
                        position: "fixed",
                        width: "100%",
                        top: "-50px",
                      }}
                    ></div>
                    <div
                      className="invoice-footer"
                      style={{
                        backgroundImage: `url(${getLetterHead({
                          buId: singleRowItem?.intBusinessUnitId,
                        })})`,
                        backgroundRepeat: "no-repeat",
                        height: "100px",
                        backgroundPosition: "left bottom",
                        backgroundSize: "cover",
                        bottom: "-0px",
                        position: "fixed",
                        width: "100%",
                      }}
                    ></div>
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
                      <tbody>
                        <div style={{ marginTop: "40px" }}>
                          {[1].includes(
                            singleRowItem?.intBankLetterTemplateId
                          ) && <AccountOpenOne values={values} />}
                          {[2].includes(
                            singleRowItem?.intBankLetterTemplateId
                          ) && <AccountOpenTwo values={values} />}
                          {[3].includes(
                            singleRowItem?.intBankLetterTemplateId
                          ) && <AccountCloseOne singleRowItem={singleRowItem} />}
                          {[4].includes(
                            singleRowItem?.intBankLetterTemplateId
                          ) && <AccountCloseTwo singleRowItem={singleRowItem} />}
                          {[5].includes(
                            singleRowItem?.intBankLetterTemplateId
                          ) && <AccountCloseThree singleRowItem={singleRowItem} />}
                          {[6].includes(
                            singleRowItem?.intBankLetterTemplateId
                          ) && <AccountCloseFour singleRowItem={singleRowItem} />}
                          {[7].includes(
                            singleRowItem?.intBankLetterTemplateId
                          ) && <FdrONE values={values} />}
                          {[8].includes(
                            singleRowItem?.intBankLetterTemplateId
                          ) && <FdrTwo values={values} />}
                          {[9].includes(
                            singleRowItem?.intBankLetterTemplateId
                          ) && <FdrThree values={values} />}
                          {[10].includes(
                            singleRowItem?.intBankLetterTemplateId
                          ) && <AuthorizationOne values={values} />}
                          {[11].includes(
                            singleRowItem?.intBankLetterTemplateId
                          ) && <SignatoryChangeOne values={values} />}
                          {[12].includes(
                            singleRowItem?.intBankLetterTemplateId
                          ) && <SignatoryChangeTwo values={values} />}
                        </div>
                      </tbody>
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
