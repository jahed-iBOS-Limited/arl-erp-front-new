import Axios from 'axios';
import { toast } from 'react-toastify';
import { _dateFormatter } from '../../../_helper/_dateFormate';
export const empAttachment_action = async (attachment, cb) => {
  let formData = new FormData();
  attachment.forEach((file) => {
    formData.append('files', file?.file);
  });
  try {
    let { data } = await Axios.post('/domain/Document/UploadFile', formData, {
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

// Get Landing Data for Shipping Charges
export const GetLandingData = async (
  accId,
  buId,
  pageNo,
  pageSize,
  searchValue,
  setter,
) => {
  try {
    const res = await Axios.get(
      `/imp/ShippingCharge/GetShippingChargeLandingPasignation?shipmentId=${searchValue}&accountId=${accId}&businessUnitId=${buId}&pageSize=${pageSize}&pageNo=${pageNo}&viewOrder=asc`,
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
};

// Get Shipping Charge List
export const GetShippingChargeList = async (accId, buId, setter) => {
  try {
    const res = await Axios.get(
      `/imp/ShippingCharge/GetShippingChargeList?accountId=${accId}&businessUnitId=${buId}`,
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
};

// Get Single Data By Id
export const GetSingleData = async (id, setter) => {
  try {
    const res = await Axios.get(
      `/imp/ShippingCharge/GetShipmentById?shippingChargeId=${id}`,
    );
    if (res.status === 200 && res?.data) {
      const data =
        // res?.data?.map((item) => ({
        {
          billNo: res?.data?.billNo,
          description: res?.data?.description,
          instrument: {
            value: res?.data?.instrumentId,
            label: res?.data?.instrumentId,
          },
          payBank: {
            value: res?.data?.payBankId,
            label: res?.data?.payBankName,
          },
          deliveryDate: _dateFormatter(res?.data?.deliveryDate),
          amountBDT: res?.data?.amount,
          demurrage: res?.data?.demurrageAmount,
          total: res?.data?.totalAmount,
          shippingLine: {
            value: res?.data?.shippingLineId,
            label: res?.data?.shippingLineId,
          },
          agent: {
            value: res?.data?.forwarderName,
            label: res?.data?.forwarderName,
          },
          arivalDate: _dateFormatter(res?.data?.arivalDate),
          shipment: {
            value: res?.data?.shipmentId,
            label: res?.data?.shipmentId,
          },
          paymentDate: _dateFormatter(res?.data?.paymentDate),
        };
      // }));
      setter(data);
    }
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
};

//Agent DDL
export const GetAgentDDL = async (accId, buId, setter) => {
  try {
    const res = await Axios.get(
      `/imp/ImportCommonDDL/ShippingAgentNameDDL?accountId=${accId}&businessUnitId=${buId}`,
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
};

//Get Shipment DDL
export const GetShipmentDDL = async (accId, buId, setter) => {
  try {
    const res = await Axios.get(
      `/imp/ImportCommonDDL/GetShipmentDDL?accountId=${accId}&businessUnitId=${buId}`,
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
};

//Get Shipping Line DDL
export const GetShippingLineDDL = async (accId, buId, setter) => {
  try {
    const res = await Axios.get(
      `/imp/ImportCommonDDL/GetShippingLineDDL?accountId=${accId}&businessUnitId=${buId}`,
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
};

//Get Bank List DDL
export const GetBankListDDL = async (setter) => {
  try {
    const res = await Axios.get(`/imp/ImportCommonDDL/GetBankListDDL`);
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
};

// Create Shipping Charges
export const CreateShippingCharge = async (
  payload,
  cb,
  accId,
  buId,
  emId,
  uploadImage,
  GetShippingChargeList,
) => {
  const data = dataSetForCreate(payload, accId, buId, emId, uploadImage);
  try {
    const res = await Axios.post(
      `/imp/ShippingCharge/CreateShippingCharge`,
      data,
    );
    if (res.status === 200 && res?.data) {
      toast.success('Create successfully');
      GetShippingChargeList();
      cb();
    }
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
};

const dataSetForCreate = (values, accId, buId, emId, uploadImage) => {
  const payload = {
    accountId: accId,
    businessUnitId: buId,
    poNumber: values?.shipment?.poNumber || 1,
    lcNumber: values?.shipment?.lcNumber,
    shipmentId: values?.shipment?.value,
    shippingLineId: values?.shippingLine?.value || 0,
    forwarderId: values?.agent?.value || 0,
    arivalDate: values?.arivalDate,
    billNo: values?.billNo,
    description: values?.description,
    deliveryDate: values?.deliveryDate,
    instrumentId: values?.instrument?.value || 2,
    payBankId: values?.payBank?.value,
    amount: values?.amountBDT,
    demurrageAmount: values?.demurrage,
    totalAmount: values?.total,
    paymentDate: values?.paymentDate,
    shippingDocumentId: uploadImage[0]?.id,
    actionBy: emId,
  };
  return payload;
};

// Save Edited Data for Shipping Charges
export const EditShippingCharge = async (
  payload,
  cb,
  accId,
  buId,
  emId,
  pid,
) => {
  const data = dataSetForEdit(payload, accId, buId, emId, pid);
  try {
    const res = await Axios.put(`/imp/ShippingCharge/EditShippingCharge`, data);
    if (res.status === 200 && res?.data) {
      toast.success('Updated successfully');
      // cb();
    }
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
};

const dataSetForEdit = (values, accId, buId, emId, pid) => {
  const payload = {
    shippingChargeId: pid,
    arivalDate: values?.arivalDate,
    description: values?.description,
    deliveryDate: values?.deliveryDate,
    instrumentId: values?.instrument?.value || 0,
    payBankId: values?.payBank?.value,
    amount: values?.amountBDT,
    demurrageAmount: values?.demurrage,
    totalAmount: values?.total,
    paymentDate: values?.paymentDate,
    shippingDocumentId: 'string',
    actionBy: emId,
  };
  return payload;
};
