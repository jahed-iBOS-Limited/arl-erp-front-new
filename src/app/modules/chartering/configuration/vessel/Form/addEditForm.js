/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useParams } from "react-router";
import { getProfitCenterList } from "../../../../procurement/purchase-management/purchaseOrder/Form/assetStandardPo/helper";
import { GetCountryDDL } from "../../../helper";
import {
  getCostCenterList,
  getRevenueCenterList,
  getSBUList,
} from "../../../lighterVessel/lighterVesselInfo/helper";
import Loading from "../../../_chartinghelper/loading/_loading";
import {
  CreateVessel,
  GetOwnerDDL,
  GetVesselById,
  UpdateVessel,
} from "../helper";
import Form from "./form";

const initData = {
  vesselName: "",
  ownerName: "",
  flag: "",
  deadWeight: "",
  imono: "",
  isOwnVessel: false,
  isOtherInfo: false,
  yearOfBuilt: "",
  shipYard: "",
  callSign: "",
  className: "",
  piclub: "",
  grt: "",
  nrt: "",
  loa: "",
  lbp: "",
  beam: "",
  depth: "",
  tpconSummerFreeBoard: "",
  actual: "",
  holdCubicGrain: "",
  holdCubicBale: "",
  holdsLengthBreadth: "",
  upperDeckStrength: "",
  hatchCover: "",
  hatchCoverLengthBreadth: "",
  hatchCoverStrength: "",
  cranes: "",
  grabs: "",
  speedAndConsumptionAtSea: "",
  ecoAndConsumptionAtSea: "",
  inPortWorking: "",
  remarks: "",

  sbu: "",
  revenueCenter: "",
  costCenter: "",
  profitCenter: "",
};

export default function VesselForm() {
  const { type, id } = useParams();
  const [loading, setLoading] = useState(false);
  const [countryDDL, setCountryDDL] = useState([]);
  const [ownerDDL, setOwnerDDL] = useState([]);
  const [singleData, setSingleData] = useState({});
  const [costCenterDDL, setCostCenterDDL] = useState([]);
  const [revenueCenterDDL, setRevenueCenterDDL] = useState([]);
  const [sbuDDL, setSbuDDL] = useState([]);
  const [profitCenterDDL, setProfitCenterDDL] = useState([]);

  // get user profile data from store
  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state?.authData;
  }, shallowEqual);

  useEffect(() => {
    if (!type || type !== "view") {
      GetCountryDDL(setCountryDDL);
      GetOwnerDDL(setOwnerDDL);
      getRevenueCenterList(selectedBusinessUnit?.value, setRevenueCenterDDL);
      getSBUList(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setSbuDDL
      );
      getProfitCenterList(
        selectedBusinessUnit?.value,
        setProfitCenterDDL,
        setLoading
      );
    }
    if (id) {
      GetVesselById(id, setLoading, setSingleData);
    }
  }, [profileData, selectedBusinessUnit, id, type]);

  const getCostCenter = (sbuId) => {
    getCostCenterList(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      sbuId,
      setCostCenterDDL
    );
  };

  useEffect(() => {
    if (id && singleData?.vesselId && singleData?.sbuId) {
      getCostCenter(singleData?.sbuId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [singleData]);

  const saveHandler = (values, cb) => {
    if (id) {
      const data = {
        vesselId: id,
        vesselName: values?.vesselName,
        ownerId: values?.ownerName?.value,
        ownerName: values?.ownerName?.label,
        deadWeight: values?.deadWeight,
        isOtherInfo: values?.isOtherInfo,
        yearOfBuilt: values?.yearOfBuilt,
        shipYard: values?.shipYard,
        imono: values?.imono,
        callSign: values?.callSign,
        className: values?.className,
        flag: values?.flag?.label,
        flagId: values?.flag?.value,
        piclub: values?.piclub,
        grt: values?.grt,
        nrt: values?.nrt,
        loa: values?.loa,
        lbp: values?.lbp,
        beam: values?.beam,
        depth: values?.depth,
        tpconSummerFreeBoard: values?.tpconSummerFreeBoard,
        actual: values?.actual,
        holdCubicGrain: values?.holdCubicGrain,
        holdCubicBale: values?.holdCubicBale,
        holdsLengthBreadth: values?.holdsLengthBreadth,
        upperDeckStrength: values?.upperDeckStrength,
        hatchCover: values?.hatchCover,
        hatchCoverLengthBreadth: values?.hatchCoverLengthBreadth,
        hatchCoverStrength: values?.hatchCoverStrength,
        cranes: values?.cranes,
        grabs: values?.grabs,
        speedAndConsumptionAtSea: values?.speedAndConsumptionAtSea,
        ecoAndConsumptionAtSea: values?.ecoAndConsumptionAtSea,
        inPortWorking: values?.inPortWorking,
        remarks: values?.remarks,
        isOwnVessel: values?.isOwnVessel,
        accountId: profileData?.accountId,
        businessUnitId: selectedBusinessUnit?.businessUnitId,
        insertby: profileData?.userId,
        // "lastActionTime": "2021-12-09T05:31:47.557",
        // "serverDatetime": "2021-12-09T05:31:47.557",
        // "isActive": false

        costCenterId: values?.costCenter?.value,
        costCenterName: values?.costCenter?.label,
        revenueCenterId: values?.revenueCenter?.value,
        revenueCenterName: values?.revenueCenter?.label,
        profitCenterId: values?.profitCenter?.value,
        profitCenterName: values?.profitCenter?.label,
      };
      UpdateVessel(data, setLoading);
    } else {
      const payload = {
        vesselName: values.vesselName,
        ownerId: values?.ownerName?.value,
        ownerName: values?.ownerName?.label,
        deadWeight: values?.deadWeight,
        isOtherInfo: values?.isOtherInfo,
        yearOfBuilt: values?.yearOfBuilt,
        shipYard: values?.shipYard,
        imono: values?.imono,
        callSign: values?.callSign,
        className: values?.className,
        flag: values?.flag?.label,
        flagId: values?.flag?.value,
        piclub: values?.piclub,
        grt: values?.grt,
        nrt: values?.nrt,
        loa: values?.loa,
        lbp: values?.lbp,
        beam: values?.beam,
        depth: values?.depth,
        tpconSummerFreeBoard: values?.tpconSummerFreeBoard,
        actual: values?.actual,
        holdCubicGrain: values?.holdCubicGrain,
        holdCubicBale: values?.holdCubicBale,
        holdsLengthBreadth: values?.holdsLengthBreadth,
        upperDeckStrength: values?.upperDeckStrength,
        hatchCover: values?.hatchCover,
        hatchCoverLengthBreadth: values?.hatchCoverLengthBreadth,
        hatchCoverStrength: values?.hatchCoverStrength,
        cranes: values?.cranes,
        grabs: values?.grabs,
        speedAndConsumptionAtSea: values?.speedAndConsumptionAtSea,
        ecoAndConsumptionAtSea: values?.ecoAndConsumptionAtSea,
        inPortWorking: values?.inPortWorking,
        remarks: values?.remarks,
        isOwnVessel: values?.isOwnVessel,
        accountId: profileData?.accountId,
        businessUnitId: selectedBusinessUnit?.value,
        insertby: profileData?.userId,

        costCenterId: values?.costCenter?.value,
        costCenterName: values?.costCenter?.label,
        revenueCenterId: values?.revenueCenter?.value,
        revenueCenterName: values?.revenueCenter?.label,
        profitCenterId: values?.profitCenter?.value,
        profitCenterName: values?.profitCenter?.label,
      };
      CreateVessel(payload, setLoading, cb);
    }
  };

  return (
    <>
      {loading && <Loading />}
      <Form
        title={
          type === "edit"
            ? "Edit Vessel"
            : type === "view"
            ? "View Vessel"
            : "Create Vessel"
        }
        initData={id ? singleData : initData}
        saveHandler={saveHandler}
        viewType={type}
        countryDDL={countryDDL}
        ownerDDL={ownerDDL}
        sbuDDL={sbuDDL}
        revenueCenterDDL={revenueCenterDDL}
        costCenterDDL={costCenterDDL}
        getCostCenter={getCostCenter}
        profitCenterDDL={profitCenterDDL}
      />
    </>
  );
}
