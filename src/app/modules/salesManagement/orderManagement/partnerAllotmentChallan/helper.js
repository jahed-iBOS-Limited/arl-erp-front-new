import Axios from "axios";
import { toast } from "react-toastify";
import { _todayDate } from "./../../../_helper/_todayDate";
import { _dateFormatter } from "./../../../_helper/_dateFormate";

export const GetPartnerAllotmentLanding = async (
  accId,
  buId,
  date,
  type,
  setLoading,
  setter
) => {
  try {
    setLoading(true);
    const res = await Axios.get(
      `/wms/PartnerAllotmentReport/GetPartnerAllotmentReport?reportType=${type}&date=${date}&businessunitId=${buId}&accountId=${accId}`
    );
    setter(res?.data);
    setLoading(false);
  } catch (error) {
    setter([]);
    toast.warning(error.message);
    setLoading(false);
  }
};

export const GetSecondaryDeliveryLanding_api = async (
  accId,
  buId,
  type,
  fromDate,
  toDate,
  pageNo,
  pageSize,
  searchTerm,
  setLoading,
  setter
) => {
  const search = searchTerm ? `&SearchTerm=${searchTerm}` : "";
  const urlOne = `/wms/SecondaryDelivery/GetSecondaryDeliveryLanding?AccountId=${accId}&BusinessUnitId=${buId}&FromDate=${fromDate}&ToDate=${toDate}&pageNo=${pageNo}&pageSize=${pageSize}&reportType=${type}&viewOrder=desc${search}`;

  const urlTwo = `/wms/SecondaryDelivery/SecondaryDeliveryUnApprovedBillTopsheet?accountId=${accId}&businessUnitId=${buId}&fromDate=${fromDate}&toDate=${toDate}&searchTerm=${searchTerm}`;

  const URL = type === 4 ? urlTwo : urlOne;

  try {
    setLoading(true);
    const res = await Axios.get(URL);
    setter(res?.data);
    setLoading(false);
  } catch (error) {
    setter([]);
    toast.warning(error.message);
    setLoading(false);
  }
};

export const getSBUListDDL = async (accId, buId, setter) => {
  try {
    const res = await Axios.get(
      `/costmgmt/SBU/GetSBUListDDL?AccountId=${accId}&BusinessUnitId=${buId}&Status=true`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
};
export const GetShippointDDL_api = async (userId, clientId, buId, setter) => {
  try {
    const res = await Axios.get(
      `/domain/OrganizationalUnitUserPermission/GetOrganizationalUnitUserPermissionByUnitId?UserId=${userId}&ClientId=${clientId}&BusinessUnitId=${buId}`
    );
    if (res.status === 200 && res?.data) {
      const newData = res?.data.map((itm) => {
        return {
          value: itm?.organizationUnitReffId,
          label: itm?.organizationUnitReffName,
        };
      });
      setter(newData);
    }
  } catch (error) {}
};

export const getSoldToPartnerDDL = async (accId, buId, setter) => {
  try {
    let res = await Axios.get(
      `/partner/BusinessPartnerBasicInfo/GetSoldToPartnerShipToPartnerDDL?accountId=${accId}&businessUnitId=${buId}`
    );
    if (res?.status === 200) {
      setter(res?.data);
    }
  } catch (err) {
    toast.warning(err?.response?.data?.message);
  }
};

export const getSalesCenterDDL = async (accId, buId, setter) => {
  try {
    let res = await Axios.get(
      `/oms/SalesOffice/GetSalesOfficeDDLbyId?AccountId=${accId}&BusinessUnitId=${buId}`
    );
    setter(res?.data);
  } catch (err) {
    setter([]);
  }
};

export const GetSecondatDeliveryItemInfo_api = async (
  accId,
  buId,
  allotmentId,
  setter,
  setDisabled
) => {
  try {
    setDisabled(true);
    let res = await Axios.get(
      `/wms/SecondaryDelivery/GetSecondatDeliveryItemInfo?AccountId=${accId}&BusinessUnitId=${buId}&AllotmentId=${allotmentId}`
    );

    setter(res?.data);
    setDisabled(false);
  } catch (err) {
    setDisabled(false);
    toast.warning(err?.response?.data?.message);
  }
};

export const getItemNameDDL_api = async (accId, buId, setter) => {
  try {
    const res = await Axios.get(
      `/item/ItemSales/GetItemSalesDDL?AccountId=${accId}&BUnitId=${buId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};
export const GetAccOfPartnerDDl_api = async (accId, buId, setter) => {
  try {
    const res = await Axios.get(
      `/wms/SecondaryDelivery/GetAccOfPartnerDDl?AccountId=${accId}&BusinessUnitId=${buId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

export const createSecondaryDelivery_api = async (payload) => {
  payload.setDisabled(true);
  try {
    console.log(payload);
    const res = await Axios.post(
      `/wms/SecondaryDelivery/CreateSecondaryDelivery`,
      payload?.data
    );
    if (res.status === 200 && res.data) {
      toast.success(res.data?.message || "Submitted successfully");
      payload.cb();
      payload.setDisabled(false);
      payload.history.push(
        "/sales-management/ordermanagement/partnerAllotmentChallan"
      );
    }
  } catch (error) {
    payload.setDisabled(false);
  }
};
export const EditSecondaryDelivery_api = async (payload) => {
  payload.setDisabled(true);
  try {
    const res = await Axios.put(
      `/wms/SecondaryDelivery/EditSecondaryDelivery`,
      payload?.data
    );
    if (res.status === 200 && res.data) {
      toast.success(res.data?.message || "Submitted successfully");
      // payload.cb();
      payload.setDisabled(false);
      payload.setAllotmentChallanModel(false);
    }
  } catch (error) {
    payload.setDisabled(false);
  }
};

export const GetSecondaryDeliveryById = async (
  accId,
  buId,
  deliveryId,
  setter
) => {
  try {
    const res = await Axios.get(
      `/wms/SecondaryDelivery/GetSecondaryDeliveryById?SecondaryDeliveryId=${deliveryId}`
    );
    if (res?.status === 200 && res?.data) {
      const {
        shippointId,
        shippointName,
        numComission,
        soldToPartnerId,
        soldToPartnerName,
        supplierId,
        supplierName,
        supplierDate,
        itemId,
        itemName,
        itemRate,
        numQuantity,
        numTotalPrice,
        fromCountryName,
        deliveryAddress,
        lcnumber,
        dteLcdate,
        bankName,
        permissionNumber,
        govtRate,
        shipName,
        dtePermissionDate,
        deliveryDate,
        color,
        zilaName,
        upzilaName,
        salesCenterId,
        salesCenterName,
        allotmentId,
      } = res?.data;

      /* Assign By Imdad Bhai (Backend) */
      let { data: allotmentDetailsData } = await Axios.get(
        `/wms/SecondaryDelivery/GetAllotmentDetailInfo?AccountId=${accId}&BusinessUnitId=${buId}&AllotmentId=${allotmentId}`
      );

      const modified = {
        ...res?.data,
        sbu: "",
        shippoint: shippointId
          ? { value: shippointId, label: shippointName }
          : "",
        commission: numComission || 0,
        soldToParty: soldToPartnerId
          ? { value: soldToPartnerId, label: soldToPartnerName }
          : "",
        supplierName: supplierId
          ? { value: supplierId, label: supplierName }
          : "",
        salesCenter: salesCenterId
          ? { value: salesCenterId, label: salesCenterName }
          : "",
        supplierDate: _dateFormatter(supplierDate) || _todayDate(),
        itemName: itemId ? { value: itemId, label: itemName } : "",
        itemPrice: itemRate || 0,
        quantity: numQuantity || 0,
        totalPrice: numTotalPrice || 0,
        supplierCountry:
          fromCountryName || allotmentDetailsData?.supplierCountry || "",
        deliveryAddress: deliveryAddress || "",
        lcNo: lcnumber || allotmentDetailsData?.lcNo || "",
        lcDate:
          _dateFormatter(dteLcdate) ||
          _dateFormatter(allotmentDetailsData?.lcDate) ||
          _todayDate(),
        bankName:
          bankName ||
          allotmentDetailsData?.bankName +
            ", " +
            allotmentDetailsData?.branchName ||
          "",
        permissionNumber:
          permissionNumber || allotmentDetailsData?.permissionNo || "",
        govtPrice: govtRate || 0,
        permissionDate:
          _dateFormatter(dtePermissionDate) ||
          _dateFormatter(allotmentDetailsData?.permissionDate) ||
          _todayDate(),
        challanDate: _dateFormatter(deliveryDate) || _todayDate(),
        shipName: shipName || allotmentDetailsData?.shipName || "",
        maxQuantity: 100000000,
        color: color || allotmentDetailsData?.color || "",
        district: zilaName || allotmentDetailsData?.district || "",
        upazila: upzilaName || allotmentDetailsData?.upazilla || "",
        accOfPartner: "",
        isAccOfPartner: false,
      };
      setter(modified);
    }
  } catch (error) {}
};

export const getChallanData = async (
  deliveryId,
  setter,
  setChallanPrintModalShow
) => {
  try {
    const res = await Axios.get(
      `/wms/SecondaryDelivery/GetSecondaryDeliveryForPrint?SecondaryDeliveryId=${deliveryId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setChallanPrintModalShow(false);
  }
};

export const GetAllotmentDetailInfo = async (
  accId,
  buId,
  allotmentId,
  setter,
  setDisabled
) => {
  setDisabled(true);
  try {
    let res = await Axios.get(
      `/wms/SecondaryDelivery/GetAllotmentDetailInfo?AccountId=${accId}&BusinessUnitId=${buId}&AllotmentId=${allotmentId}`
    );
    setter(res?.data);
    setDisabled(false);
  } catch (err) {
    setDisabled(false);
    toast.warning(err?.response?.data?.message);
  }
};

export const deleteSecondaryDelivery = async (payload, setLoading, url) => {
  setLoading && setLoading(true);
  try {
    const res = await Axios.put(url, payload);
    toast.success(res?.data?.message);
    setLoading && setLoading(false);
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setLoading && setLoading(false);
  }
};
