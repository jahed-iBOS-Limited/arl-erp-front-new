import axios from "axios";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { imarineBaseUrl } from "../../../../App";

// Validation schema
export const validationSchema = Yup.object().shape({
  charterer: Yup.object().shape({
    label: Yup.string().required("Charterer is required"),
    value: Yup.string().required("Charterer is required"),
  }),
  shipper: Yup.object().shape({
    label: Yup.string().required("Shipper is required"),
    value: Yup.string().required("Shipper is required"),
  }),
});

export const getShipperLandingData = async ({
  vesselId,
  voyageId,
  pageNo,
  pageSize,
  setter,
  setLoading,
}) => {
  setLoading(true);
  try {
    const res = await axios.get(
      `${imarineBaseUrl}/domain/HireCargoInfo/GetHireCargoInfoLanding?VoyageId=${voyageId}&VesselId=${vesselId}&viewOrder=desc&PageNo=${pageNo}&PageSize=${pageSize}`
    );
    setter(res?.data);
    setLoading(false);
  } catch (err) {
    setter([]);
    setLoading(false);
  }
};

export const getShipperDDLbyVoyageId = async (voyageId, setter, setLoading) => {
  setLoading && setLoading(true);
  try {
    const { data } = await axios.get(
      `${imarineBaseUrl}/domain/HireCargoInfo/GetShipperDDlByVoyage?VoyageId=${voyageId}`
    );
    setter(data);
    setLoading && setLoading(false);
  } catch (err) {
    setter([]);
    setLoading && setLoading(false);
  }
};

export const getCargoDDLbyChartererId = async (
  voyageId,
  chartererId,
  setter,
  setLoading
) => {
  setLoading && setLoading(true);
  try {
    const { data } = await axios.get(
      `${imarineBaseUrl}/domain/HireCargoInfo/GetCargoDDl?CharterId=${chartererId}&VoyageId=${voyageId}`
    );
    setter(data);
    setLoading && setLoading(false);
  } catch (err) {
    setter([]);
    setLoading && setLoading(false);
  }
};

/* For Invoice's */
export const getCargoDDLbyChartererIdForInvoice = async (
  voyageId,
  chartererId,
  setter,
  setLoading
) => {
  setLoading && setLoading(true);
  try {
    const { data } = await axios.get(
      `${imarineBaseUrl}/domain/FreightInvoice/GetInvoiceCargoDDL?VoyageId=${voyageId}&ChartererId=${chartererId}`
    );
    setter(data);
    setLoading && setLoading(false);
  } catch (err) {
    setter([]);
    setLoading && setLoading(false);
  }
};

export const getItemRateForBunker = async ({
  accId,
  buId,
  vesselId,
  voyageId,
  setter,
  setLoading,
}) => {
  setLoading(true);
  try {
    const { data } = await axios.get(
      `${imarineBaseUrl}/domain/BunkerInformation/GetItemRateForBunker?AccountId=${accId}&BusinessUnitId=${buId}&VoyageNoId=${voyageId}&VesselId=${vesselId}`
    );
    setter("lsfoballastRate", data?.lsifoPrice);
    setter("lsmgoballastRate", data?.lsmgoPrice);
    setLoading(false);
  } catch (err) {
    setter([]);
    setLoading(false);
  }
};

export const createShipper = async (data, setLoading, cb) => {
  setLoading(true);
  try {
    const res = await axios.post(
      `${imarineBaseUrl}/domain/HireCargoInfo/CreateCargoHireInfo`,
      data
    );
    cb();
    toast.success(res?.data?.message);
    setLoading(false);
  } catch (err) {
    toast.error(err?.response?.data?.message);
    setLoading(false);
  }
};

export const editShipper = async (data, setLoading) => {
  setLoading(true);
  try {
    const res = await axios.put(
      `${imarineBaseUrl}/domain/HireCargoInfo/EditCargoHireInfo",
      data`
    );

    toast.success(res?.data?.message, { toastId: 123 });
    setLoading(false);
  } catch (err) {
    toast.error(err?.response?.data?.message || err?.message, {
      toastId: 1234,
    });
    setLoading(false);
  }
};

export const getSingleData = async ({
  id,
  setLoading,
  setter,
  setCargoList,
}) => {
  setLoading(true);
  try {
    const { data } = await axios.get(
      `${imarineBaseUrl}/domain/HireCargoInfo/GetCargoHireInfoById?CargoHireId=${id}`
    );

    const objHeaderDTO = data?.objHeaderDTO;
    const objRowList = data?.objRowList;

    setter({
      cargo: "",
      charterer: {
        value: objHeaderDTO?.charterId,
        label: objHeaderDTO?.charterName,
        demurrageRate: objHeaderDTO?.demurrageRate,
        dispatchRate: objHeaderDTO?.dispatchRate,
        deadFreight: objHeaderDTO?.deadFreight,
      },
      demurrageRate: objHeaderDTO?.demurrageRate,
      despatchRate: objHeaderDTO?.dispatchRate,
      deadFreightDetention: objHeaderDTO?.deadFreight,
      shipper: {
        value: objHeaderDTO?.shipperId,
        label: objHeaderDTO?.shipperName,
      },
    });
    setCargoList(
      objRowList?.map((item) => {
        return {
          ...item,
          numVoyageCargoQty:
            item?.voyageCargoQty || item?.numVoyageCargoQty || 0,
        };
      })
    );
    setLoading(false);
  } catch (err) {
    setLoading(false);
  }
};
