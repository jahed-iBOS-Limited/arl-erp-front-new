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