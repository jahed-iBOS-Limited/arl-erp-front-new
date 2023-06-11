import axios from "axios";
import { toast } from "react-toastify";
import { _dateFormatter } from "../../../_helper/_dateFormate";

export const getLandingDataForConfirmation = async (
  accId,
  buId,
  values,
  searchTerm,
  pageNo,
  pageSize,
  setter,
  setLoading
) => {
  setLoading && setLoading(true);
  const search = searchTerm ? `&SearchTerm=${searchTerm}` : "";
  try {
    const confirmationTypeId = values?.confirmationType?.value;

    const commonURL = `/tms/LigterLoadUnload/GetLighterChallanInfoConfirmation?Type=${
      values?.confirmationStatus?.value
    }&AccountId=${accId}&BusinessUnitId=${buId}&ShipPointId=${values?.shipPoint
      ?.value || 0}&ShipToPartnerId=${values?.shipToPartner?.value ||
      0}&MotherVesselId=${
      values?.motherVessel?.value
    }&PageNo=${pageNo}&PageSize=${pageSize}${search}`;

    const URLForGodownUnloadBill = `/tms/LigterLoadUnload/GetGodownLabourBillInfo?Type=${
      values?.confirmationStatus?.value
    }&AccountId=${accId}&BusinessUnitId=${buId}&ShipPointId=${values?.shipPoint
      ?.value || 0}&ShipToPartnerId=${values?.shipToPartner?.value ||
      0}&MotherVesselId=${
      values?.motherVessel?.value
    }&PageNo=${pageNo}&PageSize=${pageSize}${search}`;

    const url = confirmationTypeId === 3 ? URLForGodownUnloadBill : commonURL;

    const res = await axios.get(url);

    // const truckBillData = res?.data?.data?.filter(
    //   (item) => !item?.truckSupplierBillRegisterId
    // );
    // const unloadBillData = res?.data?.data?.filter(
    //   (item) => !item?.unloadSupplierBillRegisterId
    // );

    // const billTypeId = values?.confirmationType?.value;

    // const filteredData =
    //   billTypeId === 2
    //     ? truckBillData
    //     : billTypeId === 3
    //     ? unloadBillData
    //     : res?.data?.data;

    const modifyData = {
      ...res?.data,
      data: res?.data?.data?.map((item) => ({
        // data: filteredData?.map((item) => ({
        ...item,
        quantity: item?.rowList[0]?.quantity,
        numItemPrice: +item?.rowList?.[0]?.numItemPrice || 0,
        salesRevenueAmount: +item?.rowList?.[0]?.salesRevenueAmount || 0,
        transportRate: item?.rowList[0]?.transportRate,
        maxQty: item?.rowList[0]?.quantity,
        rowId: item?.rowList[0]?.rowId,
        date: _dateFormatter(item?.deliveryDate),
        isSelected: false,
        shipToPartner: {
          value: item?.shipToPartnerId,
          label: item?.shipToPartnerName,
        },
        godownLabourSupplier: {
          value: item?.godownLabourSupplierId,
          label: item?.godownLabourSupplier,
        },
        godownLabourSupplierName: item?.godownLabourSupplier,
        unloadingAmount: item?.rowList[0]?.unloadingAmount,
        directOrDumpRate: item?.rowList[0]?.ghatLoadUnloadLabourRate,
        godownUnloadingRate: item?.rowList[0]?.goDownUnloadLabourRate,
        carrierRate: item?.rowList[0]?.carrierAgentRate,
        goDownLabourAmount: item?.rowList[0]?.goDownLabourAmount,
        transportAmount: item?.rowList[0]?.transportAmount,
      })),
    };
    setter(modifyData);
    setLoading && setLoading(false);
  } catch (error) {
    setter([]);
    toast.error(error?.response?.data?.message);
    setLoading && setLoading(false);
  }
};

export const challanConfirm = async (payload, setLoading, cb) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.put(
      `/tms/LigterLoadUnload/ConfirmLighterChallanInfo`,
      payload
    );
    toast.success(res?.data?.message);
    cb && cb();
    setLoading && setLoading(false);
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setLoading && setLoading(false);
  }
};

export const GetDomesticPortDDL = async (setter) => {
  try {
    const res = await axios.get(`/wms/FertilizerOperation/GetDomesticPortDDL`);
    setter(res?.data);
  } catch (error) {
    setter([]);
  }
};

export const getMotherVesselDDL = async (accId, buId, portId, setter) => {
  try {
    const res = await axios.get(
      `/wms/FertilizerOperation/GetMotherVesselDDL?AccountId=${accId}&BusinessUnitId=${buId}&PortId=${portId ||
        0}`
    );
    setter(res.data);
  } catch (error) {
    setter([]);
  }
};
