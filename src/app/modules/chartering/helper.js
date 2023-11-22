import axios from "axios";
import { imarineBaseUrl } from "../../App";

export const iMarineBaseURL = imarineBaseUrl;

export const GetPortDDL = async (setter) => {
  try {
    const res = await axios.get(
      `${iMarineBaseURL}/domain/Stakeholder/GetPortDDL`
    );
    setter(res?.data);
  } catch (error) {
    setter([]);
  }
};

export const GetDomesticPortDDL = async (setter) => {
  try {
    const res = await axios.get(
      `${iMarineBaseURL}/domain/LighterVessel/GetDomesticPortDDL`
    );
    setter(res?.data);
  } catch (error) {
    setter([]);
  }
};

export const GetLighterVesselDDL = async (accId, buId, setter) => {
  try {
    const res = await axios.get(
      `${iMarineBaseURL}/domain/LighterVessel/GetLighterVesselDDL?AccountId=${accId}&BusinessUnitId=${buId}`
    );
    setter(res?.data);
  } catch (error) {
    setter([]);
  }
};

export const GetCountryDDL = async (setter) => {
  try {
    const res = await axios.get(
      `${iMarineBaseURL}/domain/Vessel/GetCountryDDL`
    );
    setter(res?.data);
  } catch (error) {
    setter([]);
  }
};

export const getVesselDDL = async (accId, buId, setter, vesselId) => {
  const vesselIdStr = vesselId ? `&IsVessel=${vesselId}` : ""; // first perameter so not (?)
  try {
    const res = await axios.get(
      `${iMarineBaseURL}/domain/Voyage/GetVesselDDL?AccountId=${accId}&BusinessUnitId=${buId}${vesselIdStr}`
    );
    setter(res.data);
  } catch (error) {
    setter([]);
  }
};

export const getMotherVesselDDL = async (accId, buId, setter) => {
  try {
    const res = await axios.get(
      `${iMarineBaseURL}/domain/LighterVessel/GetMotherVesselDDL?AccountId=${accId}&BusinessUnitId=${buId}`
    );
    setter(res.data);
  } catch (error) {
    setter([]);
  }
};

export const GetLighterConsigneeDDL = async (accId, buId, setter) => {
  try {
    const res = await axios.get(
      `${iMarineBaseURL}/domain/LighterVessel/GetLighterConsigneeDDL?AccountId=${accId}&BusinessUnitId=${buId}`
    );
    setter(res?.data);
  } catch (error) {
    setter([]);
  }
};

export const getVoyageDDLByVesselId = async (
  id,
  setLoading,
  setter,
  typeId
) => {
  setLoading(true);
  const type = typeId ? `&TypeId=${typeId}` : "";
  try {
    const res = await axios.get(
      `${iMarineBaseURL}/domain/PortPDA/GetVoyageDDLByVesselId?vesselId=${id}${type}`
    );
    setter(res?.data);
    setLoading(false);
  } catch (error) {
    setter([]);
    setLoading(false);
  }
};

/* id, setter mendatory! */
export const getVoyageDDLFilter = async ({
  id,
  setLoading,
  setter,
  typeId,
  isComplete,
  isForPurchase,
}) => {
  setLoading && setLoading(true);
  const typeIdPath = typeId ? `&TypeId=${typeId}` : "";
  const isCompletePath =
    typeof isComplete === "boolean" ? `&isComplete=${isComplete}` : "";
  const isForPurchasePath = isForPurchase
    ? `&isForPurchase=${isForPurchase}`
    : "";
  try {
    const res = await axios.get(
      `${iMarineBaseURL}/domain/PortPDA/GetVoyageDDLByVesselId?vesselId=${id}${typeIdPath}${isForPurchasePath}${isCompletePath}`
    );
    setter(res?.data);
    setLoading && setLoading(false);
  } catch (error) {
    setter([]);
    setLoading && setLoading(false);
  }
};

export const getVoyageDDLNew = async ({
  accId,
  buId,
  id,
  setLoading,
  setter,
  voyageTypeId, // 0: All, 1: Time Charter, 2: Voyage Charter,
  isComplete, // 0: All, 1: true, 2: false,
  hireType, // 0: All, 1: Owner, 2: Charterer,
}) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.get(
      `${iMarineBaseURL}/domain/PortPDA/GetVoyageDDLNew?AccountId=${accId}&BusinessUnitId=${buId}&vesselId=${id}&VoyageTypeId=${voyageTypeId ||
        0}&ReturnType=${isComplete || 0}&HireTypeId=${hireType || 0}`
    );
    setter(res?.data);
    setLoading && setLoading(false);
  } catch (error) {
    setter([]);
    setLoading && setLoading(false);
  }
};

export const getVoyageDDLForPurchaseBunker = async (
  id,
  setLoading,
  setter,
  typeId
) => {
  setLoading(true);
  const type = typeId ? `&TypeId=${typeId}` : "";
  try {
    const res = await axios.get(
      `${iMarineBaseURL}/domain/PortPDA/GetVoyageDDLByVesselId?vesselId=${id}${type}&isForPurchase=true`
    );
    setter(res?.data);
    setLoading(false);
  } catch (error) {
    setter([]);
    setLoading(false);
  }
};

export const getAgencyDDL = async (setter) => {
  try {
    const res = await axios.get(`${iMarineBaseURL}/domain/PortPDA/GetAgency`);
    setter(res.data);
  } catch (error) {
    setter([]);
  }
};

export const getCharterPartyDDL = async (accId, buId, setter) => {
  try {
    const res = await axios.get(
      `${iMarineBaseURL}/domain/PortPDA/GetCharterParty?AccountId=${accId}&BusinessUnitId=${buId}`
    );
    setter(res.data);
  } catch (error) {
    setter([]);
  }
};

export const getBrokerDDL = async (setter) => {
  try {
    const res = await axios.get(`${iMarineBaseURL}/domain/PortPDA/GetBroker`);
    setter(res.data);
  } catch (error) {
    setter([]);
  }
};

export const getSupplierDDL = async (setter) => {
  try {
    const res = await axios.get(`${iMarineBaseURL}/domain/PortPDA/GetSupplier`);
    setter(res.data);
  } catch (error) {
    setter([]);
  }
};

export const getShipperDDL = async (setter) => {
  try {
    const res = await axios.get(`${iMarineBaseURL}/domain/PortPDA/GetShipper`);
    setter(res.data);
  } catch (error) {
    setter([]);
  }
};

export const getCargoDDL = async (setter) => {
  try {
    const res = await axios.get(
      `${iMarineBaseURL}/domain/HireOwner/GetCargoDDL`
    );
    setter(res.data);
  } catch (error) {
    setter([]);
  }
};

export const getBankDDL = async (setter) => {
  try {
    const res = await axios.get(
      `${iMarineBaseURL}/domain/OwnerInfo/GetBankDDL`
    );
    setter(res.data);
  } catch (error) {
    setter([]);
  }
};

export const getBankBranchDDL = async (bankId, setter) => {
  try {
    const res = await axios.get(
      `${iMarineBaseURL}/domain/OwnerInfo/GetBankBranchDDL?BankId=${bankId}`
    );
    setter(res.data);
  } catch (error) {
    setter([]);
  }
};

export const getChartererVoyageCodeDDL = async (setter) => {
  try {
    const res = await axios.get(
      `${iMarineBaseURL}/domain/Voyage/GetChartererVoyageCode`
    );
    setter(res.data);
  } catch (error) {
    setter([]);
  }
};

export const getOwnerInfoDDL = async ({ setter }) => {
  try {
    const res = await axios.get(
      `${iMarineBaseURL}/domain/Vessel/GetOwnerInfoDDL`
    );
    setter(res?.data);
  } catch (error) {
    setter([]);
  }
};

export const getOwnerBankInfoDetailsById = async (ownerId, setter) => {
  try {
    const res = await axios.get(
      `${iMarineBaseURL}/domain/OwnerInfo/GetOwnerInfoDetailsById?OwnerId=${ownerId}`
    );
    setter(res?.data);
  } catch (err) {
    setter([]);
  }
};

export const getOwnerBankInfoDetailsByStakeHolderId = async (
  ownerId,
  setter
) => {
  try {
    const res = await axios.get(
      `${iMarineBaseURL}/domain/Stakeholder/GetStakeholderViewDetailsById?stakeholderId=${ownerId}`
    );
    setter(res?.data);
  } catch (err) {
    setter([]);
  }
};

export const getStakeholderTypeDDL = async (setter) => {
  try {
    const res = await axios.get(
      `${iMarineBaseURL}/domain/Stakeholder/GetStakeholderTypeDDL`
    );
    setter(res?.data);
  } catch (err) {
    setter([]);
  }
};

export const getStakeholderNameByTypeId = async (
  accId,
  buId,
  typeId,
  setter
) => {
  try {
    const res = await axios.get(
      `${iMarineBaseURL}/domain/Stakeholder/GetStackHolderDDlByType?AccountId=${accId}&BusinessUnitId=${buId}&TypeId=${typeId}`
    );
    setter(res?.data);
  } catch (err) {
    setter([]);
  }
};

export const getChartererByVoyageId = async (voyageId, setter, setLoading) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.get(
      `${iMarineBaseURL}/domain/Voyage/GeChartererDDLByVoyage?VoyageId=${voyageId}`
    );
    setter(res?.data);
    setLoading && setLoading(false);
  } catch (err) {
    setter([]);
    setLoading && setLoading(false);
  }
};

export const getBusinessPartnerTypeDDL = async (setter) => {
  try {
    const res = await axios.get(
      `${iMarineBaseURL}/domain/LayTimeInfo/GetStackTypeDDlForChartShip`
    );
    setter(res?.data);
  } catch (err) {
    setter([]);
  }
};

export const getBusinessPartnerNameByVoyageDDL = async (
  voyageId,
  typeId,
  setter
) => {
  try {
    const res = await axios.get(
      `${iMarineBaseURL}/domain/LayTimeInfo/GetStackDDlFromVoyage?VoyageId=${voyageId}&StackTypeId=${typeId}`
    );
    setter(res?.data);
  } catch (err) {
    setter([]);
  }
};
