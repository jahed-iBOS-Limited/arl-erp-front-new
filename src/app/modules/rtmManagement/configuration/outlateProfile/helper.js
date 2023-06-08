// For Communication with external API's , for example ... get data, post data etc
import Axios from "axios";
import { toast } from "react-toastify";
import { _dateFormatter } from "../../../_helper/_dateFormate";

export const getGridData = async (
  accId,
  buId,
  roId,
  btId,
  setter,
  setLoading,
  pageNo,
  pageSize
) => {
  setLoading(true);
  try {
    const res = await Axios.get(
      `/rtm/OutletProfile/GetOutletLandingPasignation?accountId=${accId}&businessUnitid=${buId}&RouteId=${roId}&BeatId=${btId}&PageNo=${pageNo}&PageSize=${pageSize}&vieworder=desc`
    );
    if (res.status === 200 && res?.data) {
      setter(res.data);
      setLoading(false);
    }
  } catch (error) {
    setLoading(false);
  }
};

export const getBusinessTypeDDL = async (accId, buId, setter) => {
  try {
    const res = await Axios.get(
      `/rtm/RTMDDL/BusinessTypeDDL?AccountId=${accId}&BusinessUnitId=${buId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

export const getTerritotoryWithLevelByEmpDDL = async (
  accId,
  buId,
  employeeId,
  setter
) => {
  try {
    const res = await Axios.get(
      `/rtm/RTMDDL/GetTerritotoryWithLevelByEmpDDL?AccountId=${accId}&BusinessUnitId=${buId}&EmployeeId=${employeeId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {
    console.log(error);
  }
};

export const getRouteNameDDL = async (accId, buId, territoryId, setter) => {
  try {
    const res = await Axios.get(
      `/rtm/RTMDDL/RouteByTerritoryIdDDL?AccountId=${accId}&BusinessUnitId=${buId}&TerritoryId=${territoryId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

export const getOutletProfileById = async (id, setter, setOutlet) => {
  try {
    const res = await Axios.get(
      `/rtm/OutletProfile/GetOutletProfileById?OutletId=${id}`
    );
    if (res.status === 200 && res?.data) {
      const headerData = res?.data?.outletProfile;
      const data = {
        ...headerData,
        businessType: {
          value: headerData.businessTypeId,
          label: headerData.businessTypeName,
        },
        routeName: {
          value: headerData?.routeId,
          label: headerData?.routeName,
        },
        beatName: {
          value: headerData?.beatId,
          label: headerData?.beatName,
        },
        marriageSatus: {
          value: headerData?.maritatualStatusId,
          label: headerData?.maritatualStatus,
        },
        maxSales: {
          value: headerData?.maxSalesItem,
          label: headerData?.maxSalesItemName,
        },
        avgSalesAmount: headerData?.monMonthlyAvgSales,
        ownerNid: headerData?.ownerNIDNo,
        tradeLicense: headerData?.tradeLicenseNo,
        isComplete: headerData?.isProfileComplete,
        outlateName: "",
        dateOfBirth: _dateFormatter(headerData.dateOfBirth),
        marriageDate: _dateFormatter(headerData.marriageDate),
        lattitude: headerData.latitude,
        isColler: headerData?.cooler,
        collerCompany: {
          value: headerData?.coolerCompanyId,
          label: headerData?.coolerCompanyName,
        },
        // longitude: "",
      };

      const attrData = {};

      const rowDto = res.data.attibuteDeatils;
      rowDto.forEach((item) => {
        if (item.outletAttributeUIType === "DDL") {
          attrData[item.outletAttributeName] = {
            value: item.attributeValueId,
            label: item.outletAttributeValueName,
          };
        }

        if (item.outletAttributeUIType === "Date") {
          attrData[item.outletAttributeName] = _dateFormatter(
            item.outletAttributeValueName
          );
        }

        if (item.outletAttributeUIType === "TextBox") {
          attrData[item.outletAttributeName] = item.outletAttributeValueName;
        }
        if (item.outletAttributeUIType === "Number") {
          attrData[item.outletAttributeName] = item.outletAttributeValueName;
        }
      });

      setter({ ...data, ...attrData });
      setOutlet(res?.data?.attibuteDeatils);
    }
  } catch (error) {}
};

export const createOutlateProfile = async (payload, cb, setLoading) => {
  setLoading(true);
  try {
    const res = await Axios.post(
      `/rtm/OutletProfile/CreateOutletProfile`,
      payload
    );
    if (res.status === 200 && res?.data) {
      toast.success(res.data?.message || "Submitted successfully");
      cb();
      setLoading(false);
    }
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setLoading(false);
  }
};

export const editOutlateProfile = async (payload, setLoading) => {
  setLoading(true);
  try {
    const res = await Axios.put(
      `/rtm/OutletProfile/EditOutletProfile`,
      payload
    );
    if (res.status === 200 && res?.data) {
      toast.success(res.data?.message || "Edited successfully");

      setLoading(false);
      // cb();
    }
  } catch (error) {
    toast.error(error?.response?.data?.message);
    toast.error("Please fill up necessary fields");
    setLoading(false);
  }
};

export const GetOutletProfileTypeAttributes = async (accId, buId, setter) => {
  try {
    const res = await Axios.get(
      `/rtm/OutletProfileType/GetOutletProfileTypeInfo?AccountId=${accId}&BusinsessUnitId=${buId}`
    );
    if (res.status === 200 && res?.data) {
      const attributes = res?.data.map((item) => {
        if (item.objAttribute.uicontrolType === "DDL") {
          const attributeValue = item.objAttributeValue.map((attr) => ({
            ...attr,
            value: attr.attributeValueId,
            label: attr.outletAttributeValueName,
            type: item.objAttribute.uicontrolType,
          }));

          return {
            ...item,
            objAttributeValue: attributeValue,
          };
        } else {
          return item;
        }
      });
      setter(attributes);
    }
  } catch (error) {}
};

export const getBeatApiDDL = async (RoId, setter) => {
  try {
    let res = await Axios.get(`/rtm/RTMDDL/BeatNameDDL?RouteId=${RoId}`);
    if (res?.status === 200) {
      setter(res?.data);
    }
  } catch (err) {
    if (err?.response?.status === 500) {
      console.log(err?.response?.data?.message);
    }
  }
};

// export const Attachment_action = async (attachment, cb) => {
//   let formData = new FormData()
//   attachment.forEach((file) => {
//     formData.append('files', file?.file)
//   })
//   try {
//     let { data } = await Axios.post('/domain/Document/UploadFile', formData, {
//       headers: {
//         'Content-Type': 'multipart/form-data',
//       },
//     })

//     toast.success('Upload  successfully')
//     return data
//   } catch (error) {
//     toast.error(error?.response?.data?.message || 'Document not upload')
//
//   }
// }

export const getMaxItemDDL = async (accId, setter) => {
  try {
    const res = await Axios.get(
      `/rtm/RTMDDL/FinishedItemDDL?AccountId=${accId}`
    );
    if (res?.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

export const editFileInfo = async (outletfId, imageDTO, settter) => {
  try {
    let payload = {
      outletFileId: outletfId,
    };
    const res = await Axios.put(`/rtm/OutletFile/EditOutletFileInfo`, payload);
    if (res?.status === 200 && res?.data) {
      let imageNewData = imageDTO.filter(
        (data) => data.outletFileId !== outletfId
      );
      settter(imageNewData);
      toast.success(res?.data?.message || "Deleted successfully");
    }
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
};

export const Attachment_action = async (attachment, setImageDTO, outletId) => {
  let formData = new FormData();
  attachment.forEach((file) => {
    formData.append("files", file?.file);
  });
  try {
    let res = await Axios.post("/domain/Document/UploadFile", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    //console.log(res)

    //toast.success('Upload  successfully')
    if (res.status === 200) {
      let imageobj = [
        {
          fileName: res.data[0].fileName,
          fileId: res.data[0].id,
          outletId: +outletId,
        },
      ];
      const response = await Axios.post(
        `/rtm/OutletFile/CreateOutletFileInfo`,
        imageobj
      );
      if (response.status === 200) {
        let responseFile = await Axios.get(
          `/rtm/OutletFile/GetOutletFileInfoById?outletId=${+outletId}`
        );
        if (responseFile?.status === 200) {
          setImageDTO(responseFile.data);
        }
      }
    }
  } catch (error) {
    toast.error(error?.response?.data?.message || "Document not upload");
  }
};

export const getFileListDDL = async (outletId, setter) => {
  try {
    const res = await Axios.get(
      `/rtm/OutletFile/GetOutletFileInfoById?outletId=${+outletId}`
    );
    if (res?.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};
