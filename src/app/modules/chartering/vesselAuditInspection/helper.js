import axios from "axios";

export const getVesselDDL = async (type, buId, setter, setLoading) => {
  setLoading(true);
  try {
    const res = await axios.get(
      `/hcm/VesselAuditInspection/GetTypeWiseVesselDDL?type=${type}&businessUnitId=${buId}`
    );
    setter(res?.data);
    setLoading(false);
  } catch (error) {
    setter([]);
    setLoading(false);
  }
};
export const getAuditTypeDDL = async (setter, setLoading) => {
  setLoading(true);
  try {
    const res = await axios.get(
      `/hcm/VesselAuditInspection/GetVesselAuditInspectionTypeDDL`
    );
    setter(res?.data);
    setLoading(false);
  } catch (error) {
    setter([]);
    setLoading(false);
  }
};
export const getCategoryDDL = async (setter, setLoading) => {
  setLoading(true);
  try {
    const res = await axios.get(
      `/hcm/VesselAuditInspection/GetVesselAuditInspectionCategoryDDL`
    );
    setter(res?.data);
    setLoading(false);
  } catch (error) {
    setter([]);
    setLoading(false);
  }
};
