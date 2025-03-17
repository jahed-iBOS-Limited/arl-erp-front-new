import axios from "axios";
import { toast } from "react-toastify";



export const getSupplierNameDDLAction = async (accId, buId, rfqId, userId, setter) => {
  try {
    const res = await axios.get(`/procurement/ShipRequestForQuotation/GetQuotationEntrySupplierListDDL?AccountId=${accId}&BusinessUnitId=${buId}&RequestForQuotationId=${rfqId}&UserId=${userId}`);
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) { }
};

export const getQuotationEntryItemList = async (rfqId, userId, setter) => {
  try {
    const res = await axios.get(
      // `/procurement/ShipRequestForQuotation/GetRequestForQuotationShipById?RequestForQuotationId=${rfqId}`
      `/procurement/ShipRequestForQuotation/GetRFQByIdWithSupplierShip?RequestForQuotationId=${rfqId}&UserId=${userId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) { }
};

export const createQuotationEntry = async (payload, cb, setLoading) => {
  setLoading && setLoading(true);
  try {
    await axios.put(
      `/procurement/ShipRequestForQuotation/CreateRFQEntryPageShip`, payload
    );
    toast.success("Submitted successfully");
    cb && cb();
    setLoading && setLoading(false);
  } catch (error) {
    toast.warn("Something went wrong")
    setLoading && setLoading(false);
  }
};
export const updateSupplierPasss = async (payload, cb) => {
  try {
    await axios.put(
      `/domain/Information/Basic`, payload
    );
    toast.success("Password changed successfully");
    cb();
  } catch (error) {
    toast.warn("Something went wrong")
  }
};

