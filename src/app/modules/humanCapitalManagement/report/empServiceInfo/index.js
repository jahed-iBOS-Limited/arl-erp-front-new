import React, { useState } from "react";
import ICustomCard from "../../../_helper/_customCard";
import { useSelector, shallowEqual } from "react-redux";
import { Formik } from "formik";
import { Form } from "react-bootstrap";
import Loading from "../../../_helper/_loading";
import axios from "axios";
import SearchAsyncSelect from "../../../_helper/SearchAsyncSelect";
import { toast } from "react-toastify";
import { downloadFile, getPDFAction } from "../../../_helper/downloadFile";
import { _todayDate } from "../../../_helper/_todayDate";
import InputField from "../../../_helper/_inputField";

const initData = {
  employee: "",
  eligibleForGratuity:false,
  lastOfficeDate: _todayDate()
};

const EmpServiceInfo = () => {
  const [loader, setLoader] = useState(false);

  const { profileData } = useSelector((state) => {
    return state?.authData;
  }, shallowEqual);

  const loadEmpList = (v) => {
    if (v?.length < 3) return [];
    return axios
      .get(
        `/hcm/HCMDDL/GetEmployeeByAcIdDDL?AccountId=${profileData?.accountId}&search=${v}`
      )
      .then((res) => {
        return res?.data;
      })
      .catch((err) => []);
  };
  return (
    <>
      {loader && <Loading />}
      <ICustomCard title="Employee Service Information">
        <Formik
          enableReinitialize={true}
          initialValues={initData}
          onSubmit={(values, { setSubmitting, resetForm }) => {
            resetForm(initData)
            
          }}
        >
          {({ values, errors, touched, setFieldValue }) => (
            <>
              <Form className="form form-label-right">
                <div className="row">
                  <div className="col-lg-12">
                    <div className="global-form row d-flex justify-content-between">
                      <div className="col-lg-12">
                        <div className="row">
                          <div className="col-lg-3">
                            <label>Employee</label>
                            <SearchAsyncSelect
                              selectedValue={values?.employee}
                              handleChange={(valueOption) => {
                                setFieldValue("employee", valueOption);
                              }}
                              loadOptions={loadEmpList}
                              placeholder="Search by Enroll/ID No/Name (min 3 letter)"
                            />
                          </div>
                        <div className="col-lg-3">
                              <InputField
                              value={values?.lastOfficeDate}
                              label="Last Office Date"
                              // required
                              type="date"
                              name="lastOfficeDate"
                              onChange={(e) => {
                                setFieldValue("lastOfficeDate", e.target.value);
                              }}
                            />
                      </div>
                          <div className="col-md-2" style={{display:"grid", placeItems:"center"}}>
                              <label className="d-flex align-items-center" style={{paddingTop:"11px"}}>
                                <input
                                    type="checkbox"
                                    onChange={() => setFieldValue("eligibleForGratuity", !values?.eligibleForGratuity)}
                                    checked={values?.eligibleForGratuity}
                                    name="eligibleForGratuity"
                                />
                                <span className="ml-2">Eligible for Gratuity</span>
                            </label>
                          </div>
                          <div
                            style={{ marginTop: "14px" }}
                            className="col-lg-3"
                          >
                            <button
                              type="button"
                              className="btn btn-primary mr-2"
                              onClick={() => {
                                if (!values?.employee?.value)
                                  return toast.warn("Please select employee");
                                getPDFAction(
                                  `/hcm/PdfReport/PdfEmpServiceInformation?EmployeeId=${values?.employee?.value}&isEligibleForGratuity=${values?.eligibleForGratuity}&isExcelDownload=false&lastOfficeDate=${values?.lastOfficeDate || _todayDate()}`,
                                  setLoader
                                );
                              }}
                            >
                              Pdf View
                            </button>
                            <button
                              style={{marginLeft:"10px"}}
                              type="button"
                              className="btn btn-primary mr-2"
                              onClick={() => {
                                if (!values?.employee?.value)
                                  return toast.warn("Please select employee");
                                  downloadFile(
                                    `/hcm/PdfReport/PdfEmpServiceInformation?EmployeeId=${values?.employee?.value}&isEligibleForGratuity=${values?.eligibleForGratuity}&isExcelDownload=true&lastOfficeDate=${values?.lastOfficeDate || _todayDate()}`,
                                    "Employee Service Information",
                                    "xlsx"
                                  );
                              }}
                            >
                              Export Excel
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Form>
            </>
          )}
        </Formik>
      </ICustomCard>
    </>
  );
};

export default EmpServiceInfo;
