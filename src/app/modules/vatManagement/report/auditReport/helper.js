import axios from "axios";
import { toast } from "react-toastify";

export const GetExportSales_api = async (
  buid,
  values,
  setter,
  setLoading,
  setGridAllData
) => {
  setLoading(true);
  try {
    const { customsHouse, fromDate, toDate, tarrifSchedule } = values;
    const HsCode = tarrifSchedule?.hscode
      ? `&HsCode=${tarrifSchedule?.hscode}`
      : "";
    const res = await axios.get(
      `/vat/AuditLog/GetExportSales?BusinessUnitId=${buid}&CustomId=${customsHouse?.value}${HsCode}&FromDate=${fromDate}&ToDate=${toDate}`
    );
    setter(res?.data);
    if (res?.data?.length === 0) toast.warning("Data Not Found");
    setLoading(false);
    setGridAllData(res?.data);
  } catch (error) {
    setter([]);
    setLoading(false);
    console.error(error);
  }
};
export const GetLocalSales_api = async (buid, values, setter, setLoading) => {
  setLoading(true);
  try {
    const { partnerByType, fromDate, toDate, tarrifSchedule } = values;
    const HsCode = tarrifSchedule?.hscode
      ? `&HsCode=${tarrifSchedule?.hscode}`
      : "";

    const res = await axios.get(
      `/vat/AuditLog/GetLocalSales?BusinessUnitId=${buid}&CustomerId=${partnerByType?.value}${HsCode}&FromDate=${fromDate}&ToDate=${toDate}`
    );
    setter(res?.data);
    if (res?.data?.length === 0) toast.warning("Data Not Found");
    setLoading(false);
  } catch (error) {
    setter([]);
    setLoading(false);
    console.error(error);
  }
};
export const GetImportPurchase_api = async (
  buid,
  values,
  setter,
  setLoading
) => {
  setLoading(true);
  try {
    const { customsHouse, fromDate, toDate, tarrifSchedule } = values;
    const HsCode = tarrifSchedule?.hscode
      ? `&HsCode=${tarrifSchedule?.hscode}`
      : "";
    const res = await axios.get(
      `/vat/AuditLog/GetImportPurchase?BusinessUnitId=${buid}&CustomId=${customsHouse?.value}${HsCode}&FromDate=${fromDate}&ToDate=${toDate}`
    );
    setter(res?.data);
    if (res?.data?.length === 0) toast.warning("Data Not Found");
    setLoading(false);
  } catch (error) {
    setter([]);
    setLoading(false);
    console.error(error);
  }
};
export const GetLocalPurchase_api = async (
  buid,
  values,
  setter,
  setLoading
) => {
  setLoading(true);
  try {
    const { partnerByType, fromDate, toDate, tarrifSchedule } = values;
    const HsCode = tarrifSchedule?.hscode
      ? `&HsCode=${tarrifSchedule?.hscode}`
      : "";
    const res = await axios.get(
      `/vat/AuditLog/GetLocalPurchase?BusinessUnitId=${buid}&SupplierId=${partnerByType?.value}${HsCode}&FromDate=${fromDate}&ToDate=${toDate}`
    );
    if (res?.data?.length === 0) toast.warning("Data Not Found");
    setter(res?.data);
    setLoading(false);
  } catch (error) {
    setter([]);
    setLoading(false);
    console.error(error);
  }
};

export const GetCustomHouseDDL_api = async (setter) => {
  try {
    const res = await axios.get(`/vat/TaxDDL/GetCustomHouseDDL`);
    if (res.status === 200 && res?.data) {
      setter(
        res?.data?.map((itm) => ({
          ...itm,
          label: `${itm?.code}: ${itm?.label}`,
          withOutCodeLabel: itm?.label,
        }))
      );
    }
  } catch (error) {}
};
export const GetBusinessPartnerByType_api = async (
  accId,
  buid,
  type,
  setter
) => {
  try {
    const res = await axios.get(
      `/vat/Partner/GetBusinessPartnerByType?AccountId=${accId}&BusniessUnitId=${buid}&TypeId=${type}`
    );
    if (res.status === 200 && res?.data) {
      setter(
        res?.data?.map((item) => {
          return {
            ...item,
            label:
              item?.bin && item?.bin?.toLowerCase() !== "na"
                ? `${item?.label} [${item?.bin}]`
                : item?.label,
          };
        })
      );
    }
  } catch (error) {}
};

export const getHeaderData = async (accId, buId, setter) => {
  try {
    const res = await axios.get(
      `/vat/Mushak91/GetTaxPayerInformation?AccountId=${accId}&BusinessUnitId=${buId}`
    );
    setter(res?.data);
  } catch (error) {
    setter({});
  }
};
