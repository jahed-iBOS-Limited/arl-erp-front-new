import React, { useEffect } from "react";
import { Form, Formik } from "formik";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import { _formatMoney } from "../../../_helper/_formatMoney";
import InputField from "../../../_helper/_inputField";
import NewSelect from "../../../_helper/_select";
import {
  Card,
  CardBody,
  CardHeader,
  ModalProgressBar,
} from "./../../../../../_metronic/_partials/controls";
import { _dateFormatter } from "./../../../_helper/_dateFormate";
import Loading from "./../../../_helper/_loading";
import { _todayDate } from "./../../../_helper/_todayDate";
import { useDispatch } from "react-redux";
import IView from "../../../_helper/_helperIcons/_view";
import { getDownlloadFileView_Action } from "../../../_helper/_redux/Actions";

const initData = {
  fromDate: "",
  toDate: "",
  businessUnit: "",
  registrationNo: "",
  applicationId: "",
};

const ApprovedReport = () => {
  const [rowDto, setRowDto, loading] = useAxiosGet();

  // ddl
  const [unitNameDDL, getUnitNameDDL] = useAxiosGet();
  const generateAPI = (name, autoId = 0, typeId = 0) => {
    return `/hcm/TrustManagement/GetTrustAllDDL?PartName=${name}&AutoId=${autoId}&TypeId=${typeId}`;
  };

  useEffect(() => {
    getUnitNameDDL(generateAPI("UnitDDL"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // landing
  const landingAPI = (
    name,
    fromDate,
    toDate,
    unitId,
    registrationNo,
    applicationId
  ) => {
    return `/hcm/TrustManagement/GetTrustAllLanding?PartName=${name}&UnitId=${unitId}&FromDate=${fromDate}&ToDate=${toDate}&RegistrationNo=${registrationNo}&ApplicationId=${applicationId}`;
  };

  const dispatch = useDispatch();

  useEffect(() => {
    setRowDto(
      landingAPI(
        "GetAllApproveDonationApplicationList",
        _todayDate(),
        _todayDate(),
        4,
        "",
        0
      )
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
                <CardHeader title={"Approved Report"}></CardHeader>
                <CardBody>
                  <div className="mt-0">
                    <div className="form-group row global-form">
                      <div className="col-8">
                        <div className="row">
                          {/* first row */}
                          <div className="col-lg-2 mb-2">
                            <div className="d-flex align-items-center h-100">
                              Unit Name
                            </div>
                          </div>
                          <div className="col-lg-4 mb-2">
                            <div className="d-flex align-items-center">
                              <span className="mr-2">:</span>
                              <NewSelect
                                isHiddenToolTip={true}
                                name="businessUnit"
                                isHiddenLabel={true}
                                options={unitNameDDL || []}
                                value={values?.businessUnit}
                                onChange={(valueOption) => {
                                  setFieldValue("businessUnit", valueOption);
                                }}
                                placeholder="Unit Name"
                                errors={errors}
                                touched={touched}
                              />
                            </div>
                          </div>
                          <div className="col-lg-2 mb-2">
                            <div className="d-flex align-items-center h-100">
                              Application Id
                            </div>
                          </div>
                          <div className="col-lg-4 mb-2">
                            <div className="d-flex align-items-center w-100">
                              <span className="mr-2">:</span>
                              <div className="w-100">
                                <InputField
                                  type="number"
                                  value={values?.applicationId}
                                  name="applicationId"
                                />
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-2 mb-2">
                            <div className="d-flex align-items-center h-100">
                              From Date
                            </div>
                          </div>
                          <div className="col-lg-4 mb-2">
                            <div className="d-flex align-items-center">
                              <span className="mr-2">:</span>
                              <div className="w-100">
                                <InputField
                                  type="date"
                                  value={values?.fromDate}
                                  name="fromDate"
                                />
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-2 mb-2">
                            <div className="d-flex align-items-center h-100">
                              To Date
                            </div>
                          </div>
                          <div className="col-lg-4 mb-2">
                            <div className="d-flex align-items-center w-100">
                              <span className="mr-2">:</span>
                              <div className="w-100">
                                <InputField
                                  type="date"
                                  value={values?.toDate}
                                  name="toDate"
                                  min={values?.fromDate}
                                  disabled={!values?.fromDate}
                                />
                              </div>
                            </div>
                          </div>

                          {/* second row */}

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
                                />
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-6 mb-2 text-right">
                            <button
                              type="button"
                              className="btn btn-primary"
                              style={{ fontSize: "12px" }}
                              onClick={() => {
                                setRowDto(
                                  landingAPI(
                                    "GetAllApproveDonationApplicationList",
                                    values?.fromDate,
                                    values?.toDate,
                                    values?.businessUnit?.value || 4,
                                    values?.registrationNo || "",
                                    values?.applicationId || 0
                                  )
                                );
                              }}
                              disabled={!values?.fromDate || !values?.toDate}
                            >
                              Show Report
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="row cash_journal">
                      <div className="col-lg-12">
                        <div className="table-responsive">
                          <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing sales_order_landing_table">
                            <thead>
                              <tr>
                                <th style={{ width: "20px" }}>SL</th>
                                <th>Application Id</th>
                                <th>Application Date</th>
                                <th>Approved Date</th>
                                <th>Applicant Name</th>
                                <th>Account Holder's Name</th>
                                <th>Hospital/Institutes</th>
                                <th>Cause Of Donation</th>
                                <th>Effective Date</th>
                                <th>Expiry Date</th>
                                <th>Amount</th>
                                <th>Attachment</th>
                              </tr>
                            </thead>
                            <tbody>
                              {rowDto?.map((data, index) => (
                                <tr key={index}>
                                  <td> {index + 1} </td>
                                  <td>
                                    <div className="text-center">
                                      {data?.intApplicationID}
                                    </div>
                                  </td>
                                  <td>
                                    <div className="text-center">
                                      {_dateFormatter(data?.dteApplicationDate)}
                                    </div>
                                  </td>
                                  <td>
                                    <div className="text-center">
                                      {_dateFormatter(
                                        data?.dteApprovedDateTime
                                      )}
                                    </div>
                                  </td>
                                  <td> {data?.strApplicantName} </td>
                                  <td> {data?.strAccountHolderName} </td>
                                  <td> {data?.strOrganizationName}</td>
                                  <td> {data?.strDonationType} </td>
                                  <td>
                                    <div className="text-center">
                                      {_dateFormatter(data?.dteEffectiveDate)}
                                    </div>
                                  </td>
                                  <td>
                                    <div className="text-center">
                                      {_dateFormatter(data?.dteEndDate)}
                                    </div>
                                  </td>
                                  <td>
                                    <div className="text-right">
                                      {_formatMoney(data?.monAmount, 2)}
                                    </div>
                                  </td>
                                  <td
                                    style={{
                                      verticalAlign: "middle",
                                      textAlign: "center",
                                    }}
                                  >
                                    <div className="">
                                      {data?.strAttachmentUrl && (
                                        <IView
                                          clickHandler={() => {
                                            dispatch(
                                              getDownlloadFileView_Action(
                                                data?.strAttachmentUrl
                                              )
                                            );
                                          }}
                                        />
                                      )}
                                    </div>
                                  </td>
                                  {/* <td style={{ verticalAlign: "middle" }}>
                                  <div className="d-flex justify-content-center align-items-center baiscInfo_table">
                                    <button
                                      className="btn btn-outline-dark mr-1 pointer"
                                      type="button"
                                      style={{
                                        padding: "1px 5px",
                                        fontSize: "11px",
                                        width: "85px",
                                      }}
                                      onClick={() => {
                                        console.log("Click");
                                      }}
                                    >
                                      Print Preview
                                    </button>
                                  </div>
                                </td> */}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
};

export default ApprovedReport;
