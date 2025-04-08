import Axios from 'axios';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import { _dateFormatter } from '../../../_helper/_dateFormate';

export function removeDaysToDate(date, days) {
  let res = new Date(date);
  res.setDate(res.getDate() - days);
  return res;
}
export const marginTypeDDLArr = [
  { value: 1, label: 'Cash Margin' },
  { value: 2, label: 'Fdr Margin' },
];

//get single data;
export const getSingleData = async (id, setter, setDisabled) => {
  setDisabled(true);
  try {
    const res = await Axios.get(
      `/imp/LetterOfCredit/GetLetterOfCreditById?LCId=${id}`
    );
    setDisabled(false);
    const payload = {
      PIAmountBDT: res?.data?.numTotalPiamountBDT,
      poId: res?.data?.poId,
      exchangeRate: res?.data?.numExchangeRate,
      PIAmountFC: res?.data?.numTotalPiamountFC,
      accountId: res?.data?.accountId,
      lastActionBy: res?.data?.lastActionBy,
      businessUnit: {
        value: res?.data?.businessUnitId,
        label: res?.data?.businessUnitName,
      },
      lcid: res?.data?.lcid,
      subPonumber: res?.data?.subPonumber,
      lcNo: res?.data?.lcnumber,
      lcDate: _dateFormatter(res?.data?.dteLcdate),
      lastShipmentDate: _dateFormatter(res?.data?.dteLastShipmentDate),
      lcExpiredDate: _dateFormatter(res?.data?.dteLcexpireDate),
      encoTerms: {
        value: res?.data?.incoTerms,
        label: res?.data?.incoTermsName,
      },
      materialType: {
        value: res?.data?.materialTypeId,
        label: res?.data?.materialTypeName,
      },
      lcType: { value: res?.data?.lctypeId, label: res?.data?.lctypeName },
      origin: { value: res?.data?.originId, label: res?.data?.originName },
      loadingPort: res?.data?.loadingPortName,
      finalDestination: {
        value: res?.data?.finalDestinationId,
        label: res?.data?.finalDestination,
      },
      tolarance: res?.data?.numTolarance,
      currency: {
        label: res?.data?.currencyName,
        value: res?.data?.currencyId,
      },
      totalPIAmount: res?.data?.numTotalPiamount,
      lcTenor: res?.data?.lcTenor,
      pgAmount: res?.data?.numPgamount,
      pgDueDate: _dateFormatter(res?.data?.dtePgdueDate),
      totalBankCharge: res?.data?.totalBankCharge,
      vatOnCharge: res?.data?.vatOnBankCharge,
      attachment: res?.data?.openingLcdocumentId,
      indemnityBond: res?.data?.indemnityBond,
      bondLicense: res?.data?.bondLicense,
      duration: _dateFormatter(res?.data?.duration),
      poNo: res?.data?.ponumber,
      dueDate: _dateFormatter(res?.data?.dueDate),
      bankName: {
        label: res?.data?.bankName,
        value: res?.data?.bankId,
      },
      bankAccount: res?.data?.bankAccountNo
        ? {
            value: res?.data?.bankAccountId,
            label: res?.data?.bankAccountNo,
          }
        : '',
      description: res?.data?.description,
      lcMarginValue: res?.data?.lcMarginValue || '',
      lcMarginDueDate: res?.data?.lcMarginDueDate
        ? _dateFormatter(res?.data?.lcMarginDueDate)
        : '',
    };

    setter(payload);
  } catch (error) {
    setDisabled(false);
    toast.error(error?.response?.data?.message);
  }
};
//Dropdown loading finish

export const validationSchema = Yup.object().shape({
  // poNo: Yup.object().shape({
  //   value: Yup.string().required("PO No is required"),
  // }),
  lcNo: Yup.string().required('LC No is required'),
  encoTerms: Yup.object().shape({
    value: Yup.string().required('Enco Terms is required'),
  }),
  materialType: Yup.object().shape({
    value: Yup.string().required('Material Type is required'),
  }),
  lcType: Yup.object().shape({
    value: Yup.string().required('LC Type is required'),
  }),
  bankName: Yup.object().shape({
    value: Yup.string().required('Bank Name is required'),
  }),
  // bankAccount: Yup.object().shape({
  //   value: Yup.string().required("Bank Account is required"),
  //   label: Yup.string().required("Bank Account is required"),
  // }),
  origin: Yup.object().shape({
    value: Yup.string().required('Origin is required'),
  }),
  loadingPort: Yup.string().required('Loading Port is required'),
  finalDestination: Yup.object().shape({
    value: Yup.string().required('Final Destination is required'),
  }),
  // tolarance: Yup.number()
  //   .positive("Tolarance Must Be Positive")
  //   .required("Tolarance is required"),
  currency: Yup.object().shape({
    value: Yup.string().required('Currency is required'),
  }),

  PIAmountFC: Yup.string()
    // .positive("PI Amount Must Be Positive")
    .required('PI Amount is required'),

  lcTenor: Yup.number()
    .integer('Must be Integer Number')
    .positive('LC Tenor is positive'),
  exchangeRate: Yup.number().required('Exchange Rate is required'),
  PIAmountBDT: Yup.string().required('PI Amount BDT Number is required'),
  // pgAmount: Yup.number().positive("PG Amount is always positive"),
  pgDueDate: Yup.date(),
  totalBankCharge: Yup.number()
    .positive('Total bank Charge is always positive')
    .required('Total Bank Charge is Required'),
  vatOnCharge: Yup.number()
    .positive('VAT On Charge is always positive')
    .required('VAT On Charge is Required'),
  // duration: Yup.date().required("Duration Date is required"),
  // lcMarginPercent: Yup.number()
  //   .required("LC Margin is required"),
  lcMarginValue: Yup.number().required('LC Margin Value is required'),
  lcMarginDueDate: Yup.date().required('LC Margin Due Date is required'),
  marginType: Yup.object().shape({
    value: Yup.string().required('Margin type is required'),
  }),
  numInterestRate: Yup.number()
    .min(0, 'Must be above 0')
    .max(100, 'Must be below 100'),
});
