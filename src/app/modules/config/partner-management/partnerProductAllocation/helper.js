import * as Yup from "yup";
import Axios from "axios";
import { toast } from "react-toastify";
import { _dateFormatter } from "../../../_helper/_dateFormate";

export const validationSchema = Yup.object().shape({
  customer: Yup.object().shape({
    label: Yup.string().required("Customer is required"),
    value: Yup.string().required("Customer is required"),
  }),
  // dealerName: Yup.string().required("Dealer Name is required"),
  upozila: Yup.object().shape({
    label: Yup.string().required("Zone is required"),
    value: Yup.string().required("Zone is required"),
  }),
  productName: Yup.object().shape({
    label: Yup.string().required("Product Name is required"),
    value: Yup.string().required("Product Name is required"),
  }),
  allotedQnt: Yup.number().required("Alloted Qnt is required"),
  rate: Yup.number().required("Rate is required"),
});

export const customerListDDL = async (accId, buId, setter) => {
  try {
    const res = await Axios.get(
      `/partner/BusinessPartnerBasicInfo/GetSoldToPartnerShipToPartnerDDL?accountId=${accId}&businessUnitId=${buId}`
    );
    setter(res?.data);
  } catch (error) {
    setter([]);
  }
};

export const getLcNoDDL = async (accId, buId, setter) => {
  try {
    const res = await Axios.get(
      `/partner/PartnerAllotmentHeader/GetAllotmentHeaderInfoDDL?AccountId=${accId}&BusinessUnitId=${buId}`
    );
    setter(res?.data);
  } catch (error) {
    setter([]);
  }
};

export const getBusinessPartnerDDL = async (accId, buId, setter) => {
  try {
    const res = await Axios.get(
      `/partner/BusinessPartnerBasicInfo/GetSoldToPartnerShipToPartnerDDL?accountId=${accId}&businessUnitId=${buId}`
    );
    setter(res?.data);
  } catch (error) {
    setter([]);
  }
};

export const productDDL = async (accId, buId, setter) => {
  try {
    const res = await Axios.get(
      `/item/ItemSales/GetItemSalesDDL?AccountId=${accId}&BUnitId=${buId}`
    );
    setter(res?.data);
  } catch (error) {
    setter([]);
  }
};

export const upozilaDDL = async (accId, buId, setter) => {
  try {
    const res = await Axios.get(
      `/tms/TransportZone/GetTransportZoneDDL?AccountId=${accId}&BusinessUnitId=${buId}`
    );
    setter(res?.data);
  } catch (error) {
    setter([]);
  }
};

export const CreatePartnerProductAllocation = async (data, setLoading, cb) => {
  setLoading(true);
  try {
    const res = await Axios.post(
      `/partner/PartnerAllotment/CreatePartnerAllotment`,
      data
    );
    toast.success(res?.data?.message || "Submitted Successfully");
    cb();
    setLoading(false);
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setLoading(false);
  }
};
export const CreatePartnerAllotmentExcel_api = async (obj) => {
  const { accountId, buid, userId, fileObjects, setLoading } = obj;
  setLoading(true);
  let formData = new FormData();
  fileObjects.forEach((file) => {
    formData.append("allotmentExcel", file?.file);
  });
  try {
    let { data } = await Axios.post(
      `/wms/WmsReport/CreatePartnerAllotmentExcel?AccountId=${accountId}&BusinessUnitId=${buid}&ActionBy=${userId}`,
      formData,
      {
        headers: {
          "Content-Type":
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        },
      }
    );
    setLoading(false);
    toast.success("Upload  successfully");
    return data;
  } catch (error) {
    setLoading(false);
    toast.error("Document not upload");
  }
};

export const EditPartnerProductAllocation = async (data, setLoading) => {
  setLoading(true);
  try {
    const res = await Axios.put(
      `/partner/PartnerAllotment/EditPartnerAllotment`,
      data
    );
    toast.success(res?.data?.message || "Updated Successfully");
    setLoading(false);
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setLoading(false);
  }
};

export const GetPartnerProductAllocationLandingData = async (
  accId,
  buId,
  partnerId,
  type,
  fromDate,
  pageNo,
  pageSize,
  setter,
  setLoading
) => {
  setLoading(true);
  console.log("type is", type);
  let url = "";
  if (type === 1) {
    // get partner wise
    url = `/partner/PartnerAllotment/GetPartnerAllotmentByPartnerId?AccountId=${accId}&BusinessUnitId=${buId}&PartnerId=${partnerId}`;
  } else {
    // get date wise
    url = `/partner/PartnerAllotment/GetPartnerAllotmentLanding?AccountId=${accId}&BusinessUnitId=${buId}&ReportDate=${fromDate}&PageNo=${pageNo}&PageSize=${pageSize}&viewOrder=desc`;
  }
  try {
    const res = await Axios.get(url);
    type === 1 ? setter({ data: res?.data }) : setter(res?.data);
    setLoading(false);
  } catch (error) {
    setter([]);
    setLoading(false);
  }
};

export const GetPartnerProductAllocationById = async (
  id,
  setter,
  setLoading
) => {
  setLoading(true);
  try {
    const res = await Axios.get(
      `/partner/PartnerAllotment/GetPartnerAllotmentById?AllotmentId=${id}`
    );
    const {
      upzilaName,
      upzila,
      uomName,
      customerId,
      customerName,
      totalAmount,
      toDate,
      remarks,
      ownerName,
      itemRate,
      itemId,
      itemName,
      fromDate,
      allotedQty,
      permissionNo,
      permissionDate,
    } = res?.data;
    const modifyData = {
      fromDate: _dateFormatter(fromDate),
      toDate: _dateFormatter(toDate),
      customer: {
        value: customerId,
        label: customerName,
      },
      dealerName: ownerName,
      upozila: {
        value: upzila,
        label: upzilaName,
      },
      productName: {
        value: itemId,
        label: itemName,
      },
      allotedQnt: allotedQty,
      uomName: uomName,
      rate: itemRate,
      grandTotal: totalAmount,
      remarks: remarks,
      permissionDate: _dateFormatter(permissionDate),
      permissionNo: permissionNo,
    };
    setter(modifyData);
    setLoading(false);
  } catch (error) {
    setter([]);
    setLoading(false);
  }
};
