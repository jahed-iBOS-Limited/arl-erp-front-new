import axios from 'axios';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import { _dateFormatter } from '../../../../../_helper/_dateFormate';

// GetShipTypeDDL
export const getShipByDDL = async (setter) => {
  try {
    const res = await axios.get('/imp/ImportCommonDDL/GetShipmentTypeDDL');
    if (res.status === 200 && res.data) {
      setter(res.data);
    }
  } catch (error) {}
};

export const empAttachment_action = async (attachment) => {
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

    return [];
  }
};

export const createShipment = async (payload, cb, setDisabled) => {
  setDisabled && setDisabled(true);
  try {
    const res = await axios.post(`/imp/Shipment/CreateShipment`, payload);

    setDisabled && setDisabled(false);
    toast.success(res.data.message);
    cb();
  } catch (error) {
    setDisabled && setDisabled(false);
    toast.error(error?.response?.data?.message);
  }
};

export const getShipmentItemDDL = async (
  accId,
  buId,
  poNo,
  setter,
  InitialInvoiceAmountHandler,
) => {
  try {
    const res = await axios.get(
      `/imp/ImportCommonDDL/GetItemInfoForShipmentDDL?accountId=${accId}&businessUnitId=${buId}&PONo=${poNo}`,
    );
    if (res.status === 200 && res.data) {
      const item = res?.data.map((data) => {
        return {
          shipmentId: 1,
          accountId: accId,
          businessUnitId: buId,
          itemId: data.itemId,
          itemName: data.itemName,
          itemCode: data.itemCode,
          hscode: data.hscode,
          poquantity: data.poquantity,
          addedQuantity: data.addedQty,
          rate: data.rate,
          shippedQuantity:
            Number(data.poquantity) - Number(data?.addedQty) > 0
              ? Number(data.poquantity) - Number(data?.addedQty)
              : 0,
          totalQuantity: Number(data.poquantity),
          uomName: data?.uomName,
          uomId: data?.uomId,
        };
      });
      setter(item);
      InitialInvoiceAmountHandler && InitialInvoiceAmountHandler(item);
    }
  } catch (error) {}
};

export const getCurrencyDDL = async (setter) => {
  try {
    const res = await axios.get('/imp/ImportCommonDDL/GetCurrencyTypeDDL');
    if (res.status === 200 && res.data) {
      setter(res.data);
    }
  } catch (error) {}
};
// https://localhost:44396/imp/Shipment/GetTolerance?accountId=2&businessUnitId=164&search=lc-001
export const getTollarence = async (
  accountId,
  businessUnitId,
  searchValue,
  setter,
) => {
  try {
    const res = await axios.get(
      `/imp/Shipment/GetTolerance?accountId=${accountId}&businessUnitId=${businessUnitId}&search=${searchValue}`,
    );
    if (res.status === 200 && res.data) {
      setter(res.data.tolerancePercent);
    }
  } catch (error) {}
};
// https://localhost:44396/imp/Shipment/GetShipmentInfoByPoNumber?accountId=2&businessUnitId=164&poNumber=PO-420088
export const getShipmentInfo = async (
  accountId,
  businessUnitId,
  searchValue,
  initFormData,
  setter,
) => {
  try {
    const res = await axios.get(
      `/imp/Shipment/GetShipmentInfoByPoNumber?accountId=${accountId}&businessUnitId=${businessUnitId}&poNumber=${searchValue}`,
    );
    if (res.status === 200 && res.data) {
      setter({
        ...initFormData,
        ...res.data,
        shipByName: res?.data?.shipmentTypeName,
        shipById: res?.data?.shipmentTypeId,
        Currency: res?.data?.currencyName,
        currencyId: res?.data?.currencyId,
      });
    }
  } catch (error) {}
};

export const getShipmentLandingData = async (
  accId,
  buId,
  pageSize,
  pageNo,
  setter,
  search,
  fromDate,
  toDate,
) => {
  try {
    const searchTerm = search ? search : '';
    const FromDate = fromDate ? fromDate : '';
    const ToDate = toDate ? toDate : '';

    const res = await axios.get(
      `/imp/Shipment/GetShipmentLandingPasignation?searchTerm=${searchTerm}&accountId=${accId}&businessUnitId=${buId}&fromDate=${FromDate}&toDate=${ToDate}&pageSize=${pageSize}&pageNo=${pageNo}&viewOrder=desc`,
    );
    setter(res.data);
  } catch (error) {}
};

export const getShipmentDataById = async (
  shipmentId,
  headerSetter,
  rowSetter,
  setTollerence,
) => {
  try {
    const res = await axios.get(
      `/imp/Shipment/GetShipmentById?shipmentId=${shipmentId}`,
    );
    const response = res.data;
    if (res.status === 200 && res.data) {
      // localStorage.setItem('poNumber', response?.objHeader?.ponumber)
      const header = {
        ...response?.objHeader,
        shipById: response?.objHeader?.shipById,
        shipByName: response?.objHeader?.shipByName,
        blAwbTrNo: response?.objHeader?.shipByNumber,
        blAwbTrDate: _dateFormatter(response?.objHeader?.shippingDate),
        // currency:{value: response?.objHeader?.currencyId, label: response?.objHeader?.currencyName},
        invoiceNumber: response?.objHeader?.invoiceNumber,
        invoiceAmount: response?.objHeader?.invoiceAmount,
        invoiceDate: _dateFormatter(response?.objHeader?.invoiceDate),
        vasselName: response?.objHeader?.vasselName,
        docReceiveByBank: _dateFormatter(response?.objHeader?.docReceiveByBank),
        packingCharge: response?.objHeader?.packingCharge,
        freightCharge: response?.objHeader?.freightCharge,
        ataDate: _dateFormatter(response?.objHeader?.dteAta),
        etaDate: _dateFormatter(response?.objHeader?.dteEta),
        dueDate: _dateFormatter(response?.objHeader?.dueDate),
        currency: response?.objHeader?.currencyName,
        cnfProvider: {
          value: response?.objHeader?.cnFPartnerId,
          label: response?.objHeader?.cnFPartnerName,
        },
        shipmentDocumentId: response?.objHeader?.shipmentDocumentId,
      };
      headerSetter(header);
      setTollerence(response?.objHeader?.tolarance);
      rowSetter(
        response.objRow?.map((item) => {
          return { ...item, shippedQuantity: 0 };
        }),
      );
    }
  } catch (error) {}
};

export const EditShipment = async (payload, setDisabled) => {
  try {
    setDisabled && setDisabled(true);
    const res = await axios.put(`/imp/Shipment/EditShipment`, payload);
    setDisabled && setDisabled(false);
    if (res.status === 200) {
      toast.success(res.data.message);
    }
  } catch (error) {
    setDisabled && setDisabled(false);
    toast.error(error?.response?.data?.message);
  }
};

// https://localhost:44396/imp/ImportCommonDDL/GetCnFAgencyList?accountId=2&businessUnitId=164
export const GetCNFAgencyDDL = async (accountId, businessUnitId, setter) => {
  try {
    let res = await axios.get(
      `/imp/ImportCommonDDL/GetCnFAgencyList?accountId=${accountId}&businessUnitId=${businessUnitId}`,
    );
    if (res?.status === 200) {
      setter(res?.data);
    }
  } catch (err) {
    toast.warning(err?.response?.data?.message);
  }
};

// validation Schema for insurance policy
export const validationSchema = Yup.object().shape({
  blAwbTrNo: Yup.string().required('BL/AWB/TR No is required'),
  blAwbTrDate: Yup.string().required('BL/AWB/TR Date is required'),
  invoiceNumber: Yup.string().required('Invoice Number is required'),
  //invoiceAmount: Yup.string().required("Invoice Amount is required"),
  invoiceDate: Yup.string().required('Invoice Date is required'),
  docReceiveByBank: Yup.string().nullable(),
  cnfProvider: Yup.object().shape({
    value: Yup.string().required('CNF is required'),
  }),
  etaDate: Yup.date().required('ETA Date is required'),
  // packingCharge: Yup.number()
  //   .positive("Packing Charge is always positive")
  //   .required("Packing Charge is required"),
  // freightCharge: Yup.number()
  //   .positive("Freight Charge is always positive")
  //   .required("Freight Charge is required"),
});

export const cancelShipmentHeaderById = async (id, cb) => {
  try {
    const res = await axios.post(
      `/imp/Shipment/DeleteShipment?shipmentHeaderId=${id}`,
    );
    if (res.status === 200) {
      cb && cb();
      toast.success(res?.data?.message || 'Successfully Deleted');
    }
  } catch (error) {}
};
