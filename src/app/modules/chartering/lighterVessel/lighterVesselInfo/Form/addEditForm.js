/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */

import React, { useState, useEffect } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { getProfitCenterList } from "../../../../procurement/purchase-management/purchaseOrder/Form/assetStandardPo/helper";
import Loading from "../../../_chartinghelper/loading/_loading";
import {
  saveLighterVessel,
  saveEditedLighterVessel,
  getSBUList,
  getRevenueCenterList,
  getCostCenterList,
} from "../helper";
import Form from "./form";

const initData = {
  lighterVesselName: "",
  vesselType:"",
  capacity: "",
  costCenter: "",
  revenueCenter: "",
  sbu: "",
  lastTripNo: "",
  profitCenter: "",
};

export default function LighterVesselForm({
  singleData,
  setOpen,
  viewHandler,
}) {
  const [loading, setLoading] = useState(false);
  const [costCenterDDL, setCostCenterDDL] = useState([]);
  const [revenueCenterDDL, setRevenueCenterDDL] = useState([]);
  const [sbuDDL, setSbuDDL] = useState([]);
  const [profitCenterDDL, setProfitCenterDDL] = useState([]);

  // get user profile data from store
  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state?.authData;
  }, shallowEqual);

  const getCostCenter = (sbuId) => {
    getCostCenterList(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      sbuId,
      setCostCenterDDL
    );
  };

  useEffect(() => {
    getRevenueCenterList(selectedBusinessUnit?.value, setRevenueCenterDDL);
    getSBUList(profileData?.accountId, selectedBusinessUnit?.value, setSbuDDL);
    getProfitCenterList(
      selectedBusinessUnit?.value,
      setProfitCenterDDL,
      setLoading
    );
    if (singleData?.lighterVesselId) {
      getCostCenter(singleData?.intSbuId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData, selectedBusinessUnit, singleData]);

  const saveHandler = (values, cb) => {
    if (!values?.lighterVesselId) {
      const payload = {
        lighterVesselId: 0,
        lighterVesselName: values?.lighterVesselName,
        vesselType: values?.vesselType?.label,
        accountId: profileData?.accountId,
        businessUnitId: selectedBusinessUnit?.value,
        insertby: profileData?.userId,
        capacity: values?.capacity,
        intCostCenterId: values?.costCenter?.value,
        strCostCenterName: values?.costCenter?.label,
        intRevenueCenterId: values?.revenueCenter?.value,
        strRevenueCenterName: values?.revenueCenter?.label,
        strSbuName: values?.sbu?.label,
        intSbuId: values?.sbu?.value,
        intLastTripNo: values?.lastTripNo || 0,

        profitCenterId: values?.profitCenter?.value,
        profitCenterName: values?.profitCenter?.label,
      };
      saveLighterVessel(payload, setLoading, () => {
        cb();
        viewHandler(0, 50);
        setOpen(false);
      });
    } else {
      const payload = {
        lighterVesselId: values?.lighterVesselId,
        lighterVesselName: values?.lighterVesselName,
        accountId: profileData?.accountId,
        businessUnitId: selectedBusinessUnit?.value,
        insertby: profileData?.userId,
        capacity: values?.capacity,
        intCostCenterId: values?.costCenter?.value,
        strCostCenterName: values?.costCenter?.label,
        intRevenueCenterId: values?.revenueCenter?.value,
        intRevenueCenterName: values?.revenueCenter?.label,
        strSbuName: values?.sbu?.label,
        intSbuId: values?.sbu?.value,
        tripNo: values?.lastTripNo || 0,
        profitCenterId: values?.profitCenter?.value,
        profitCenterName: values?.profitCenter?.label,
      };
      saveEditedLighterVessel(payload, setLoading, () => {
        cb();
        viewHandler(0, 50);
        setOpen(false);
      });
    }
  };

  const title = singleData?.lighterVesselId
    ? "Edit Lighter Vessel"
    : "Create New Lighter Vessel";

  return (
    <>
      {loading && <Loading />}
      <Form
        title={title}
        initData={
          singleData?.lighterVesselId
            ? {
                ...singleData,
                costCenter: {
                  value: singleData?.intCostCenterId,
                  label: singleData?.strCostCenterName,
                },
                revenueCenter: {
                  value: singleData?.intRevenueCenterId,
                  label: singleData?.strRevenueCenterName,
                },
                sbu: {
                  value: singleData?.intSbuId,
                  label: singleData?.strSbuName,
                },
                profitCenter: {
                  value: singleData?.profitCenterId,
                  label: singleData?.profitCenterName,
                },
              }
            : initData
        }
        saveHandler={saveHandler}
        setLoading={setLoading}
        costCenterDDL={costCenterDDL}
        revenueCenterDDL={revenueCenterDDL}
        sbuDDL={sbuDDL}
        getCostCenter={getCostCenter}
        profitCenterDDL={profitCenterDDL}
      />
    </>
  );
}
