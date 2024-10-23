import axios from "axios";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { imarineBaseUrl } from "../../../../App";

// Validation schema
export const validationSchema = Yup.object().shape({
  vesselName: Yup.string().required("Vessel name is required"),
  ownerName: Yup.object().shape({
    label: Yup.string().required("Owner name is required"),
    value: Yup.string().required("Owner name is required"),
  }),
  flag: Yup.object().shape({
    label: Yup.string().required("Flag is required"),
    value: Yup.string().required("Flag is required"),
  }),
  deadWeight: Yup.string().required("Dead Weight is required"),
  imono: Yup.string().required("IMO No is required"),
  grt: Yup.string().required("GRT is required"),
  nrt: Yup.string().required("NRT is required"),

  // Vessel Master Data
  strParticulars: Yup.string().when("isEditing", {
    is: false,
    then: Yup.string().required("Particulars is required"),
    else: Yup.string(),
  }),
  strVesselParticulars: Yup.string().when("isEditing", {
    is: false,
    then: Yup.string().required("Vessel Particulars is required"),
    else: Yup.string(),
  }),
  strMasterEmail: Yup.string().when("isEditing", {
    is: false,
    then: Yup.string().required("Master Email is required"),
    else: Yup.string(),
  }),
  numBallastEcoSpeed: Yup.number().when("isEditing", {
    is: false,
    then: Yup.number().required("Ballast Eco Speed is required"),
    else: Yup.number(),
  }),
  numBallastMaxSpeed: Yup.number().when("isEditing", {
    is: false,
    then: Yup.number().required("Ballast Max Speed is required"),
    else: Yup.number(),
  }),
  numBallastVlsfoconsumptionMtPerday: Yup.number().when("isEditing", {
    is: false,
    then: Yup.number().required(
      "Ballast VLSFO Consumption (Mt/Day) is required"
    ),
    else: Yup.number(),
  }),
  numBallastLsmgoconsumptionMtPerday: Yup.number().when("isEditing", {
    is: false,
    then: Yup.number().required(
      "Ballast LSMGO Consumption (Mt/Day) is required"
    ),
    else: Yup.number(),
  }),
  numLadenEcoSpeed: Yup.number().when("isEditing", {
    is: false,
    then: Yup.number().required("Laden Eco Speed is required"),
    else: Yup.number(),
  }),
  numLadenMaxSpeed: Yup.number().when("isEditing", {
    is: false,
    then: Yup.number().required("Laden Max Speed is required"),
    else: Yup.number(),
  }),
  numLadenVlsfoconsumptionMtPerday: Yup.number().when("isEditing", {
    is: false,
    then: Yup.number().required("Laden VLSFO Consumption (Mt/Day) is required"),
    else: Yup.number(),
  }),
  numLadenLsmgoconsumptionMtPerday: Yup.number().when("isEditing", {
    is: false,
    then: Yup.number().required("Laden LSMGO Consumption (Mt/Day) is required"),
    else: Yup.number(),
  }),
  numPortWorkingVlsfoperDay: Yup.number().when("isEditing", {
    is: false,
    then: Yup.number().required("Port Working VLSFO per Day is required"),
    else: Yup.number(),
  }),
  numPortWorkingLsmgoperDay: Yup.number()
    .when("isEditing", {
      is: false,
      then: Yup.number().required("Port Working LSMGO per Day is required"),
      else: Yup.number(),
    })
    ,
  numPortIdleVlsfoperDay: Yup.number()
    .when("isEditing", {
      is: false,
      then: Yup.number().required("Port Idle VLSFO per Day is required"),
      else: Yup.number(),
    })
    ,
  numPortIdleLsmgoperDay: Yup.number()
    .when("isEditing", {
      is: false,
      then: Yup.number().required("Port Idle LSMGO per Day is required"),
      else: Yup.number(),
    })
    ,
  numSummerDisplacementDraftMts: Yup.number()
    .when("isEditing", {
      is: false,
      then: Yup.number().required("Summer Displacement Draft (Mts) is required"),
      else: Yup.number(),
    })
    ,
  numSummerLightShipMts: Yup.number()
    .when("isEditing", {
      is: false,
      then: Yup.number().required("Summer Light Ship (Mts) is required"),
      else: Yup.number(),
    })
    ,
  numWinterDisplacementDraftMts: Yup.number()
    .when("isEditing", {
      is: false,
      then: Yup.number().required("Winter Displacement Draft (Mts) is required"),
      else: Yup.number(),
    })
    ,
  numWinterLightShipMts: Yup.number()
    .when("isEditing", {
      is: false,
      then: Yup.number().required("Winter Light Ship (Mts) is required"),
      else: Yup.number(),
    })
    ,
  numTropicalDisplacementDraftMts: Yup.number()
    .when("isEditing", {
      is: false,
      then: Yup.number().required("Tropical Displacement Draft (Mts) is required"),
      else: Yup.number(),
    })
   ,
  numTropicalLightShipMts: Yup.number()
    .when("isEditing", {
      is: false,
      then: Yup.number().required("Tropical Light Ship (Mts) is required"),
      else: Yup.number(),
    })
   ,
  intHoldNumber: Yup.number()
    .when("isEditing", {
      is: false,
      then: Yup.number().required("Hold Number is required"),
      else: Yup.number(),
    })
    ,
  numMaxBallastVlsfoconsumptionMtPerday: Yup.number()
    .when("isEditing", {
      is: false,
      then: Yup.number().required("Max Ballast VLSFO Consumption (Mt/Day) is required"),
      else: Yup.number(),
    })
    ,
  numMaxBallastLsmgoconsumptionMtPerday: Yup.number()
    .when("isEditing", {
      is: false,
      then: Yup.number().required("Max Ballast LSMGO Consumption (Mt/Day) is required"),
      else: Yup.number(),
    })
    ,
});

export const CreateVessel = async (payload, setLoading, cb) => {
  setLoading(true);
  try {
    const res = await axios.post(
      `${imarineBaseUrl}/domain/Vessel/CreateVessel`,
      payload
    );
    toast.success(res?.data?.message);
    cb();
    setLoading(false);
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setLoading(false);
  }
};

export const GetOwnerDDL = async (setter) => {
  try {
    const res = await axios.get(
      `${imarineBaseUrl}/domain/Vessel/GetOwnerInfoDDL`
    );
    setter(res?.data);
  } catch (error) {
    setter([]);
  }
};

export const GetVesselLandingData = async (
  accId,
  buId,
  pageNo,
  pageSize,
  searchValue,
  status,
  filterBy,
  setLoading,
  setter
) => {
  setLoading(true);
  const search = searchValue ? `&search=${searchValue}` : "";
  try {
    const res = await axios.get(
      `${imarineBaseUrl}/domain/Vessel/GetVesseLandingPagination?AccountId=${accId}&BusinessUnitId=${buId}&viewOrder=desc&PageNo=${pageNo}&PageSize=${pageSize}${search}&ActiveOrInActiveg=${status}&status=${filterBy}`
    );
    setter(res?.data);
    setLoading(false);
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setLoading(false);
    setter([]);
  }
};

export const activeInactiveVessel = async (id, status, setLoading, cb) => {
  setLoading(true);
  try {
    const res = await axios.put(
      `${imarineBaseUrl}/domain/Vessel/ActiveOrInActive?vesselId=${id}&activeOrInActive=${status}`
    );
    toast.success(res?.data?.message);
    cb();
    setLoading(false);
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setLoading(false);
  }
};

export const GetVesselById = async (id, setLoading, setter) => {
  setLoading(true);
  try {
    const res = await axios.get(
      `${imarineBaseUrl}/domain/Vessel/GetVesselViewDetailsById?vesselId=${id}`
    );
    const modifyData = {
      ...res?.data,
      ownerName: {
        value: res?.data?.ownerId,
        label: res?.data?.ownerName,
      },
      flag: {
        value: res?.data?.flagId,
        label: res?.data?.flag,
      },
      sbu: {
        value: res?.data?.sbuId,
        label: res?.data?.sbuName,
      },
      revenueCenter: {
        value: res?.data?.revenueCenterId,
        label: res?.data?.revenueCenterName,
      },
      costCenter: {
        value: res?.data?.costCenterId,
        label: res?.data?.costCenterName,
      },
      profitCenter: {
        value: res?.data?.profitCenterId,
        label: res?.data?.profitCenterName,
      },
      // ! isEditing true/false mode for create and edit mode handle
      isEditing: true,
    };
    setter(modifyData);
    setLoading(false);
  } catch (error) {
    setter({});
    setLoading(false);
  }
};

export const UpdateVessel = async (payload, setLoading) => {
  setLoading(true);
  try {
    const res = await axios.put(
      `${imarineBaseUrl}/domain/Vessel/EditVessel`,
      payload
    );
    toast.success(res?.data?.message);

    setLoading(false);
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setLoading(false);
  }
};

export const DeleteVessel = async (vesselId, setLoading, cb) => {
  setLoading(true);
  try {
    const res = await axios.post(
      `${imarineBaseUrl}/domain/Vessel/DeleteVessel?vesselId=${vesselId}`
    );
    toast.success(res?.data?.message);
    cb();
    setLoading(false);
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setLoading(false);
  }
};
