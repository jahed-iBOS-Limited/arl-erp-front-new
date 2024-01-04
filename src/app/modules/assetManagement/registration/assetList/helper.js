import Axios from "axios";
import { toast } from "react-toastify";
import { _dateFormatter } from "../../../_helper/_dateFormate";
import { createFile } from "../../../_helper/excel/index";

export const getAssetPlantDDL = async (userId, accId, buId, setter) => {
  try {
    const res = await Axios.get(
      `/wms/BusinessUnitPlant/GetOrganizationalUnitUserPermission?UserId=${userId}&AccId=${accId}&BusinessUnitId=${buId}&OrgUnitTypeId=7`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

export const getAssetSBUDDL = async (accId, buId, setter) => {
  try {
    const res = await Axios.get(
      `/asset/DropDown/GetSbuByUnitId?AccountId=${accId}&UnitId=${buId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

export const getassetWarehouseData = async (
  userId,
  accId,
  buId,
  plId,
  setter
) => {
  try {
    const res = await Axios.get(
      `/wms/BusinessUnitPlant/GetOrganizationalUnitUserPermissionforWearhouse?UserId=${userId}&AccId=${accId}&BusinessUnitId=${buId}&PlantId=${plId}&OrgUnitTypeId=8`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

export const getGridData = async (
  accId,
  buId,
  sbuId,
  plId,
  whId,
  searchTerm,
  setter,
  setLoading,
  pageNo,
  pageSize
) => {
  try {
    setLoading(true);
    const res = await Axios.get(
      `/asset/LandingView/GetAssetList?AccountId=${accId}&UnitId=${buId}&SbuId=${sbuId}&PlantId=${plId}&WHId=0&search=${searchTerm}&PageNo=${pageNo}&PageSize=${pageSize}&viewOrder=desc`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
      setLoading(false);
    }
  } catch (error) {
    setLoading(false);
  }
};

export const getAssetReceiveDDL = async (Id, itemId, setter) => {
  try {
    const res = await Axios.get(
      `/asset/DetalisView/GetAssetReceive?AssReceiveId=${Id}&ItemId=${itemId}`
    );
    if (res.status === 200 && res?.data) {
      let header = res?.data.objHeader;
      let row = res.data.objRow;
      let newData = {
        ...header,
        itemId: row.itemId,
        itemName: row.itemName,
        transactionQuantity: row.transactionQuantity,
        transactionValue: row.transactionValue,
        uoMid: row.uoMid,
        uoMname: row.uoMname,
        objLast: res.data.objLast,
      };
      setter(newData);
    }
  } catch (error) {}
};

export const getAssignToDDL = async (accId, buId, sbuId, setter) => {
  try {
    const res = await Axios.get(
      `/asset/DropDown/GetEmployeeList?AccountId=${accId}&UnitId=${buId}&SbuId=${sbuId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

export const getresponsiblePersonDDL = async (accId, buId, sbuId, setter) => {
  try {
    const res = await Axios.get(
      `/asset/DropDown/GetEmployeeList?AccountId=${accId}&UnitId=${buId}&SbuId=${sbuId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

export const saveAssetData = async (data, cb) => {
  try {
    const res = await Axios.post(`/asset/Asset/CreateAsset`, data);
    if (res.status === 200) {
      toast.success(res?.message || "Submitted successfully");
      cb();
    }
  } catch (error) {}
};

export const saveAssetForData = async (data, cb, setter) => {
  try {
    const res = await Axios.post(`/asset/Asset/CreateAsset`, data);
    if (res.status === 200) {
      toast.success(res?.message || "Submitted successfully");
      cb();
      setter([]);
    }
  } catch (error) {}
};

export const getDepartmenttDDL = async (accId, buId, userId, setter) => {
  try {
    const res = await Axios.get(
      `/asset/DropDown/GetDepartmentList?AccountId=${accId}&UnitId=${buId}&Userid=${userId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

export const getAssignToDDLforCreate = async (accId, buId, sbuId, setter) => {
  try {
    const res = await Axios.get(
      `/asset/DropDown/GetEmployeeList?AccountId=${accId}&UnitId=${buId}&SbuId=${sbuId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

export const getresponsiblePersonDDLforCreate = async (
  accId,
  buId,
  sbuId,
  setter
) => {
  try {
    const res = await Axios.get(
      `/asset/DropDown/GetEmployeeList?AccountId=${accId}&UnitId=${buId}&SbuId=${sbuId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

export const getItemDDLforCreate = async (accId, buId, plId, whId, setter) => {
  try {
    const res = await Axios.get(
      `/asset/DropDown/GetItemListByWhId?AccountId=${accId}&UnitId=${buId}&PlantId=${plId}&WHId=${whId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

export const getSupplierDDLforCreate = async (accId, buId, setter) => {
  try {
    const res = await Axios.get(
      `/asset/DropDown/GetSupplierList?AccountId=${accId}&UnitId=${buId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

export const getItemAttributeforCreate = async (
  itemId,
  accId,
  buId,
  setter
) => {
  try {
    setter([]);
    const res = await Axios.get(
      `/asset/DetalisView/GetItem?ItemId=${itemId}&AccountId=${accId}&BusinessUnitId=${buId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

export const getBrtaDDL = async (setter) => {
  try {
    const res = await Axios.get(
      `/asset/DropDown/GetBRTAVehicleType`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {
    
  }
};

export const getSingleDataForEdit = async (accId, buId, assetId, setter) => {
  try {
    const res = await Axios.get(
      `/asset/DetalisView/GetAssetRegister?AccountId=${accId}&UnitId=${buId}&AssetId=${assetId}`
    );
    if (res.status === 200 && res?.data) {
      let currentRowData = res.data[0];
      let initDataForEdit = {
        itemName: {
          value: currentRowData.itemId,
          label: currentRowData.itemName,
          // code: currentRowData.itemCode,
        },
        referenceCode: currentRowData.poNo,
        businessPartnerName: {
          value: currentRowData.supplierId,
          label: currentRowData.supplierName,
        },
        itemCategory: currentRowData?.itemCategoryName,
        brtaType: currentRowData.brtaTypeId?{
          value: currentRowData.brtaTypeId,
          label: currentRowData.brtaTypeName,
        }:"",
        transactionDate: _dateFormatter(currentRowData.acquisitionDate),
        transactionValue: currentRowData.invoiceValue,
        acquisitionValue: currentRowData.acquisitionValue,
        manuName: currentRowData.nameManufacturer,
        countryOrigin: currentRowData.countryOrigin,
        warrentyEnd: _dateFormatter(currentRowData.warrentyEndDate),
        location: currentRowData.location,
        depriValue: currentRowData.totalDepValue,
        depriRunDate: _dateFormatter(currentRowData.depRunDate),
        assignTo: {
          value: currentRowData.usingEmployeeId,
          label: currentRowData.usingEmployeName,
        },
        usageType: {
          value: currentRowData.useTypeId,
          label: currentRowData.useTypeName,
        },
        resPerson: {
          value: currentRowData.responsibleEmployeeId,
          label: currentRowData.responsibleEmpName,
        },
        assetDes: currentRowData.assetDescription,
        departnemt: {
          value: currentRowData.usingDepartmentId,
          label: currentRowData.departmentName,
        },
        strManufacturerSerialNo: currentRowData.serialNo,
        assetName:currentRowData?.assetName,
        category: currentRowData?.assetCagegoryId ? { value: currentRowData.assetCagegoryId, label: currentRowData?.assetCagegoryName } : "",
        profitCenter: currentRowData?.profitCenter  && currentRowData?.profitCenterName ? {value:currentRowData?.profitCenter , label:currentRowData?.profitCenterName} : "",
      };
      setter(initDataForEdit);
    }
  } catch (error) {}
};

export const saveAssetListEdit = async (data, setDisabled) => {
  try {
    setDisabled(true);
    const res = await Axios.post(`/asset/Asset/CreateAsset`, data);
    if (res.status === 200) {
      toast.success(res?.message || "Submitted successfully");
      setDisabled(false);
    }
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setDisabled(false);
  }
};

export const exportExcel = async (
  accId,
  buId,
  sbuId,
  plId,
  whId,
  searchTerm,
  setLoading,
  pageNo,
  pageSize
) => {
  try {
    setLoading(true);
    const res = await Axios.get(
      `/asset/LandingView/GetAssetList?AccountId=${accId}&UnitId=${buId}&SbuId=${sbuId}&PlantId=${plId}&WHId=0&search=${searchTerm}&PageNo=${pageNo}&PageSize=${pageSize}&viewOrder=desc`
    );
    setLoading(false);
    if (res.status === 200 && res?.data) {
      const headerName = [
        "Asset Id",
        "Asset Code",
        "Asset Name",
        "Name Manufacturer",
        "Country Origin",
        "Supplier Name",
        "Acquisition Date",
        "Warrenty End Date",
      ];
      const header = headerName?.map((item) => {
        return {
          text: item,
          bold: true,
          fontSize: 12,
          textColor: "ffffff",
          bgColor: "666699",
        };
      });

      const body = res?.data?.data?.map((item, index) => {
        return [
          item?.assetId,
          String(item?.assetCode || ""),
          item?.assetName,
          item?.nameManufacturer,
          item?.countryOrigin,
          item?.supplierName,
          _dateFormatter(item?.acquisitionDate),
          _dateFormatter(item?.warrentyEndDate),
        ];
      });

      const row = [header, ...body];
      // console.log(row);

      createFile({
        name: "Asset List Report",
        sheets: [
          {
            name: "assetList",
            border: "all 000000 thin",
            alignment: "center:middle",
            rows: row,
          },
        ],
      });
    }
  } catch (error) {
    setLoading(false);
  }
};


export const getMaintenanceReport = async (
  part,
  businessUnitId,
  plantId,
  reportType,
  fromDate,
  toDate,
  intReffId,
  setter,
  setLoading
) => {
  setLoading(true);
  try {
    const res = await Axios.get(`/asset/Asset/GetAssetManitenanceRPT?intPart=${part}&intUnitId=${businessUnitId}&intPlantId=${plantId}&dteFrom=${fromDate}&dteTo=${toDate}&intReffId=${intReffId}&intRptType=${reportType}`
    );
    setLoading(false);
    setter(res?.data);
  } catch (error) {
    setter([]);
    setLoading(false);

  }
};

export const getAssetCategoryList = async (setter) => {
  try {
    const res = await Axios.get(
      `/asset/Asset/AssetCategory`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {
    
  }
};