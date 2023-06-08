/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */

import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useParams } from "react-router";
import { getVesselDDL } from "../../../helper";
import Loading from "../../../_chartinghelper/loading/_loading";
import {
  createBallastPassge,
  editBallastPassge,
  getSingleBallastDataById,
} from "../helper";
import Form from "./form";

const initData = {
  vesselName: "",
  voyageNo: "",
  ballastStartDate: "",
  ballastEndDate: "",
  ballastDuration: "",
  lsmgoperDayQty: "",
  lsmgoballastQty: "",
  lsmgoballastRate: "",
  lsmgoballastAmount: "",
  lsfoperDayQty: "",
  lsfoballastQty: "",
  lsfoballastRate: "",
  lsfoballastAmount: "",
};

export default function BallastPassageForm() {
  const { type, id } = useParams();
  const [loading, setLoading] = useState(false);
  const [vesselDDL, setVesselDDL] = useState([]);
  const [voyageNoDDL, setVoyageNoDDL] = useState([]);
  const [singleData, setSingleData] = useState([]);

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
  }, [profileData, selectedBusinessUnit, id]);

  useEffect(() => {
    getSingleBallastDataById({ id, setLoading, setter: setSingleData });
  }, [id]);

  const saveHandler = (values, cb) => {
    if (!id) {
      const payload = {
        ballastId: 0,
        accountId: profileData?.accountId,
        businessUnitId: selectedBusinessUnit?.value,
        vesselId: values?.vesselName?.value,
        vesselName: values?.vesselName?.label,
        voyageId: values?.voyageNo?.value,
        voyageNo: values?.voyageNo?.label,
        ballastStartDate: values?.ballastStartDate,
        ballastEndDate: values?.ballastEndDate,
        ballastDuration: values?.ballastDuration,
        lsmgoperDayQty: +values?.lsmgoperDayQty,
        lsmgoballastQty: +values?.lsmgoballastQty,
        lsmgoballastRate: +values?.lsmgoballastRate,
        lsmgoballastAmount: +values?.lsmgoballastAmount,
        lsfoperDayQty: +values?.lsfoperDayQty,
        lsfoballastQty: +values?.lsfoballastQty,
        lsfoballastRate: +values?.lsfoballastRate,
        lsfoballastAmount: +values?.lsfoballastAmount,
        actionBy: profileData.actionBy,
      };
      createBallastPassge(payload, setLoading, cb);
    } else {
      const payload = {
        ballastId: +id,
        accountId: profileData?.accountId,
        businessUnitId: selectedBusinessUnit?.value,
        vesselId: values?.vesselName?.value,
        vesselName: values?.vesselName?.label,
        voyageId: values?.voyageNo?.value,
        voyageNo: values?.voyageNo?.label,
        ballastStartDate: values?.ballastStartDate,
        ballastEndDate: values?.ballastEndDate,
        ballastDuration: values?.ballastDuration,
        lsmgoperDayQty: +values?.lsmgoperDayQty,
        lsmgoballastQty: +values?.lsmgoballastQty,
        lsmgoballastRate: +values?.lsmgoballastRate,
        lsmgoballastAmount: +values?.lsmgoballastAmount,
        lsfoperDayQty: +values?.lsfoperDayQty,
        lsfoballastQty: +values?.lsfoballastQty,
        lsfoballastRate: +values?.lsfoballastRate,
        lsfoballastAmount: +values?.lsfoballastAmount,
        actionBy: profileData.actionBy,
      };

      editBallastPassge(payload, setLoading);
    }
  };

  const title =
    type === "view"
      ? "View Ballast Passage"
      : type === "edit"
      ? "Edit Ballast Passage"
      : "Create Ballast Passage";

  return (
    <>
      {loading && <Loading />}
      <Form
        title={title}
        initData={id ? singleData : initData}
        saveHandler={saveHandler}
        viewType={type}
        vesselDDL={vesselDDL}
        setLoading={setLoading}
        voyageNoDDL={voyageNoDDL}
        setVoyageNoDDL={setVoyageNoDDL}
      />
    </>
  );
}
