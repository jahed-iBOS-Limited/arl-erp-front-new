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
import BankCertificateOne from "./printDocuments/templates/BankCertificate/one";

const initData = {
  businessUnit: "",
  bank: "",
  bankBranch: "",
  date: _todayDate(),
  brDate: "",
  templateType: "",
  templateName: "",
  accountType: "",
  bankAccount: "",
  amount: "",
  marginType: "",
  numOfMonth: "",
  profitRate: "",
  documentName: "",
  massengerName: "",
  messengerDesignation: "",
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
    console.log({ values });
    const payload = {
      intBankLetterTemplatePrintId: 0,
      intBusinessUnitId: values?.businessUnit?.value || 0,
      strBusinessUnitName: values?.businessUnit?.label || "",
      strBusinessUnitShortName: values?.businessUnit?.buShortName || "",
      strRefDate: values?.date
        ? moment(values?.date).format("MMMM D, YYYY")
        : "",
      strDate: values?.date || "",
      intBankId: values?.bank?.value || 0,
      strBankName: values?.bank?.label || "",
      strBankShortName: values?.bank?.bankShortName || "",
      strBranchId: values?.bankBranch?.value || 0,
      strBranchName:
        values.templateType?.value === 1
          ? values?.bankBranch?.label
          : values?.bankAccount?.strBankBranchName,
      strBranchAddress: values?.bankAccount?.strBankBranchAddress || "",
      intBankLetterTemplateId: values?.templateName?.value || 0,
      strBankLetterTemplateName: values?.templateName?.label || "",
      intTemplateTypeId: values?.templateType?.value || 0,
      strTemplateTypeName: values?.templateType?.label || "",
      isActivce: true,
      dteCreateDate: _todayDate(),
      intCreateBy: userId,
      dteUpdateDate: _todayDate(),
      dteUpdateBy: userId,
      strBrdate: values?.brDate || "",
      strAccountType: values?.accountType || "",
      strAccountName: values?.bankAccount?.strBankAccountName || "",
      strAccountNo: values?.bankAccount?.strBankAccountNo || "",
      numAmount: values?.amount || 0,
      strMarginType: values?.marginType || "",
      intNumOfMonth: values?.numOfMonth || 0,
      numProfitRate: values?.profitRate || 0,
      strDocumentName: values?.documentName || "",
      strMassengerName: values?.massengerName || "",
      strMessengerDesignation: values?.messengerDesignation || "",
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
                      setFieldValue("bankBranch", "");
                      setFieldValue("bankAccount", "");
                      setBankBranchList([]);
                      setBankAccountInfo([]);
                    }}
                    errors={errors}
                    touched={touched}
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
                      {
                        value: 6,
                        label: "Bank Certificate",
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
                            setFieldValue("templateName", "");

                            setTemplateList(data);
                            if (data?.length === 1) {
                              setFieldValue("templateName", data[0]);
                            }
                          }
                        );
                      }
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                {/* --- */}
                {/* {[1].includes(values?.templateType?.value) && ( */}
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
                {/* )} */}
                {[1, 2, 3, 4, 5, 6].includes(values?.templateType?.value) && (
                  <div className="col-lg-3">
                    <NewSelect
                      name="bank"
                      options={bankList || []}
                      value={values?.bank}
                      label="Bank"
                      onChange={(valueOption) => {
                        setFieldValue("bank", valueOption || "");
                        setFieldValue("bankBranch", "");
                        setFieldValue("bankAccount", "");
                        setBankBranchList([]);
                        setBankAccountInfo([]);
                        if (valueOption) {
                          getBankBranchList(
                            `/hcm/HCMDDL/GetBankBranchDDL?BankId=${valueOption?.value}`
                          );
                          getBankAccountInfo(
                            `/fino/BankLetter/GetBankAccountList?intBusinessUnitId=${values?.businessUnit?.value}&intBankId=${valueOption?.value}`,
                            (res) => {
                              const modifyData = res.map((item) => ({
                                ...item,
                                value: item?.intBankAccountId,
                                label: `${item?.strBankAccountNo}-${item?.strBankBranchName}`,
                              }));
                              setBankAccountInfo(modifyData);
                            }
                          );
                        }
                      }}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                )}
                {[1].includes(values?.templateType?.value) && (
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
                )}
                {[2, 3, 4, 5, 6].includes(values?.templateType?.value) && (
                  <div className="col-lg-3">
                    <NewSelect
                      name="bankAccount"
                      options={bankAccountInfo || []}
                      value={values?.bankAccount}
                      label="Bank Account"
                      onChange={(valueOption) => {
                        setFieldValue("bankAccount", valueOption || "");
                      }}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                )}
                {/* {[1, 2, 3, 4, 5].includes(values?.templateType?.value) && ( */}
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
                {/* )} */}
                {[2, 3].includes(values?.templateType?.value) && (
                  <div className="col-lg-3">
                    <InputField
                      value={values.amount}
                      label="Amount"
                      name="amount"
                      type="number"
                      onChange={(e) => setFieldValue("amount", e.target.value)}
                    />
                  </div>
                )}
                {[3].includes(values?.templateType?.value) && (
                  <div className="col-lg-3">
                    <InputField
                      value={values.marginType}
                      label="Margin Type"
                      name="marginType"
                      type="text"
                      onChange={(e) =>
                        setFieldValue("marginType", e.target.value)
                      }
                    />
                  </div>
                )}
                {[3].includes(values?.templateType?.value) && (
                  <div className="col-lg-3">
                    <InputField
                      value={values.numOfMonth}
                      label="Number of Months"
                      name="numOfMonth"
                      type="text"
                      onChange={(e) =>
                        setFieldValue("numOfMonth", e.target.value)
                      }
                    />
                  </div>
                )}
                {[3].includes(values?.templateType?.value) && (
                  <div className="col-lg-3">
                    <InputField
                      value={values.profitRate}
                      label="Profit Rate"
                      name="profitRate"
                      type="text"
                      onChange={(e) =>
                        setFieldValue("profitRate", e.target.value)
                      }
                    />
                  </div>
                )}
                {[4].includes(values?.templateType?.value) && (
                  <div className="col-lg-3">
                    <InputField
                      value={values.documentName}
                      label="Document Name"
                      name="documentName"
                      type="text"
                      onChange={(e) =>
                        setFieldValue("documentName", e.target.value)
                      }
                    />
                  </div>
                )}
                {[4].includes(values?.templateType?.value) && (
                  <div className="col-lg-3">
                    <InputField
                      value={values.massengerName}
                      label="Messenger Name"
                      name="massengerName"
                      type="text"
                      onChange={(e) =>
                        setFieldValue("massengerName", e.target.value)
                      }
                    />
                  </div>
                )}
                {[4].includes(values?.templateType?.value) && (
                  <div className="col-lg-3">
                    <InputField
                      value={values.messengerDesignation}
                      label="Messenger Designation"
                      name="messengerDesignation"
                      type="text"
                      onChange={(e) =>
                        setFieldValue("messengerDesignation", e.target.value)
                      }
                    />
                  </div>
                )}
                {/* {[1, 2, 3, 4, 5].includes(values?.templateType?.value) && ( */}
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
                {/* )} */}
                {[1, 2, 5].includes(values?.templateType?.value) && (
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
                )}
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
                          ) && <AccountOpenOne singleRowItem={singleRowItem} />}
                          {[2].includes(
                            singleRowItem?.intBankLetterTemplateId
                          ) && <AccountOpenTwo singleRowItem={singleRowItem} />}
                          {[3].includes(
                            singleRowItem?.intBankLetterTemplateId
                          ) && (
                            <AccountCloseOne singleRowItem={singleRowItem} />
                          )}
                          {[4].includes(
                            singleRowItem?.intBankLetterTemplateId
                          ) && (
                            <AccountCloseTwo singleRowItem={singleRowItem} />
                          )}
                          {[5].includes(
                            singleRowItem?.intBankLetterTemplateId
                          ) && (
                            <AccountCloseThree singleRowItem={singleRowItem} />
                          )}
                          {[6].includes(
                            singleRowItem?.intBankLetterTemplateId
                          ) && (
                            <AccountCloseFour singleRowItem={singleRowItem} />
                          )}
                          {[7].includes(
                            singleRowItem?.intBankLetterTemplateId
                          ) && <FdrONE singleRowItem={singleRowItem} />}
                          {[8].includes(
                            singleRowItem?.intBankLetterTemplateId
                          ) && <FdrTwo singleRowItem={singleRowItem} />}
                          {[9].includes(
                            singleRowItem?.intBankLetterTemplateId
                          ) && <FdrThree singleRowItem={singleRowItem} />}
                          {[10].includes(
                            singleRowItem?.intBankLetterTemplateId
                          ) && (
                            <AuthorizationOne singleRowItem={singleRowItem} />
                          )}
                          {[11].includes(
                            singleRowItem?.intBankLetterTemplateId
                          ) && (
                            <SignatoryChangeOne singleRowItem={singleRowItem} />
                          )}
                          {[12].includes(
                            singleRowItem?.intBankLetterTemplateId
                          ) && (
                            <SignatoryChangeTwo singleRowItem={singleRowItem} />
                          )}
                          {[13].includes(
                            singleRowItem?.intBankLetterTemplateId
                          ) && (
                            <BankCertificateOne singleRowItem={singleRowItem} />
                          )}
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
