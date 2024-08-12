import axios from "axios";
import { toast } from "react-toastify";

// get selected business unit from store

export const getLandingPageData = (
  accId,
  buId,
  plantId,
  setLoader,
  setter,
  pageNo,
  pageSize,
  search
) => {
  setLoader(true);
  const searchPath = search ? `Searchterm=${search}&` : "";
  axios
    .get(
      `/mes/Routing/RoutingLandingPagination?${searchPath}AccountId=${accId}&BusinessUnitId=${buId}&PlantId=${plantId}&viewOrder=desc&PageNo=${pageNo}&PageSize=${pageSize}`
    )
    .then((res) => {
      const { data, status } = res;

      if (status === 200 && data) {
        setter(data);
        setLoader(false);
      }
    });
};

export const getSinglePageData = (id, setter) => {
  axios.get(`/mes/Routing/GetRoutingById?RoutingId=${id}`).then((res) => {
    const { data, status } = res;
    if (status === 200 && data) {
      setter(data);
    }
  });
};

export function saveCreateData(data, cb, setDisabled) {
  setDisabled(true);
  axios
    .post("/mes/Routing/CreateRouting", data)
    .then((res) => {
      const { data, status } = res;
      if (status === 200 && data) {
        toast.success(data.message);

        cb();
        setDisabled(false);
      }
    })
    .catch((err) => {
      toast.error(err?.response?.data?.message);
      setDisabled(false);
    });
}

export function saveEditData(data, setDisabled) {
  setDisabled(true);
  axios.put("/mes/Routing/EditRouting", data).then((res) => {
    const { data, status } = res;
    if (status === 200 && data) {
      toast.success(data.message);
      setDisabled(false);
    }
  });
}

export const getPlantNameDDL = (userId, accId, buId, setter) => {
  axios
    .get(
      `/wms/BusinessUnitPlant/GetOrganizationalUnitUserPermission?UserId=${userId}&AccId=${accId}&BusinessUnitId=${buId}&OrgUnitTypeId=7`
    )
    .then((res) => {
      setter(res?.data);
    });
};

export const getShopFloorDDL = (accId, buId, plantId, setter) => {
  axios
    .get(
      `/mes/MesDDL/GetShopfloorDDL?AccountId=${accId}&BusinessUnitid=${buId}&PlantId=${plantId}`
    )
    .then((res) => {
      setter(res.data);
    });
};
export const getBomNameDDL = (
  accId,
  buId,
  plantId,
  itemId,
  shopFloorId,
  setter
) => {
  axios
    .get(
      `/mes/MesDDL/GetBoMNameDDL?AccountId=${accId}&BusinessUnitId=${buId}&PlantId=${plantId}&ItemId=${itemId}&ShopFloorId=${shopFloorId}`
    )
    .then((res) => {
      setter(res.data);
    });
};

export const getWorkCenterNameDDL = (
  accId,
  buId,
  plantId,
  shopFloorId,
  setter
) => {
  axios
    .get(
      `/mes/MesDDL/GetWorkCenterDDL?AccountId=${accId}&BusinessUnitId=${buId}&PlantId=${plantId}&ShopFloorId=${shopFloorId}`
    )
    .then((res) => {
      // const modifiedData = res?.data?.filter(
      //   (item) => item?.label.split("-")[0].toLowerCase() === "packer"
      // );
      setter(res?.data);
    });
};

export const getItemNameDDL = (accId, buId, plantId, wrkCntrId, setter) => {
  axios
    .get(
      `/mes/MesDDL/GetItemNameByWorkCenter?AccountId=${accId}&BusinessUnitId=${buId}&PlantId=${plantId}&workCenterId=${wrkCntrId}`
    )
    .then((res) => {
      setter(
        res?.data?.map((item) => {
          return {
            ...item,
            label: item?.label + ` [${item?.code}]`,
          };
        })
      );
    });
};
export const getBillOfMaterialNameDDL = (setter) => {
  axios.get("/mes/MesDDL/GetBoMNameDDL").then((res) => {
    setter(res.data);
  });
};

export const getCreatePageData = (
  accId,
  buId,
  workCenterName,
  setFieldValue
) => {
  axios
    .get(
      `/mes/WorkCenter/GetWorkCenterById?WorkCenterId=${workCenterName.value}&AccountId=${accId}&BusinessUnitId=${buId}`
    )
    .then((res) => {
      const { data, status } = res;
      if (status === 200 && data) {
        setFieldValue(
          "laborTime",
          data.getByIdHeader.laborQty * data.getByIdHeader.machineTime
        );
        setFieldValue("machineTime", data.getByIdHeader.machineTime);
        setFieldValue("setUpTime", data.getByIdHeader.setupTime);
        setFieldValue("laborQty", data.getByIdHeader.laborQty);
        setFieldValue("laborCost", data.getByIdHeader.laborCost);
        setFieldValue("capacity", data.getByIdHeader.workCenterCapacity);
      }
    });
};
