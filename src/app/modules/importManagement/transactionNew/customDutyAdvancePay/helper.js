import axios from "axios";
import { toast } from "react-toastify";



// Get Shipment DDL
export const getShipmentDDL = async (
   accountId,
   businessUnitId,
   searchValue,
   setter
 ) => {
   try {
     let res = await axios.get(
       `/imp/ImportCommonDDL/GetShipmentListForAllCharge?accountId=${accountId}&businessUnitId=${businessUnitId}&search=${searchValue}`
     );
     if (res?.status === 200) {
       setter(res?.data);
     }
   } catch (err) {
     toast.warning(err?.response?.data?.message);
   }
 };