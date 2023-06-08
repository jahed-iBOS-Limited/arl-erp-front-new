import Axios from "axios";
import { toast } from "react-toastify";
import { createFile } from "../../../_helper/excel";

export const getInventoryAgingLanding = async (
  unitId,
  warehouseId,
  fromDate,
  toDate,
  setter,
  pageNo,
  pageSize,
  setLoading,
) => {
  try {
    setLoading(true);
    const res = await Axios.get(
      `/wms/WmsReport/GetInventoryAging?BusinessUnitId=${unitId}&WarehouseId=${warehouseId}&FromDate=${fromDate}&ToDate=${toDate}&PageNo=${pageNo}&PageSize=${pageSize}`
    );
    setter && setter(res?.data);
    setLoading(false);
  } catch (error) {
    setLoading(false);
    toast.error(error?.response?.data?.message || "Error occured");
    setter([]);
  }
};

//businessUnitPlant_api Api call
export const businessUnitPlant_api = async (
  accId,
  buId,
  userId,
  plantId,
  setter
) => {
  try {
    const res = await Axios.get(
      `/wms/BusinessUnitPlant/GetOrganizationalUnitUserPermission?UserId=${userId}&AccId=${accId}&BusinessUnitId=${buId}&OrgUnitTypeId=${plantId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};
//Wearhouse_api Api call
export const wearhouse_api = async (accId, buId, userId, plantId, setter) => {
  try {
    const res = await Axios.get(
      `/wms/BusinessUnitPlant/GetOrganizationalUnitUserPermissionforWearhouse?UserId=${userId}&AccId=${accId}&BusinessUnitId=${buId}&PlantId=${plantId}&OrgUnitTypeId=8`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

class Cell {
  constructor(label,align,format){
      this.text= label;
      this.alignment=`${align}:middle`;
      this.format=format
  }
  getCell () {
      return  {
          text:this.text,
          fontSize:7,
          border:"all 000000 thin",
          alignment:this.alignment || "",
          textFormat:this.format
      }
  }
}

const getTableData = (row) => {
  const data =row?.map((item, index) => {
    return [
        new Cell(index+1,"center","text").getCell(),
        new Cell(item?.code,"left","text").getCell(),
        new Cell(item?.itemName,"left","text").getCell(),
        new Cell(item?.uoM,"left","text").getCell(),
        new Cell(item?.stockQty,"right","number").getCell(),
        new Cell(item?.stockCoverDay,"right","number").getCell(),
        new Cell(item?.avgUseDay,"right","text").getCell(),
        new Cell(item?.lastIssueDays,"right","text").getCell(),
        new Cell(item?.leadTime,"right","number").getCell(),
    ];
  });
  return data
};

export const generateExcel = (header, row,setLoading) => {
  console.log("rowdata",row);
  setLoading(true)
  const excel = {
    name: "Inventory Analysis",
    sheets: [
      {
        name: "Inventory Analysis",
        gridLine: false,
        rows: [header, ...getTableData(row)],
      },
    ],
  };
  createFile(excel);
  setLoading(false)
};