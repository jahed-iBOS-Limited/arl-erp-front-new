import Axios from "axios";
import { _dateFormatter } from "../../../_helper/_dateFormate";
import { toast } from "react-toastify";

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

export const landingGridData = async (
  accId,
  buId,
  pageNo,
  pageSize,
  fromDate,
  toDate,
  statusCode,
  shippointId,
  setter,
  setLoading,
  searchValue
) => {
  try {
    setLoading(true);
    const searchPath = searchValue ? `search=${searchValue}&` : "";
    const res = await Axios.get(
      `/tms/ShipmentStandardCost/ShipmentStandardCostReportLandingPasignation?${searchPath}accountid=${accId}&businessunitid=${buId}&fromdate=${fromDate}&todate=${toDate}&inoutstatus=${statusCode}&viewOrder=desc&PageNo=${pageNo}&PageSize=${pageSize}&ShippointId=${shippointId}`
    );
    if (res?.status === 200) {
      if (res?.data?.length === 0) {
        toast.warning("No data found", { toastId: "ndf" });
      } else {
        setter(res?.data);
      }
      setLoading(false);
    }
  } catch (error) {
    setLoading(false);
  }
};

export const getShipmentByID = async (shipmentId, setter, setRowDto) => {
  try {
    const res = await Axios.get(
      `/tms/ShipmentStandardCost/getShipmentStandardCostbyId?ShipmentStandardCostId=${shipmentId}`
    );
    if (res.status === 200 && res?.data) {
      const objHeader = res?.data?.objHeader;
      const newObj = {
        ...objHeader,
        shipmentDate: _dateFormatter(objHeader.shipmentDate),
        daQuantity: "",
        daAmount: "",
        downTraip: false,
        downTripAllowns: "",
      };
      setter(newObj);
      const modify = res?.data?.objList?.map((itm) => ({
        ...itm,
        actualCost: itm?.standardCost,
      }));
      setRowDto(modify);
    }
  } catch (error) {}
};
