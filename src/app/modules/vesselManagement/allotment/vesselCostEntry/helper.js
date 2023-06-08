import axios from "axios";
import { toast } from "react-toastify";
import { _dateFormatter } from "../../../_helper/_dateFormate";

export const rateUpdateAPI = async (payload, setLoading, cb) => {
  setLoading(true);
  try {
    const res = await axios.put(
      `/tms/LigterLoadUnload/UpdateVesselRevenueNCost`,
      payload
    );
    toast.success(res?.data?.message);
    setLoading(false);
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setLoading(false);
  }
};

export const getMotherVesselDDL = async (accId, buId, setter, portId) => {
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

export const GetVesselCostData = async (
  buId,
  motherVesselId,
  portId,
  setter,
  setLoading
  // fromDate,
  // toDate
) => {
  try {
    setLoading(true);
    const res = await axios.get(
      `/wms/TransportMode/GetsprMotherVesselInfo?Partid=1&UnitId=${buId}&PortId=${portId}&MotherVesselId=${motherVesselId ||
        0}`
    );

    if (res.status === 200 && res?.data) {
      setter(res?.data);
      setLoading(false);
    }
  } catch (error) {
    setLoading(false);
  }
};

// export const updateLighterAllotmentCarrierRate = async (
//   payload,
//   setLoading,
//   cb
// ) => {
//   setLoading(true);
//   try {
//     const res = await axios.put(
//       `/wms/FertilizerOperation/UpdateLighterAllotmentCarrierRate`,
//       payload
//     );
//     toast.success(res?.data?.message);
//     setLoading(false);
//   } catch (error) {
//     toast.error(error?.response?.data?.message);
//     setLoading(false);
//   }
// };
export const GetGeneralInfoById = async ({
  id,
  status ,
  setter,
  setRowDto,
  setLoading,
  setRowDtoTwo,
}) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.get(
      `/wms/FertilizerOperation/ViewLighterAllotmentDetailsMotherVessel?MotherVesselId=${id}&type=${status}`
    );
    let h = res?.data[0];
    const singleHeader = {
      motherVessel: {
        value: h?.motherVesselId,
        label: h?.motherVesselName,
      },
      programNo: h?.program,
      loadingPort: {
        value: h?.portId,
        label: h?.portName,
      },
      item: {
        value: h?.itemId,
        label: h?.itemName,
      },
      cnf: {
        value: h?.cnfid,
        label: h?.cnfname,
      },
      steveDore: {
        value: h?.stevedoreId,
        label: h?.stevedoreName,
      },
      allotmentDate: _dateFormatter(h?.allotmentDate),
      lotNo: h?.lotNo,
      type: h?.type || "badc",
      rowType: {
        value: 2,
        label: "Carrier Rate",
      },
    };

    setter && setter(singleHeader);
    setRowDto(
      res?.data?.map((item) => {
        return {
          ...item,
          vatTax: item?.vatNtax || 0,
          billAmount: 0,
          ld: item?.ld || 0,
          localRateTaka: item?.revenueRate || 0,
          damarage: item?.demurrage || 0,
          others: item?.others || 0,
          label: item?.lighterVesselName,
          surveyQty: item?.surveyQnt,
          unloadingPort: {
            value: item?.shipPointId,
            label: item?.shipPointName,
          },
          isSelected: false,
        };
      })
    );
    setRowDtoTwo &&
      setRowDtoTwo(
        res?.data?.map((item) => {
          return {
            ...item,
            label: item?.lighterVesselName,
            surveyQty: item?.surveyQnt,
            unloadingPort: {
              value: item?.shipPointId,
              label: item?.shipPointName,
            },
            isSelected: false,
            carrierRate: item?.carrierRate || 0,
            carrierCommissionRate: item?.carrierCommissionRate || 0,
            amount:
              ((+item?.carrierRate || 0) +
                (+item?.carrierCommissionRate || 0)) *
              (+item?.surveyQnt || 0),
          };
        })
      );
    setLoading && setLoading(false);
  } catch (error) {
    setter([]);
    toast.error(error?.response?.data?.message);
    setLoading && setLoading(false);
  }
};
