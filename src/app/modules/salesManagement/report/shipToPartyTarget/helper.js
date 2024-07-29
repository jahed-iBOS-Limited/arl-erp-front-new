import axios from "axios";
import { toast } from "react-toastify";

export const getTargetEntryData = async (
  buId,
  levelId,
  channelId,
  setter,
  setLoading,
  areaId
) => {
  setLoading(true);
  try {
    const res = await axios.get(
      `/oms/Complains/OperationalSetupNEmployee?BusinessUnitId=${buId}&LevelId=${levelId}&ChannelId=${channelId}&areaId=${areaId}`
    );
    setter(
      res?.data?.map((item) => ({ ...item, targetQty: "", isSelected: false }))
    );
    setLoading(false);
  } catch (error) {
    setter([]);
    toast.error(error?.response?.data?.message);
    setLoading(false);
  }
};

 