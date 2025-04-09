import Axios from 'axios';
import moment from 'moment';
import { toast } from 'react-toastify';
import { _dateFormatter } from '../../../_helper/_dateFormate';
import { _todayDate } from './../../../_helper/_todayDate';

export const createSales = async (payload, cb) => {
  try {
    const res = await Axios.post(
      `/vat/TaxSalesInvoice/CreateTaxSalesInvoice`,
      payload
    );
    if (res.status === 200 && res?.data) {
      toast.success(res.data?.message || 'Submitted successfully');
      cb();
    }
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
};
export const CreateFuelConstInfo_api = async (payload) => {
  try {
    const res = await Axios.post(
      `/tms/FuelCostInfo/CreateFuelConstInfo`,
      payload
    );
    if (res.status === 200 && res?.data) {
      //oast.success("FuelConstInfo successfully save");
    }
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
};

export const editShipment = async (payload, setDisabled, fuleCostSaveCB) => {
  setDisabled(true);
  try {
    const res = await Axios.put(
      `/tms/ShipmentStandardCost/EditShipmentStandardCost`,
      payload
    );
    if (res.status === 200 && res?.data) {
      toast.success(res.data?.message || 'Edited successfully');
      setDisabled(false);
      fuleCostSaveCB && fuleCostSaveCB();
    }
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setDisabled(false);
  }
};

export const getVatBranches = async (accid, buid, setter) => {
  try {
    const res = await Axios.get(
      `/vat/TaxDDL/GetTaxBranchDDL?AccountId=${accid}&BusinessUnitId=${buid}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

export const getSupplierDDL = async (accId, buId, setter) => {
  try {
    const res = await Axios.get(
      `/partner/PManagementCommonDDL/GetCustomerNameDDL?AccountId=${accId}&BusinessUnitId=${buId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

const attachmentFileIdGroup = (arr) => {
  const result = [];
  if (arr?.length > 0) {
    arr.forEach((itmOne, inx) => {
      const findInx = result?.findIndex(
        (itm) => itm?.reason.trim() === itmOne?.reason.trim()
      );
      // if duplicate reason add
      if (findInx >= 0) {
        result[findInx] = {
          ...result[findInx],
          attachmentFileId: [
            ...result[findInx].attachmentFileId,
            itmOne?.attachmentFileId,
          ],
        };
      } else {
        result.push({
          ...itmOne,
          attachmentFileId: [itmOne?.attachmentFileId],
        });
      }
    });
  }
  return result;
};

export const getShipmentByID = async (
  shipmentId,
  setter,
  setRowDto,
  setDisabled,
  setAttachmentGrid
) => {
  try {
    setDisabled && setDisabled(true);
    const res = await Axios.get(
      `/tms/ShipmentStandardCost/getShipmentStandardCostbyId?ShipmentStandardCostId=${shipmentId}`
    );
    if (res.status === 200 && res?.data) {
      setDisabled && setDisabled(false);
      const objHeader = res?.data?.objHeader;
      const newObj = {
        ...objHeader,
        shipmentDate: _dateFormatter(objHeader.shipmentDate),
        daQuantity: '',
        daAmount: '',
        downTraip: false,
        downTripAllowns: '',
        downTripCash: objHeader?.downTripCash || 0,
        downTripCredit: objHeader?.downTripCredit || 0,
        businessUnitName: objHeader?.downTripUnitId
          ? {
              value: objHeader.downTripUnitId,
              label: objHeader.downTripUnitName,
            }
          : '',
        extraMillage: objHeader?.extraMillage || 0,
        fuelDate: _todayDate(),
        fuelStationName: '',
        fuelType: '',
        fuelQty: '',
        supplier: '',
        purchaseType: 'Cash',
        purchaseCashAmount: 0,
        credit: 0,
        cash: 0,
        fuelAmount: '',
      };
      setter(newObj);
      const modify = res?.data?.objList?.map((itm) => ({
        ...itm,
        actualCost: itm?.standardCost,
      }));
      setRowDto && setRowDto(modify);

      // attachmentFileIdGroup
      const result = attachmentFileIdGroup(res?.data?.objAttachment);
      setAttachmentGrid && setAttachmentGrid(result || []);
    }
  } catch (error) {
    setDisabled && setDisabled(false);
  }
};
export const GetFuelConstInfoById_api = async (shipmentCost, setter) => {
  try {
    const res = await Axios.get(
      `/tms/FuelCostInfo/GetFuelConstInfoById?ShipmentCostId=${shipmentCost}`
    );
    if (res.status === 200 && res?.data) {
      const modifiedData = res?.data?.map((itm) => ({
        ...itm,
        fuelDate: _dateFormatter(itm?.fuelDate),
      }));
      setter(modifiedData);
    }
  } catch (error) {}
};

export const getComponentDDL = async (accId, setter) => {
  try {
    const res = await Axios.get(
      `/tms/TransportMgtDDL/GetComponentDDL?AccountId=${accId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};
export const GetSupplierFuelStationDDL_api = async (
  partnerId,
  accId,
  buId,
  setter
) => {
  try {
    const res = await Axios.get(
      `/partner/PManagementCommonDDL/GetSupplierFuelStationDDL?PartnerId=${partnerId}&AccountId=${accId}&BusinessUnitId=${buId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};
export const GetVehicleFuelTypeDDL_api = async (setter) => {
  try {
    const res = await Axios.get(
      `/tms/Vehicle/GetVehicleFuelTypeDDL?IsActive=true`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};
export const GetSupplierListDDL_api = async (accId, busId, setter) => {
  try {
    const res = await Axios.get(
      `/procurement/PurchaseOrder/GetSupplierListDDL?AccountId=${accId}&UnitId=${busId}&SBUId=0`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};
export const GetShipToPartnerDistanceByShipmentId_api = async (
  shipmentId,
  setter
) => {
  try {
    const res = await Axios.get(
      `/tms/PartnerShipping/GetShipToPartnerDistanceByShipmentId?shipmentId=${shipmentId}`
    );
    if (res.status === 200 && res?.data) {
      setter(
        res?.data?.result.map((itm) => ({
          ...itm,
          isUpdateBtnClick: itm?.numDistanceKM > 0 ? true : false,
        }))
      );
    }
  } catch (error) {}
};
export const GetPartnerShippingInformation_api = async (shipmentId, setter) => {
  try {
    const res = await Axios.get(
      `/tms/Shipment/GetPartnerShippingInformation?ShipmentId=${shipmentId}`
    );
    if (res.status === 200 && res?.data) {
      setter(
        res?.data?.map((itm) => ({
          ...itm,
          isUpdateBtnClick: itm?.rentAmount > 0 ? true : false,
        }))
      );
    }
  } catch (error) {}
};

export const getChalanInfo = async (shipmentId, setter) => {
  try {
    const res = await Axios.get(
      `/tms/Shipment/GetChallanInfoByShipmentId?shipmentId=${shipmentId}`
    );
    setter(res?.data);
  } catch (error) {
    setter([]);
  }
};

export const billSubmitApi = async (setLoading, payload, cb) => {
  setLoading(true);
  try {
    const res = await Axios.put(
      `/tms/ShipmentStandardCost/EditShipmentStandardCostBillSubmit`,
      payload
    );
    if (res.status === 200) {
      setLoading(false);
      toast.success(res?.data?.message, { toastId: 'billSubmitApi' });
      cb();
    }
  } catch (error) {
    setLoading(false);
    toast.warn(error?.response?.data?.message, { toastId: 'billSubmitApErr' });
  }
};
export const EditVehiclePartnerRentAmount_api = async (
  shipmentId,
  shipPointId,
  shiptoPartnerId,
  buId,
  rentAmount,
  idx,
  vehicleReantUpdateCB
) => {
  try {
    const res = await Axios.put(
      `/tms/Vehicle/EditVehiclePartnerRentAmount?ShipmentId=${shipmentId}&ShipPointId=${shipPointId}&ShiptoPartnerId=${shiptoPartnerId}&BusinessUnitId=${buId}&RentAmount=${rentAmount}`
    );
    if (res.status === 200) {
      toast.success(res?.data?.message, {
        toastId: 'EditVehiclePartnerRentAmount',
      });
      vehicleReantUpdateCB(idx);
    }
  } catch (error) {
    toast.warn(error?.response?.data?.message, {
      toastId: 'EditVehiclePartnerRentAmount',
    });
  }
};
export const EditVehiclePartnerDistenceKM_api = async (
  shipmentId,
  shipPointId,
  shiptoPartnerId,
  buId,
  ristanceKM,
  idx,
  vehicleReantUpdateCB,
  values,
  millageAllowanceRowValueChange,
  setFieldValue
) => {
  try {
    const res = await Axios.put(
      `/tms/Vehicle/EditVehiclePartnerDistenceKM?ShipmentId=${shipmentId}&ShipPointId=${shipPointId}&ShiptoPartnerId=${shiptoPartnerId}&BusinessUnitId=${buId}&DistanceKM=${ristanceKM}`
    );
    if (res.status === 200) {
      toast.success(res?.data?.message, {
        toastId: 'EditVehiclePartnerRentAmount',
      });
      vehicleReantUpdateCB(idx);
      millageAllowanceRowValueChange(ristanceKM, values, setFieldValue);
    }
  } catch (error) {
    toast.warn(error?.response?.data?.message, {
      toastId: 'EditVehiclePartnerRentAmount',
    });
  }
};

export const getSelectedItemInfo = async (
  itemId,
  accId,
  buId,
  setter,
  setFieldValue
) => {
  try {
    const res = await Axios.get(
      `/vat/HsCode/GetCustomsDutyStructureById?TaxItemGroupId=${itemId}&AccountId=${accId}&BusinessUnitId=${buId}`
    );
    if (res.status === 200 && res?.data) {
      if (res.data.length > 0) {
        const value = {
          value: res?.data[0].uomId,
          label: res?.data[0].uomName,
        };
        setFieldValue('selectedUom', value);
        setFieldValue('rate', res?.data[0]?.basePrice);
        setter(res?.data[0]);
      } else {
        setFieldValue('selectedUom', {});
        setFieldValue('rate', '');
        setter({});
      }
    }
  } catch (error) {}
};

export const getGridData = async (
  accId,
  buId,
  rtId,
  fromDate,
  fromTime,
  toDate,
  toTime,
  shippointId,
  setter,
  setLoading,
  searchValue
) => {
  try {
    setLoading(true);
    const fromDateTime = moment(`${fromDate} ${fromTime}`).format(
      'YYYY-MM-DDTHH:mm:ss'
    );
    const toDateTime = moment(`${toDate} ${toTime}`).format(
      'YYYY-MM-DDTHH:mm:ss'
    );
    const searchPath = searchValue ? `search=${searchValue}&` : '';
    const res = await Axios.get(
      `/tms/ShipmentStandardCost/ShipmentStandardCostPaginationModified?${searchPath}&accountId=${accId}&businessUnitId=${buId}&shipmentId=${shippointId}&FromDate=${fromDateTime}&ToDate=${toDateTime}&status=true&IsClose=${
        rtId === 2 ? true : rtId
      }&isBillSubmited=${
        rtId === 2 ? true : false
      }&PageNo=1&PageSize=1000&viewOrder=desc`
    );
    if (res.status === 200 && res?.data) {
      if (res?.data?.data?.length === 0) {
        toast.warning('No data found', { toastId: 'ndf' });
      } else {
        if (rtId) {
          setter(
            res?.data?.data?.map((item) => {
              return {
                ...item,
                isSelect: false,
              };
            })
          );
        } else {
          setter(res?.data?.data);
        }
      }
      setLoading(false);
    }
  } catch (error) {
    setLoading(false);
  }
};

export const getSalesInvoiceById = async (id, setter) => {
  try {
    const res = await Axios.get(
      `/vat/TaxSalesInvoice/GetTaxSalesInvoiceById?TaxSalesId=${id}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};
//

export const getDownTripData = async (vehiId, accId, buId, setter) => {
  try {
    const res = await Axios.get(
      `/tms/Vehicle/GetVehicleCapacityTripAllowanceById?VehicleId=${vehiId}&AccountId=${accId}&BusinessUnitId=${buId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data[0]);
    }
  } catch (error) {}
};

export const getBUMilageAllowance = async (accId, buId, setter) => {
  try {
    const res = await Axios.get(
      `/tms/Vehicle/GetBUMilageAllowance?AccountId=${accId}&BusinessUnitId=${buId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data[0]);
    }
  } catch (error) {}
};

export const GetShipmentCostEntryStatus_api = async (
  accId,
  buId,
  tripId,
  setter
) => {
  try {
    const res = await Axios.get(
      `/tms/ShipmentStandardCost/GetShipmentCostEntryStatus?accountid=${accId}&businessunitid=${buId}&TripId=${tripId}`
    );
    setter(res?.data);
  } catch (error) {}
};

export const getBusinessUnitDDL_api = async (actionBy, accountId, setter) => {
  try {
    const res = await Axios.get(
      `/domain/OrganizationalUnitUserPermission/GetBusinessUnitPermissionbyUser?UserId=${actionBy}&ClientId=${accountId}`
    );
    if (res.status === 200 && res?.data) {
      const newdata = res?.data.map((itm) => {
        return {
          value: itm?.organizationUnitReffId,
          label: itm?.organizationUnitReffName,
        };
      });
      setter(newdata);
    }
  } catch (error) {}
};
