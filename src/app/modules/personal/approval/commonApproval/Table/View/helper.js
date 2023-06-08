import Axios from "axios";

export const getSingleDataById = async (
  bomId,
  setter,
  setRowDto,
  setCostElementRowData,
  setDisabled
) => {
  setDisabled(true);
  try {
    const res = await Axios.get(`/mes/BOM/GetBOMView?BOMId=${bomId}`);
    if (res?.status === 200) {
      const {
        plantId,
        plantName,
        shopFloorId,
        shopFloorName,
        billOfMaterialName,
        billOfMaterialId,
        billOfMaterialCode,
        itemId,
        itemName,
        lotSize,
        wastagePercentage,
        isStandardBoM,
        itemCode,
        boMUOMName,
        boMuoMid,
        boMItemVersionName
      } = res?.data?.objHeaderDTO;

      const newData = {
        billOfMaterialId: billOfMaterialId,
        plant: {
          value: plantId,
          label: plantName,
        },
        shopFloor: {
          value: shopFloorId,
          label: shopFloorName,
        },
        bomName: billOfMaterialName,
        bomVersion: boMItemVersionName,
        bomCode: billOfMaterialCode,
        product: {
          value: itemId,
          label: itemName,
        },
        lotSize: lotSize,
        netWeight: "",
        wastage: wastagePercentage,
        isStandardBoM: isStandardBoM,
        itemCode: itemCode,
        objList: res?.data?.objList,
        costCenter: "",
        headerUOM: {
          value: boMuoMid,
          label: boMUOMName,
        },
        material: "",
        quantity: "",
      };
      const newRowData = res?.data?.objList?.map((item, index) => ({
        ...item,

        material: {
          value: item?.rowItemId,
          label: item?.rowItemName,
          description: item?.uomName,
        },
        quantity: item?.quantity,
        uomName: item?.uomName,
      }));

      setCostElementRowData(res?.data?.boEdata);
      setRowDto(newRowData);
      setter(newData);
      setDisabled(false);
    }
  } catch (error) {
    setDisabled(false);
  }
};

