import Axios from "axios";
import { toast } from "react-toastify";

export const getRouteDDL = async (accId, buId, setter) => {
  try {
    const res = await Axios.get(
      `/rtm/RTMDDL/RouteNameDDL?AccountId=${accId}&BusinessUnitId=${buId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {
    
  }
};

export const getBeatNameDDL = async (routeId, setter) => {
  try {
    const res = await Axios.get(`/rtm/RTMDDL/BeatNameDDL?RouteId=${routeId}`);
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {
    
  }
};

export const getOutletNameDDL = async (routeId, setter) => {
  try {
    const res = await Axios.get(`/rtm/RTMDDL/OutletNameDDL?RouteId=${routeId}`);
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {
    
  }
};

export const getItemDDL = async (setter, accId, buId, chId) => {
  try {
    const res = await Axios.get(`/rtm/RTMCommonProcess/GetOutletItemInfo?AccountId=${accId}&BUnitId=${buId}&ChannelId=${chId}`);
    if (res?.status === 200 && res?.data) {
      let newArray = res.data.map((item)=>{
        return {
          orderId: 0,
          rowId: 0,
          itemId: item.itemId,
          itemName: item.itemName,
          uomId:item.uomId,
          orderQty: 0,
          rate: item?.itemRate,
          uomName: item?.uomName,
          amount: 0,
        };
      })
      setter(newArray);
    }
  } catch (error) {
    
  }
};

export const getOutletInfoDDL = async (accId, busId, setter) => {
  try {
    const res = await Axios.get(
      `/rtm/RTMDDL/GetOutletInfoDDL?AccountId=${accId}&BusinessUnitId=${busId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {
    
  }
};

export const getSecondaryOrderLanding = async (
  accountId,
  buId,
  setLoading,
  pageNo,
  pageSize,
  setter
) => {
  setLoading(true);
  try {
    const res = await Axios.get(
      `/rtm/SecondaryOrder/GetSecondaryOrderPasignation?AccountId=${accountId}&BusinessUnitId=${buId}&viewOrder=desc&PageNo=${pageNo}&PageSize=${pageSize}`
    );
    if (res.status === 200 && res?.data) {
      setLoading(false);
      setter(res?.data);
      console.log(res?.data, "data");
    }
  } catch (error) {
    setLoading(false);
    
  }
};

export const savSecondaryOrderAction = async (data, cb, setDisabled) => {
  setDisabled(true);
  try {
    const res = await Axios.post(
      `/rtm/SecondaryOrder/CreateSecondaryOrder`,
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

export const saveEditedSecondaryOrder = async (data, setDisabled) => {
  setDisabled(true);
  try {
    const res = await Axios.put(`/rtm/SecondaryOrder/EditSecondaryOrder`, data);
    if (res.status === 200) {
      toast.success(res.data?.message || "Edited successfully");
      setDisabled(false);
    }
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setDisabled(false);
  }
};

export const getSingleData = async (ordrId, setter) => {
  try {
    const res = await Axios.get(
      `/rtm/SecondaryOrder/GetSecondaryOrderById?OrderId=${ordrId}`
    );

    let header = res?.data?.objHeader;
    let objRow = res?.data?.objRow;
    
    const obj = {
      routeName: {
        value: header[0]?.routeId,
        label: header[0]?.routeName,
      },
      beatName: {
        value: header[0]?.beatId,
        label: header[0]?.beatName,
      },
      outlateName: {
        value: header[0]?.outletid,
        label: header[0]?.outletName,
      },
      territoryName: {
        value: header[0]?.territoryId,
        label: header[0]?.territoryName,
      },
      distributorName: {
        value: header[0]?.businessPartnerId,
        label: header[0]?.businessPartnerName,
      },
      distributionChannel: {
        value: header[0]?.distributionChannelId,
        label: header[0]?.distributionChannelName,
      },
      item: "",
      uomName: "",
      orderQuantity: "",
      rate: "",
      orderAmount: "",
      orderId: header[0]?.orderId,
      receivedAmount: header[0]?.receiveAmount,
      row: objRow,
    };
    setter(obj);
  } catch (error) {
    
  }
};



export const getTerrotoryDDL = async (accId, buId, setter) => {
  try {
    let res = await Axios.get(
      `/rtm/RTMDDL/TerritoryDDL?AccountId=${accId}&BusinessUnitId=${buId}`
    );
    if (res?.status === 200) {
      setter(res?.data);
    }
  } catch (err) {
    if (err?.response?.status === 500) {
      toast.warning(err?.response?.data?.message)
    }
  }
};


export const getdistributorNameDDL = async (accId, buId,tId, setter,setFieldValue) => {
  try {
    let res = await Axios.get(
      `/rtm/RTMDDL/GetCustomerDDL?AccountId=${accId}&BusinessUnitId=${buId}&TerrytoryId=${tId}`
    );
    if (res?.status === 200) {
      setter(res?.data);
      setFieldValue("distributionChannel", res?.data[0] || "" )
    }
  } catch (err) {
    if (err?.response?.status === 500) {
      toast.warning(err?.response?.data?.message)
    }
  }
};


export const getdistributorCahnelNameDDL = async (accId, buId,prId, setter) => {
  try {
    let res = await Axios.get(
      `/rtm/RTMDDL/GetDistributinChannelByPartnerIdDDL?AccountId=${accId}&BusinessUnitId=${buId}&BusinessPartnetId=${prId}`
    );
    if (res?.status === 200) {
      setter(res?.data);
    }
  } catch (err) {
    if (err?.response?.status === 500) {
      toast.warning(err?.response?.data?.message)
    }
  }
};
