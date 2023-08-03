/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useSelector, shallowEqual } from "react-redux";
import { useParams } from "react-router";
import { getItemRateByVoyageId } from "../../bunker/bunkerInformation/helper";
import { getVesselDDL } from "../../helper";
import Loading from "../../_chartinghelper/loading/_loading";
import {
  createOffHire,
  editOffHire,
  getDailyHireByVoyageNo,
  getOffHireById,
} from "../helper";
import Form from "./form";

const date = new Date();

const initData = {
  vesselName: "",
  voyageNo: "",
  offHireReason: "",
  offHireStartDateTime: moment(date).format("yyyy-MM-DDTHH:mm"),
  offHireEndDateTime: moment(date).format("yyyy-MM-DDTHH:mm"),
  offHireDuration: "",
  durationPercentage: "",
  offHireCostAmount: "",
  perDayLsmgoQty: "",
  offHireLsmgoqty: "",
  offHireLsmgorate: "",
  offHireLsmgovalue: "",
  perDayLsfoQty: "",
  offHireLsfoqty: "",
  offHireLsforate: "",
  offHireLsfovalue: "",
  offHireCve: "",
  otherCost: "",
  finalOffHireDuration: "",
  offHireAddressCommission: "",
  offHireBrokerCommission: "",
};

export default function OffHireForm() {
  const { type, id } = useParams();
  const [loading, setLoading] = useState(false);
  const [singleData, setSingleData] = useState({});
  const [vesselDDL, setVesselDDL] = useState([]);
  const [dailyHireAndCVE, setDailyHireAndCVE] = useState({});
  const [itemRates, setItemRates] = useState({});
  const [rows, setRows] = useState([]);

  // get user profile data from store
  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state?.authData;
  }, shallowEqual);

  useEffect(() => {
    getVesselDDL(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setVesselDDL
    );
    if (id) {
      getOffHireById(id, setSingleData, setLoading, (resData) => {
        getDailyHireByVoyageNo(resData?.voyageId, setDailyHireAndCVE);
        getItemRateByVoyageId(
          profileData?.accountId,
          selectedBusinessUnit?.value,
          resData?.vesselId,
          resData?.voyageId,
          setLoading,
          setItemRates
        );
      });
    }
  }, [profileData, selectedBusinessUnit, id]);

  const addHandler = (values) => {
    const newRow = {
      vesselId: values?.vesselName?.value,
      vesselName: values?.vesselName?.label,
      voyageId: values?.voyageNo?.value,
      voyageNumber: values?.voyageNo?.label,
      offHireReason: values?.offHireReason,
      offHireStartDateTime: values?.offHireStartDateTime,
      offHireEndDateTime: values?.offHireEndDateTime,
      durationPercentage: values?.durationPercentage,
      offHireCostAmount: values?.offHireCostAmount,
      offHireDuration: values?.offHireDuration,
      perDayLsmgoQty: values?.perDayLsmgoQty,
      offHireLsmgoqty: values?.offHireLsmgoqty,
      offHireLsmgorate: values?.offHireLsmgorate,
      offHireLsmgovalue: values?.offHireLsmgovalue,
      perDayLsfoQty: values?.perDayLsfoQty,
      offHireLsfoqty: values?.offHireLsfoqty,
      offHireLsforate: values?.offHireLsforate,
      offHireLsfovalue: values?.offHireLsfovalue,
      offHireCve: values?.offHireCve,
      otherCost: values?.otherCost,
      accountId: profileData?.accountId,
      businessUnitId: selectedBusinessUnit?.value,
      insertby: profileData?.userId,
      addressCommision: values?.offHireAddressCommission,
      offHireFinalDuration: values?.finalOffHireDuration,
      brokarageCommision: values?.offHireBrokerCommission,
    };
    setRows([...rows, newRow]);
  };

  const remover = (index) => {
    const newRowSet = rows?.filter((_, i) => i !== index);
    setRows(newRowSet);
  };

  const saveHandler = (values, cb) => {
    if (id) {
      const data = {
        offHireId: id,
        vesselId: values?.vesselName?.value,
        vesselName: values?.vesselName?.label,
        voyageId: values?.voyageNo?.value,
        offHireReason: values?.offHireReason,
        offHireStartDateTime: values?.offHireStartDateTime,
        offHireEndDateTime: values?.offHireEndDateTime,
        durationPercentage: values?.durationPercentage,
        offHireCostAmount: values?.offHireCostAmount,
        offHireDuration: values?.offHireDuration,
        perDayLsmgoQty: values?.perDayLsmgoQty,
        offHireLsmgoqty: values?.offHireLsmgoqty,
        offHireLsmgorate: values?.offHireLsmgorate,
        offHireLsmgovalue: values?.offHireLsmgovalue,
        perDayLsfoQty: values?.perDayLsfoQty,
        offHireLsfoqty: values?.offHireLsfoqty,
        offHireLsforate: values?.offHireLsforate,
        offHireLsfovalue: values?.offHireLsfovalue,
        offHireCve: values?.offHireCve,
        otherCost: values?.otherCost,
        accountId: profileData?.accountId,
        businessUnitId: selectedBusinessUnit?.value,
        insertby: profileData?.userId,
        addressCommision: values?.offHireAddressCommission,
        offHireFinalDuration: values?.finalOffHireDuration,
        brokarageCommision: values?.offHireBrokerCommission,
      };
      editOffHire(data, setLoading);
    } else {
      // const payload = {
      //   vesselId: values?.vesselName?.value,
      //   vesselName: values?.vesselName?.label,
      //   voyageId: values?.voyageNo?.value,
      //   voyageNumber: values?.voyageNo?.label,
      //   offHireReason: values?.offHireReason,
      //   offHireStartDateTime: values?.offHireStartDateTime,
      //   offHireEndDateTime: values?.offHireEndDateTime,
      //   durationPercentage: values?.durationPercentage,
      //   offHireCostAmount: values?.offHireCostAmount,
      //   offHireDuration: values?.offHireDuration,
      //   perDayLsmgoQty: values?.perDayLsmgoQty,
      //   offHireLsmgoqty: values?.offHireLsmgoqty,
      //   offHireLsmgorate: values?.offHireLsmgorate,
      //   offHireLsmgovalue: values?.offHireLsmgovalue,
      //   perDayLsfoQty: values?.perDayLsfoQty,
      //   offHireLsfoqty: values?.offHireLsfoqty,
      //   offHireLsforate: values?.offHireLsforate,
      //   offHireLsfovalue: values?.offHireLsfovalue,
      //   offHireCve: values?.offHireCve,
      //   otherCost: values?.otherCost,
      //   accountId: profileData?.accountId,
      //   businessUnitId: selectedBusinessUnit?.value,
      //   insertby: profileData?.userId,
      //   addressCommision: values?.offHireAddressCommission,
      //   offHireFinalDuration: values?.finalOffHireDuration,
      //   brokarageCommision: values?.offHireBrokerCommission,
      // };
      createOffHire(rows, setLoading, () => {
        setRows([]);
        cb();
      });
    }
  };

  return (
    <>
      {loading && <Loading />}
      <Form
        title={
          type === "edit"
            ? "Edit Off Hire"
            : type === "view"
            ? "View Off Hire"
            : "Create Off Hire"
        }
        initData={id ? singleData : initData}
        saveHandler={saveHandler}
        viewType={type}
        vesselDDL={vesselDDL}
        setLoading={setLoading}
        dailyHireAndCVE={dailyHireAndCVE}
        setDailyHireAndCVE={setDailyHireAndCVE}
        profileData={profileData}
        selectedBusinessUnit={selectedBusinessUnit}
        itemRates={itemRates}
        setItemRates={setItemRates}
        rows={rows}
        remover={remover}
        addHandler={addHandler}
      />
    </>
  );
}
