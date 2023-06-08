import axios from "axios";
import { toast } from "react-toastify";
import { _dateFormatter } from "../../../_helper/_dateFormate";

export const deleteLighterVessel = async (id, setLoading, cb) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.put(
      `/wms/FertilizerOperation/DisableLighterVessel?LighterVesselId=${id}`
    );
    toast.success(res?.data?.message);
    cb && cb();
    setLoading && setLoading(false);
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setLoading && setLoading(false);
  }
};

export const getItemData = async (accId, buId, itemTypeId, setter) => {
  try {
    const res = await axios.get(
      `/oms/CustomerSalesTarget/GetitemDDL?AccountId=${accId}&BusinessUnitId=${buId}&ItemTypeId=${itemTypeId}`
    );
    const data = res?.data.map((itm) => ({
      value: itm.itemId,
      label: itm.itemName,
      data: itm,
    }));
    setter(data);
  } catch (error) {
    setter([]);
  }
};

export const rateUpdateAPI = async (payload, setLoading, cb) => {
  setLoading(true);
  try {
    const res = await axios.put(
      `/wms/FertilizerOperation/UpdateLighterAllotmentDetailsRate`,
      payload
    );
    toast.success(res?.data?.message);
    setLoading(false);
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setLoading(false);
  }
};

export const GetGeneralInfoById = async ({
  id,
  setter,
  setRowDto,
  setLoading,
}) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.get(
      `/wms/FertilizerOperation/ViewLighterAllotmentDetails?AllotmentNo=${id}`
    );
    let h = res?.data[0];
    const singleHeader = {
      motherVessel: {
        value: h?.motherVesselId,
        label: h?.motherVesselName,
      },
      programNo: h?.program,
      loadingPort: {
        value: h?.portId,
        label: h?.portName,
      },
      item: {
        value: h?.itemId,
        label: h?.itemName,
      },
      cnf: {
        value: h?.cnfid,
        label: h?.cnfname,
      },
      steveDore: {
        value: h?.stevedoreId,
        label: h?.stevedoreName,
      },
      allotmentDate: _dateFormatter(h?.allotmentDate),
      lotNo: h?.lotNo,
      type: h?.type || "badc",
    };

    setter && setter(singleHeader);
    setRowDto(
      res?.data?.map((item) => {
        return {
          ...item,
          label: item?.lighterVesselName,
          surveyQty: item?.surveyQnt,
          unloadingPort: {
            value: item?.shipPointId,
            label: item?.shipPointName,
          },
          isSelected: false,
        };
      })
    );
    setLoading && setLoading(false);
  } catch (error) {
    setter([]);
    toast.error(error?.response?.data?.message);
    setLoading && setLoading(false);
  }
};
