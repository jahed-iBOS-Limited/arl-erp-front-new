import * as Yup from 'yup';

export const ReceiveValidationSchema = Yup.object().shape({
  bankAcc: Yup.object().shape({
    label: Yup.string().required('Bank Account is required'),
    value: Yup.string().required('Bank Account is required'),
  }),
  receiveFrom: Yup.string().required('Receive from is required'),
  instrumentType: Yup.object().shape({
    label: Yup.string().required('Instrument type is required'),
    value: Yup.string().required('Instrument type is required'),
  }),
  instrumentNo: Yup.string().required('Instrument no is required'),
  instrumentDate: Yup.string().required('Instrument date is required'),
  headerNarration: Yup.string().required('Narration is required'),
  placingDate: Yup.string().required('Placing date is required'),
});

export const PaymentValidationSchema = Yup.object().shape({
  bankAcc: Yup.object().shape({
    label: Yup.string().required('Bank Account is required'),
    value: Yup.string().required('Bank Account is required'),
  }),
  instrumentType: Yup.object().shape({
    label: Yup.string().required('Instrument type is required'),
    value: Yup.string().required('Instrument type is required'),
  }),
  paidTo: Yup.string().required('Paid to is required'),
  instrumentNo: Yup.string().required('Instrument no is required'),
  instrumentDate: Yup.string().required('Instrument date is required'),
  headerNarration: Yup.string().required('Header narration is required'),
});

export const TransferValidationSchema = Yup.object().shape({
  bankAcc: Yup.object().shape({
    label: Yup.string().required('Bank Account is required'),
    value: Yup.string().required('Bank Account is required'),
  }),
  transferTo: Yup.object().shape({
    label: Yup.string().required('Transfer to is required'),
    value: Yup.string().required('Transfer to is required'),
  }),
  sendToGLBank: Yup.object().shape({
    label: Yup.string().required('GL/BL is required'),
    value: Yup.string().required('GL/BL is required'),
  }),
  instrumentType: Yup.object().shape({
    label: Yup.string().required('Instrument type is required'),
    value: Yup.string().required('Instrument type is required'),
  }),
  transferAmount: Yup.string().required('Amount is required'),
  instrumentNo: Yup.string().required('Instrument no is required'),
  instrumentDate: Yup.date().required('Instrument date is required'),
  headerNarration: Yup.string().required('Header narration is required'),
});

export const complainValidationSchema = Yup.object().shape({
  occurrenceDate: Yup.date().required('Occurrence Date is required'),
  respondentType: Yup.object().shape({
    label: Yup.string().required('Respondent Type is required'),
    value: Yup.string().required('Respondent Type is required'),
  }),
  respondentName: Yup.object().when('respondentType.value', {
    is: (value) => value !== '4',
    then: Yup.object().shape({
      label: Yup.string().required('Field is required'),
      value: Yup.string().required('Field is required'),
    }),
  }),
  respondentBusinessUnit: Yup.object().shape({
    label: Yup.string().required('Respondent BusinessUnit is required'),
    value: Yup.string().required('Respondent BusinessUnit is required'),
  }),
  respondentContact: Yup.string()
    .required('Respondent Contact is required')
    .matches(/^[0-9]+$/, 'Must be only number'),
  issueType: Yup.object().shape({
    label: Yup.string().required('Issue Type is required'),
    value: Yup.string().required('Issue Type is required'),
  }),
  issueSubType: Yup.object().shape({
    label: Yup.string().required('Sub Issue Type is required'),
    value: Yup.string().required('Sub Issue Type is required'),
  }),
  issueDetails: Yup.string().required('Issue Details is required'),
  respondent: Yup.string().required('Respondent Name is required'),
});
export const bankJournalValidationSchema = Yup.object().shape({
  controllingUnitCode: Yup.string()
    .min(2, 'Minimum 2 symbols')
    .max(100, 'Maximum 100 symbols')
    .required('Code is required'),
  sbu: Yup.object().shape({
    label: Yup.string().required('SBU is required'),
    value: Yup.string().required('SBU is required'),
  }),
  accountingJournalTypeId: Yup.object().shape({
    label: Yup.string().required('Journal Type is required'),
    value: Yup.string().required('Journal Type is required'),
  }),
});
export const loanRegisterSchema = Yup.object().shape({
  account: Yup.object().shape({
    label: Yup.string().required('Bank is required'),
    value: Yup.string().required('Bank is required'),
  }),
  instrumentNo: Yup.string().required('Instrument No is required'),
});

export const vslAndVoyNoValidationSchema = Yup.object().shape({
  vesselName: Yup.object().shape({
    label: Yup.string().required('Vessel Name is required'),
    value: Yup.string().required('Vessel Name is required'),
  }),
  voyageNo: Yup.object().shape({
    label: Yup.string().required('Voyage No is required'),
    value: Yup.string().required('Voyage No is required'),
  }),
});
export const ProductEditSchema = Yup.object().shape({
  accountName: Yup.string()
    .min(2, 'Minimum 0 range')
    .max(1000, 'Maximum 1000 range')
    .required('Account Name is required'),
  accountNo: Yup.string()
    .min(2, 'Minimum 2 range')
    .required('Account No is required'),
  bankName: Yup.object().shape({
    label: Yup.string().required('Bank is required'),
    value: Yup.string().required('Bank is required'),
  }),
  branchName: Yup.object().shape({
    label: Yup.string().required('Bank is required'),
    value: Yup.string().required('Bank is required'),
  }),
  routingNo: Yup.string()
    .min(2, 'Minimum 0 range')
    .required('Routing No is required'),
});

export const dataValidationSchema = Yup.object().shape({
  attribute: Yup.object().shape({
    label: Yup.string().required('Attribute is required'),
    value: Yup.string().required('Attribute is required'),
  }),
  uom: Yup.object().shape({
    label: Yup.string().required('Uom is required'),
    value: Yup.string().required('Uom is required'),
  }),
  value: Yup.string().required('Value is required'),
});

export const ChangePassValidationSchema = Yup.object().shape({
  oldPassword: Yup.string()
    .min(6, 'Minimum 6 symbols')
    .max(50, 'Maximum 100 symbols')
    .required('Old Password required'),
  newPassword: Yup.string()
    .min(6, 'Minimum 6 symbols')
    .max(50, 'Maximum 100 symbols')
    .required('New Password required'),
  confirmPassowrd: Yup.string()
    .min(6, 'Minimum 6 symbols')
    .max(50, 'Maximum 100 symbols')
    .required('Confirm Password required')
    .when('newPassword', {
      is: (val) => (val && val.length > 0 ? true : false),
      then: Yup.string().oneOf(
        [Yup.ref('newPassword')],
        'Both password need to be the same'
      ),
    }),
});
export const unloadingChargesValidationSchema = Yup.object().shape({
  receiversName: Yup.string().required('Driver/Receive Name is required'),
  contactNo: Yup.string()
    .required('Contact no is required')
    .matches(/^[0-9]+$/, 'Must be only digits')
    .min(11, 'Must be exactly 11 digits')
    .max(11, 'Must be exactly 11 digits'),
  remarks: Yup.string().required('Remarks is required'),
});
