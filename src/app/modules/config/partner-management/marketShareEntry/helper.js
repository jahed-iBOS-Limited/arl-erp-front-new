import axios from "axios";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { monthDDL } from "../../../inventoryManagement/warehouseManagement/liftingEntry/form/addEditForm";

export const getCompanyList = async (buId, setter, setLoading) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.get(
      `/tms/LigterLoadUnload/GetMarketShareCompanyDDL?BusinessUnitId=${buId}`
    );
    setter(
      res?.data?.map((item) => ({
        ...item,
        quantity: "",
        companyName: item?.label,
      }))
    );
    setLoading && setLoading(false);
  } catch (error) {
    setter([]);
    toast.error(error?.response?.data?.message);
    setLoading && setLoading(false);
  }
};

export const getMarketShareByTerritoryId = async (
  accId,
  buId,
  territoryId,
  setter,
  setSingleData,
  setLoading
) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.get(
      `/tms/LigterLoadUnload/GetMarketShareSalesContributionByTerritoryId?AccountId=${accId}&BusinessUnitId=${buId}&TerritoryId=${territoryId}`
    );
    setter(res?.data);
    const singleData = {
      territory: {
        value: res?.data[0]?.territoryId,
        label: res?.data[0]?.territoryName,
      },
      month: {
        value: res?.data[0]?.monthId,
        label: monthDDL[res?.data[0]?.monthId - 1]?.label,
      },
      year: {
        value: res?.data[0]?.yearId,
        label: res?.data[0]?.yearId,
      },
    };
    setSingleData(singleData);
    setLoading && setLoading(false);
  } catch (error) {
    setter([]);
    toast.error(error?.response?.data?.message);
    setLoading && setLoading(false);
  }
};

export const editMarketShareEntry = async (payload, setLoading) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.put(
      `/tms/LigterLoadUnload/EditMarketShareSalesContribution`,
      payload
    );
    toast.success(res?.data?.message);
    setLoading && setLoading(false);
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setLoading && setLoading(false);
  }
};

export const validationSchema = Yup.object().shape({
  territory: Yup.object().shape({
    label: Yup.string().required("Territory is required"),
    value: Yup.string().required("Territory is required"),
  }),
  month: Yup.object().shape({
    label: Yup.string().required("Month is required"),
    value: Yup.string().required("Month is required"),
  }),
  year: Yup.object().shape({
    label: Yup.string().required("Year is required"),
    value: Yup.string().required("Year is required"),
  }),
});
