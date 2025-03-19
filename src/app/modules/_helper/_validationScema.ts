import * as Yup from 'yup';

export const ReceivevalidationSchema = Yup.object().shape({
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

export const PaymentvalidationSchema = Yup.object().shape({
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