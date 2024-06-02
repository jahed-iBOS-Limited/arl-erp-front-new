import { Form, Formik } from "formik";
import React, { useEffect, useRef } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import IForm from "../../../_helper/_form";
import InputField from "../../../_helper/_inputField";
import Loading from "../../../_helper/_loading";
import NewSelect from "../../../_helper/_select";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import "./style.css";
import { cementLetterhead } from "../../invoiceManagementSystem/salesInvoice/base64Images/cement";
import { useReactToPrint } from "react-to-print";
import AccountOpenOne from "./printDocuments/templates/AccountsOpen/one";
import AccountOpenTwo from "./printDocuments/templates/AccountsOpen/two";
import FdrONE from "./printDocuments/templates/Fdr/fdrOne";
import FdrThree from "./printDocuments/templates/Fdr/FdrThree";
import FdrTwo from "./printDocuments/templates/Fdr/fdrTwo";
const initData = {};
export default function BankLetter() {
  const { businessUnitList } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  const [bankList, getBankList] = useAxiosGet();
  const [templateList, getTemplateList, , setTemplateList] = useAxiosGet();
  const printRef = useRef();

  useEffect(() => {
    getBankList(`/hcm/HCMDDL/GetBankDDL`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const saveHandler = (values, cb) => {};
  const handleInvoicePrint = useReactToPrint({
    content: () => printRef.current,
    pageStyle:
      "@media print{body { -webkit-print-color-adjust: exact; margin: 0mm;}@page {size: portrait ! important}}",
  });
  const history = useHistory();
  return (
    <Formik
      enableReinitialize={true}
      initialValues={{}}
      // validationSchema={{}}
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
          {false && <Loading />}
          <IForm title="Bank Letter" isHiddenReset isHiddenBack isHiddenSave>
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
                    }}
                    errors={errors}
                    touched={touched}
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
                    label="Bank"
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
                      handleInvoicePrint();
                    }}
                    type="button"
                    className="btn  btn-primary mt-5"
                  >
                    Print
                  </button>
                </div>
              </div>
              <div>
                <div ref={printRef} className="bank-letter-print-wrapper">
                  <div style={{ margin: "-13px 50px 51px 50px" }}>
                    <div
                      className="invoice-header"
                      style={{
                        backgroundImage: `url(${cementLetterhead})`,
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
                        backgroundImage: `url(${cementLetterhead})`,
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
                          {[1].includes(values?.templateName?.value) && (
                            <AccountOpenOne values={values} />
                          )}
                          {[2].includes(values?.templateName?.value) && (
                            <AccountOpenTwo values={values} />
                          )}
                          {[7].includes(values?.templateName?.value) && (
                            <FdrONE values={values} />
                          )}
                          {[8].includes(values?.templateName?.value) && (
                            <FdrTwo values={values} />
                          )}
                          {[9].includes(values?.templateName?.value) && (
                            <FdrThree values={values} />
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
