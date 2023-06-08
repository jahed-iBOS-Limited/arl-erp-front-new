// For Communication with external API's , for example ... get data, post data etc
import axios from "axios";
import { toast } from "react-toastify";

export const getGeneralLedgerDDL = async (accId, buId, setter) => {
  try {
    let res = await axios.get(
      `/domain/BusinessUnitGeneralLedger/GetBUGeneralLedgerDDL?AccountId=${accId}&BusinessUnitId=${buId}&AccountGroupId=0`
    );
    if (res?.status === 200) {
      setter(
        res?.data?.map((item) => {
          return {
            ...item,
            value: item?.generalLedgerId,
            label: item?.generalLedgerName,
          };
        })
      );
    }
  } catch (err) {
    setter([]);
  }
};

export const saveData = async (payload, setIsLoading) => {
  setIsLoading(true);
  try {
    let res = await axios.post(
      `/costmgmt/BusinessUnitGeneralLedger/SaveWIPSetup`,
      payload
    );
    if (res?.status === 200) {
      toast.success(res?.data?.message, { toastId: "saveData" });
      setIsLoading(false);
    }
  } catch (err) {
    toast.warning(err?.response?.data?.message, {
      toastId: "saveDataErr",
    });
    setIsLoading(false);
  }
};

export const getByDDLId = async (accId, buId, setIsLoading, setter) => {
  setIsLoading(true);
  try {
    let res = await axios.get(
      `/costmgmt/BusinessUnitGeneralLedger/GetWIPSetup?AccountId=${accId}&BusinessUnitId=${buId}`
    );
    if (res?.status === 200) {
      const data = res?.data;
      setter({
        id: data?.setupId,
        materialWIP: {
          value: data?.materialWipglid,
          label: data?.materialWipglName,
        },
        overheadCost: {
          value: data?.overheadCostGlid,
          label: data?.overheadCostGlName,
        },
      });
      setIsLoading(false);
    }
  } catch (err) {
    setIsLoading(false);
  }
};
