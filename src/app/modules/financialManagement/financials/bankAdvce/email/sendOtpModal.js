/* eslint-disable react-hooks/exhaustive-deps */
import { Formik } from "formik";
import React, { useMemo, useState } from "react";
import Loading from "../../../../_helper/_loading";
import * as Yup from "yup";
import InputField from "../../../../_helper/_inputField";
import numberWithCommas from "../../../../_helper/_numberWithCommas";
import useAxiosPost from "../../../../_helper/customHooks/useAxiosPost";
import { toast } from "react-toastify";

export default function SendOtpToEmailModal({ objProps }) {
  const {
    profileData,
    adviceReportData,
    setAdviceReportData,
    sendingOtpToEmailResponse,
    selectedBusinessUnit,
    values: landingValues,
    setSCBModalShow,
  } = objProps;
  // console.log(objProps);

  const [verified, setVerified] = useState(false);

  // sending email for otp
  const [verifyOtpResponse, verifyOtp, verifyOtpLoading, ,] = useAxiosPost();
  // confirm salary disbursement
  const [
    ,
    confirmSalaryDisbursement,
    confirmSalaryDisbursementLoading,
    ,
  ] = useAxiosPost();

  // console.log(confirmSalaryDisbursementResponse);

  // formik init data
  const initData = { otp: "" };

  // validation schema of otp
  const validationSchema = Yup.object({
    otp: Yup.string()
      .matches(/^\S+$/, "OTP cannot contain spaces")
      .required("OTP is required"),
  });

  // return an new array of selected account or row dto
  const selectedAdviceReportData = (arr, callback) => {
    const filterdData = arr?.filter((item) => Boolean(item?.checked));
    callback && callback(filterdData);
  };

  // generate salary disbursement payload
  const generateSCBDisbursementPayload = (
    arr,
    landingValues,
    selectedBusinessUnit,
    profileData
  ) =>
    arr.map((item) => {
      // destructure current item
      const {
        numAmount,
        strPayee,
        strBankAccountNo,
        intBankId,
        strBankAccountName,
        strBankName,
        intBankBranchId,
        strRoutingNumber,
        intEmployeeId,
      } = item;

      // landing values destrcuture
      const { dateTime, bankAccountNo, advice, adviceType } = landingValues;

      // return an object (individual payload)
      return {
        dteSalaryDate: dateTime,
        intBusinessUnitId: selectedBusinessUnit?.value,
        strReferenceId: "",
        dteDate: dateTime,
        intBankAccountId: bankAccountNo?.value,
        intBankId: bankAccountNo?.bankId,
        strBankName: bankAccountNo?.bankName,
        strBankAccountNo: bankAccountNo?.bankAccNo,
        strBankAccountName: bankAccountNo?.accountName,
        intAdviceFormatId: advice?.value,
        strAdviceFormat: advice?.label,
        intInstrumentTypeId: adviceType?.value,
        strInstrumentType: adviceType?.label,
        numAmount: numAmount,
        isSuccess: true,
        strResponse: "",
        intActionBy: profileData?.accountId,
        intSalaryGenerateHeaderId: item?.intPkReferenceId,
        intEmployeeId: intEmployeeId,
        strEmployeeName: strPayee,
        strPayee: strPayee,
        strPayeeAccountNo: strBankAccountNo,
        strPayeeAccountName: strBankAccountName,
        intPayeeBankId: intBankId,
        strPayeeBankName: strBankName,
        intPayeeBankBranchId: intBankBranchId,
        strPayeeRoutingNo: strRoutingNumber,
      };
    });

  // save handler of disbursement
  const saveHandler = (
    values,
    landingValues,
    profileData,
    selectedBusinessUnit,
    adviceReportData,
    cb
  ) => {
    // disburse only checked account & making ready for disbursement
    const payload = selectedAdviceReportData(
      adviceReportData,
      (filteredData) => {
        const updatedDataForPayload = generateSCBDisbursementPayload(
          filteredData,
          landingValues,
          selectedBusinessUnit,
          profileData
        );
        return updatedDataForPayload;
      }
    );
    // // generate scb disbursement payload
    // const payload = generateSCBDisbursementPayload(
    //   filteredSCBDisburmentData,
    //   landingValues,
    //   selectedBusinessUnit,
    //   profileData
    // );
    console.log(payload);

    // confirm disbursement
    confirmSalaryDisbursement(
      "/fino/Disburse/SaveBankAdviceDirect",
      payload,
      (response) => {
        // status code
        const statusCode = response?.StatusCode || response?.statuscode;
        const message = response?.Message || response?.message;

        if (statusCode === 500 || statusCode === 500) {
          toast.warn(message);
          setSCBModalShow(true);
        } else if (statusCode === 200 || statusCode === 200) {
          toast.success(message);
          setAdviceReportData([]);
          setSCBModalShow(false);
        }
        // if status code isn't 500 than close modal & clear report data
        setAdviceReportData([]);
        setSCBModalShow(false);
      },
      false,
      "Salary disbursement complement",
      "Salary disbursement not complement",
      () => {
        setAdviceReportData([]);
        setSCBModalShow(false);
      }
    );
  };

  const totalAmount = useMemo(
    () => adviceReportData.reduce((acc, item) => acc + +item.numAmount, 0),
    [adviceReportData]
  );

  // console.log(adviceReportData?.filter((item) => Boolean(item?.checked)));

  // handle verify otp
  const handleVerifyOtp = (profileData, values) => {
    verifyOtp(
      `/fino/Disburse/VerifyAdviceOTP`,
      {
        // ! this should be preset
        // emailAddress: "rakibul.rifat@ibos.io",
        emailAddress: profileData?.emailAddress,
        otp: values?.otp,
      },
      () => setVerified(true),
      true,
      "OTP verified",
      "OTP not verified",
      () => setVerified(false)
    );
  };

  // console.log(verifyOtpResponse);

  // const notVerified = true;

  return (
    <Formik
      enableReinitialize={true}
      initialValues={initData}
      validationSchema={validationSchema}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        saveHandler(
          values,
          landingValues,
          profileData,
          selectedBusinessUnit,
          adviceReportData,
          () => {
            resetForm(initData);
          }
        );
      }}
    >
      {({
        handleSubmit,
        resetForm,
        values,
        dirty,
        errors,
        touched,
        handleChange,
        setFieldValue,
        isSubmitting,
        isValid,
      }) => (
        <div>
          {(verifyOtpLoading || confirmSalaryDisbursementLoading) && (
            <Loading />
          )}
          <div className="container">
            <form enctype="multipart/form-data">
              {/** If otp not verified or not verifying than show this */}
              {!verified ? (
                <>
                  <div className="d-flex flex-column pt-5 pb-2 mx-auto text-center">
                    <h6 className="text-danger">
                      {sendingOtpToEmailResponse?.message}
                    </h6>
                    <h4 className="text-primary">
                      {profileData?.emailAddress}
                    </h4>
                  </div>

                  <div className="d-flex flex-column align-items-center">
                    <div>
                      <InputField
                        value={values?.otp}
                        placeholder="******"
                        name="otp"
                        onChange={(e) => {
                          setFieldValue("otp", e.target.value);
                        }}
                      />
                    </div>
                    <div className="mt-2">
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => handleVerifyOtp(profileData, values)}
                        disabled={!errors || !dirty}
                      >
                        Verify OTP
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="pt-5 pb-2 mx-auto text-center">
                  <h4 className="text-success">
                    {verifyOtpResponse?.message} Successfully
                  </h4>
                </div>
              )}
            </form>
            <hr />
            <section className="mt-3">
              <div className="d-flex flex-row justify-content-between align-items-center mb-3">
                <h6>
                  Total{" "}
                  <strong className="text-primary">
                    {
                      adviceReportData?.filter((item) => Boolean(item?.checked))
                        ?.length
                    }
                  </strong>{" "}
                  accounts are selected for salary disbursement.
                </h6>
                {verified && (
                  <button
                    type="button"
                    className="btn btn-primary"
                    disabled={isSubmitting}
                    onClick={handleSubmit}
                  >
                    Confirm
                  </button>
                )}
              </div>

              {/* Selected account table for disbursement */}
              {adviceReportData?.length > 0 && (
                <div className="table-responsive">
                  <table
                    className={`table table-bordered global-table mt-0 table-font-size-sm advice_table ${!verified &&
                      "table-striped "}`}
                  >
                    <thead className="bg-secondary">
                      <tr>
                        <th>SL</th>
                        <th>Account No</th>
                        <th>Type</th>
                        <th>Account Name</th>
                        <th>Bank</th>
                        <th>Branch</th>
                        <th>Address</th>
                        <th>Amount</th>
                        <th>Instrument</th>
                        <th>Code</th>
                        <th>Payee</th>
                        <th>Routing</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody className={!verified ? "bg-secondary" : ""}>
                      {adviceReportData
                        ?.filter((item) => Boolean(item?.checked))
                        .map((item, index) => (
                          <tr
                            key={index}
                            className={
                              item?.printCount || item?.mailCount
                                ? "font_color_red"
                                : ""
                            }
                          >
                            <td>{index + 1}</td>
                            <td>{item?.strAccountNo}</td>
                            <td>{item?.strBankAccType}</td>
                            <td>{item?.strBankAccountName}</td>
                            <td>{item?.strBankName}</td>
                            <td>{item?.strBankBranchName}</td>
                            <td>{item?.strBranchAddress}</td>
                            <td className="text-right">
                              {numberWithCommas(item?.numAmount)}
                            </td>
                            <td>{item?.strInstrumentNo}</td>
                            <td>{item?.strPayeCode}</td>
                            <td>{item?.strPayee}</td>
                            <td>{item?.strRoutingNumber}</td>
                            <td>
                              P-{item?.printCount}, M-{item?.mailCount}{" "}
                            </td>
                          </tr>
                        ))}
                      <tr>
                        <td colSpan={7}>
                          <strong>Total</strong>
                        </td>

                        <td className="text-right">
                          <div className="pr-2">
                            {(totalAmount || 0).toFixed(2)}
                          </div>
                        </td>
                        <td colSpan={5}></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </div>
        </div>
      )}
    </Formik>
  );
}
