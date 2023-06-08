import React from "react";
import { Form, Formik } from "formik";
import {
  Card,
  CardBody,
  CardHeader,
  ModalProgressBar,
} from "./../../../../../_metronic/_partials/controls";
import Loading from "../../../_helper/_loading";
import DonationTable from "./donationTable";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import InputField from "../../../_helper/_inputField";

const initData = {
  applicantName: "",
  beneficiaryName: "",
  accountHolder: "",
  accountNo: "",
  registrationNo: "",
  mobileNo: "",
};

export default function DonationReceiverReport() {
  const [rowDto, getData, loading, ] = useAxiosGet();


  const getTrustAllLanding = (partName, paymentStatusId = 2, appName, beneficiaryName, accountHolder, accountNo, regNo, mobileNo) => {
    return `/hcm/TrustManagement/GetTrustAllLanding?PartName=${partName}&PaymentStatusId=${paymentStatusId}&ApplicantName=${appName}&BeneficiaryName=${beneficiaryName}&AccountHolder=${accountHolder}&AccountNo=${accountNo}&RegistrationNo=${regNo}&MobileNo=${mobileNo}`;
  };


  return (
    <>
      {loading && <Loading />}
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          resetForm(initData);
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
          setValues,
        }) => (
          <>
            <Form className="form form-label-right">
              <Card>
                {true && <ModalProgressBar />}
                <CardHeader title={"Donation Receiver Report"}></CardHeader>
                <CardBody>
                  <div className="mt-0">
                    <div className="form-group row global-form">
                      <div className="col-8">
                        <div className="row">
                          {/* first row */}
                          <div className="col-lg-2 mb-2">
                            <div className="d-flex align-items-center h-100">
                              Applicant Name
                            </div>
                          </div>
                          <div className="col-lg-4 mb-2">
                            <div className="d-flex align-items-center">
                              <span className="mr-2">:</span>
                              <div className="w-100">
                                <InputField
                                  value={values?.applicantName}
                                  name="applicantName"
                                  placeholder=""
                                  type="text"
                                />
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-2 mb-2">
                            <div className="d-flex align-items-center h-100">
                              Beneficiary Name
                            </div>
                          </div>
                          <div className="col-lg-4 mb-2">
                            <div className="d-flex align-items-center">
                              <span className="mr-2">:</span>
                              <div className="w-100">
                                <InputField
                                  value={values?.beneficiaryName}
                                  name="beneficiaryName"
                                  placeholder=""
                                  type="text"
                                />
                              </div>
                            </div>
                          </div>

                          {/* second row */}
                          <div className="col-lg-2 mb-2">
                            <div className="d-flex align-items-center h-100">
                              Account Holder
                            </div>
                          </div>
                          <div className="col-lg-4 mb-2">
                            <div className="d-flex align-items-center">
                              <span className="mr-2">:</span>
                              <div className="w-100">
                                <InputField
                                  value={values?.accountHolder}
                                  name="accountHolder"
                                  placeholder=""
                                  type="text"
                                />
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-2 mb-2">
                            <div className="d-flex align-items-center h-100">
                              Account No
                            </div>
                          </div>
                          <div className="col-lg-4 mb-2">
                            <div className="d-flex align-items-center">
                              <span className="mr-2">:</span>
                              <div className="w-100">
                                <InputField
                                  value={values?.accountNo}
                                  name="accountNo"
                                  placeholder=""
                                  type="text"
                                />
                              </div>
                            </div>
                          </div>

                          {/* third row */}
                          <div className="col-lg-2 mb-2">
                            <div className="d-flex align-items-center h-100">
                              Registration No
                            </div>
                          </div>
                          <div className="col-lg-4 mb-2">
                            <div className="d-flex align-items-center">
                              <span className="mr-2">:</span>
                              <div className="w-100">
                                <InputField
                                  value={values?.registrationNo}
                                  name="registrationNo"
                                  placeholder=""
                                  type="text"
                                />
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-2 mb-2">
                            <div className="d-flex align-items-center h-100">
                              Mobile No
                            </div>
                          </div>
                          <div className="col-lg-4 mb-2">
                            <div className="d-flex align-items-center">
                              <span className="mr-2">:</span>
                              <div className="w-100">
                                <InputField
                                  value={values?.mobileNo}
                                  name="mobileNo"
                                  placeholder=""
                                  type="text"
                                />
                              </div>
                            </div>
                          </div>

                          {/* 4th row */}
                          <div className="col-lg-12 mb-2">
                            <div className="text-right">
                              <button
                                type="button"
                                className="btn btn-primary"
                                style={{fontSize: "12px"}}
                                onClick={() => {
                                  getData(
                                    getTrustAllLanding(
                                      "GetAllPaymentStatusNDonationReciverList",
                                      2,
                                      values?.applicantName,
                                      values?.beneficiaryName,
                                      values?.accountHolder,
                                      values?.accountNo,
                                      values?.registrationNo,
                                      values?.mobileNo,
                                    )
                                  );
                                }}
                                // disabled={}
                              >
                                Show Report
                              </button>  
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <DonationTable rowDto={rowDto}/>
                  </div>
                </CardBody>
              </Card>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}
