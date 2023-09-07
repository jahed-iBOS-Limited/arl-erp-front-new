import axios from "axios";
import { toast } from "react-toastify";
import { _dateFormatter } from "../../../_helper/_dateFormate";

export const getPartnerCheckSubmitById = async (
  accId,
  buId,
  partnerId,
  id,
  setter,
  setLoading
) => {
  setLoading(true);
  try {
    const res = await axios.get(
      `partner/PartnerOverDue/GetBusinessPartnerCheckById?AccountId=${accId}&BusinessUnitId=${buId}&BusinessPartnerId=${partnerId}&ConfigId=${id}`
    );
    const {
      advanceAmount70P,
      bankId,
      bankName,
      branchId,
      branchName,
      businessPartnerId,
      businessPartnerName,
      chequeDate,
      comments,
      distributionChannelId,
      distributionChannelName,
      mrramount,
      previousAmount30P,
      chequeBearerId,
      chequeBearerName,
      chequeNo,
      companyAccountBankId,
      companyAccountBankName,
    } = res?.data;

    const singleData = {
      customer: {
        value: businessPartnerId,
        label: businessPartnerName,
      },
      channel: {
        value: distributionChannelId,
        label: distributionChannelName,
      },
      chequeDate: _dateFormatter(chequeDate),
      amount: mrramount,
      advance: advanceAmount70P,
      previous: previousAmount30P,
      bankName: {
        value: bankId,
        label: bankName,
      },
      branchName: {
        value: branchId,
        label: branchName,
      },
      remarks: comments,
      chequeBearer: {
        value: chequeBearerId,
        label: chequeBearerName,
      },
      chequeNo: chequeNo,
      companyBankName: {
        value: companyAccountBankId,
        label: companyAccountBankName,
      },
    };
    setter(singleData);
    setLoading(false);
  } catch (error) {
    setter({});
    toast.error(error?.response?.data?.message);
    setLoading(false);
  }
};

export const editORDeletePartnerChequeSubmit = async (
  payload,
  setLoading,
  cb
) => {
  setLoading(true);
  try {
    const res = await axios.post(
      `/partner/PartnerOverDue/EditBusinessPartnerCheck`,
      payload
    );
    res?.data?.message
      ? payload?.edit?.length
        ? toast.success("Updated Successfully!")
        : toast.success("Deleted Successfully!")
      : toast.warn("Something went wrong!");
    cb && cb();
    setLoading(false);
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setLoading(false);
  }
};

export const deleteMMRChequeOfCement = async (id, setLoading, cb) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.put(
      `/partner/PartnerOverDue/DeleteBusinessPartnerChequeForACCL?ConfigId=${id}`
    );
    toast.success(res?.data?.message);
    cb();
    setLoading && setLoading(false);
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setLoading && setLoading(false);
  }
};

export const editPartnerCheque = async (payload, setLoading) => {
  setLoading(true);
  try {
    const res = await axios.put(
      `/partner/PartnerOverDue/EditBusinessPartnerChequeForACCL`,
      payload
    );
    toast.success(res?.data?.message);
    setLoading(false);
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setLoading(false);
  }
};

export const editExportPaymentPosting = async (payload, setLoading, cb) => {
  setLoading(true);
  try {
    const res = await axios.put(
      `/partner/PartnerOverDue/EditExportPartnerPaymentInfo`,
      payload
    );
    toast.success(res?.data?.message);
    setLoading(false);
    cb && cb();
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setLoading(false);
  }
};
