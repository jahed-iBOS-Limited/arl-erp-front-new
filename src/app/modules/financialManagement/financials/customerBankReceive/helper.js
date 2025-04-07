import Axios from 'axios';
import { toast } from 'react-toastify';

export const getPlantList = async (userId, accId, buId, setter) => {
  try {
    const res = await Axios.get(
      `/wms/BusinessUnitPlant/GetOrganizationalUnitUserPermission?UserId=${userId}&AccId=${accId}&BusinessUnitId=${buId}&OrgUnitTypeId=7`
    );
    setter(res?.data);
  } catch (error) {}
};

export const getCustomerBankRecLanding = async (
  buId,
  accountNo,
  fromDate,
  toDate,
  setLoading,
  setter,
  search = ''
) => {
  setLoading(true);
  try {
    const res = await Axios.get(
      `/fino/BankBranch/GetUnReconcileList?BusinessUnitId=${buId}&FromDate=${fromDate}&ToDate=${toDate}&search=${search}`
    );
    setLoading(false);
    let bankrecLanding = res?.data?.map((data) => {
      return {
        ...data,
        customerList: { value: data?.partnerId, label: data?.partnerName },
        remarks: '',
      };
    });
    setter(bankrecLanding);
  } catch (error) {
    setLoading(false);
  }
};

export const savecustomerBankRec = async (data, setDisabled, cb) => {
  setDisabled(true);
  try {
    const res = await Axios.post(
      `/fino/BankBranch/CustomerBankReconcile`,
      data
    );
    toast.success(res?.data?.message || 'Submitted successfully');
    setDisabled(false);
    // getBankStatementData(values);
    cb();
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setDisabled(false);
  }
};
export const getBankAccountNoDDL = async (accId, buId, setter) => {
  try {
    const res = await Axios.get(
      `/fino/FinanceCommonDDL/BankAccountNumberDDL?AccountId=${accId}&BusinessUnitId=${buId}`
    );
    setter(res?.data);
  } catch (err) {
    console.log(err);
  }
};
export const getInvoiceByPartnerApi = async (
  buId,
  setter,
  selectedItem,
  setLoading
) => {
  setLoading(true);
  try {
    const res = await Axios.get(
      `/oms/OManagementReport/GetInvoiceByPartner?BusinessunitId=${buId}&businessPartnerId=${selectedItem?.customerList?.value}`
    );
    setLoading(false);
    let totalAmount = +selectedItem?.creditAmount || 0;
    setter(
      res?.data?.map((data) => ({
        ...data,
        dueAmount: (+data?.actualAmount || 0) - (data?.receviedAmount || 0),
        advanceAmount: data?.invoiceNumber ? 0 : totalAmount,
        receviedAmount: data?.receviedAmount || 0,
      }))
    );
  } catch (err) {
    setLoading(false);
    console.log(err);
  }
};

export const customerBankReconcileNSalesInvoiceApi = async (
  data,
  setDisabled,
  cb
) => {
  setDisabled(true);
  try {
    const res = await Axios.post(
      `/fino/BankStatment/CustomerBankReconcileNSalesInvoice?typeId=1`,
      data
    );
    toast.success(res?.data?.message || 'Submitted successfully');
    setDisabled(false);
    // getBankStatementData(values);
    cb();
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setDisabled(false);
  }
};
