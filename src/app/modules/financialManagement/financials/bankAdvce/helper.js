import axios from "axios";
import { toast } from "react-toastify";

export const getBankAccount = async (accId, buId, setter) => {
  try {
    const res = await axios.get(
      `/costmgmt/BankAccount/GetBankAccountDDL?AccountId=${accId}&BusinssUnitId=${buId}`
    );
    setter(res?.data);
  } catch (err) {
    console.log(err);
  }
};
export const getSBUList = async (accId, buId, setter) => {
  try {
    const res = await axios.get(
      `/costmgmt/SBU/GetSBUListDDL?AccountId=${accId}&BusinessUnitId=${buId}&Status=true`
    );
    setter(res?.data);
  } catch (error) {}
};
export const getInstrumentDDL = async (setter) => {
  try {
    const res = await axios.get(`/costmgmt/Instrument/GetInstrumentTypeDDL`);
    res.data.push(
      { label: "Salary Advice", value: 12 },
      { label: "Bonus Advice", value: 13 },
      { label: "Manning Advice", value: 14 },
      { label: "Zakat Advice", value: 15 },
      { label: "Sales Incentive", value: 20 },
      { label: "TDS/VDS", value: 21 }
    );
    setter(res?.data);
  } catch (err) {
    console.log(err);
  }
};
// /fino/Advice/GetAdviceView?Account=1&Unit=8&SBU=19&Date=2021-8-19&BillNo=0&PayingBankAccId=9&InstrumentType=1&AdviceBank=Others
export const getAdviceReport = async (
  accId,
  buId,
  sbuId,
  adviceTypeId,
  date,
  adviceName,
  bankAccountId,
  setter,
  setLoading
) => {
  setLoading(true);
  try {
    const res = await axios.get(
      `/fino/Advice/GetAdviceView?Account=${accId}&Unit=${buId}&SBU=${sbuId}&Date=${date}&BillNo=${0}&PayingBankAccId=${bankAccountId}&InstrumentType=${adviceTypeId}&AdviceBank=${adviceName}`
    );

    // const res = {
    //   data: [
    //     {
    //       strBankAccountNo: "000",
    //       strBankAccountName: "MJL Bangladesh Limited",
    //       intBankId: 32,
    //       strBankName: "PRIME BANK LTD",
    //       intBankBranchId: 4425,
    //       strBankBranchName: "GULSHAN",
    //       strRoutingNumber: "170261724",
    //       numAmount: 137598.0,
    //       strAccountNo: "000",
    //       strPayee: "MJL Bangladesh Limited",
    //       strPayeCode: "57",
    //       strInstrumentNo: "ACCL-MAY22-378",
    //       strPaymentReff: "SA-ACCL-MAY22-1",
    //       strComments: "BP-ACCL-MAY22-330",
    //       strBankAccType: "saving",
    //       strSubject: "Payment Instruction.",
    //       strBranchAddress: "DHAKA-SOUTH",
    //       strNaration: "test",
    //       intJournalId: 296583,
    //       intBillId: 0,
    //       strPayBankCode: "170261724",
    //       strEmail: "",
    //     },
    //     {
    //       strBankAccountNo: "000",
    //       strBankAccountName: "MJL Bangladesh Limited",
    //       intBankId: 32,
    //       strBankName: "PRIME BANK LTD",
    //       intBankBranchId: 4425,
    //       strBankBranchName: "GULSHAN",
    //       strRoutingNumber: "170261724",
    //       numAmount: 832400.0,
    //       strAccountNo: "000",
    //       strPayee: "MJL Bangladesh Limited",
    //       strPayeCode: "57",
    //       strInstrumentNo: "ACCL-MAY22-379",
    //       strPaymentReff: "SA-ACCL-MAY22-2",
    //       strComments: "BP-ACCL-MAY22-331",
    //       strBankAccType: "saving",
    //       strSubject: "Payment Instruction.",
    //       strBranchAddress: "DHAKA-SOUTH",
    //       strNaration: "test",
    //       intJournalId: 296584,
    //       intBillId: 0,
    //       strPayBankCode: "170261724",
    //       strEmail: "",
    //     },
    //     {
    //       strBankAccountNo: "0000200008212",
    //       strBankAccountName: "I. R. Rubber Industries",
    //       intBankId: 35,
    //       strBankName: "RUPALI BANK LTD",
    //       intBankBranchId: 5438,
    //       strBankBranchName: "KAPTAN BAZAR",
    //       strRoutingNumber: "185273615",
    //       numAmount: 41500.0,
    //       strAccountNo: "0000200008212",
    //       strPayee: "I. R. Rubber Industries",
    //       strPayeCode: "2111760",
    //       strInstrumentNo: "ACCL-MAY22-324",
    //       strPaymentReff: "SI-ACCL-MAY22-67",
    //       strComments: "BP-ACCL-MAY22-292",
    //       strBankAccType: "saving",
    //       strSubject: "Payment Instruction.",
    //       strBranchAddress: "DHAKA-SOUTH",
    //       strNaration: "test",
    //       intJournalId: 296203,
    //       intBillId: 0,
    //       strPayBankCode: "185273615",
    //       strEmail: "",
    //     },
    //     {
    //       strBankAccountNo: "0000200191005",
    //       strBankAccountName: "Asian Paints( Bangladesh) Ltd",
    //       intBankId: 13,
    //       strBankName: "CITI BANK N A",
    //       intBankBranchId: 2330,
    //       strBankBranchName: "MOTIJHEEL",
    //       strRoutingNumber: "075274245",
    //       numAmount: 41700.0,
    //       strAccountNo: "0000200191005",
    //       strPayee: "Asian Paints( Bangladesh) Ltd",
    //       strPayeCode: "53421",
    //       strInstrumentNo: "ACCL-MAY22-175",
    //       strPaymentReff: "SI-ACCL-MAR22-758",
    //       strComments: "BP-ACCL-MAY22-144",
    //       strBankAccType: "saving",
    //       strSubject: "Payment Instruction.",
    //       strBranchAddress: "DHAKA-SOUTH",
    //       strNaration: "test",
    //       intJournalId: 294749,
    //       intBillId: 0,
    //       strPayBankCode: "075274245",
    //       strEmail: "",
    //     },
    //     {
    //       strBankAccountNo: "0000210013221",
    //       strBankAccountName: "Akij Cement Company Limited",
    //       intBankId: 25,
    //       strBankName: "JANATA BANK LTD",
    //       intBankBranchId: 3694,
    //       strBankBranchName: "BANDAR",
    //       strRoutingNumber: "135670163",
    //       numAmount: 1000.0,
    //       strAccountNo: "0000210013221",
    //       strPayee: "Akij Cement Company Limited",
    //       strPayeCode: "ACCL-Janata",
    //       strInstrumentNo: "ACCL-MAY22-235",
    //       strPaymentReff: "IE-ACCL-MAY22-46",
    //       strComments: "BP-ACCL-MAY22-203",
    //       strBankAccType: "saving",
    //       strSubject: "Payment Instruction.",
    //       strBranchAddress: "DHAKA-SOUTH",
    //       strNaration: "",
    //       intJournalId: 296005,
    //       intBillId: 0,
    //       strPayBankCode: "",
    //       strEmail: "",
    //     },
    //     {
    //       strBankAccountNo: "0000210013221",
    //       strBankAccountName: "Akij Cement Company Limited",
    //       intBankId: 25,
    //       strBankName: "JANATA BANK LTD",
    //       intBankBranchId: 3694,
    //       strBankBranchName: "BANDAR",
    //       strRoutingNumber: "135670163",
    //       numAmount: 1038.0,
    //       strAccountNo: "0000210013221",
    //       strPayee: "Akij Cement Company Limited",
    //       strPayeCode: "ACCL-Janata",
    //       strInstrumentNo: "ACCL-MAY22-234",
    //       strPaymentReff: "IE-ACCL-MAY22-45",
    //       strComments: "BP-ACCL-MAY22-202",
    //       strBankAccType: "saving",
    //       strSubject: "Payment Instruction.",
    //       strBranchAddress: "DHAKA-SOUTH",
    //       strNaration: "",
    //       intJournalId: 296004,
    //       intBillId: 0,
    //       strPayBankCode: "",
    //       strEmail: "",
    //     },
    //     {
    //       strBankAccountNo: "0000210013221",
    //       strBankAccountName: "Akij Cement Company Limited",
    //       intBankId: 25,
    //       strBankName: "JANATA BANK LTD",
    //       intBankBranchId: 3694,
    //       strBankBranchName: "BANDAR",
    //       strRoutingNumber: "135670163",
    //       numAmount: 10440.0,
    //       strAccountNo: "0000210013221",
    //       strPayee: "Akij Cement Company Limited",
    //       strPayeCode: "ACCL-Janata",
    //       strInstrumentNo: "ACCL-MAY22-240",
    //       strPaymentReff: "IE-ACCL-MAY22-38",
    //       strComments: "BP-ACCL-MAY22-209",
    //       strBankAccType: "saving",
    //       strSubject: "Payment Instruction.",
    //       strBranchAddress: "DHAKA-SOUTH",
    //       strNaration: "",
    //       intJournalId: 296028,
    //       intBillId: 0,
    //       strPayBankCode: "",
    //       strEmail: "",
    //     },
    //     {
    //       strBankAccountNo: "0000210013221",
    //       strBankAccountName: "Akij Cement Company Limited",
    //       intBankId: 25,
    //       strBankName: "JANATA BANK LTD",
    //       intBankBranchId: 3694,
    //       strBankBranchName: "BANDAR",
    //       strRoutingNumber: "135670163",
    //       numAmount: 10440.0,
    //       strAccountNo: "0000210013221",
    //       strPayee: "Akij Cement Company Limited",
    //       strPayeCode: "ACCL-Janata",
    //       strInstrumentNo: "ACCL-MAY22-241",
    //       strPaymentReff: "IE-ACCL-MAY22-39",
    //       strComments: "BP-ACCL-MAY22-210",
    //       strBankAccType: "saving",
    //       strSubject: "Payment Instruction.",
    //       strBranchAddress: "DHAKA-SOUTH",
    //       strNaration: "",
    //       intJournalId: 296029,
    //       intBillId: 0,
    //       strPayBankCode: "",
    //       strEmail: "",
    //     },
    //     {
    //       strBankAccountNo: "0000210013221",
    //       strBankAccountName: "Akij Cement Company Limited",
    //       intBankId: 25,
    //       strBankName: "JANATA BANK LTD",
    //       intBankBranchId: 3694,
    //       strBankBranchName: "BANDAR",
    //       strRoutingNumber: "135670163",
    //       numAmount: 10440.0,
    //       strAccountNo: "0000210013221",
    //       strPayee: "Akij Cement Company Limited",
    //       strPayeCode: "ACCL-Janata",
    //       strInstrumentNo: "ACCL-MAY22-242",
    //       strPaymentReff: "IE-ACCL-MAY22-40",
    //       strComments: "BP-ACCL-MAY22-211",
    //       strBankAccType: "saving",
    //       strSubject: "Payment Instruction.",
    //       strBranchAddress: "DHAKA-SOUTH",
    //       strNaration: "",
    //       intJournalId: 296030,
    //       intBillId: 0,
    //       strPayBankCode: "",
    //       strEmail: "",
    //     },
    //     {
    //       strBankAccountNo: "0000210013221",
    //       strBankAccountName: "Akij Cement Company Limited",
    //       intBankId: 25,
    //       strBankName: "JANATA BANK LTD",
    //       intBankBranchId: 3694,
    //       strBankBranchName: "BANDAR",
    //       strRoutingNumber: "135670163",
    //       numAmount: 10440.0,
    //       strAccountNo: "0000210013221",
    //       strPayee: "Akij Cement Company Limited",
    //       strPayeCode: "ACCL-Janata",
    //       strInstrumentNo: "ACCL-MAY22-243",
    //       strPaymentReff: "IE-ACCL-MAY22-41",
    //       strComments: "BP-ACCL-MAY22-212",
    //       strBankAccType: "saving",
    //       strSubject: "Payment Instruction.",
    //       strBranchAddress: "DHAKA-SOUTH",
    //       strNaration: "",
    //       intJournalId: 296031,
    //       intBillId: 0,
    //       strPayBankCode: "",
    //       strEmail: "",
    //     },
    //     {
    //       strBankAccountNo: "0000210013221",
    //       strBankAccountName: "Akij Cement Company Limited",
    //       intBankId: 25,
    //       strBankName: "JANATA BANK LTD",
    //       intBankBranchId: 3694,
    //       strBankBranchName: "BANDAR",
    //       strRoutingNumber: "135670163",
    //       numAmount: 10440.0,
    //       strAccountNo: "0000210013221",
    //       strPayee: "Akij Cement Company Limited",
    //       strPayeCode: "ACCL-Janata",
    //       strInstrumentNo: "ACCL-MAY22-244",
    //       strPaymentReff: "IE-ACCL-MAY22-42",
    //       strComments: "BP-ACCL-MAY22-213",
    //       strBankAccType: "saving",
    //       strSubject: "Payment Instruction.",
    //       strBranchAddress: "DHAKA-SOUTH",
    //       strNaration: "",
    //       intJournalId: 296032,
    //       intBillId: 0,
    //       strPayBankCode: "",
    //       strEmail: "",
    //     },
    //     {
    //       strBankAccountNo: "0000210013221",
    //       strBankAccountName: "Akij Cement Company Limited",
    //       intBankId: 25,
    //       strBankName: "JANATA BANK LTD",
    //       intBankBranchId: 3694,
    //       strBankBranchName: "BANDAR",
    //       strRoutingNumber: "135670163",
    //       numAmount: 30212.0,
    //       strAccountNo: "0000210013221",
    //       strPayee: "Akij Cement Company Limited",
    //       strPayeCode: "ACCL-Janata",
    //       strInstrumentNo: "ACCL-MAY22-239",
    //       strPaymentReff: "IE-ACCL-MAY22-37",
    //       strComments: "BP-ACCL-MAY22-208",
    //       strBankAccType: "saving",
    //       strSubject: "Payment Instruction.",
    //       strBranchAddress: "DHAKA-SOUTH",
    //       strNaration: "",
    //       intJournalId: 296027,
    //       intBillId: 0,
    //       strPayBankCode: "",
    //       strEmail: "",
    //     },
    //   ],
    // };
    setLoading(false);
    setter(
      res?.data?.map((item) => ({
        ...item,
        strRequestFor: "Duty",
      }))
    );
  } catch (err) {
    setLoading(false);
  }
};

export const getAdviceReportForSalaryTypeAdvice = async (
  accId,
  buId,
  adviceType,
  isAdviceComplete,
  date,
  advice,
  voucherPosting,
  setter,
  setLoading
) => {
  setLoading(true);
  try {
    const res = await axios.get(
      `/fino/Advice/GetAdvice?accountId=${accId}&businessUnitId=${buId}&getDate=${date}&adviceType=${adviceType}&isAccountNoMandatory=${isAdviceComplete}&advice=${advice}&voucherPosting=${voucherPosting}`
    );
    setLoading(false);
    setter(res?.data);
  } catch (err) {
    setLoading(false);
  }
};
// /fino/BankJournal/AdvicePrintCount
export const advicePrintCount = async (data) => {
  try {
    const res = await axios.put(`/fino/BankJournal/AdvicePrintCount`, data);
    if (res.status === 200) {
      // cb();
      // toast.success(res?.data?.message || "Submitted successfully");
      // setDisabled(false);
    }
  } catch (error) {}
};

export const adviceMailCreate = async (data, setLoading) => {
  try {
    setLoading(true);
    await axios.post(`/fino/Advice/AdviceMailCreate`, data);
    toast.success("Email sent successfully");
    setLoading(false);
  } catch (error) {
    setLoading(false);
    toast.error(error.response.data.message);
  }
};

// accId=1,busId=152,isAdviceComplete=false,getDate=04-28-2021 advice=ibbl voucherPosting=all adviceType=Salary Advice

function MailSender(parameterName, valueArr) {
  if (parameterName === "SendTo" && valueArr?.length > 0) {
    const queryArr = valueArr.map((value) => parameterName + "=" + value);
    return queryArr.join("&");
  } else {
    return parameterName + "=" + [];
  }
}

function toCCMailSend(parameterName, valueArr) {
  if (parameterName === "SendToCC" && valueArr?.length > 0) {
    const queryArr = valueArr.map((value) => parameterName + "=" + value);
    return queryArr.join("&");
  } else {
    return parameterName + "=" + [];
  }
}

function toBCCMailSend(parameterName, valueArr) {
  if (parameterName === "SendToBCC" && valueArr?.length > 0) {
    const queryArr = valueArr.map((value) => parameterName + "=" + value);
    return queryArr.join("&");
  } else {
    return parameterName + "=" + [];
  }
}

export const sendEmailPostApi = async (
  values,
  attachment,
  fileName,
  setLoading
) => {
  console.log("attachment", attachment);
  //const checkMail = Array.isArray(values?.toMail)
  const toMail = values?.toMail?.split(",");
  const sendCCMail = values?.toCC === "" ? [] : values?.toCC?.split(",");

  const checkBCCMail = Array.isArray(values?.toBCC);
  let sendBCCMail = [];
  if (!checkBCCMail) {
    sendBCCMail = values?.toBCC?.split(",");
  }

  let formData = new FormData();
  attachment.forEach((file) => {
    formData.append("files", file);
  });
  // let formData = new FormData();
  // formData.append("files", attachment);
  setLoading && setLoading(true);
  try {
    let res = await axios.post(
      `/procurement/ShipRequestForQuotation/SendEMailWithAttachmentForBankAdvice?${MailSender(
        "SendTo",
        toMail
      )}&${toCCMailSend("SendToCC", sendCCMail)}&${toBCCMailSend(
        "SendToBCC",
        sendBCCMail
      )}&MailSubject=${values?.subject || ""}&MailBody=${values?.message ||
        ""}&fileName=${fileName}`,
      formData
    );

    toast.success("Mail Send Successfully");
    setLoading && setLoading(false);
    return res;
  } catch (error) {
    setLoading && setLoading(false);
    toast.error(
      error?.response?.data?.message || "Mail cant not send successfully"
    );
  }
};
