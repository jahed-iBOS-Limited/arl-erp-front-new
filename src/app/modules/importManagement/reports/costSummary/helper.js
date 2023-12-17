import axios from "axios";
import { toast } from "react-toastify";

export const getCostingSummary = async (
  poId,
  lcId,
  shipmentId,
  setter,
  setLoader
) => {
  setLoader(true);
  const typeID = shipmentId ? 2 : 1;
  // const shipmentID = shipmentId ?? 0;
  const shipmentID = typeID === 1 ? 0 : shipmentId;
  
  try {
    let query = `/imp/ImportReport/ImportCostSheetReport?lcId=${lcId}&`;
    // if (lcId) {
    //   query += `lcId=${lcId}&`;
    // }
    if (poId) {
      query += `poId=${poId}&`;
    }
    
    if (shipmentID === 0 || shipmentId) {
      query += `shipmentId=${shipmentID}&`;
    }
    if (typeID) {
      query += `typeId=${typeID}`;
    }
    
    // const res = await axios.get(
    //   `/imp/ImportReport/ImportCostSheetReport?lcId=${lcId}&poId=${poId}&shipmentId=${shipmentID}&typeId=${typeID}`
    // );
    let res = await axios.get(query);
    if (res?.data) {
      setter(res?.data);
      setLoader(false);
    } else {
      setter([]);
      setLoader(false);
    }
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setLoader(false);
  }
};

// get shipment DDL
export const getShipmentDDL = async (accId, buId, poLc, setter, formCommonApproval) => {
  const requestURL = formCommonApproval
    ? `/imp/ImportCommonDDL/GetInfoFromPoLcDDLApprove?accId=${accId}&buId=${buId}&searchTerm=${poLc}`
    : `/imp/ImportCommonDDL/GetInfoFromPoLcDDL?accId=${accId}&buId=${buId}&searchTerm=${poLc}`;
    
  try {
    const res = await axios.get(
      requestURL
    );
    setter(res?.data);
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
};

export const getReportHeaderInfo = async (accId, buId, setter) => {
  try {
    const res = await axios.get(
      `/imp/ImportReport/GetBusinessUnitDetails?accountId=${accId}&businessUnitId=${buId}`
    );
    setter(res?.data);
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
};
