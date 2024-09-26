import React, { useEffect, useState } from "react";
import InputField from "../../../../_helper/_inputField";
import { adviceMailCreate, advicePrintCount, getAdviceReport } from "../helper";
import NewSelect from "./../../../../_helper/_select";
import IViewModal from "../../../../_helper/_viewModal";
import ViewData from "./ViewPrint";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { moneyInWord } from "../../../../_helper/_convertMoneyToWord";
import Loading from "../../../../_helper/_loading";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import { SetFinancialsBankAdviceAction } from "../../../../_helper/reduxForLocalStorage/Actions";
import IConfirmModal from "../../../../chartering/_chartinghelper/_confirmModal";
import EmailViewForm from "./emailForm";
import { generateExcel } from "./excelReportGenarate";
import SendOtpToEmailModal from "../email/sendOtpModal";
import useAxiosPost from "../../../../_helper/customHooks/useAxiosPost";

const InputFields = ({ obj }) => {
  const { userRole } = useSelector((state) => state?.authData, shallowEqual);
  const [isView, setIsView] = useState("");
  const [mdalShow, setModalShow] = useState(false);
  const [scbModalShow, setSCBModalShow] = useState(false);
  const [isShowModal, setIsShowModal] = useState(false);
  const [total, setTotal] = useState(0);
  const [, setTotalInWords] = useState(0);
  const [
    adviceDDL,
    getAdviceDDL,
    loadingOnGetAdviceDDL,
    setAdviceDDL,
  ] = useAxiosGet();

  const dispatch = useDispatch();
  let {
    values,
    bankAccountDDL,
    setFieldValue,
    errors,
    touched,
    profileData,
    selectedBusinessUnit,
    setLoading,
    setAdviceReportData,
    adviceReportData,
    adviceTypeDDL,
    sbuList,
  } = obj;

  const getData = () => {
    let data = [];
    if (values?.advice?.info === "below36Character") {
      data = adviceReportData?.filter(
        (item) => item.checked && item.strPayee?.length < 36
      );
    } else if (values?.advice?.info === "above36Character") {
      data = adviceReportData?.filter(
        (item) => item.checked && item.strPayee?.length >= 36
      );
    } else if (values?.adviceType?.value === 21) {
      // adviceType 21 (TDS/VDS)
      const data1 = adviceReportData?.filter((item) => item.checked);
      const firstItem = data1?.[0] || {};
      data = [
        {
          ...firstItem,
          numAmount: data1?.reduce((acc, cur) => {
            return acc + (+cur?.numAmount || 0);
          }, 0),
        },
      ];
    } else {
      data = adviceReportData?.filter((item) => item.checked);
    }
    return data;
  };
  useEffect(() => {
    if (values?.bankAccountNo) {
      getAdviceDDL(
        `/costmgmt/BankAccount/GetAdviceFormatByBankId?bankId=${values?.bankAccountNo?.bankId}`
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values?.bankAccountNo]);

  useEffect(() => {
    if (adviceReportData.length > 0) {
      setTotal(
        Number(
          adviceReportData
            ?.reduce((acc, item) => acc + item?.numAmount, 0)
            .toFixed(2)
        )
      );
    }
  }, [adviceReportData]);

  useEffect(() => {
    if (total) {
      moneyInWord(total, setTotalInWords);
    }
  }, [total]);

  const initDataforEmail = {
    toMail: [],
    toCC: "",
    toBCC: [],
    subject: ``,
    message: ``,
    attachment: "",
  };

  // Salary Advice advice report data checking is a single data is selected or not
  const isAdviceReportDataSelected = (arr) =>
    arr?.some((item) => Boolean(item?.checked));

  // console.log(isAdviceReportDataSelected(adviceReportData));

  // sending email for otp
  const [
    sendingOtpToEmailResponse,
    sendingOtpToEmail,
    sendingOtpToEmailLoading,
    ,
  ] = useAxiosPost();

  // handle send otp to mail
  const handleSendOtpToMail = (profileData) => {
    // sending email
    sendingOtpToEmail(
      `/fino/Disburse/SendAdviceOTP`,
      {
        // ! this should be preset
        emailAddress: profileData?.emailAddress,
        // emailAddress: "rakibul.rifat@ibos.io",
      },
      () => setSCBModalShow(true),
      true,
      "OTP Has been send",
      "OTP couldn't be send",
      () => setSCBModalShow(false)
    );
  };

  // scb disbursement btn permission
  const scbDisbursementBtnPermission = userRole.find(
    (role) => role?.intFeatureId === 1508
  );

  return (
    <>
      {(loadingOnGetAdviceDDL || sendingOtpToEmailLoading) && <Loading />}
      <div className="form-group global-form">
        <div className="row">
          <div className="col-lg-2">
            <NewSelect
              name="sbuUnit"
              options={sbuList}
              value={values?.sbuUnit}
              label="SBU"
              onChange={(valueOption) => {
                setFieldValue("sbuUnit", valueOption);
                dispatch(
                  SetFinancialsBankAdviceAction({
                    ...values,
                    sbuUnit: valueOption,
                  })
                );
              }}
              placeholder="SBU"
              errors={errors}
              touched={touched}
            />
          </div>
          <div className="col-lg-2">
            <label>Date</label>
            <InputField
              value={values?.dateTime || ""}
              name="dateTime"
              placeholder="Date"
              type="date"
              onChange={(e) => {
                dispatch(
                  SetFinancialsBankAdviceAction({
                    ...values,
                    dateTime: e.target.value,
                  })
                );
              }}
            />
          </div>
          <div className="col-lg-2">
            <NewSelect
              isSearchable={true}
              options={bankAccountDDL || []}
              name="bankAccountNo"
              placeholder="Bank Account No"
              value={values?.bankAccountNo || ""}
              onChange={(valueOption) => {
                setFieldValue("bankAccountNo", valueOption);
                setAdviceDDL([]);
                if (valueOption) {
                  setFieldValue("advice", "");
                }
                dispatch(
                  SetFinancialsBankAdviceAction({
                    ...values,
                    bankAccountNo: valueOption,
                  })
                );
              }}
              errors={errors}
              touched={touched}
              // disabled={}
            />
          </div>
          <div className="col-lg-2">
            <NewSelect
              isSearchable={true}
              options={adviceTypeDDL || []}
              name="adviceType"
              placeholder="Instrument Type"
              value={values?.adviceType || ""}
              onChange={(valueOption) => {
                setFieldValue("adviceType", valueOption);
                dispatch(
                  SetFinancialsBankAdviceAction({
                    ...values,
                    adviceType: valueOption,
                  })
                );
              }}
              errors={errors}
              touched={touched}
            />
          </div>
          <div className="col-lg-2">
            <NewSelect
              isSearchable={true}
              options={adviceDDL || []}
              name="advice"
              placeholder="Advice"
              value={values?.advice || ""}
              onChange={(valueOption) => {
                setFieldValue("advice", valueOption);
                setAdviceReportData([]);
              }}
              errors={errors}
              touched={touched}
            />
          </div>
        </div>
        <div
          className="d-flex align-items-center justify-content-end"
          style={{ marginTop: "8px", flexWrap: "wrap", gap: "10px" }}
        >
          {/* Show only user has permission & salary advice & bank is scb */}
          {scbDisbursementBtnPermission?.isEdit &&
            values?.adviceType?.value === 12 && (
              <button
                type="button"
                className="btn btn-primary mr-2"
                onClick={() => handleSendOtpToMail(profileData)}
                // disable if bank acc isn't to scb bank value 41
                disabled={
                  !values?.dateTime ||
                  values?.bankAccountNo?.bankId !== 41 ||
                  values?.adviceType?.value !== 12 ||
                  !values?.advice ||
                  !isAdviceReportDataSelected(adviceReportData)
                }
              >
                SCB Disburse
              </button>
            )}

          <button
            type="button"
            onClick={() => setIsShowModal(true)}
            className="btn btn-primary back-btn mr-2"
            disabled={
              !values?.dateTime ||
              !values?.bankAccountNo ||
              !values?.adviceType ||
              !values?.advice ||
              !adviceReportData.some((item) => item?.checked)
            }
          >
            Send To Bank
          </button>
          <button
            type="button"
            className="btn btn-primary mr-2"
            onClick={() => {
              getAdviceReport(
                profileData?.accountId,
                selectedBusinessUnit?.value,
                values?.sbuUnit?.value,
                values?.adviceType?.value,
                values?.dateTime,
                values?.advice?.label,
                values?.bankAccountNo?.value,
                setAdviceReportData,
                setLoading
              );
              setIsView(true);
            }}
            disabled={
              !values?.dateTime ||
              !values?.bankAccountNo ||
              !values?.adviceType ||
              !values?.advice
            }
          >
            Show
          </button>
          <button
            type="button"
            className="btn btn-primary mr-2"
            onClick={() => {
              let data = getData();
              if (data?.length > 0) {
                const filterArr = data?.map((itm) => ({
                  JournalId: itm?.intJournalId || 0,
                }));
                IConfirmModal({
                  title: "Send Email",
                  message: "Are you sure you want to email ?",
                  yesAlertFunc: () => {
                    adviceMailCreate(filterArr, setLoading);
                  },
                  noAlertFunc: () => {},
                });
              }
              setIsView(true);
            }}
            disabled={
              !values?.dateTime ||
              !values?.bankAccountNo ||
              !values?.adviceType ||
              !values?.advice
            }
          >
            Send Mail
          </button>
          {/* <button
            type="button"
            className="btn btn-primary mr-2"
            onClick={() => {
              let data = getData();
              if (!data?.length) return null;
              advicePrintCount(
                data?.map((item) => {
                  return {
                    journalId: item?.intJournalId,
                    actionBy: profileData?.userId,
                  };
                })
              );
              const adviceName =
                values?.advice?.label === "IBBL"
                  ? "IBBL_ONLINE"
                  : values?.advice?.label === "IBBL-BEFTN"
                  ? "IBBL_BEFTN"
                  : values?.advice?.label;
              const dateFormat = values?.dateTime?.split("/").join("_");
              const fileName = `${selectedBusinessUnit?.buShortName}_${
                total ? total : 0
              }_${adviceName}_${dateFormat}`;
              generateExcel(
                data,
                values,
                0,
                "",
                selectedBusinessUnit,
                false,
                null,
                fileName
              );
              // }
            }}
            disabled={
              !values?.dateTime ||
              !values?.bankAccountNo ||
              !values?.adviceType ||
              !values?.advice ||
              !adviceReportData.some((item) => item?.checked)
            }
          >
            Export Excel
          </button> */}
          <button
            type="button"
            className="btn btn-primary mr-2"
            onClick={() => {
              let data = getData();
              if (!data?.length) return null;
              advicePrintCount(
                data?.map((item) => {
                  return {
                    journalId: item?.intJournalId,
                    actionBy: profileData?.userId,
                  };
                })
              );
              const adviceName =
                values?.advice?.label === "IBBL"
                  ? "IBBL_ONLINE"
                  : values?.advice?.label === "IBBL-BEFTN"
                  ? "IBBL_BEFTN"
                  : values?.advice?.label;
              const dateFormat = values?.dateTime?.split("/").join("_");
              const fileName = `${selectedBusinessUnit?.buShortName}_${
                total ? total : 0
              }_${adviceName}_${dateFormat}`;
              generateExcel(
                data,
                values,
                0,
                "",
                selectedBusinessUnit,
                false,
                null,
                fileName,
                "isOldExcelDownload"
              );
              // }
            }}
            disabled={
              !values?.dateTime ||
              !values?.bankAccountNo ||
              !values?.adviceType ||
              !values?.advice ||
              !adviceReportData.some((item) => item?.checked)
            }
          >
            Export Excel 2003
          </button>
          <button
            type="button"
            className="btn btn-primary mr-2"
            onClick={() => {
              if (
                ["above36Character", "below36Character"].includes(
                  values?.advice?.info
                )
              ) {
                const data = getData();
                if (data?.length > 0) {
                  setModalShow(true);
                } else {
                  toast.warn(`No data have found ${values?.advice?.label}`);
                }
              } else {
                setModalShow(true);
              }
            }}
            disabled={
              !values?.dateTime ||
              !values?.bankAccountNo ||
              !values?.adviceType ||
              !values?.advice ||
              !isView ||
              !adviceReportData.some((item) => item.checked)
            }
          >
            View Print
          </button>
        </div>
      </div>

      {/* SCB Bank Advice Modal Show For Send OTP */}
      <IViewModal
        // title="Send OTP"
        modelSize={"xl"}
        show={scbModalShow}
        onHide={() => setSCBModalShow(false)}
      >
        <SendOtpToEmailModal
          objProps={{
            profileData,
            adviceReportData,
            setAdviceReportData,
            sendingOtpToEmailResponse,
            selectedBusinessUnit,
            values,
            setSCBModalShow,
          }}
        />
      </IViewModal>

      <IViewModal
        title="Send Email"
        show={isShowModal}
        onHide={() => setIsShowModal(false)}
      >
        <EmailViewForm
          initData={initDataforEmail}
          selectedBusinessUnit={selectedBusinessUnit}
          data={getData()}
          landingValues={values}
        />
      </IViewModal>

      <IViewModal show={mdalShow} onHide={() => setModalShow(false)}>
        <ViewData adviceReportData={getData()} values={values} />
      </IViewModal>
    </>
  );
};

export default InputFields;
/* {values?.adviceType?.label === "Salary" && (
        <>
          <div className="col-lg-2">
            <NewSelect
              isSearchable={true}
              options={mandatoryDDL || []}
              name="mandatory"
              placeholder="Account No Mandatory"
              value={values?.mandatory || ""}
              onChange={(valueOption) => {
                setFieldValue("mandatory", valueOption);
              }}
              errors={errors}
              touched={touched}
            />
          </div>
          <div className="col-lg-2">
            <NewSelect
              isSearchable={true}
              options={voucherPostingDDL || []}
              name="voucherPosting"
              placeholder="Voucher Posting"
              value={values?.voucherPosting || ""}
              onChange={(valueOption) => {
                setFieldValue("voucherPosting", valueOption);
              }}
              errors={errors}
              touched={touched}
            />
          </div>
        </>
      )} */
// let totalAmount = useCallback(
//   adviceReportData.reduce((acc, item) => acc + +item?.numAmount, 0),
//   [adviceReportData]
// );

// useEffect(() => {
//   if (values?.bankAccountNo) {
//     const data = _adviceDDL.filter((item) =>
//       item.label.startsWith(values?.bankAccountNo?.label.split(":")[0])
//     );
//     if (
//       ["STANDARD CHARTERED BANK", "ISLAMI BANK BANGLADESH LTD"].includes(
//         values?.bankAccountNo?.bankName?.toUpperCase()
//       )
//     ) {
//       data.push(
//         {
//           value: 5,
//           label: "Above 36 Character",
//           info: "above36Character",
//         },
//         {
//           value: 6,
//           label: "Below 36 Character",
//           info: "below36Character",
//         }
//       );
//     }
//     data.push({
//       value: 7,
//       label: "Import",
//       info: "import",
//     });
//     setAdviceDDL(data);
//   }
// }, [values]);

// change some data according said vai

// setAdviceDDL(
//   _adviceDDL.filter((item) =>
//     item.label.startsWith(valueOption?.label.split(":")[0])
//   )
// );
// import { downloadFile } from "../../../../_helper/downloadFile";
// import { useCallback } from "react";
// import {
//   voucherPostingDDL,
// _adviceDDL,
//   mandatoryDDL,
// } from "./utils";
