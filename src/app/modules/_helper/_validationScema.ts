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
    // respondentName: Yup.object().shape({
    //   label: Yup.string().required("Field is required"),
    //   value: Yup.string().required("Field is required"),
    // }),
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
        .min(2, "Minimum 2 symbols")
        .max(100, "Maximum 100 symbols")
        .required("Code is required"),
    sbu: Yup.object().shape({
        label: Yup.string().required("SBU is required"),
        value: Yup.string().required("SBU is required"),
    }),
    accountingJournalTypeId: Yup.object().shape({
        label: Yup.string().required("Journal Type is required"),
        value: Yup.string().required("Journal Type is required"),
    }),
});
export const loanRegisterSchema = Yup.object().shape({
    account: Yup.object().shape({
        label: Yup.string().required('Bank is required'),
        value: Yup.string().required('Bank is required'),
    }),
    instrumentNo: Yup.string().required('Instrument No is required'),
});
