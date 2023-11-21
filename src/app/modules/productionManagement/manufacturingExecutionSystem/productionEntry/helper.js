import axios from "axios";
import { toast } from "react-toastify";

export const getGridData = async (
  accId,
  buId,
  plId,
  shopFloorId,
  setter,
  setLoading,
  pageNo,
  pageSize,
  search,
  fromDate,
  toDate
) => {
  setLoading(true);
  const searchPath = search ? `searchTerm=${search}&` : "";
  const strFromDate = fromDate ? `fromDate=${fromDate}&` : "";
  const strToDate = toDate ? `toDate=${toDate}&` : "";
  try {
    const res = await axios.get(
      `/mes/ProductionEntry/GetProductionEntrySearchPagination?${searchPath}accountId=${accId}&businessUnitId=${buId}&PlantId=${plId}&ShopFloorId=${shopFloorId}&status=true&${strFromDate}${strToDate}PageNo=${pageNo}&PageSize=${pageSize}&viewOrder=desc`
    );

    if (res.status === 200 && res?.data) {
      setter(res?.data);
      setLoading(false);
    }
  } catch (error) {
    setLoading(false);
  }
};

export const getsbuDDL = async (accId, buId, setter) => {
  try {
    const res = await axios.get(
      `/costmgmt/SBU/GetSBUListDDL?AccountId=${accId}&BusinessUnitId=${buId}&Status=true`
    );
    if (res?.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {
    setter([]);
  }
};

export const getShopFloorDDL = async (accId, buId, plantId, setter) => {
  try {
    const res = await axios.get(
      `/mes/MesDDL/GetShopfloorDDL?AccountId=${accId}&BusinessUnitid=${buId}&PlantId=${plantId}`
    );
    if (res.status === 200 && res.data) {
      setter(res.data);
    }
  } catch (error) {}
};

export const getProductionOrderDDL = async (
  accId,
  buId,
  plantId,
  shopFloorId,
  workCenterId,
  setter
) => {
  // console.log(plantId)
  try {
    const res = await axios.get(
      `/mes/MesDDL/GetProductionOrderDDL?AccountId=${accId}&BusinessUnitId=${buId}&PlantId=${plantId}&ShopFloorId=${shopFloorId}&WorkCenterId=${workCenterId}`
    );

    if (res.status === 200 && res.data) {
      setter(res.data);
      // console.log(res.data);
    }
  } catch (error) {}
};

export const getItemNameDDL = async (accId, buId, plantId, setter) => {
  try {
    const res = await axios.get(
      `/mes/MesDDL/GetItemNameDDL?AccountId=${accId}&BusinessUnitId=${buId}&PlantId=${plantId}`
    );

    if (res.status === 200 && res.data) {
      setter(res.data);
    }
  } catch (error) {}
};

export const getShiftDDL = async (accId, buId, setter) => {
  try {
    const res = await axios.get(
      `/mes/MesDDL/GetProductionShiftDDL?AccountId=${accId}&BusinessUnitId=${buId}`
    );

    if (res.status === 200 && res.data) {
      setter(res.data);
    }
  } catch (error) {}
};

export const getWorkCenterDDL = async (
  accId,
  buId,
  plantId,
  shopFloorId,
  setter
) => {
  try {
    const res = await axios.get(
      `/mes/MesDDL/GetWorkCenterDDL?AccountId=${accId}&BusinessUnitId=${buId}&PlantId=${plantId}&ShopFloorId=${shopFloorId}`
    );

    if (res.status === 200 && res.data) {
      setter(res.data);
    }
  } catch (error) {}
};

export const createProductionEntry = async (
  payload,
  cb,
  isCheck,
  setDisabled
) => {
  setDisabled(true);
  try {
    const res = await axios.post(
      `/mes/ProductionEntry/CreateProductionEntry?check=${isCheck}`,
      payload
    );
    if (res.status === 200 && res.data) {
      toast.success(res?.data?.message || "Created Successfully!", {
        toastId: "createProductionEntry",
      });
      setDisabled(false);
      cb();
    }
  } catch (error) {
    toast.warning(error?.response?.data?.message, {
      toastId: "createProductionEntryErr",
    });
    setDisabled(false);
  }
};
export const createProductionEntryForBackCalculation = async (
  payload,
  cb,
  setDisabled
) => {
  setDisabled(true);
  try {
    const res = await axios.post(
      `/mes/BackCalculation/CreateProductionEntryBackcalculation`,
      payload
    );
    // console.log("payload: ", payload);

    if (res.status === 200 && res.data) {
      toast.success(res?.data?.message || "Created Successfully!", {
        toastId: "createProductionEntry",
      });
      setDisabled(false);
      cb();
    }
  } catch (error) {
    toast.warning(error?.response?.data?.message, {
      toastId: "createProductionEntryErr",
    });
    setDisabled(false);
  }
};
//for ------- WITHOUT ------ back calculation api
export const getSingleDataById = async (
  productionId,
  accId,
  buId,
  setter,
  setRowData
) => {
  try {
    const res = await axios.get(
      `/mes/ProductionEntry/GetProductionEntryById?ProductionId=${productionId}&accountId=${accId}&BusinessUnitId=${buId}`
    );

    if (res.status === 200 && res.data) {
      // console.log(res.data);
      let response = res.data;
      let newObj = {
        ...response,
        plantName: {
          value: response.objHeader.plantId,
          label: response.objHeader.plantName,
        },
        itemName: response.objHeader.itemName,
        plantId: response.objHeader.plantId,
        shift: {
          value: response.objHeader.shiftId,
          label: response.objHeader.shiftName,
        },
        productionOrder: {
          value: response.objHeader.productionOrderId,
          label: response.objHeader.productionOrderCode,
        },
        dteProductionDate: response.objHeader?.dteProductionDate,
        goodQty: response?.objRow[0]?.outPutQuantity,
        checkOutputItem: response?.objRow?.length > 1 ? true : false,

        productionRowId: response?.objRow[0]?.productionRowId,
        outputItemName: response?.objRow[0]?.strItemName,
      };
      let newObjRow = response?.objRow.map((item) => {
        return {
          ...item,
          productionRowId: item?.productionRowId,
          itemName: item?.strItemName,
          numQuantity: item?.outPutQuantity,
          approvedQuantity: item?.outPutQuantity,
        };
      });
      setter(newObj);
      setRowData(newObjRow?.filter((item, index) => index !== 0));
    }
  } catch (error) {}
};
//for back calculation api
export const getSingleDataByForBackCalculation = async (
  productionId,
  setter,
  setTableData
) => {
  try {
    const res = await axios.get(
      `/mes/BackCalculation/GetProductionEntryById?productionId=${productionId}`
    );

    if (res?.status === 200 && res?.data) {
      // console.log(res.data);
      let response = res.data;
      let newObj = {
        ...response,
        plantName: {
          value: response?.header?.plantId,
          label: response?.header?.plantName,
        },
        location: {
          value: response?.header?.locationData?.value,
          label: response?.header?.locationData?.label,
        },
        itemName: response?.header?.itemName,
        plantId: response?.header?.plantId,
        shift: {
          value: response?.header?.shiftId,
          label: response?.header?.shiftName,
        },
        // productionOrder: {
        //   value: response.objHeader.productionOrderId,
        //   label: response.objHeader.productionOrderCode,
        // },
        dteProductionDate: response.header?.productionDate,
        goodQty: response?.row[0]?.numQuantity,
        // checkOutputItem: response?.objRow?.length > 1 ? true : false,

        productionRowId: response?.row[0]?.productionId,
        outputItemName: response?.row[0]?.strItemName,
      };
      let newObjRow = response?.row?.map((item) => {
        return {
          ...item,
          productionRowId: item?.productionId,
          itemName: item?.itemName,
          uomName: item?.uomname,
          numQuantity: item?.numQuantity,
          approvedQuantity: item?.numQuantity,
          isMain: item?.isMain,
        };
      });
      setter(newObj);
      setTableData(newObjRow);
      // ?.filter((item, index) => index !== 0)
    }
  } catch (error) {}
};

//for ------ WITHOUT ------- back calculation approve by id
export const getSingleDataByIdApprove = async (
  productionId,
  accId,
  buId,
  setter,
  setRowData
) => {
  try {
    const res = await axios.get(
      `/mes/ProductionEntry/GetProductionEntryById?ProductionId=${productionId}&accountId=${accId}&BusinessUnitId=${buId}`
    );

    if (res?.status === 200 && res?.data) {
      // console.log(res.data);
      let response = res?.data;
      let newObj = {
        ...response,
        productionId,
        plantName: {
          value: response?.objHeader?.plantId,
          label: response?.objHeader?.plantName,
        },
        itemName: response?.objHeader?.itemName,
        plantId: response?.objHeader?.plantId,
        shift: {
          value: response?.objHeader?.shiftId,
          label: response?.objHeader?.shiftName,
        },
        productionOrder: {
          value: response?.objHeader?.productionOrderId,
          label: response?.objHeader?.productionOrderCode,
        },
        dteProductionDate: response?.objHeader?.dteProductionDate,
        goodQty: response?.objRow[0]?.outPutQuantity,
        checkOutputItem: response?.objRow?.length > 1 ? true : false,

        productionRowId: response?.objRow[0]?.productionRowId,
        outputItemName: response?.objRow[0]?.strItemName,
      };
      let newObjRow = response?.objRow.map((item) => {
        return {
          ...item,
          productionRowId: item?.productionRowId,
          itemName: item?.strItemName,
          numQuantity: item?.outPutQuantity,
          approvedQuantity: item?.outPutQuantity,
          isMain: item?.isMain,
        };
      });
      setter(newObj);
      setRowData(newObjRow);
    }
  } catch (error) {}
};

//for back calculation approve by id
export const getSingleDataByIdForBackCalculation = async (
  productionId,
  setter,
  setTableData
) => {
  try {
    const res = await axios.get(
      `/mes/BackCalculation/GetProductionEntryById?productionId=${productionId}`
    );

    if (res?.status === 200 && res?.data) {
      let response = res?.data;
      let newObj = {
        ...response,
        plantName: {
          value: response?.header?.plantId,
          label: response?.header?.plantName,
        },

        itemName: response?.header?.itemName,
        plantId: response?.header?.plantId,
        shift: {
          value: response?.header?.shiftId,
          label: response?.header?.shiftName,
        },
        // productionOrder: {
        //   value: response.objHeader.productionOrderId,
        //   label: response.objHeader.productionOrderCode,
        // },
        dteProductionDate: response.header?.productionDate,
        goodQty: response?.row[0]?.numQuantity,
        // checkOutputItem: response?.objRow?.length > 1 ? true : false,

        productionRowId: response?.row[0]?.productionId,
        outputItemName: response?.row[0]?.strItemName,
      };
      let newObjRow = response?.row?.map((item) => {
        return {
          ...item,
          productionRowId: item?.productionId,
          itemName: item?.itemName,
          uomName: item?.uomname,
          numQuantity: item?.numQuantity,
          approvedQuantity: item?.outPutQuantity,
        };
      });
      setter(newObj);
      setTableData(newObjRow?.filter((item, index) => index !== 0));
    }
  } catch (error) {}
};

export const editProductionEntry = async (payload, setDisabled) => {
  setDisabled(true);
  try {
    const res = await axios.put(
      `/mes/ProductionEntry/EditProductionEntry`,
      payload
    );

    if (res.status === 200 && res.data) {
      toast.success(res?.data?.message || "Updated Successfully!");
      setDisabled(false);
    }
  } catch (error) {
    toast.error("Sorry! Can not update now. Try again later.");
    setDisabled(false);
  }
};

export const editApprovalProductionEntry = async ({
  payload,
  setDisabled,
  setSaveBtnDisabled,
  IssueReturnHandler,
  values,
  rowData,
  singleData,
  params,
  profileData,
  selectedBusinessUnit,
}) => {
  setDisabled(true);
  try {
    const res = await axios.put(
      `/mes/ProductionEntry/ApproveProductionEntry`,
      payload
    );

    if (res.status === 200 && res.data) {
      toast.success(res?.data?.message || "Approved Successfully!");
      setDisabled(false);
      setSaveBtnDisabled(true);
      [2]?.includes(+params?.backCalculationId) &&
        IssueReturnHandler &&
        IssueReturnHandler({
          response: res?.data,
          values,
          rowData,
          singleData,
          profileData,
          selectedBusinessUnit,
        });
    }
  } catch (error) {
    // toast.error("Sorry! Can not approve now. Try again later.");
    toast.error(error?.response?.data?.message);
    setDisabled(false);
  }
};

export const editApprovalProductionEntryForBackCalculation = async (
  payload,
  setDisabled,
  setSaveBtnDisabled
) => {
  // console.log('payload : ', payload);
  setDisabled(true);
  try {
    const res = await axios.put(
      `/mes/BackCalculation/ApproveProductionEntryBackCalculation`,
      payload
    );

    if (res.status === 200 && res.data) {
      toast.success(res?.data?.message || "Approved Successfully!");
      setDisabled(false);
      setSaveBtnDisabled(true);
    }
  } catch (error) {
    // toast.error("Sorry! Can not approve now. Try again later.");
    toast.error(error?.response?.data?.message);
    setDisabled(false);
  }
};

export const getOtherOutputItemDDL = async (accId, buId, plantId, setter) => {
  try {
    const res = await axios.get(
      `/mes/MesDDL/GetOthersOutputItemDDL?AccountId=${accId}&BusinessUnitId=${buId}&PlantId=${plantId}`
    );

    if (res.status === 200 && res.data) {
      setter(res.data);
    }
  } catch (error) {}
};

// Plant DDL for Landing

export const getPlantNameDDL = async (userId, accId, buId, setter) => {
  try {
    const res = await axios.get(
      `/wms/BusinessUnitPlant/GetOrganizationalUnitUserPermission?UserId=${userId}&AccId=${accId}&BusinessUnitId=${buId}&OrgUnitTypeId=7`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {
    //
  }
};

export const getOrderQuantityDDL = async (
  accId,
  buId,
  plantId,
  poId,
  setter
) => {
  try {
    const res = await axios.get(
      `/mes/MesDDL/GetOrderQuantityDDL?AccountId=${accId}&BusinessUnitId=${buId}&PlantId=${plantId}&ProductionOrderId=${poId}`
    );

    if (res.status === 200 && res.data) {
      setter(res.data);
    }
  } catch (error) {}
};

export const getProductionItemQuantity = async (poId, itemId, setter) => {
  try {
    const res = await axios.get(
      `/mes/ProductionEntry/GetProductionItemQuantity?ProductionOrderId=${poId}&ItemId=${itemId}`
    );

    if (res.status === 200 && res.data) {
      setter(res.data);
    }
  } catch (error) {}
};

export const productionOrderAction = async (poId, updateRowDto, setRowDto) => {
  try {
    const res = await axios.put(
      `/mes/ProductionOrder/ProductionOrderClose?ProductionId=${poId}`
    );
    if (res.status === 200) {
      toast.success(res.data?.message || "leave movement successfully");
      setRowDto(updateRowDto);
    }
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
};

export const GetMESConfigurationBusinessUnitWiseByAccountId = async (
  accId,
  buId,
  setter
) => {
  try {
    const res = await axios.get(
      `/mes/BOM/GetMESConfigurationBusinessUnitWiseByAccountId?accountId=${accId}&businessUnitId=${buId}`
    );
    setter(res.data);
  } catch (error) {}
};

export const getItemListForBackCalculation = async (
  accId,
  buId,
  plantId,
  shopFloorId,
  workCenterId,
  setter
) => {
  try {
    const res = await axios.get(
      `/mes/MesDDL/GetItemListForBackCalculation?accountId=${accId}&businessUnitId=${buId}&plantId=${plantId}&shopFloorId=${shopFloorId}&workCenterId=${workCenterId}`
    );
    let data = res?.data?.map((item) => ({
      ...item,
      value: item?.itemId,
      label: item?.itemName,
      isMain: true,
    }));
    setter(data);
  } catch (error) {}
};

export const getRoutingToBOMDDL = async (
  accId,
  buId,
  itemId,
  workCenterId,
  shopFloorId,
  setter
) => {
  try {
    const res = await axios.get(
      `/mes/MesDDL/GetRoutingToBOMDDL?AccountId=${accId}&BusinessUnitId=${buId}&ItemId=${itemId}&WorkCenterId=${workCenterId}&ShopFloorId=${shopFloorId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

export const getWarehouseDDL = async (
  userId,
  accId,
  buId,
  plantId,
  orgId,
  setter
) => {
  try {
    const res = await axios.get(
      `/wms/BusinessUnitPlant/GetOrganizationalUnitUserPermissionforWearhouse?UserId=${userId}&AccId=${accId}&BusinessUnitId=${buId}&PlantId=${plantId}&OrgUnitTypeId=8`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

//Image Attachment
export const empAttachment_action = async (attachment, cb) => {
  let formData = new FormData();
  attachment.forEach((file) => {
    formData.append("files", file?.file);
  });
  try {
    let { data } = await axios.post("/domain/Document/UploadFile", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    // toast.success(res?.data?.message || "Submitted Successfully");
    toast.success(data?.message || "Upload  successfully");
    return data;
  } catch (error) {
    toast.error("Document not upload");
  }
};
