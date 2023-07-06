import axios from "axios";
import { toast } from "react-toastify";
import { _todayDate } from "./../../../_helper/_todayDate";

export const getDashBoardPDDReportApi = async (
  buId,
  shipPointId,
  rpttypeId,
  setter,
  setLoading
) => {
  setLoading(true);
  try {
    const res = await axios.get(
      `/oms/SalesInformation/GetDashBoardPDDReport?rpttypeId=${rpttypeId}&shipmentType=0&businessUnitId=${buId}&shipPointId=${shipPointId}&fromDate=${_todayDate()}&toDate=${_todayDate()}`
    );

    // Regular Sum
    let RegularSum = res?.data
      ?.filter((item) => item?.shipmentType === "Regular")
      ?.reduce((acc, curr) => acc + (+curr?.totalDC || +curr?.numQuantity || 0 ), 0);

    // Special Sum
    let SpecialSum = res?.data
      ?.filter((item) => item?.shipmentType === "Special")
      ?.reduce((acc, curr) => acc + (+curr?.totalDC|| +curr?.numQuantity || 0), 0);

    //Express  sum
    let ExpressSum = res?.data
      ?.filter((item) => item?.shipmentType === "Express")
      ?.reduce((acc, curr) => acc + (+curr?.totalDC|| +curr?.numQuantity || 0), 0);
    setter({
      Regular: RegularSum || 0,
      Special: SpecialSum || 0,
      Express: ExpressSum || 0,
    });
    setLoading(false);
  } catch (error) {
    setter([]);
    setLoading(false);
  }
};

export const getDashBoardPDDOnTimeDeliveryReportApi = async (
  buId,
  shipPointId,
  rpttypeId,
  setter,
  setLoading
) => {
  setLoading(true);
  try {
    const res = await axios.get(
      `/oms/SalesInformation/GetDashBoardPDDReport?rpttypeId=${rpttypeId}&shipmentType=0&businessUnitId=${buId}&shipPointId=${shipPointId}&fromDate=${_todayDate()}&toDate=${_todayDate()}`
    );

    // deliveryPlanCount Sum
    let deliveryPlanCountSum = res?.data?.reduce(
      (acc, curr) => acc + (+curr?.deliveryPlanCount || 0),
      0
    );

    // actualDeliveryCount Sum
    let actualDeliveryCountSum = res?.data?.reduce(
      (acc, curr) => acc + (+curr?.actualDeliveryCount || 0),
      0
    );

    const onTimeDelivery =
      (actualDeliveryCountSum / deliveryPlanCountSum) * 100;

    setter({
      onTimeDelivery: isNaN(onTimeDelivery) ? 0 : onTimeDelivery,
    });
    setLoading(false);
  } catch (error) {
    setter([]);
    setLoading(false);
  }
};

export const getDashBoardPDDReporttransferOutQntApi = async (
  buId,
  shipPointId,
  rpttypeId,
  setter,
  setLoading
) => {
  setLoading(true);
  try {
    const res = await axios.get(
      `/oms/SalesInformation/GetDashBoardPDDReport?rpttypeId=${rpttypeId}&shipmentType=0&businessUnitId=${buId}&shipPointId=${shipPointId}&fromDate=${_todayDate()}&toDate=${_todayDate()}`
    );

    // TransferOut Qnt Sum
    let transferOutQntSum = res?.data?.reduce(
      (acc, curr) => acc + (+curr?.transferOutQnt || 0),
      0
    );
    setter({
      transferOutQnt: transferOutQntSum || 0,
    });
    setLoading(false);
  } catch (error) {
    setter([]);
    setLoading(false);
  }
};

export const getDashBoardPDDReportVehicleApi = async (
  buId,
  shipPointId,
  rpttypeId,
  setter,
  setLoading
) => {
  setLoading(true);
  try {
    const res = await axios.get(
      `/oms/SalesInformation/GetDashBoardPDDReport?rpttypeId=${rpttypeId}&shipmentType=0&businessUnitId=${buId}&shipPointId=${shipPointId}&fromDate=${_todayDate()}&toDate=${_todayDate()}`
    );

    // Company Sum
    let CompanySum = res?.data
      ?.filter((item) => item?.vehicleMode === "Company")
      ?.reduce(
        (acc, curr) => acc + (+curr?.totalGateIn || +curr?.totalGateOut || 0),
        0
      );

    // Supplier Sum
    let SupplierSum = res?.data
      ?.filter((item) => item?.vehicleMode === "Supplier")
      ?.reduce(
        (acc, curr) => acc + (+curr?.totalGateIn || +curr?.totalGateOut || 0),
        0
      );

    setter({
      Company: CompanySum || 0,
      Supplier: SupplierSum || 0,
    });
    setLoading(false);
  } catch (error) {
    setter([]);
    setLoading(false);
  }
};



export const getDashBoardPDDDepotPendingReportApi = async (
  buId,
  shipPointId,
  rpttypeId,
  setter,
  setLoading
) => {
  setLoading(true);
  try {
    const res = await axios.get(
      `/oms/SalesInformation/GetDashBoardPDDReport?rpttypeId=${rpttypeId}&shipmentType=0&businessUnitId=${buId}&shipPointId=${shipPointId}&fromDate=${_todayDate()}&toDate=${_todayDate()}`
    );

    // categories Sum
    let categories = res?.data?.map((item) => item?.strShipPointName);
    let numQuantity = res?.data?.map((item) => item?.numQuantity);

    setter({
      categories: categories || 0,
      data: numQuantity || 0,
    });
    setLoading(false);
  } catch (error) {
    setter([]);
    setLoading(false);
  }
};