
import * as Yup from "yup";
import Axios from 'axios'
import { toast } from "react-toastify";

export const initData = {
  refType:"",
  refNo:"",
  transType:"",
  remarks:"",
  item:"",
  busiPartner:"",
  personnel:"",
  //locaStock:""
};

// // Validation schema
export const validationSchema = Yup.object().shape({
  refType: Yup.object().shape({
    label: Yup.string().required("Refference Type is required"),
    value: Yup.string().required("Refference Type is required"),
  }),
  transType: Yup.object().shape({
    label: Yup.string().required("Transaction Type is required"),
    value: Yup.string().required("Transaction Type is required"),
  })

});

export const getItemQtyforAdjustInv = async (accId,buId,plantId,whId,transName,itemId,locId,stockId, rowDtoHandler, index) => {
  try {
    const res = await Axios.get(
      `/wms/ItemPlantWarehouse/GetItemPlantWarehouseByReffLocStocktypDDL?accountId=${accId}&businessUnitId=${buId}&plantId=${plantId}&whId=${whId}&Reff=${transName}&ItemId=${itemId}&locId=${locId}&stocktypId=${stockId}`
    );
    if (res.status === 200 && res?.data) {
      if(res.data.length === 0){
        toast.error("Item not found");
      }else{
        rowDtoHandler("restQty", res?.data[0]?.availableStock, index);
        rowDtoHandler("refQty", res?.data[0]?.availableStock, index);
      }
    }
  } catch (error) {
    
  }
};

