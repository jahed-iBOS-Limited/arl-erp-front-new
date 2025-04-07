import axios from 'axios';
import { toast } from 'react-toastify';
import { _dateFormatter } from '../../../../_helper/_dateFormate';
import { _formatMoney } from '../../../../_helper/_formatMoney';
import { _todayDate } from '../../../../_helper/_todayDate';
// create page
// init data
export const initData = {
  // global
  viewType: 'import',

  // common (import, income, payment)
  poLC: '',
  sbu: '', // customer received
  bankName: '',
  bankAccount: '',
  paymentType: { value: 'Duty', label: 'Duty' },
  amount: '',
  paymentDate: '',
  remarks: '',

  // margin & at sight payment
  marginType: '',

  // margin
  beneficiary: '',
  poValue: '',

  // at sight payment
  lcType: '',
  margin: '',
  docValue: '',
  exchangeRate: '',

  // payment & income
  partnerType: '',
  transaction: '',
  dueDate: '',

  // others (not exit on field)
  businessPartner: '',

  // customer received
  month: '',
};

export const generateSaveURL = (viewType) => {
  if (!viewType) toast.warn('Select a view type');
  // generate url
  switch (viewType) {
    case 'income':
    case 'import':
    case 'payment':
      return '/fino/FundManagement/SaveProjectedCashFlow?partName=SaveProjectedCashFlow';
    case 'customer received':
      return '/fino/FundManagement/SaveCustomerPaymentReceived?partName=SaveCustomerPaymentReceived';
    default:
      return '';
  }
};

// fetch POLC And Set Form Field
export const fetchPOLCAndSetFormField = (obj) => {
  const {
    lcPoId,
    getPOLCNumberData,
    setValues,
    values,
    getBankAccountDDL,
    profileData,
  } = obj;

  getPOLCNumberData(
    `/fino/FundManagement/GetProjectedCashFlow?partName=GetLcInfoByLcId&lcId=${lcPoId}`,
    (res) => {
      // destrcuture from array of obj
      const desData = res[0];

      // generate form value from response value
      const responseData = {
        bankName: {
          value: desData?.bankId || 0,
          label: desData?.bankName || '',
        },
        bankAccount: {
          value: desData?.bankAccountId || 0,
          label: desData?.bankAccountNo || '',
        },
        exchangeRate: desData?.exchangeRate || '',
        poLC: {
          ...values?.poLC,
          lcId: desData?.lcId || '',
          lcMarginValue: desData?.lcMarginValue || 0,
          lcNumber: desData?.lcNo || 0,
          // poAmount: desData?.poValue || 0,
          poId: desData?.purchaseOrderId || 0,
          poNumber: desData?.purchaseOrderNo || '',
          label: desData?.purchaseOrderNo || '',
          value: desData?.purchaseOrderId || 0,
        },
        lcType: {
          label: desData?.lcTypeName || '',
          value: desData?.lcTypeId || 0,
        },
        margin: desData?.marginPercentage || 0,
        beneficiary: {
          label: desData?.businessPartnerName || '',
          value: desData?.businessPartnerId || 0,
        },
        poValue: desData?.poValue || 0,
      };
      // set to formik (init data & response data)
      setValues({
        ...values,
        ...responseData,
      });

      // fetch bank account with bank id
      if (desData?.bankId) {
        // fetch bank account ddl
        fetchBankAccountDDL({
          getBankAccountDDL,
          profileData,
          values,
          bankId: desData?.bankId,
        });
      }
    }
  );
};

// generate save payload
export const generateSavePayloadAndURL = (obj) => {
  // destrcuture
  const { values, profileData, customerReceivedRowData } = obj;
  // values
  const {
    viewType,
    poLC,
    sbu,
    bankName,
    bankAccount,
    paymentType,
    amount,
    paymentDate,
    remarks,
    marginType,
    beneficiary,
    poValue,
    lcType,
    margin,
    docValue,
    exchangeRate,
    partnerType,
    transaction,
    dueDate,
  } = values;

  let payload = {};

  // customer received payload
  if (viewType === 'customer received') {
    return customerReceivedRowData;
  } else if (viewType === 'income' || viewType === 'payment') {
    payload =
      // income, payment payload
      {
        actionBy: profileData?.userId,
        cashFlowType: viewType,
        businessUnitId: sbu?.value,
        bankName: bankName?.label,
        bankId: bankName?.value,
        bankAccountId: bankAccount?.value,
        bankAccountNo: bankAccount?.label,
        projectedAmount: +amount || 0,
        remarks: remarks || '',
        partnerType: partnerType?.label || '',
        transactionId: transaction?.value || 0,
        transactionName: transaction?.label || 0,
        dueDate: dueDate,
      };
  } else {
    payload =
      // import, income, payment payload
      {
        // global
        actionBy: profileData?.userId,
        cashFlowType: viewType,

        // common (import, income, payment, customer received)
        lcId: poLC?.lcId,
        lcNo: poLC?.lcNumber,
        purchaseOrderId: poLC?.poId,
        purchaseOrderNo: poLC?.poNumber,
        businessUnitId: sbu?.value,
        bankName: bankName?.label,
        bankId: bankName?.value,
        bankAccountId: bankAccount?.value,
        bankAccountNo: bankAccount?.label,
        paymentType: paymentType?.value,
        paymentDate: paymentDate,
        projectedAmount: +amount || 0,
        remarks: remarks || '',

        // margin & at sight payment
        marginTypeId: marginType?.value,
        marginTypeName: marginType?.label,

        // margin
        purchaseOrderAmount: +poValue || 0,

        // at sight payment
        lcTypeId: lcType?.value,
        lcTypeName: lcType?.label,
        lcMarginPercentage: +margin || 0,
        docValue: +docValue || 0,
        exchangeRate: +exchangeRate || 0,

        // payment & income
        partnerType: partnerType?.label || '',
        transactionId: transaction?.value || 0,
        transactionName: transaction?.label || 0,
        dueDate: dueDate,
        businessPartnerId: beneficiary?.value || 0,
        businessPartnerName: beneficiary?.label || '',
      };
  }

  return payload;
};

// import payment type
export const importPaymentType = [
  { value: 'Duty', label: 'Duty' },
  {
    value: 'At sight payment',
    label: 'At sight payment',
  },
  {
    value: 'Margin',
    label: 'Margin',
  },
];

// margin type ddl
export const marginTypeDDL = [
  { value: 1, label: 'Cash Margin' },
  { value: 2, label: 'Fdr Margin' },
];

// get po lc number
export const fetchPOLCNumber = (obj) => {
  const { profileData, buUnId, v } = obj;
  if (v?.length < 3) return [];
  return axios
    .get(
      `/imp/ImportCommonDDL/GetPONOLcNoforLCSummeryDDL?accountId=${profileData?.accountId}&businessUnitId=${buUnId}&searchTerm=${v}`
    )
    .then((res) => res?.data)
    .catch((err) => []);
};

// fetch transaction list
export const fetchTransactionList = (obj) => {
  const { v, profileData, values } = obj;
  if (v?.length < 3) return [];
  return axios
    .get(
      `/partner/BusinessPartnerPurchaseInfo/GetTransactionByTypeSearchDDL?AccountId=${
        profileData?.accountId
      }&BusinessUnitId=${
        values?.sbu?.value || 0
      }&Search=${v}&PartnerTypeName=${''}&RefferanceTypeId=${
        values?.partnerType?.reffPrtTypeId || 0
      }`
    )
    .then((res) => {
      return res?.data;
    })
    .catch((err) => []);
};

// fetch bank name ddl
export const fetchBankNameDDL = (obj) => {
  const { getBankNameDDL } = obj;

  getBankNameDDL(`/hcm/HCMDDL/GetBankDDL`);
};

// fetch bank account ddl
export const fetchBankAccountDDL = (obj) => {
  const { getBankAccountDDL, profileData, values, bankId } = obj;
  const { sbu } = values;

  getBankAccountDDL(
    `/imp/ImportCommonDDL/GetBankAccountIdNameDDL?AccountId=${
      profileData?.accountId
    }&BusinessUnitId=${sbu?.value}&BankId=${bankId || 0}`
  );
};

// landing page
// generateGetPCFLandingDataURL
export const generateGetPCFLandingDataURL = ({
  landingPageValues,
  createPageValues,
}) => {
  // destructure
  const { fromDate, toDate, sbu, paymentType } = landingPageValues;
  const { viewType } = createPageValues;

  // payment, income & import base url
  let paymentIncomeImportBaseURL = `/fino/FundManagement/GetProjectedCashFlow`;
  // payemnt income import params
  let paymentIncomeImportParams = `partName=GetProjectedCashFlow&businessUnitId=${sbu?.value}&fromDate=${fromDate}&toDate=${toDate}`;

  // customer received base url
  let customerReceivedBaseURL = `/fino/FundManagement/GetCustomerPaymentReceived`;
  // customer received params
  let customerReceivedParams = `partName=GetCustomerPaymentReceived&businessUnitId=${sbu?.value}&fromDate=${fromDate}&toDate=${toDate}`;

  switch (viewType) {
    case 'import': {
      paymentIncomeImportParams += `&cashFlowType=Import`;
      if (paymentType !== undefined) {
        paymentIncomeImportParams += `&paymentType=${`${paymentType?.value}`}`;
      }
      break;
    }
    case 'payment':
      paymentIncomeImportParams += `&cashFlowType=Payment`;
      break;
    case 'income':
      paymentIncomeImportParams += `&cashFlowType=Income`;
      break;
    default:
      break;
  }

  return `${
    viewType !== 'customer received'
      ? paymentIncomeImportBaseURL
      : customerReceivedBaseURL
  }?${
    viewType !== 'customer received'
      ? paymentIncomeImportParams
      : customerReceivedParams
  }`;
};

// landing show btn validation
export const landingShowBtnValidation = ({
  landingPageValues,
  createPageValues,
}) => {
  if (!landingPageValues?.sbu) {
    toast.warn('Please select sbu');
    return false;
  }

  if (
    createPageValues?.viewType === 'import' &&
    !landingPageValues?.paymentType
  ) {
    toast.warn('Please select payment type');
    return false;
  }

  return true;
};

// fetch PCF Landing Data
export const fetchPCFLandingData = (obj) => {
  // destructure
  const { getPCFLandingData, landingPageValues, createPageValues } = obj;

  // validation of form when show btn click
  if (!landingShowBtnValidation({ landingPageValues, createPageValues })) {
    return false; // Stop further execution if validation fails
  }

  try {
    // generate url
    const URL = generateGetPCFLandingDataURL({
      landingPageValues,
      createPageValues,
    });
    // api call
    getPCFLandingData(URL);

    // Optionally handle success feedback
    // toast.success("Data Fetched Successfully!");
    return true;
  } catch (e) {
    // Optionally handle error feedback
    toast.error('Please try again later.');
    return false;
  }
};

// import table header
export const columnsForImportLanding = [
  { header: 'SL', render: (_i, index) => index + 1 },
  { header: 'Payment Type', key: 'paymentType' },
  { header: 'Cash Flow Type', key: 'cashFlowType' },
  { header: 'LC No', key: 'lcNo' },
  { header: 'LC Type', key: 'lcTypeName' },
  { header: 'PO No', key: 'purchaseOrderNo' },
  { header: 'Bank Name', key: 'bankName' },
  { header: 'Bank Acc No', key: 'bankAccountNo' },
  { header: 'Business Partner Name', key: 'businessPartnerName' },
  {
    header: 'Margin',
    className: 'text-right',
    render: (item) => _formatMoney(item.lcMarginPercentage),
  },
  {
    header: 'Exchange Rate',
    className: 'text-right',
    render: (item) => _formatMoney(item.exchangeRate),
  },
  {
    header: 'PO Amount',
    className: 'text-right',
    render: (item) => _formatMoney(item.purchaseOrderAmount),
  },
  {
    header: 'DOC Value',
    className: 'text-right',
    render: (item) => _formatMoney(item.docValue),
  },
  {
    header: 'Amount',
    className: 'text-right',
    render: (item) => _formatMoney(item.projectedAmount),
  },
  {
    header: 'Payment Date',
    render: (item) => _dateFormatter(item.paymentDate),
  },
  { header: 'Action By', key: 'actionByUserName' },
];

// payment & income table header
export const paymentAndIncomeLanding = [
  { header: 'SL', render: (_i, index) => index + 1 },
  { header: 'Cash Flow Type', key: 'cashFlowType' },
  { header: 'Bank Name', key: 'bankName' },
  { header: 'Bank Acc No', key: 'bankAccountNo' },
  { header: 'Partner Type', key: 'partnerType' },
  { header: 'Transaction Name', key: 'transactionName' },
  {
    header: 'Amount',
    className: 'text-right',
    render: (item) => _formatMoney(item.projectedAmount),
  },
  { header: 'Due Date', render: (item) => _dateFormatter(item?.dueDate) },
  { header: 'Action By', key: 'actionByUserName' },
];

// customer received table header
export const customerReceivedLanding = [
  { header: 'SL', render: (_i, index) => index + 1 },
  {
    header: 'Business Unit',
    key: 'businessUnitName',
  },
  {
    header: 'Payment Date',
    key: 'paymentDate',
    className: 'text-center',
    render: (item) => _dateFormatter(item.paymentDate),
  },
  {
    header: 'Amount',
    key: 'receivedAmount',
    className: 'text-right',
    render: (item) => _formatMoney(item.receivedAmount),
  },
  {
    header: 'Action By',
    key: 'actionByUserName',
  },
];

// choose table header
export const chooseTableColumns = (viewType) => {
  switch (viewType) {
    case 'import':
      return columnsForImportLanding;
    case 'payment':
    case 'income':
      return paymentAndIncomeLanding;
    case 'customer received':
      return customerReceivedLanding;
    default:
      return columnsForImportLanding;
  }
};

// landing table init data
export const landingInitData = {
  sbu: '',
  paymentType: { value: 'Duty', label: 'Duty' },
  // fromDate: _monthFirstDate(),
  // toDate: _monthLastDate(),
  fromDate: _todayDate(), // temporary untill pagination
  toDate: _todayDate(), // temporary untill pagination
};

// customer received

// get total days of month
export const totalDaysOfMonth = (monthYear) => {
  // Extract the year and month from the input
  const [year, month] = getMonthAndYear(monthYear);
  return new Date(year, month, 0).getDate();
};

// get month & year of selected month
export const getMonthAndYear = (monthYear) => {
  return monthYear.split('-').map(Number);
};

// handle customer received row data generate
export const generateCustomerReceivedRowData = (obj) => {
  // destructure
  const { setCustomerReceivedRowData, values, profileData } = obj;

  // get toatal days of month
  const getRowDataNo = totalDaysOfMonth(values?.month);

  // get month & year
  const [year, month] = getMonthAndYear(values?.month);

  if (getRowDataNo > 0) {
    const newCustomerReceivedData = Array.from(
      { length: getRowDataNo },
      (_, index) => ({
        businessUnitName: values?.sbu?.label,
        businessUnitId: values?.sbu?.value,
        receivedAmount: 0,
        actionBy: profileData?.userId,
        paymentDate: new Date(year, month - 1, index + 1).toLocaleDateString(),
        remarks: '',
      })
    );

    setCustomerReceivedRowData((prevState) => {
      return [...prevState, ...newCustomerReceivedData];
    });
  }
};

// all object for landing sbu
export const allObjSBU = { value: 0, label: 'All' };
