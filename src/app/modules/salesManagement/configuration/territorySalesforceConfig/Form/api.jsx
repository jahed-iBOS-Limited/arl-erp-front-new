import axios from "axios";
import { toast } from "react-toastify";

export const getRegionAreaTerritory = async ({
  channelId,
  regionId,
  areaId,
  setter,
  setLoading,
  value,
  label,
  territoryId,
}) => {
  setLoading(true);
  const region = regionId ? `&regionId=${regionId}` : "";
  const area = areaId ? `&areaId=${areaId}` : "";
  const territory = territoryId ? `&territoryId=${territoryId}` : "";
  try {
    const res = await axios.get(
      `/oms/TerritoryInfo/GetTerrotoryRegionAreaByChannel?channelId=${channelId}${region}${area}${territory}`
    );
    setter(
      res?.data?.map((item) => ({
        ...item,
        value: item[value],
        label: item[label],
      }))
    );
    setLoading(false);
  } catch (error) {
    setter([]);
    setLoading(false);
  }
};

export const deleteSalesForceTerritory = async (
  configId,
  empId,
  setLoading,
  cb
) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.put(
      `/oms/SalesForceTerritory/DeleteSalesForceTerritory?ConfigId=${configId}&EmployeeId=${empId}`
    );
    toast.success(res?.data?.message);
    cb();
    setLoading && setLoading(false);
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setLoading && setLoading(false);
  }
};
