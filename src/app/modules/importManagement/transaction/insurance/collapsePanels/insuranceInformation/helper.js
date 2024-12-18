import axios from 'axios';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { _dateFormatter } from '../../../../../_helper/_dateFormate';
import numberWithCommas from '../../../../../_helper/_numberWithCommas';
import { _formatMoney } from '../../../../../_helper/_formatMoney';

export const empAttachment_action = async (attachment, cb) => {
  let formData = new FormData();
  attachment.forEach((file) => {
    formData.append('files', file?.file);
  });
  try {
    let { data } = await axios.post('/domain/Document/UploadFile', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    // toast.success(res?.data?.message || "Submitted Successfully");
    toast.success('Upload  successfully');
    return data;
  } catch (error) {
    toast.error('Document not upload');
  }
};

// GetInsuranceTypeDDL
export const GetInsuranceTypeDDL = async (setter) => {
  try {
    const res = await axios.get('/imp/ImportCommonDDL/GetShipmentTypeDDL');
    if (res.status === 200 && res.data) {
      setter(res.data);
    }
  } catch (error) {}
};

// GetProviderDDL
export const GetProviderDDL = async (accId, buId, setter) => {
  try {
    const res = await axios.get(
      `/imp/ImportCommonDDL/GetProviderDDL?accountId=${accId}&businessUnitId=${buId}`,
    );

    if (res.status === 200 && res.data) {
      setter(res.data);
    }
  } catch (error) {}
};

// Get Currency Type DDL
export const GetCurrencyTypeDDL = async (setter) => {
  try {
    const res = await axios.get('/imp/ImportCommonDDL/GetCurrencyTypeDDL');

    if (res.status === 200 && res.data) {
      setter(res.data);
    }
  } catch (error) {}
};

// Get Insurance Coverage DDL
export const GetInsuranceCoverageDDL = async (setter) => {
  try {
    const res = await axios.get('/imp/ImportCommonDDL/GetInsuranceCoverageDDL');

    if (res.status === 200 && res.data) {
      setter(res.data);
    }
  } catch (error) {}
};

// Get Payment Type DDL
export const GetPaymentTypeDDL = async (setter) => {
  try {
    const res = await axios.get('/imp/ImportCommonDDL/GetPaymentTypeDDL');

    if (res.status === 200 && res.data) {
      setter(res.data);
    }
  } catch (error) {}
};

export const CreateInsuranceCoverNote = async (data, cb) => {
  try {
    const res = await axios.post(
      '/imp/InsurancePolicy/CreateInsuranceInformation',
      data,
    );
    if (res.status === 200 && res.data) {
      toast.success(res.message || 'Submitted  successfully');
      cb();
    }
  } catch (error) {
    toast.error(error.response.data.message);
  }
};

// Edit Cover Note Insurance Information
export const EditInstanceCoverNote = async (data, cb) => {
  try {
    const res = await axios.put(
      '/imp/InsurancePolicy/EditInsuranceCoverNote',
      data,
    );
    if (res.status === 200 && res.data) {
      toast.success(res.message || 'Updated  successfully');
      // cb();
    }
  } catch (error) {
    toast.error(error.response.data.message);
  }
};

//  Get Cover Note By Id
export const GetInsuranceCoverNoteById = async (id, setter) => {
  try {
    const res = await axios.get(
      `/imp/InsurancePolicy/GetinsuranceCoverNoteById?insuranceCoverNoteId=${id}`,
    );
    if (res.status === 200 && res.data) {
      const data = {
        poNo: res.data.poNumber,
        coverNoteDocumentId: res?.data?.coverNoteDocumentId,
        coverage: {
          value: res?.data?.coverageId,
          label: res?.data?.coverageName,
        },
        shipmentType: {
          label: res?.data?.insuranceTypeName,
          value: res?.data?.insuranceTypeId,
        },
        provider: {
          label: res?.data?.providerName,
          value: res?.data?.providerId,
        },
        paymentBy: {
          label: res?.data?.paymentByName,
          value: res?.data?.paymentById,
        },
        currency: {
          label: res?.data?.currencyName,
          value: res?.data?.currencyId,
        },
        insuranceDate: _dateFormatter(res?.data?.dteInsuranceDate),
        coverNoteNumber: res?.data?.coverNoteNumber,
        PIAmountFC: numberWithCommas(res?.data?.numPiAmountFC),
        PIAmountFCNumber: res?.data?.numPiAmountFC,
        // currency: res?.data?.currencyName,
        // currencyId: res?.data?.currencyId,
        exchangeRate: res?.data?.numExchangeRate,
        PIAmountBDT: numberWithCommas(res?.data?.numPIAmountBDT),
        PIAmountBDTNumber: res?.data?.numPIAmountBDT,
        insuredAmount: res?.data?.numInsuredAmount,
        total: res?.data?.numTotalAmount,
        vat: res?.data?.numVatamount,
        attachment: res?.data?.coverNoteDocumentId,
        prefix: res?.data?.providerPolicyPrefix,
        dueDate: _dateFormatter(res?.data?.dueDate),
      };
      setter(data);
    }
  } catch (error) {
    toast.error(error.response.data.message);
  }
};

// Check PO No validation
export const ValidatePoNo = async (
  accId,
  buId,
  PoNo,
  setter,
  GetCurrencyByPO,
) => {
  try {
    const res = await axios.get(
      `/imp/ImportCommonDDL/GetPOCheck?accountId=${accId}&businessUnitId=${buId}&PONo=${PoNo}`,
    );
    if (res?.status === 200 && res?.data) {
      if (res?.data === 'PO number is valid') {
        GetCurrencyByPO();
      } else {
        setter(res?.data);
      }
    }
  } catch (error) {
    toast.error(error.response.data.message);
  }
};

export const getDataByPoNo = async (accId, buId, PoNo, setter) => {
  try {
    const res = await axios.get(
      `/imp/InsurancePolicy/GetinsuranceCoverNoteByPONumber?accountId=${accId}&businessUnitId=${buId}&poNumber=${PoNo}`,
    );
    if (res?.status === 200) {
      const data = [
        {
          poNo: res.data.poNumber,
          coverage: {
            value: res?.data?.coverageId,
            label: res?.data?.coverageName,
          },
          shipmentType: {
            label: res?.data?.insuranceTypeName,
            value: res?.data?.insuranceTypeId,
          },
          provider: {
            label: res?.data?.providerName,
            value: res?.data?.providerId,
          },
          paymentBy: {
            label: res?.data?.paymentByName,
            value: res?.data?.paymentById,
          },
          insuranceDate: _dateFormatter(res?.data?.dteInsuranceDate),
          coverNoteNumber: res?.data?.coverNoteNumber,
          PIAmountFC: numberWithCommas(res?.data?.numPiAmountFC),
          PIAmountFCNumber: res?.data?.numPiAmountFC,
          currency: res?.data?.currencyName,
          currencyId: res?.data?.currencyId,
          exchangeRate: res?.data?.numExchangeRate,
          PIAmountBDT: numberWithCommas(res?.data?.numPIAmountBDT),
          PIAmountBDTNumber: res?.data?.numPIAmountBDT,
          insuredAmount: res?.data?.numInsuredAmount,
          total: res?.data?.numTotalAmount,
          vat: res?.data?.numVatamount,
          attachment: res?.data?.coverNoteDocumentId,
          prefix: res?.data?.providerPolicyPrefix,
          dueDate: _dateFormatter(res?.data?.dueDate),
        },
      ];
      setter(data);
    }
  } catch (error) {
    setter([]);
    // toast.error(error.response.data.message);
  }
};

// Get Currency By PONo
export const GetCurrencyByPO = async (
  accId,
  buId,
  PoNo,
  setter,
  initialValue,
  setDataByPO,
) => {
  try {
    const res = await axios.get(
      `/imp/ImportCommonDDL/GetCurrencyByPO?accountId=${accId}&businessUnitId=${buId}&PONo=${PoNo}`,
    );
    setter({
      ...initialValue,
      currency: {
        value: res?.data?.currencyId,
        label: res?.data?.currencyName,
      },
      exchangeRate: res?.data?.currencyName === 'Taka' ? 1 : '',
      PIAmountBDT:
        res?.data?.currencyName === 'Taka'
          ? _formatMoney(res?.data?.piAmountFC)
          : '',
      PIAmountFC: _formatMoney(res?.data?.piAmountFC),
      poId: res?.data?.poId,
    });
    setDataByPO(res?.data);
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
};

//calculation form landing api;
export const getCalculationFormLandingForm = async (accId, values, setter) => {
  try {
    const res = await axios.get(
      `/imp/FormulaForCalculation/GetFormulaCalculationForInsurance?accountId=${accId}&businessPartnerId=${values?.provider?.value}&shipmentTypeId=${values?.shipmentType?.value}&PIBDT=${values?.PIAmountBDT}`,
    );
    if (res?.status === 200 && res?.data) {
      setter({
        insuredAmount: res?.data?.insuredAmount,
        insuredAddRate: res?.data?.insuredAddRate,
        premium: res?.data?.premium,
        stamp: res?.data?.stamp,
        vat: res?.data?.vat,
        discountOnCommision: res?.data?.discountOnCommision,
        netPaid: res?.data?.netPaid,
        accountId: res?.data?.accountId,
        businessPartnerId: res?.data?.businessPartnerId,
        shipmentTypeId: res?.data?.shipmentTypeId,
      });
    }
  } catch (error) {
    toast.error("Total Amount Can't Be 0");
  }
};

// validation Schema for insurance cover note
export const validationSchema = Yup.object().shape({
  poNo: Yup.string().required('PO No is required'),
  coverage: Yup.object().shape({
    label: Yup.string().required('Coverage is required'),
    value: Yup.string().required('Coverage is required'),
  }),
  shipmentType: Yup.object().shape({
    label: Yup.string().required('Shipment Type is required'),
    value: Yup.string().required('Shipment Type is required'),
  }),
  provider: Yup.object().shape({
    label: Yup.string().required('Provider is required'),
    value: Yup.string().required('Provider is required'),
  }),
  paymentBy: Yup.object().shape({
    label: Yup.string().required('Payment By is required'),
    value: Yup.string().required('Payment By is required'),
  }),
  insuranceDate: Yup.string().required('Date is required'),
  coverNoteNumber: Yup.string().required('Cover note number is required'),
  exchangeRate: Yup.number().required('Exchange Rate is required'),
  total: Yup.number()
    .positive()
    .required('Total Amount is required'),
  vat: Yup.number().required('VAT is required'),
});
