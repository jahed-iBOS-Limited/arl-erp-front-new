export const plantNameDDLApi = (buId, accId, userId) => {
  return `/wms/BusinessUnitPlant/GetOrganizationalUnitUserPermission?UserId=${userId}&AccId=${accId}&BusinessUnitId=${buId}&OrgUnitTypeId=7`;
};

export const shopFloorNameDDLApi = (accId, buId, plantId) => {
  return `/mes/MesDDL/GetShopfloorDDL?AccountId=${accId}&BusinessUnitid=${buId}&PlantId=${plantId}`;
};

export const machineNameDDLApi = (buId, autoId) => {
  return `/mes/MSIL/GetAllMSIL?PartName=BreakDownMachineDDL&BusinessUnitId=${buId}&AutoId=${autoId}`;
};

export const itemNameDDLApi = (accId, buId, PlantId, searchText) => {
  return `/mes/MesDDL/GetItemNameDDL?AccountId=${accId}&BusinessUnitId=${buId}&PlantId=${PlantId}&Search=${searchText}`;
};

export const bomNameDDLApi = ({
  buId,
  accId,
  plantId,
  itemId,
  shopFloorId,
}) => {
  return `/mes/MesDDL/GetStandardBoMNameDDL?AccountId=${accId}&BusinessUnitId=${buId}&PlantId=${plantId}&ItemId=${itemId}&ShopFloorId=${shopFloorId}`;
};

export const getLandingData = (
  buId,
  plantId,
  shopId,
  machineId,
  pageNo,
  pageSize,
) => {
  return `/mes/OeeProductWaste/GetCapacityConfigurationPagination?businessUnitId=${buId}&plantId=${plantId}&shopFloorId=${shopId ||
    0}&machineId=${machineId}&pageNo=${pageNo}&pageSize=${pageSize}`;
};

// class CapacityConfigurationAPIs {
//     constructor(buId, accId, userId) {
//       this.buId = buId;
//       this.accId = accId;
//       this.userId = userId;
//     }

//     plantNameDDLApi = () =>
//       `/wms/BusinessUnitPlant/GetOrganizationalUnitUserPermission?UserId=${this.userId}&AccId=${this.accId}&BusinessUnitId=${this.buId}&OrgUnitTypeId=7`;

//     shopFloorNameDDLApi = (plantId) =>
//       `/mes/MesDDL/GetShopfloorDDL?AccountId=${this.accId}&BusinessUnitid=${this.buId}&PlantId=${plantId}`;

//     machineNameDDLApi = (autoId) =>
//       `/mes/MSIL/GetAllMSIL?PartName=BreakDownMachineDDL&BusinessUnitId=${this.buId}&AutoId=${autoId}`;

//     itemNameDDLApi = (plantId) =>
//       `/mes/MesDDL/GetItemNameDDL?AccountId=${this.accId}&BusinessUnitId=${this.buId}&PlantId=${plantId}`;

//     bomNameDDLApi = (plantId, itemId, shopFloorId) =>
//       `/mes/MesDDL/GetBoMNameDDL?AccountId=${this.accId}&BusinessUnitId=${this.buId}&PlantId=${plantId}&ItemId=${itemId}&ShopFloorId=${shopFloorId}`;
//   }

//   export default CapacityConfigurationAPIs;
