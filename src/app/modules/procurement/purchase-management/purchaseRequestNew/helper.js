import Axios from 'axios';
import { toast } from 'react-toastify';
import { _dateFormatter } from '../../../_helper/_dateFormate';

export const getSBUList = async (accId, buId, setter) => {
   try {
      const res = await Axios.get(
         `/costmgmt/SBU/GetSBUListDDL?AccountId=${accId}&BusinessUnitId=${buId}&Status=true`
      );
      setter(res?.data);
   } catch (error) {}
};

export const getPurchaseOrgList = async (accId, buId, setter) => {
   try {
      const res = await Axios.get(
         `/procurement/BUPurchaseOrganization/GetBUPurchaseOrganizationDDL?AccountId=${accId}&BusinessUnitId=${buId}`
      );
      setter(res?.data);
   } catch (error) {}
};

export const getPlantList = async (userId, accId, buId, setter) => {
   try {
      const res = await Axios.get(
         `/wms/BusinessUnitPlant/GetOrganizationalUnitUserPermission?UserId=${userId}&AccId=${accId}&BusinessUnitId=${buId}&OrgUnitTypeId=7`
      );
      setter(res?.data);
   } catch (error) {}
};

export const getWhList = async (userId, accId, buId, plantId, setter) => {
   try {
      const res = await Axios.get(
         `/wms/BusinessUnitPlant/GetOrganizationalUnitUserPermissionforWearhouse?UserId=${userId}&AccId=${accId}&BusinessUnitId=${buId}&PlantId=${plantId}&OrgUnitTypeId=8`
      );
      setter(res?.data);
   } catch (error) {}
};

export const getPurchaseRequestSearchLanding = async (
   accId,
   buId,
   setter,
   setLoading,
   pageNo,
   pageSize,
   search
) => {
   setLoading(true);
   try {
      const searchPath = search ? `searchTerm=${search}&` : '';

      const res = await Axios.get(
         // `/procurement/PurchaseRequest/GetPurchaseRequestInformationSearchPasignation?${searchPath}AccountId=${accId}&BusinessUnitId=${buId}&viewOrder=desc&PageNo=${pageNo}&PageSize=${pageSize}`
         `/procurement/PurchaseRequest/GetPurchaseRequestInformationSearchPasignation?${searchPath}AccountId=${accId}&BusinessUnitId=${buId}&Sbu=${0}&PurchaseOrganizationId=${0}&Plant=${0}&WearHouse=${0}&viewOrder=desc&PageNo=${pageNo}&PageSize=${pageSize}`
      );
      setLoading(false);
      setter(res?.data);
   } catch (error) {
      setLoading(false);
   }
};

export const getPurchaseRequestLanding = async (
   accId,
   buId,
   setLoading,
   setter,
   PageNo,
   pageSize,
   sbu,
   poId,
   plantId,
   whId,
   status,
   fromDate,
   toDate,
   search
) => {
   if (fromDate) {
      if (!toDate) {
         return toast.warning('To date is Required');
      }
   }

   if (toDate) {
      if (!fromDate) {
         return toast.warning('From date is Required');
      }
   }

   const searchPath = search ? `searchTerm=${search}&` : '';
   const pageNo = search ? 0 : PageNo;

   setLoading(true);
   const requestUrl =
      status !== undefined && fromDate && toDate
         ? `/procurement/PurchaseRequest/GetPurchaseRequestInformationSearchPasignation?${searchPath}AccountId=${accId}&BusinessUnitId=${buId}&Sbu=${sbu ||
              0}&PurchaseOrganizationId=${poId || 0}&Plant=${plantId ||
              0}&WearHouse=${whId ||
              0}&status=${status}&fromDate=${fromDate}&toDate=${toDate}&viewOrder=desc&PageNo=${pageNo}&PageSize=${pageSize}`
         : fromDate && toDate
         ? `/procurement/PurchaseRequest/GetPurchaseRequestInformationSearchPasignation?${searchPath}AccountId=${accId}&BusinessUnitId=${buId}&Sbu=${sbu ||
              0}&PurchaseOrganizationId=${poId || 0}&Plant=${plantId ||
              0}&WearHouse=${whId ||
              0}&fromDate=${fromDate}&toDate=${toDate}&viewOrder=desc&PageNo=${pageNo}&PageSize=${pageSize}`
         : fromDate
         ? `/procurement/PurchaseRequest/GetPurchaseRequestInformationSearchPasignation?${searchPath}AccountId=${accId}&BusinessUnitId=${buId}&Sbu=${sbu ||
              0}&PurchaseOrganizationId=${poId || 0}&Plant=${plantId ||
              0}&WearHouse=${whId ||
              0}&fromDate=${fromDate}&viewOrder=desc&PageNo=${pageNo}&PageSize=${pageSize}`
         : toDate
         ? `/procurement/PurchaseRequest/GetPurchaseRequestInformationSearchPasignation?${searchPath}AccountId=${accId}&BusinessUnitId=${buId}&Sbu=${sbu ||
              0}&PurchaseOrganizationId=${poId || 0}&Plant=${plantId ||
              0}&WearHouse=${whId ||
              0}&toDate=${toDate}&viewOrder=desc&PageNo=${pageNo}&PageSize=${pageSize}`
         : status !== undefined
         ? `/procurement/PurchaseRequest/GetPurchaseRequestInformationSearchPasignation?${searchPath}AccountId=${accId}&BusinessUnitId=${buId}&Sbu=${sbu ||
              0}&PurchaseOrganizationId=${poId || 0}&Plant=${plantId ||
              0}&WearHouse=${whId ||
              0}&status=${status}&viewOrder=desc&PageNo=${pageNo}&PageSize=${pageSize}`
         : `/procurement/PurchaseRequest/GetPurchaseRequestInformationSearchPasignation?${searchPath}AccountId=${accId}&BusinessUnitId=${buId}&Sbu=${sbu ||
              0}&PurchaseOrganizationId=${poId || 0}&Plant=${plantId ||
              0}&WearHouse=${whId ||
              0}&viewOrder=desc&PageNo=${pageNo}&PageSize=${pageSize}`;

   try {
      const res = await Axios.get(requestUrl);
      setLoading(false);
      setter(res?.data);
   } catch (error) {
      setLoading(false);
   }
};

export const getRequestTypeList = async setter => {
   try {
      const res = await Axios.get(
         `/procurement/PurchaseRequest/GetPurchaseRequestTypeListDDL`
      );
      let data = res?.data?.map(item => ({
         value: item?.purchaseRequestTypeId,
         label: item?.purchaseRequestTypeName,
      }));
      setter(data);
   } catch (error) {}
};
export const getItemTypeList = async setter => {
   try {
      const res = await Axios.get(
         `/wms/ItemPlantWarehouse/GetStandardItemTypeListDDL`
      );
      console.log(res?.data);
      let data = res?.data?.map(item => ({
         value: item?.itemTypeId,
         label: item?.itemTypeName,
      }));
      setter(data);
   } catch (error) {}
};
export const getItemCategoryList = async (accId, buId, itemTypeId, setter) => {
   try {
      const res = await Axios.get(
         `/item/ItemCategory/GetItemCategoryDDLByTypeId?AccountId=${accId}&BusinessUnitId=${buId}&ItemTypeId=${itemTypeId}`
      );
      console.log(res?.data);
      let data = res?.data?.map(item => ({
         value: item?.itemCategoryId,
         label: item?.itemCategoryName,
      }));
      setter(data);
   } catch (error) {}
};

export const getControllingUnitList = async (accId, buId, setter) => {
   try {
      const res = await Axios.get(
         `/procurement/PurchaseOrder/GetControllingUnit?AccountId=${accId}&UnitId=${buId}`
      );
      setter(res?.data);
   } catch (error) {}
};

export const getCostCenterList = async (accId, buId, cuId, setter) => {
   try {
      const res = await Axios.get(
         `/costmgmt/CostCenter/GetCostCenterDDLForControllingUnit?AccountId=${accId}&BusinessUnitId=${buId}&ControllingUnitId=${cuId}`
      );

      setter(res?.data);
   } catch (error) {}
};

export const getCostElementList = async (
   accId,
   buId,
   controllingUnitId,
   setter
) => {
   try {
      const res = await Axios.get(
         `/procurement/PurchaseOrder/GetCostElement?AccountId=${accId}&UnitId=${buId}&ControllingUnitId=${controllingUnitId}`
      );

      setter(res?.data);
   } catch (error) {}
};

export const getItemList = async (
   accId,
   buId,
   plantId,
   whId,
   purchaseOrg,
   itemType,
   setter
) => {
   try {
      const res = await Axios.get(
         `/wms/ItemPlantWarehouse/GetItemPlantWarehouseForPurchaseRequestDDL?accountId=${accId}&businessUnitId=${buId}&plantId=${plantId}&whId=${whId}&purchaseOrganizationId=${purchaseOrg}&typeId=${itemType}`
      );
      const data = res?.data;
      const arrayData = [];
      data.forEach(item => {
         var index = arrayData.findIndex(x => x.code === item.code);
         if (index === -1) {
            arrayData.push({
               value: item?.value,
               label: item?.label,
               code: item?.code,
               uoMname: item?.conversionUom,
               baseUoMName: item?.baseUoMName,
               baseUoMId: item?.baseUoMId,
            });
         }
         setter(arrayData);
      });
   } catch (error) {}
};

export const getUOMList = async (
   itemId,
   buId,
   accId,
   setter,
   setFieldValue
) => {
   try {
      const res = await Axios.get(
         `/wms/ItemPlantWarehouse/GetItemUomconversionData?ItemId=${itemId}&BusinessUnitId=${buId}&AccountId=${accId}`
      );
      const data = res?.data?.convertedList;
      const newData = data?.map(item => {
         return {
            value: item?.value,
            label: item?.label,
         };
      });
      setter(newData);
      setFieldValue('uomName', {
         value: res?.data?.value,
         label: res?.data?.label,
      });
   } catch (error) {}
};

export const savePurchaseRequest = async (
   payload,
   cb,
   setDisabled,
   IConfirmModal
) => {
   try {
      const res = await Axios.post(
         `/procurement/PurchaseRequest/CreatePurchaseRequestInfo`,
         payload
      );
      cb();
      setDisabled(false);
      const obj = {
         title: res.data?.message,
         // code: "00987",
         noAlertFunc: () => {},
      };
      IConfirmModal(obj);
      // toast.success(res?.data?.message || "Submitted successfully");
   } catch (error) {
      setDisabled(false);
      toast.error(error?.response?.data?.message);
   }
};

export const editPurchaseRequest = async (payload, setDisabled) => {
   try {
      const res = await Axios.put(
         `/procurement/PurchaseRequest/EditPurchaseRequest`,
         payload
      );
      toast.success(res?.data?.message || 'Submitted successfully');
      setDisabled(false);
   } catch (error) {
      setDisabled(false);

      toast.error(error?.response?.data?.message);
   }
};

export const getPurchaseRequestbyId = async (prId, setter, setDisabled) => {
   try {
      setDisabled(true);
      const res = await Axios.get(
         `/procurement/PurchaseRequest/GetPurchaseRequestInformationByRequestId?RequestId=${prId}`
      );
      console.log(res);
      const {
         purchaseRequestTypeId,
         purchaseRequestTypeName,
         requestDate,
         reffNo,
         purchaseRequestCode,
         deliveryAddress,
         plantId,
         warehouseId,
         costControlingUnitId,
         costControlingUnitName,
         costCenterName,
         costCenterId,
         costElementId,
         costElementName,
         requiredDate,
         purpose,
         purchaseOrganizationId,
      } = res?.data[0]?.getPurchaseRequestHeader;

      const {
         //remarks,
         itemCode,
         uoMname,
      } = res?.data[0]?.getPurchaseRequestRow[0];

      const payload = {
         requestType: {
            value: purchaseRequestTypeId,
            label: purchaseRequestTypeName,
         },
         supplyingWh: '',
         requestDate: _dateFormatter(requestDate),
         bom: '',
         controllingUnit: {
            value: costControlingUnitId,
            label: costControlingUnitName,
         },
         costCenter: { value: costCenterId, label: costCenterName },
         costElement: { value: costElementId, label: costElementName },
         purpose: purpose,
         refNo: reffNo,
         code: purchaseRequestCode,
         itemCode,
         uoMname,
         address: deliveryAddress,
         requiredDate: _dateFormatter(requiredDate),
         itemName: '',
         quantity: '',
         row: res?.data[0]?.getPurchaseRequestRow,
         plantId,
         warehouseId,
         purchaseOrganizationId,
      };

      setter(payload);
      setDisabled(false);
   } catch (error) {
      setDisabled(false);
   }
};

export const getReportListPurchaseReq = async (prId, buId, setter, cb) => {
   try {
      const res = await Axios.get(
         `/procurement/PurchaseRequest/GetPurchaseRequestInformationByRequestIdPrint?RequestId=${prId}&BusinessUnitId=${buId}`
      );
      setter(res?.data[0]);
      cb && cb(res?.data[0]);
   } catch (error) {}
};

export const sendEmailPostApi = async (dataObj, cb) => {
   let formData = new FormData();
   // formData.append("to", dataObj?.toMail);
   // formData.append("cc", dataObj?.toCC);
   // formData.append("bcc", dataObj?.toBCC);
   // formData.append("subject", dataObj?.subject);
   // formData.append("body", dataObj?.message);
   // formData.append("file", dataObj?.attachment);
   if (!dataObj?.toMail) {
      return toast.warning('To Mail Address is required');
   } else if (!dataObj?.attachment) {
      return toast.warning('Attachment is required');
   }

   if (dataObj.toCC && dataObj.toBCC) {
      formData.append('to', dataObj?.toMail);
      formData.append('cc', dataObj?.toCC);
      formData.append('bcc', dataObj?.toBCC);
      formData.append('subject', dataObj?.subject);
      formData.append('body', dataObj?.message);
      formData.append('file', dataObj?.attachment);
   } else if (dataObj.toBCC) {
      formData.append('to', dataObj?.toMail);
      formData.append('bcc', dataObj?.toBCC);
      formData.append('subject', dataObj?.subject);
      formData.append('body', dataObj?.message);
      formData.append('file', dataObj?.attachment);
   } else if (dataObj.toCC) {
      formData.append('to', dataObj?.toMail);
      formData.append('cc', dataObj?.toCC);
      formData.append('subject', dataObj?.subject);
      formData.append('body', dataObj?.message);
      formData.append('file', dataObj?.attachment);
   } else {
      formData.append('to', dataObj?.toMail);
      formData.append('subject', dataObj?.subject);
      formData.append('body', dataObj?.message);
      formData.append('file', dataObj?.attachment);
   }

   try {
      let { data } = await Axios.post('/domain/MailSender/SendMail', formData, {
         headers: {
            'Content-Type': 'multipart/form-data',
         },
      });

      cb();

      toast.success('Mail Send Successfully');
      return data;
   } catch (error) {
      toast.error(
         error?.response?.data?.message || 'Mail cant not send successfully'
      );
   }
};

export const postPurchaseReqCancelAction = async POId => {
   try {
      const res = await Axios.put(
         `/procurement/PurchaseRequest/CancelPurchaseRequest?RequestId=${POId}`
      );
      if (res.status === 200) {
         toast.success(res?.data?.message || 'Cancel Successfully');
      }
   } catch (error) {
      toast.error(error?.response?.data?.message || 'Cancel Failed');
   }
};

export const completePoHandlerAction = async (reqId, userId) => {
   try {
      const res = await Axios.put(
         `/procurement/PurchaseRequest/ClosePurchaseRequest?RequestId=${reqId}&UserId=${userId}`
      );
      if (res.status === 200) {
         //setter(res?.data);
         toast.success('Close Successfully');
         //setLoading(false);
      }
   } catch (error) {
      toast.error(error?.response?.data?.message || 'Cancel Failed');
   }
};

export function mergeFields(mainArray, secondaryArray, idField) {
   return mainArray.map(item => {
      const matchingItem = secondaryArray.find(
         i => i[idField] === item[idField]
      );
      if (matchingItem) {
         return {
            ...item,
            numStockByDate: matchingItem.numStockByDate,
            numStockRateByDate: matchingItem.numStockRateByDate,
         };
      } else {
         return { ...item, numStockByDate: null, numStockRateByDate: null };
      }
   });
}
