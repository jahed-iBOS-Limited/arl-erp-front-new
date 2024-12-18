import axios from 'axios';
import { toast } from 'react-toastify';
import { _dateFormatter } from '../../../../_helper/_dateFormate';
import numberWithCommas from '../../../../_helper/_numberWithCommas';
import IWarningModal from '../../../../_helper/_warningModal';

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

// get supplier DDL
export const GetSupplier_api = async (setDisabled, accId, buId, setter) => {
  try {
    setDisabled(true);
    const res = await axios.get(
      `/imp/LCBusinessPartner/GetSupplierListForBillDDL?accountId=${accId}&businessUnitId=${buId}`,
    );
    const modifyData = res?.data?.map((item) => ({
      value: item?.value,
      label: item?.label,
    }));
    setter(modifyData);
    setDisabled(false);
  } catch (error) {
    setter([]);
    setDisabled(false);
  }
};

// Get landing data
export const getLandingData = async (
  accId,
  buId,
  PoLcLabel,
  supplierId,
  billingStatus,
  setter,
  pageNo,
  pageSize,
  setDisabled,
  setTotalCount,
  chargeTypeName,
  subChargeTypeId,
) => {
  const poLc = PoLcLabel ? PoLcLabel : '';
  let supplier = supplierId ? supplierId : '';
  // const billStatus = billingStatus ?? "";

  const searchTerm = poLc ? `&searchTerm=${poLc}` : '';
  supplier = supplier ? `supplierId=${supplier}&` : '';
  const ChargeTypeName = chargeTypeName
    ? `&ChargeTypeName=${chargeTypeName}`
    : '';

  setDisabled(true);

  try {
    const res = await axios.get(
      `/imp/ImportReport/CommercialPaymentLandingPasignation?accountId=${accId}&businessUnitId=${buId}${searchTerm}&${supplier}billingStatus=${billingStatus}${ChargeTypeName}&subChargeTypeId=${subChargeTypeId}&pageSize=${pageSize}&pageNo=${pageNo}&viewOrder=desc`,
    );
    setTotalCount(res?.data?.totalCount);
    const modify = res?.data?.data?.map((item) => {
      return {
        ...item,
        dueDate: _dateFormatter(item?.dueDate),
        isSelect: false,
        // totalBilledAmount: (+item?.totalAmount || 0) + ((+item?.totalAmount *+item?.vatamount) /100 || 0),
        totalBilledAmount: (+item?.totalAmount || 0) + (+item?.vatamount || 0),
        tempVatAmount: '',
        totalAmount: numberWithCommas((item?.totalAmount || 0).toFixed(2)),
        vatAmount: item?.vatamount?.toFixed(2),
      };
    });
    setDisabled(false);
    return setter(modify);
  } catch (error) {
    setter([]);
    setDisabled(false);
  }
};

// Save Commercial Payment
export const saveCommercialPayment = async (
  accId,
  buId,
  plantId,
  sbuId,
  businessPartnerId,
  actionById,
  supplierBillRef,
  imageId,
  rowDto,
  setDisabled,
  cb,
  getLandingDataForCommercialBill,
) => {
  // console.log(rowDto)
  const filterData = rowDto?.filter((item) => item?.isSelect !== false);
  const dataSet = modifyPayload(filterData, imageId);
  const filterByBillAmount = rowDto?.reduce(
    (acc, item) => acc + item?.totalBilledAmount,
    0,
  );
  const supplierId =
    filterData?.length > 0 && filterData[0]['businessPartnerId'];
  try {
    if (
      !filterData?.every(
        (item) => item?.costTypeName === filterData[0]?.costTypeName,
      )
    ) {
      return toast.error('Charge Type Should Be Same');
    }
    if (
      !filterData?.every(
        (item) => item?.subChargeTypeName === filterData[0]?.subChargeTypeName,
      )
    ) {
      return toast.error('Sub Charge Type Should Be Same');
    }
    if (
      !filterData?.every(
        (item) =>
          item?.businessPartnerName === filterData[0]?.businessPartnerName,
      )
    ) {
      toast.error('Supplier Name Should Be Same');
      return;
    } else if (filterByBillAmount <= 0) {
      toast.error('Please Enter Valid Amount');
      return;
    } else {
      setDisabled(true);
      const res = await axios.post(
        `/imp/FormulaForCalculation/CommercialCostingForTypeTwo?accountId=${accId}&businessUnitId=${buId}&plantId=${plantId}&sbuId=${sbuId}&transactionDate=${_dateFormatter(
          new Date(),
        )}&costId=${0}&businessPartnerId=${supplierId}&totalAmount=${0}&typeId=${2}&actionById=${actionById}&SupplierBillRef=${supplierBillRef}`,
        dataSet,
      );
      setDisabled(false);
      toast.success(
        res?.data?.message ? res?.data?.message : 'Submitted successfully',
      );
      cb();
      getLandingDataForCommercialBill && getLandingDataForCommercialBill();
    }
  } catch (error) {
    setDisabled(false);
    toast.error(error.response.data.message);
  }
};

//add bill save
export const CommercialCostingForTypeTwo = async (
  accId,
  buId,
  plantId,
  sbuId,
  businessPartnerId,
  actionById,
  supplierId,
  supplierBillRef,
  imageId,
  costId,
  totalAmount,
  setDisabled,
  payload,
  cb,
  getLandingDataForCommercialBill,
  advanceAdjust,
) => {
  setDisabled(true);
  try {
    const res = await axios.post(
      `/imp/FormulaForCalculation/CommercialCostingForTypeTwo?accountId=${accId}&businessUnitId=${buId}&plantId=${plantId}&sbuId=${sbuId}&transactionDate=${_dateFormatter(
        new Date(),
      )}&costId=${costId}&businessPartnerId=${supplierId}&totalAmount=${
        totalAmount < advanceAdjust ? 0 : totalAmount - advanceAdjust || 0
      }&typeId=${2}&actionById=${actionById}&SupplierBillRef=${supplierBillRef}&numAdvanceAdjust=${
        totalAmount < advanceAdjust ? totalAmount : advanceAdjust || 0
      }`,
      payload,
    );
    setDisabled(false);
    toast.success(
      res?.data?.message ? res?.data?.message : 'Submitted successfully',
    );
    cb();
    getLandingDataForCommercialBill && getLandingDataForCommercialBill();
  } catch (error) {
    setDisabled(false);
    // toast.error(error.response.data.message);
  }
};

// data modify for save
const modifyPayload = (filterData, imageId) => {
  const data = filterData.map((item) => {
    return {
      costId: item?.costId,
      bookedAmount: item?.totalAmount,
      totalAmount: item?.totalBilledAmount,
      vat: +item?.vatamount,
    };
  });
  return {
    jason: data,
    imageString: {
      imageId: imageId,
    },
  };
};

export const attachmentUpload = async (attachment, cb) => {
  let formData = new FormData();
  attachment.forEach((file) => {
    formData.append('files', file);
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

export const getCommercialCostingServiceBreakdown = async (
  referenceId,
  setter,
) => {
  try {
    const res = await axios.get(
      `/imp/AllCharge/GetCommercialCostingServiceBreakdown?referenceId=${referenceId}`,
    );
    if (res.status === 200) {
      setter(res?.data);
    }
  } catch (err) {
    toast.error(err?.response?.data?.message);
  }
};

export const getCommercialBreakdownForAdvanceAndBill = async (
  referenceId,
  supplierId,
  setAdvanceBill,
  setBill,
  setLoading,
) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.get(
      `/imp/AllCharge/GetCommercialBreakdownForAdvanceAndBill?referenceId=${referenceId}&supplierId=${supplierId}`,
    );
    console.log(res);
    if (res.status === 200) {
      setAdvanceBill(res?.data?.objAdvanceData);
      setBill(res?.data?.objBillData);
    }
    setLoading && setLoading(false);
  } catch (err) {
    setLoading && setLoading(false);
    toast.error(err?.response?.data?.message);
  }
};

export const createCommercialBreakdownForAdvance = async (
  payload,
  setIsLoading,
  cb,
) => {
  try {
    setIsLoading(true);
    const res = await axios.post(
      '/imp/AllCharge/CreateCommercialBreakdownForAdvance',
      payload,
    );
    if (res.status === 200) {
      setIsLoading(false);
      toast.success(res?.data?.message);
      cb && cb();
    }
  } catch (err) {
    setIsLoading(false);
    toast.error(err?.response?.data?.message);
  }
};

export const createCommercialBreakdownForBill = async (
  payload,
  setIsLoading,
) => {
  try {
    setIsLoading(true);
    const res = await axios.post(
      '/imp/AllCharge/CreateCommercialBreakdownForBill',
      payload,
    );

    if (res.status === 200) {
      setIsLoading(false);
      toast.success(res?.data?.message);
      //after creating add bill message modal
      let confirmObject = {
        title: 'Bill Code',
        message: res?.data?.invoiceCode,
        okAlertFunc: async () => {},
      };
      IWarningModal(confirmObject);
    }
  } catch (err) {
    setIsLoading(false);
    toast.error(err?.response?.data?.message);
  }
};
