import Axios from "axios";
import { toast } from "react-toastify";

export const GetBusinessPartnerProfilePagination = async (
  accountId,
  buId,
  setter,
  setLoading,
  pageNo,
  pageSize,
  search,
  partnerType
) => {
  const searchPath = search ? `searchTerm=${search}&` : "";
  const partnerTypeCon = partnerType ? partnerType : 0;
  try {
    setLoading(true);
    const res = await Axios.get(
      `vat/VATBusinessPartnerBasicInfo/GetBusinessPartnerSearchLandingPaging?${searchPath}&partnerTypeId=${partnerTypeCon}&accountId=${accountId}&businessUnitId=${buId}&status=true&viewOrder=desc&PageNo=${pageNo}&PageSize=${pageSize}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
      setLoading(false);
    }
  } catch (error) {
    setLoading(false);
  }
};

export const GetBusinessPartnerProfileView = async (
  accountId,
  businessUnitId,
  partnerId,
  setter,
  setDisabled
) => {
  try {
    setDisabled && setDisabled(true);
    const res = await Axios.get(
      `/vat/VATBusinessPartnerBasicInfo/GetBusinessPartnerByID?accountId=${accountId}&businessUnitId=${businessUnitId}&partnerID=${partnerId}`
    );

    let {
      contactNumber,
      email,
      nid,
      bin,
      businessPartnerName,
      licenseNo,
      businessPartnerTypeName,
      businessPartnerAddress,
      businessPartnerTypeId,
      businessPartnerCode,
      taxBracketId,
      taxBracketName,
    } = res?.data?.[0]?.getBPartnerVat;
    let row = res?.data?.[0]?.getBPartnerVatRow;
    setDisabled && setDisabled(false);
    let obj = {
      businessPartnerTypeId: businessPartnerTypeId ?{
        value: businessPartnerTypeId,
        label: businessPartnerTypeName,
      } : "",
      businessPartnerAddress: businessPartnerAddress || "",
      contactNumber: contactNumber || "",
      email: email || "",
      nid: nid || "",
      businessPartnerName: businessPartnerName || "",
      businessPartnerCode: businessPartnerCode || "",
      country: "",
      state: "",
      city: "",
      policeStation: "",
      postCode: "",
      taxBracket: taxBracketId ?{
        value: taxBracketId,
        label: taxBracketName,
      } : "",
      bin: bin || "",
      licenseNo: licenseNo,
      addShipToParty: row?.length > 0 ? true : false,
      row,
    };
    setter(obj);
  } catch (error) {
    setDisabled && setDisabled(false);
  }
};

export const getPartnerTypeDDL_api = async (setter) => {
  try {
    const res = await Axios.get(
      `/partner/BusinessPartnerBasicInfo/GetBusinessPartnerTypeList
      `
    );
    if (res.status === 200 && res?.data) {
      const data = res?.data;
      const newData = data.map((item) => {
        return {
          value: item.businessPartnerTypeId,
          label: item.businessPartnerTypeName,
        };
      });
      setter(newData);
    }
  } catch (error) {}
};

export const saveBusinessPartnerProfile = async (
  type,
  check,
  bin,
  license,
  data,
  cb,
  setDisabled
) => {
  setDisabled(true);
  try {
    const res = await Axios.post(
      `vat/VATBusinessPartnerBasicInfo/CreateBusinessPartner?Type=${type}&Check=${check}&Bin=${bin}&License=${license} `,
      data
    );
    if (res.status === 200) {
      toast.success(res.data?.message || "Submitted successfully");
      cb();
      setDisabled(false);
    }
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setDisabled(false);
  }
};

export const saveEditedBusinessPartnerProfile = async (
  type,
  check,
  data,
  setDisabled
) => {
  try {
    setDisabled(true);
    const res = await Axios.put(
      `/vat/VATBusinessPartnerBasicInfo/EditBusinessPartner?Type=${type}&Check=${check}`,
      data
    );
    if (res.status === 200) {
      toast.success(res.data?.message || "Edited successfully");
      setDisabled(false);
    }
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setDisabled(false);
  }
};

export const getTaxBracketDDL_api = async (setter) => {
  try {
    const res = await Axios.get(`/vat/TaxDDL/TaxBracketDDL`);
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

export const getCountryDDL_api = async (setter) => {
  try {
    const res = await Axios.get(`/oms/TerritoryInfo/GetCountryDDL`);
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

export const getDivisionDDL_api = async (countryId, setter) => {
  try {
    const res = await Axios.get(
      `/oms/TerritoryInfo/GetDivisionDDL?countryId=${countryId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

export const getDistrictDDL_api = async (countryId, divisionId, setter) => {
  try {
    const res = await Axios.get(
      `/oms/TerritoryInfo/GetDistrictDDL?countryId=${countryId}&divisionId=${divisionId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

export const getPoliceStationDDL_api = async (
  countryId,
  divisionId,
  districtId,
  setter
) => {
  try {
    const res = await Axios.get(
      `/oms/TerritoryInfo/GetThanaDDL?countryId=${countryId}&divisionId=${divisionId}&districtId=${districtId}`
    );
    if (res.status === 200 && res?.data) {
      const data = res?.data.map((itm) => ({
        value: itm.value,
        label: `${itm?.label} [PC: ${itm?.code}]`,
        code: itm?.code,
      }));
      setter(data);
    }
  } catch (error) {}
};

export const getPostcodeDDL_api = async (ThanaID, setter) => {
  try {
    const res = await Axios.get(
      `/vat/TaxDDL/GetPostcodeByThanaDDL?ThanaId=${ThanaID}`
    );
    if (res.status === 200 && res?.data) {
      let newThanaObj = res?.data.map((item) => {
        return {
          code: item.code,
          label: item.code,
          name: item.label,
          subId: item.subId,
          uomId: item.uomId,
          uomName: item.uomName,
          value: item.value,
        };
      });
      setter(newThanaObj.length > 0 && newThanaObj);
    }
  } catch (error) {}
};
