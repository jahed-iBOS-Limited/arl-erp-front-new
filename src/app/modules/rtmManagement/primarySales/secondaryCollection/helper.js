import Axios from "axios";

export const SecondaryCollectionLanding = async (
  accountId,
  buId,
  RouteId,
  orderStatus,
  setter,
  setLoading,
  pageNo,
  pageSize
) => {
  try {
    setLoading(true);
    const res = await Axios.get(
      `/rtm/SecondaryCollection/SecondaryCollectionLandingPasignation?AccountId=${accountId}&BusinessunitId=${buId}&RouteId=${RouteId}&orderStatus=${orderStatus}&PageNo=${pageNo}&PageSize=${pageSize}&vieworder=desc`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
      console.log(res?.data, "api");
      setLoading(false);
    }
  } catch (error) {
    
    setLoading(false);
  }
};

export const getrouteNameDDL_api = async (accId, buId, setter) => {
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

export const GetSecondaryCollectionView = async (OrderId, setter) => {
  try {
    const res = await Axios.get(
      `/rtm/SecondaryCollection/SecondaryCollectionOrderDeatailsById?OrderId=${OrderId}`
    );

    let row = res?.data?.objRow;

    let obj = {
      row,
    };
    setter(obj);
    console.log(obj);
  } catch (error) {
    
  }
};
