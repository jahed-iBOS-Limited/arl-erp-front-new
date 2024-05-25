import Axios from "axios";
import { toast } from "react-toastify";

// getBusinessPartnerBasicinfoAction
export const getBusinessPartnerBasicinfoAction = async (
  accId,
  buId,
  partnerId,
  setter
) => {
  try {
    const res = await Axios.get(
      `/partner/BusinessPartnerBasicInfo/GetBusinessPartnerByID?accountId=${accId}&businessUnitId=${buId}&partnerID=${partnerId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

export const attachmentUpload = async (attachment, cb) => {
  let formData = new FormData();
  attachment.forEach((file) => {
    formData.append("files", file?.file);
  });
  try {
    let { data } = await Axios.post("/domain/Document/UploadFile", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    // toast.success(res?.data?.message || "Submitted Successfully");
    toast.success("Upload  successfully");
    return data;
  } catch (error) {
    toast.error("Document not upload");
  }
};
export const getBankNameDDL_api = async (setter) => {
  try {
    const res = await Axios.get(`/costmgmt/BankAccount/GETBankDDl`);
    setter(res?.data);
  } catch (error) {
    setter([]);
  }
};

export const getBranchNameDDL_api = async (bId, cId, setter) => {
  try {
    const res = await Axios.get(
      `/costmgmt/BankAccount/GETBankBranchDDl?BankId=${bId}&CountryId=${cId}`
    );
    setter(res?.data);
  } catch (error) {
    setter([]);
  }
};

export const getBusinessPartnerSalesByPartnerId = async (
  accId,
  buId,
  id,
  setIsPartnerSale,
  setSalesData,
  setRowDto,
  setCreditRowDto,
  setMorgazeRowDto,
  setRowDtoTwo,
  setDefaultConfigId,
  cb
) => {
  try {
    const res = await Axios.get(
      // `/partner/BusinessPartnerSales/GetBusinessPartnerShipPoint?BusinessPartnerId=${id}`
      `/partner/BusinessPartnerSales/GetBusinessPartnerSalesByPartnerId?BusinessPartnerId=${id}`
    );
    const { data } = res;

    // const { accountId } = profileData;
    // const { value: businessunitid } = selectedBusinessUnit;
    if (!(data.objGetDTO === null) || data.objListDTO.length > 0) {
      setIsPartnerSale(true);
    }
    const objDataGet = data.objGetDTO;
    const defaultShipPoint = data.objListDTO.filter((item) => {
      return item.isDefaultShippoint === true;
    });

    let bothCheck = false;
    if (data?.objData?.length > 0) {
      data.objData.forEach((item) => {
        if (item?.isDayLimit !== data?.objData?.[0]?.isDayLimit) {
          bothCheck = true;
        }
      });
    }
    const limitType = bothCheck
      ? "both"
      : data?.objData?.[0]?.isDayLimit
      ? "dayesLimit"
      : data?.objData?.length > 0
      ? "creditLimit"
      : "";

    const daysLimitFind = data?.objData?.find((itm) => itm?.isDayLimit);

    const singleData = {
      isTaxOnDeliveryAmount: objDataGet?.isTaxOnDeliveryAmount || false,
      priceIncludingTax: objDataGet?.isBackCalculation || false,
      accountId: accId,
      businessUnitId: buId,
      customerType: objDataGet?.customerType
        ? {
            value: 100,
            label: objDataGet?.customerType,
          }
        : "",
      sbu: objDataGet?.businessAreaId
        ? {
            value: objDataGet?.businessAreaId,
            label: objDataGet?.businessAreaName,
          }
        : "",
      salesOrganaization: objDataGet?.salesOrganizationId
        ? {
            value: objDataGet?.salesOrganizationId,
            label: objDataGet?.salesOrganizationName,
          }
        : "",
      distributionChannel: objDataGet?.distributionChannelId
        ? {
            value: objDataGet?.distributionChannelId,
            label: objDataGet?.distributionChannelName,
          }
        : "",
      salesTerriory:
        objDataGet?.territoryId && objDataGet?.territoryName
          ? {
              value: objDataGet?.territoryId,
              label: objDataGet?.territoryName,
            }
          : "",
      transportZone: objDataGet?.transportZoneId
        ? {
            value: objDataGet?.transportZoneId,
            label: objDataGet?.transportZoneName,
          }
        : "",
      reconGeneralLedger: objDataGet?.generalLederId
        ? {
            value: objDataGet?.generalLederId,
            label: objDataGet?.generalLederName,
          }
        : "",
      alternetGeneralLedger: objDataGet?.alternateGlid
        ? {
            value: objDataGet?.alternateGlid,
            label: objDataGet?.alternateGlidName,
          }
        : "",
      shippingPoint: defaultShipPoint[0]?.shipPointId
        ? {
            value: defaultShipPoint[0]?.shipPointId,
            label: defaultShipPoint[0]?.shipPointName,
          }
        : "",
      defaultDistanceKm: defaultShipPoint[0]?.distanceKm,
      creditLimit: objDataGet?.creditLimit,
      soldToParty: objDataGet?.soldToPartnerShipToPartnerID
        ? {
            value: objDataGet?.soldToPartnerShipToPartnerID,
            label: objDataGet?.soldToPartnerShipToPartnerName,
          }
        : "",
      priceStructure: objDataGet?.priceStructureId
        ? {
            value: objDataGet?.priceStructureId,
            label: objDataGet?.priceStructureName,
          }
        : "",
      collectionDays: objDataGet?.collectionDays || 0,
      bankName: "",
      branchName: "",
      refNo: "",
      limitType: limitType,
      numberOfDays:
        limitType === "dayesLimit" || limitType === "both"
          ? daysLimitFind?.limitDays
          : "0",
      daysCreditLimitAmount:
        limitType === "dayesLimit" || limitType === "both"
          ? daysLimitFind?.creditLimit
          : "0",
      daysLimitBtnDisabled:
        limitType === "creditLimit" || limitType === "both" ? true : false,
      paymentMode: objDataGet?.creditFacilityTypeId
        ? {
            value: objDataGet?.creditFacilityTypeId,
            label: objDataGet?.creditFacilityTypeName,
          }
        : "",
      partyStatusType: objDataGet?.partyStatusType
        ? {
            value: objDataGet?.partyStatusType,
            label: objDataGet?.partyStatusType,
          }
        : "",
      customerCategory: objDataGet?.customerCategory
        ? {
            value: objDataGet?.customerCategory,
            label: objDataGet?.customerCategory,
          }
        : "",
      exclusivity: objDataGet?.isExclusive
        ? { value: true, label: "Exclusive" }
        : { value: false, label: "Non-Exclusive" },
      isManualAuto: objDataGet?.isManualAuto || false,
    };
    setSalesData(singleData);
    setRowDto(data?.objListDTO);
    setCreditRowDto(data?.objData);
    setMorgazeRowDto(data?.objNewData);
    setRowDtoTwo(data?.objShippingAddrs);
    setDefaultConfigId(data.objGetDTO.configId || 0);
    cb && cb(res?.data);
  } catch (error) {
    console.log(error);
  }
};
